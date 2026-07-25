from django.db.models import Count, Q, Sum
from django.utils import timezone

from apps.venues.models import Booking, Venue

RECENT_BOOKINGS_LIMIT = 5


class OwnerDashboardService:
    @staticmethod
    def get_dashboard(owner):
        owner_venues = Venue.active_objects.filter(owner=owner)

        if not owner_venues.exists():
            return {
                "has_venues": False,
                "stats": None,
                "recent_bookings": [],
            }

        # "Total Venues" is a public-facing credibility number - a DRAFT
        # or PENDING venue isn't a real listing yet, so only APPROVED ones
        # count, even though `has_venues` above (which just gates the
        # empty-state) considers any venue the owner has started.
        approved_venue_count = owner_venues.filter(
            status=Venue.Status.APPROVED
        ).count()

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
                "total_venues": approved_venue_count,
                "monthly_bookings": totals["monthly_bookings"],
                "monthly_revenue": totals["monthly_revenue"] or 0,
                "pending_bookings": totals["pending_bookings"],
            },
            "recent_bookings": list(recent_bookings),
        }
