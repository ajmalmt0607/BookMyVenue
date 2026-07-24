import Shimmer from "../../ui/Shimmer";

const KpiCardSkeleton = () => (
  <div className="rounded-3xl border border-gray-100 bg-white p-6">
    <div className="flex items-center justify-between">
      <Shimmer className="h-4 w-24 rounded-md" />
      <Shimmer className="h-10 w-10 rounded-xl" />
    </div>

    <Shimmer className="mt-4 h-8 w-20 rounded-md" />
  </div>
);

export default KpiCardSkeleton;
