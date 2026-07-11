import Shimmer from "../ui/Shimmer";

const VenueCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white">
    <Shimmer className="h-56 w-full" />

    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <Shimmer className="h-5 w-2/3 rounded-md" />
        <Shimmer className="h-5 w-12 rounded-full" />
      </div>

      <div className="mt-3 flex items-center gap-4">
        <Shimmer className="h-4 w-20 rounded-md" />
        <Shimmer className="h-4 w-24 rounded-md" />
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-5">
        <div className="space-y-2">
          <Shimmer className="h-3 w-16 rounded-md" />
          <Shimmer className="h-6 w-24 rounded-md" />
        </div>

        <Shimmer className="h-9 w-9 rounded-full" />
      </div>
    </div>
  </div>
);

export default VenueCardSkeleton;
