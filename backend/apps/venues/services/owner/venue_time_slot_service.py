from django.db.models import Min


class VenueTimeSlotService:

    @staticmethod
    def overlaps_existing(venue, start_time, end_time, exclude_id=None):
        existing = venue.time_slots.filter(is_active=True)

        if exclude_id:
            existing = existing.exclude(id=exclude_id)

        return any(
            start_time < slot.end_time and slot.start_time < end_time
            for slot in existing
        )

    @staticmethod
    def sync_starting_price(venue):
        # A venue's headline price is the cheapest active time slot, not a
        # flat rate an owner types in upfront - keeps it accurate as slots
        # are added, repriced, deactivated, or removed.
        lowest_price = venue.time_slots.filter(is_active=True).aggregate(
            Min("price")
        )["price__min"]

        if venue.price_per_day != lowest_price:
            venue.price_per_day = lowest_price
            venue.save(update_fields=["price_per_day"])
