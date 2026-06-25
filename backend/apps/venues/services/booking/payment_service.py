from apps.venues.models import Payment


class PaymentService:

    @staticmethod
    def create_payment(
        booking,
    ):

        payment = Payment.objects.create(
            booking=booking,
            amount=booking.total_amount,
        )

        return payment

    @staticmethod
    def mark_success(
        payment,
        transaction_id,
    ):

        payment.status = (
            Payment.Status.SUCCESS
        )

        payment.transaction_id = (
            transaction_id
        )

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