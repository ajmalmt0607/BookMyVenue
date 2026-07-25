from apps.common.functions import generate_slug
from apps.venues.models import Venue, VenuePolicy

# Order matters here: it drives both `next_step`/`current_step` in the
# progress payload and the frontend's step-by-step wizard navigation.
DRAFT_STEPS = ["basic_information", "images", "amenities", "policies", "time_slots"]

REQUIRED_BASIC_INFO_FIELDS = [
    "venue_type_id",
    "name",
    "description",
    "venue_address",
    "location_name",
    "location_address",
    "city",
    "state",
    "min_capacity",
    "max_capacity",
    "price_per_day",
]


class VenueSubmissionError(Exception):
    """Raised when a venue does not meet the requirements to be submitted
    for approval. `errors` is a dict of step_name -> message, mirroring
    how BookingService/SlotUnavailableError already signal a domain
    failure for the view to translate into a Response."""

    def __init__(self, errors):
        self.errors = errors
        super().__init__("Venue is not ready for submission.")


class VenueDraftService:
    """Business logic for the step-by-step venue draft workflow: creating
    a draft, saving each step, tracking completion, and submitting for
    admin approval."""

    @staticmethod
    def create_draft(owner):
        # An owner can have several venues in flight at once (multiple
        # drafts, one pending approval, others already approved) - each
        # call always starts a new draft. Resuming a specific in-progress
        # draft is a separate action (Continue Setup on that draft's card).
        return Venue.objects.create(owner=owner, status=Venue.Status.DRAFT)

    @staticmethod
    def update_basic_information(venue, **fields):
        for field_name, value in fields.items():
            setattr(venue, field_name, value)

        # Keep the slug in sync with the name while the venue is still
        # editable - once submitted/approved the slug is a public URL and
        # shouldn't shift under anyone.
        if "name" in fields and venue.status in Venue.EDITABLE_STATUSES:
            venue.slug = generate_slug(fields["name"] or "venue")

        venue.save()

        return venue

    @staticmethod
    def update_amenities(venue, amenities):
        venue.amenities.set(amenities)
        venue.amenities_completed = True
        venue.save()

        return venue

    @staticmethod
    def update_policies(venue, policies):
        venue.policies.all().delete()

        if policies:
            VenuePolicy.objects.bulk_create(
                VenuePolicy(venue=venue, **policy) for policy in policies
            )

        venue.policies_completed = True
        venue.save()

        return venue

    @staticmethod
    def is_basic_information_complete(venue):
        return all(
            getattr(venue, field_name) not in (None, "")
            for field_name in REQUIRED_BASIC_INFO_FIELDS
        )

    @staticmethod
    def has_valid_images(venue):
        images = list(venue.images.all())

        return bool(images) and sum(image.is_primary for image in images) == 1

    @staticmethod
    def has_active_time_slot(venue):
        return venue.time_slots.filter(is_active=True).exists()

    @staticmethod
    def get_progress(venue):
        completed = []

        if VenueDraftService.is_basic_information_complete(venue):
            completed.append("basic_information")

        if VenueDraftService.has_valid_images(venue):
            completed.append("images")

        if venue.amenities_completed:
            completed.append("amenities")

        if venue.policies_completed:
            completed.append("policies")

        if VenueDraftService.has_active_time_slot(venue):
            completed.append("time_slots")

        remaining = [step for step in DRAFT_STEPS if step not in completed]
        next_step = remaining[0] if remaining else "review"
        current_step = (
            DRAFT_STEPS.index(next_step) + 1
            if next_step in DRAFT_STEPS
            else len(DRAFT_STEPS) + 1
        )

        return {
            "current_step": current_step,
            "completed_steps": completed,
            "next_step": next_step,
            "completion_percentage": round(
                len(completed) / len(DRAFT_STEPS) * 100
            ),
        }

    @staticmethod
    def submit_for_approval(venue):
        errors = {}

        if not VenueDraftService.is_basic_information_complete(venue):
            errors["basic_information"] = "Complete all required venue information."

        if not VenueDraftService.has_valid_images(venue):
            errors["images"] = (
                "At least one image is required, with exactly one marked primary."
            )

        if not VenueDraftService.has_active_time_slot(venue):
            errors["time_slots"] = "At least one active time slot is required."

        if errors:
            raise VenueSubmissionError(errors)

        venue.status = Venue.Status.PENDING
        venue.save(update_fields=["status"])

        return venue
