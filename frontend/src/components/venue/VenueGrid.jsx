import { memo } from "react";
import { SearchX } from "lucide-react";

import VenueCard from "./VenueCard";
import VenueCardSkeleton from "./VenueCardSkeleton";

const GRID_CLASSES = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6";

const VenueGrid = ({ venues, loading, onResetFilters }) => {
  if (loading) {
    return (
      <div className={GRID_CLASSES}>
        {[...Array(6)].map((_, index) => (
          <VenueCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!venues?.length) {
    return (
      <div
        className="
          flex flex-col items-center gap-4
          rounded-3xl border border-gray-100 bg-white
          px-6 py-20 text-center
        "
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <SearchX size={26} className="text-red-600" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900">
            No venues found
          </h3>

          <p className="mt-2 text-gray-500">
            Try adjusting your search or filters to find what you're
            looking for.
          </p>
        </div>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="
              mt-2 rounded-xl bg-red-600 px-6 py-2.5
              text-sm font-semibold text-white
              transition-all duration-200 ease-out
              hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md
            "
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={GRID_CLASSES}>
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};

export default memo(VenueGrid);
