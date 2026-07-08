from celery import shared_task

from django.utils import timezone

from apps.venues.models import Booking


@shared_task
def expire_reservations():

    expired_bookings = (
        Booking.objects.filter(
            status=Booking.Status.RESERVED,
            reserved_until__lt=timezone.now(),
        )
    )

    expired_bookings.update(
        status=Booking.Status.EXPIRED
    )

    return expired_bookings.count()