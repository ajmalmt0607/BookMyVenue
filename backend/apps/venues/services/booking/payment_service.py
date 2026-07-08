import stripe
from django.conf import settings
from django.db import transaction

from apps.venues.models import Booking
from apps.venues.models import Payment
from apps.venues.services.booking.booking_service import BookingService


class PaymentService:

    @staticmethod
    def create_payment(
        booking,
    ):

        payment, _ = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "amount": booking.total_amount,
            },
        )

        return payment

    @staticmethod
    def create_payment_intent(
        booking,
    ):

        payment = PaymentService.create_payment(
            booking
        )

        if payment.status == Payment.Status.SUCCESS:
            raise ValueError(
                "This booking has already been paid for."
            )

        if payment.stripe_payment_intent_id:

            intent = stripe.PaymentIntent.retrieve(
                payment.stripe_payment_intent_id
            )

            if intent.status != "canceled":
                return payment, intent

        intent = stripe.PaymentIntent.create(
            amount=int(booking.total_amount * 100),
            currency=settings.STRIPE_CURRENCY,
            metadata={
                "booking_id": str(booking.id),
                "payment_id": str(payment.id),
            },
        )

        payment.stripe_payment_intent_id = intent.id

        payment.save(
            update_fields=[
                "stripe_payment_intent_id",
            ]
        )

        return payment, intent

    @staticmethod
    def mark_success(
        payment,
        payment_intent_id,
        charge_id=None,
    ):

        payment.status = (
            Payment.Status.SUCCESS
        )

        payment.stripe_payment_intent_id = (
            payment_intent_id
        )

        if charge_id:
            payment.stripe_charge_id = charge_id

        payment.save()

        return payment

    @staticmethod
    def mark_failed(
        payment,
    ):

        payment.status = (
            Payment.Status.FAILED
        )

        payment.save()

        return payment

    @staticmethod
    @transaction.atomic
    def handle_payment_intent_succeeded(
        intent,
    ):

        payment_intent_id = intent["id"]

        try:
            payment = (
                Payment.objects
                .select_for_update()
                .select_related("booking")
                .get(
                    stripe_payment_intent_id=payment_intent_id
                )
            )

        except Payment.DoesNotExist:
            return None

        # Idempotent: webhooks can be delivered more than once.
        if payment.booking.status == Booking.Status.CONFIRMED:
            return payment

        if payment.status != Payment.Status.SUCCESS:

            PaymentService.mark_success(
                payment,
                payment_intent_id,
                charge_id=intent.get("latest_charge"),
            )

        BookingService.confirm_booking(
            payment.booking
        )

        return payment

    @staticmethod
    def handle_payment_intent_failed(
        intent,
    ):

        try:
            payment = Payment.objects.get(
                stripe_payment_intent_id=intent["id"]
            )

        except Payment.DoesNotExist:
            return None

        PaymentService.mark_failed(
            payment
        )

        return payment
