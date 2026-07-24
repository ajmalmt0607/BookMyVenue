from django.db.models import Count, Q, Sum
from django.utils import timezone

from apps.venues.models import Booking, Venue

RECENT_BOOKINGS_LIMIT = 5


class OwnerDashboardService:
    """Aggregates a venue owner's dashboard: venue count, this month's
    booking/revenue snapshot, and the most recent bookings across all of
    their venues."""

    @staticmethod
    def get_dashboard(owner):
        total_venues = Venue.active_objects.filter(owner=owner).count()

        if total_venues == 0:
            return {
                "has_venues": False,
                "stats": None,
                "recent_bookings": [],
            }

        bookings = Booking.active_objects.filter(venue__owner=owner)

        month_start = timezone.localtime().replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )

        # One aggregate query for all three counters - each Count/Sum
        # carries its own filter, so mixing a month-scoped stat with an
        # all-time one (pending) costs nothing extra over a plain count().
        totals = bookings.aggregate(
            monthly_bookings=Count("id", filter=Q(created_at__gte=month_start)),
            monthly_revenue=Sum(
                "total_amount",
                filter=Q(
                    created_at__gte=month_start,
                    status=Booking.Status.CONFIRMED,
                ),
            ),
            # RESERVED = reserved but not yet paid for - the closest
            # match to "pending" among the model's statuses.
            pending_bookings=Count("id", filter=Q(status=Booking.Status.RESERVED)),
        )

        recent_bookings = bookings.select_related("venue", "customer").order_by(
            "-created_at"
        )[:RECENT_BOOKINGS_LIMIT]

        return {
            "has_venues": True,
            "stats": {
                "total_venues": total_venues,
                "monthly_bookings": totals["monthly_bookings"],
                "monthly_revenue": totals["monthly_revenue"] or 0,
                "pending_bookings": totals["pending_bookings"],
            },
            "recent_bookings": list(recent_bookings),
        }
