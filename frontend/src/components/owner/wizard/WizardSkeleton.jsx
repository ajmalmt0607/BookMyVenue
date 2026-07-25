import Shimmer from "../../ui/Shimmer";

const WizardSkeleton = () => (
  <div className="mx-auto max-w-4xl space-y-8 px-5 py-10">
    <div className="space-y-3">
      <Shimmer className="h-7 w-72 rounded-lg" />
      <Shimmer className="h-4 w-96 max-w-full rounded-lg" />
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Shimmer className="h-12 w-full rounded-xl" />
      <Shimmer className="h-12 w-full rounded-xl" />
    </div>

    <Shimmer className="h-28 w-full rounded-xl" />
    <Shimmer className="h-12 w-full rounded-xl" />
  </div>
);

export default WizardSkeleton;
