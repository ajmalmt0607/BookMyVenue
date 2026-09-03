from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.venues.models import Booking, BookingSlot, Venue, VenueTimeSlot
from apps.venues.services.booking.availability_service import AvailabilityService
from apps.venues.services.booking.pricing_service import PricingService


class SlotUnavailableError(Exception):
    """Raised when one or more requested slots were booked by someone"""


class BookingService:

    @classmethod
    @transaction.atomic
    def create_reservation(
        cls,
        *,
        customer,
        venue: Venue,
        booking_date,
        slot_ids,
        guest_count,
        full_name,
        email,
        phone_number,
        alternate_phone_number="",
        special_requirements="",
        arrival_notes="",
        event_notes="",
        terms_accepted=False,
    ):

        slots = list(
            VenueTimeSlot.objects.select_for_update().filter(
                id__in=slot_ids,
                venue=venue,
                is_active=True,
            )
        )

        if len(slots) != len(set(slot_ids)):
            raise ValueError(
                "No valid slots selected."
            )

        conflict_exists = BookingSlot.objects.filter(
            slot_id__in=[slot.id for slot in slots],
            booking__booking_date=booking_date,
            booking__status__in=Booking.ACTIVE_HOLD_STATUSES,
        ).exists()

        if conflict_exists:
            raise SlotUnavailableError(
                "One or more selected slots were just booked. Please choose another."
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

            full_name=full_name,
            email=email,
            phone_number=phone_number,
            alternate_phone_number=alternate_phone_number,
            special_requirements=special_requirements,
            arrival_notes=arrival_notes,
            event_notes=event_notes,
            guest_count=guest_count,

            venue_amount=price["venue_amount"],

            platform_fee=price["platform_fee"],

            gst_amount=price["gst_amount"],

            discount_amount=price["discount_amount"],

            total_amount=price["total_amount"],

            reserved_until=timezone.now() + timedelta(
                minutes=settings.RESERVATION_TIMEOUT_MINUTES
            ),

            status=Booking.Status.RESERVED,

            terms_accepted_at=timezone.now() if terms_accepted else None,
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

        if BookingService.is_expired(booking):

            BookingService.expire_booking(
                booking
            )

            return False

        return True

    @staticmethod
    def confirm_booking(booking):

        booking.status = Booking.Status.CONFIRMED

        booking.reserved_until = None

        booking.payment_completed_at = timezone.now()

        booking.save(
            update_fields=[
                "status",
                "reserved_until",
                "payment_completed_at",
            ]
        )

        AvailabilityService.invalidate_cache(
            booking.venue,
            booking.booking_date,
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

        AvailabilityService.invalidate_cache(
            booking.venue,
            booking.booking_date,
        )

        return booking

    @staticmethod
    @transaction.atomic
    def cancel_reservation(booking):

        locked_booking = (
            Booking.objects
            .select_for_update()
            .select_related("venue")
            .filter(
                id=booking.id,
                status=Booking.Status.RESERVED,
            )
            .first()
        )

        if not locked_booking:
            return None

        locked_booking.status = Booking.Status.CANCELLED

        locked_booking.save(
            update_fields=[
                "status",
            ]
        )

        AvailabilityService.invalidate_cache(
            locked_booking.venue,
            locked_booking.booking_date,
        )

        return locked_booking
