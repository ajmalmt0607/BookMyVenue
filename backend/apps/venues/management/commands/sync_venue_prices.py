from django.core.management.base import BaseCommand

from apps.venues.models import Venue
from apps.venues.services.owner.venue_time_slot_service import VenueTimeSlotService


class Command(BaseCommand):
    help = (
        "Recomputes price_per_day for every venue from its cheapest active "
        "time slot. One-off backfill for venues whose price was manually "
        "entered before price syncing was added."
    )

    def handle(self, *args, **options):
        venues = Venue.objects.prefetch_related("time_slots")
        updated = 0

        for venue in venues:
            before = venue.price_per_day
            VenueTimeSlotService.sync_starting_price(venue)

            if venue.price_per_day != before:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Synced price_per_day for {updated} of {venues.count()} venues."
            )
        )
