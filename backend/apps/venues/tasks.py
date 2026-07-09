from celery import shared_task

from django.db import transaction
from django.utils import timezone

from apps.venues.models import Booking


@shared_task
def expire_reservations():

    booking_ids = list(
        Booking.objects.filter(
            status=Booking.Status.RESERVED,
            reserved_until__lt=timezone.now(),
        ).values_list(
            "id",
            flat=True,
        )
    )

    expired_count = 0

    for booking_id in booking_ids:

        with transaction.atomic():

            booking = (
                Booking.objects
                .select_for_update()
                .filter(
                    id=booking_id,
                    status=Booking.Status.RESERVED,
                )
                .first()
            )

            # Re-check under the lock: the booking may have just been
            # confirmed by a webhook/payment-sync call in the moment
            # between the query above and acquiring this row lock.
            if not booking:
                continue

            if (
                not booking.reserved_until
                or booking.reserved_until >= timezone.now()
            ):
                continue

            booking.status = Booking.Status.EXPIRED

            booking.save(
                update_fields=[
                    "status",
                ]
            )

            expired_count += 1

    return expired_count
