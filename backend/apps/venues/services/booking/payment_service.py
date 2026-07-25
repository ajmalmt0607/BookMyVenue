import logging

import stripe
from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.venues.models import Booking, Payment
from apps.venues.services.booking.booking_service import BookingService

logger = logging.getLogger(__name__)


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
                PaymentService._mark_payment_started(booking)
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

        PaymentService._mark_payment_started(booking)

        return payment, intent

    @staticmethod
    def _mark_payment_started(
        booking,
    ):

        if booking.payment_started_at:
            return

        booking.payment_started_at = timezone.now()

        booking.save(
            update_fields=[
                "payment_started_at",
            ]
        )

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
    def confirm_payment_success(
        payment_intent_id,
        charge_id=None,
    ):

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
            logger.warning(
                "Stripe confirm: no Payment found for intent %s",
                payment_intent_id,
            )
            return None

        logger.info(
            "Stripe confirm: payment found (payment_id=%s booking_id=%s "
            "payment_status=%s booking_status=%s)",
            payment.id,
            payment.booking_id,
            payment.status,
            payment.booking.status,
        )

        if payment.booking.status == Booking.Status.CONFIRMED:
            logger.info(
                "Stripe confirm: booking %s already confirmed, skipping "
                "(idempotent no-op) for intent %s",
                payment.booking_id,
                payment_intent_id,
            )
            return payment

        if payment.status != Payment.Status.SUCCESS:

            PaymentService.mark_success(
                payment,
                payment_intent_id,
                charge_id=charge_id,
            )

            logger.info(
                "Stripe confirm: payment %s updated to SUCCESS "
                "(intent=%s charge=%s)",
                payment.id,
                payment_intent_id,
                charge_id,
            )

        BookingService.confirm_booking(
            payment.booking
        )

        logger.info(
            "Stripe confirm: booking %s confirmed (reserved_until cleared)",
            payment.booking_id,
        )

        return payment

    @staticmethod
    @transaction.atomic
    def confirm_payment_failure(
        payment_intent_id,
    ):

        try:
            payment = (
                Payment.objects
                .select_for_update()
                .get(
                    stripe_payment_intent_id=payment_intent_id
                )
            )

        except Payment.DoesNotExist:
            return None

        # Never downgrade a payment that already succeeded - guards
        # against an out-of-order/late "failed" event.
        if payment.status != Payment.Status.SUCCESS:
            PaymentService.mark_failed(payment)

        return payment

    @staticmethod
    def handle_payment_intent_succeeded(
        intent,
    ):

        logger.info(
            "Stripe webhook: payment_intent.succeeded received for %s",
            intent["id"],
        )

        return PaymentService.confirm_payment_success(
            intent["id"],
            # StripeObject has no dict-style .get() in this SDK version -
            # getattr() with a default is the correct way to read an
            # optional field without raising on a missing/None key.
            charge_id=getattr(
                intent,
                "latest_charge",
                None,
            ),
        )

    @staticmethod
    def handle_payment_intent_failed(
        intent,
    ):

        return PaymentService.confirm_payment_failure(
            intent["id"]
        )

    @staticmethod
    def sync_payment_status(
        booking,
    ):


        payment = getattr(
            booking,
            "payment",
            None,
        )

        if not payment or not payment.stripe_payment_intent_id:
            return payment

        if payment.status == Payment.Status.SUCCESS:
            return payment

        intent = stripe.PaymentIntent.retrieve(
            payment.stripe_payment_intent_id
        )

        if intent.status == "succeeded":

            return PaymentService.confirm_payment_success(
                intent.id,
                charge_id=getattr(
                    intent,
                    "latest_charge",
                    None,
                ),
            )

        if intent.status == "canceled":

            return PaymentService.confirm_payment_failure(
                intent.id
            )

        return payment
