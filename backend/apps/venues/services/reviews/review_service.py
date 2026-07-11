from django.db.models import Avg, Count

from apps.venues.models import Review

PREVIEW_COUNT = 2


class ReviewService:

    @staticmethod
    def get_review_context(venue, limit=PREVIEW_COUNT):

        queryset = (
            Review.active_objects
            .filter(venue=venue, is_active=True)
            .select_related("user")
        )

        summary = queryset.aggregate(
            average_rating=Avg("rating"),
            total_reviews=Count("id"),
        )

        total_reviews = summary["total_reviews"] or 0

        average_rating = (
            round(summary["average_rating"], 2)
            if summary["average_rating"]
            else 0
        )

        reviews = list(queryset[:limit])

        return {
            "reviews": reviews,
            "average_rating": average_rating,
            "total_reviews": total_reviews,
            "has_more_reviews": total_reviews > len(reviews),
        }
