import { memo, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";

const READ_MORE_THRESHOLD = 140;

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = new Date(review.created_at).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" }
  );

  const canTruncate = (review.description || "").length > READ_MORE_THRESHOLD;

  return (
    <div className="rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-full bg-red-50 text-sm font-bold text-red-600
          "
        >
          {getInitials(review.user?.full_name)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold text-gray-900">
              {review.user?.full_name}
            </p>

            {review.is_verified_booking && (
              <span
                title="Verified booking"
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100"
              >
                <BadgeCheck size={12} className="text-emerald-600" />
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400">{formattedDate}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={14}
            className={
              index < review.rating
                ? "fill-red-600 text-red-600"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>

      {review.title && (
        <p className="mt-3 font-semibold text-gray-900">{review.title}</p>
      )}

      <p
        className={`mt-1.5 text-sm leading-relaxed text-gray-600 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {review.description}
      </p>

      {canTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="
            mt-2 text-sm font-semibold text-red-600
            transition-colors duration-200 ease-out hover:text-red-700
          "
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default memo(ReviewCard);
