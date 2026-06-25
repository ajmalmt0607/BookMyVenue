from datetime import date

from django.db.models import Exists
from django.db.models import OuterRef
from django.utils import timezone

from apps.venues.models import Booking
from apps.venues.models import BookingSlot
from apps.venues.models import Venue
from apps.venues.models import VenueTimeSlot


class AvailabilityService:

    @staticmethod
    def get_available_slots(
        venue: Venue,
        booking_date: date,
    ):

        booked_slots = BookingSlot.objects.filter(
            slot=OuterRef("pk"),
            booking__booking_date=booking_date,
            booking__status__in=[
                Booking.Status.RESERVED,
                Booking.Status.CONFIRMED,
            ],
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
                end_time__gt=current_time
            )

        return queryset