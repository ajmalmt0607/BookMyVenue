import { memo } from "react";
import { Star } from "lucide-react";

import ReviewCard from "./ReviewCard";

const ReviewsSection = ({ reviews }) => {
  const {
    items = [],
    average_rating: averageRating = 0,
    total_reviews: totalReviews = 0,
    has_more_reviews: hasMoreReviews = false,
  } = reviews || {};

  if (!items.length) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        <p className="mt-3 text-gray-500">
          No reviews yet. Be the first to share your experience.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index < Math.round(averageRating)
                  ? "fill-red-600 text-red-600"
                  : "fill-gray-200 text-gray-200"
              }
            />
          ))}
        </div>

        <span className="font-bold text-gray-900">{averageRating}</span>

        <span className="text-gray-500">
          ({totalReviews} review{totalReviews === 1 ? "" : "s"})
        </span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {hasMoreReviews && (
        <button
          type="button"
          className="
            mt-6 w-full rounded-2xl border border-gray-200 py-3
            text-sm font-semibold text-gray-700
            transition-colors duration-200 ease-out
            hover:border-gray-300 hover:bg-gray-50
            sm:w-auto sm:px-8
          "
        >
          View All Reviews
        </button>
      )}
    </section>
  );
};

export default memo(ReviewsSection);
