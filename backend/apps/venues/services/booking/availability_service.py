from datetime import date

from django.core.cache import cache
from django.db.models import Exists, OuterRef
from django.utils import timezone

from apps.venues.models import Booking, BookingSlot, Venue, VenueTimeSlot


def availability_cache_key(venue: Venue, booking_date: date) -> str:

    return f"availability:{venue.slug}:{booking_date}"


class AvailabilityService:

    @staticmethod
    def get_available_slots(
        venue: Venue,
        booking_date: date,
    ):

        booked_slots = BookingSlot.objects.filter(
            slot=OuterRef("pk"),
            booking__booking_date=booking_date,
            booking__status__in=Booking.ACTIVE_HOLD_STATUSES,
        )

        queryset = (
            VenueTimeSlot.objects
            .filter(
                venue=venue,
                is_active=True,
            )
            .annotate(
                is_booked=Exists(booked_slots)
            )
            .filter(
                is_booked=False
            )
            .order_by(
                "start_time"
            )
        )

        today = timezone.localdate()

        if booking_date == today:

            current_time = timezone.localtime().time()

            queryset = queryset.filter(
                start_time__gt=current_time
            )

        return queryset

    @staticmethod
    def invalidate_cache(venue: Venue, booking_date: date):

        cache.delete(
            availability_cache_key(venue, booking_date)
        )