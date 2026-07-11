import { memo, useCallback, useState } from "react";
import { Heart } from "lucide-react";

// UI only for now — backend wishlist integration comes later. Sits inside
// VenueCard's clickable <Link>, so it must stop the click from bubbling up
// and navigating to the venue detail page.
const WishlistButton = ({ className = "" }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSaved((saved) => !saved);
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isSaved}
      className={`
        flex h-9 w-9 items-center justify-center rounded-full
        bg-white/90 shadow-md
        transition-transform duration-200 ease-out
        hover:scale-110
        ${className}
      `}
    >
      <Heart
        size={18}
        className={`
          transition-all duration-200 ease-out
          ${
            isSaved
              ? "fill-red-600 text-red-600 scale-110"
              : "fill-transparent text-gray-700"
          }
        `}
      />
    </button>
  );
};

export default memo(WishlistButton);
