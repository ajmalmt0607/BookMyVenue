from apps.common.functions import generate_slug
from apps.venues.models import Venue, VenuePolicy

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
]


class VenueSubmissionError(Exception):

    def __init__(self, errors):
        self.errors = errors
        super().__init__("Venue is not ready for submission.")


class VenueDraftService:

    @staticmethod
    def create_draft(owner):
        return Venue.objects.create(owner=owner, status=Venue.Status.DRAFT)

    @staticmethod
    def update_basic_information(venue, **fields):
        for field_name, value in fields.items():
            setattr(venue, field_name, value)

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
