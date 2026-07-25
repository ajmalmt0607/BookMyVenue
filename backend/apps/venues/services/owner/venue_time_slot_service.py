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
