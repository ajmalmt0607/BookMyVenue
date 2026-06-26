from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from apps.venues.models import Booking
from apps.venues.models import BookingSlot
from apps.venues.models import Venue
from apps.venues.models import VenueTimeSlot
from apps.venues.services.booking.pricing_service import PricingService


class BookingService:

    RESERVATION_MINUTES = 10

    @classmethod
    @transaction.atomic
    def create_reservation(
        cls,
        *,
        customer,
        venue: Venue,
        booking_date,
        slot_ids,
    ):

        slots = VenueTimeSlot.objects.filter(
            id__in=slot_ids,
            venue=venue,
            is_active=True,
        )

        if not slots.exists():
            raise ValueError(
                "No valid slots selected."
            )

        venue_amount = sum(
            slot.price
            for slot in slots
        )

        price = PricingService.calculate(
            venue_amount
        )

        booking = Booking.objects.create(
            customer=customer,
            venue=venue,
            booking_date=booking_date,

            venue_amount=price["venue_amount"],

            platform_fee=price["platform_fee"],

            gst_amount=price["gst_amount"],

            total_amount=price["total_amount"],

            reserved_until=timezone.now() + timedelta(minutes=10),

            status=Booking.Status.RESERVED,
        )

        booking_slots = [
            BookingSlot(
                booking=booking,
                slot=slot,
                price=slot.price,
            )
            for slot in slots
        ]

        BookingSlot.objects.bulk_create(
            booking_slots
        )

        return booking

    @staticmethod
    def is_expired(booking):

        return (
            booking.reserved_until
            and booking.reserved_until < timezone.now()
        )

    @staticmethod
    def validate_reservation(booking):

        if booking.status != Booking.Status.RESERVED:
            return False

        if BookingService.is_expired(
            booking
        ):
            return False

        return True

    @staticmethod
    def confirm_booking(booking):

        booking.status = Booking.Status.CONFIRMED

        booking.save(
            update_fields=[
                "status",
            ]
        )

        return booking

    @staticmethod
    def expire_booking(booking):

        booking.status = Booking.Status.EXPIRED

        booking.save(
            update_fields=[
                "status",
            ]
        )

        return booking