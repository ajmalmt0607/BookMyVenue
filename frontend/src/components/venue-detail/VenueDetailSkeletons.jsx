import Shimmer from "../ui/Shimmer";

export const GallerySkeleton = () => (
  <div>
    <Shimmer className="h-[420px] w-full rounded-3xl md:h-[480px] lg:h-[520px]" />

    <div className="mt-3 hidden gap-3 lg:flex">
      {Array.from({ length: 6 }).map((_, index) => (
        <Shimmer key={index} className="h-20 w-28 shrink-0 rounded-xl" />
      ))}
    </div>
  </div>
);

export const BookingCardSkeleton = () => (
  <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
    <Shimmer className="h-3 w-24 rounded-md" />
    <Shimmer className="mt-2 h-8 w-40 rounded-md" />

    <Shimmer className="mt-6 h-12 w-full rounded-2xl" />

    <div className="mt-6 space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Shimmer key={index} className="h-16 w-full rounded-2xl" />
      ))}
    </div>

    <Shimmer className="mt-6 h-24 w-full rounded-2xl" />
  </div>
);

export const DescriptionSkeleton = () => (
  <div className="space-y-3">
    <Shimmer className="h-5 w-40 rounded-md" />
    <Shimmer className="h-4 w-full rounded-md" />
    <Shimmer className="h-4 w-full rounded-md" />
    <Shimmer className="h-4 w-2/3 rounded-md" />
  </div>
);

export const AmenitiesSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 2 }).map((_, group) => (
      <div key={group}>
        <Shimmer className="mb-3 h-4 w-32 rounded-md" />

        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Shimmer key={index} className="h-10 w-28 rounded-full" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const PoliciesSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2">
    {Array.from({ length: 4 }).map((_, index) => (
      <Shimmer key={index} className="h-32 rounded-2xl" />
    ))}
  </div>
);

export const ReviewsSkeleton = () => (
  <div>
    <Shimmer className="mb-6 h-6 w-48 rounded-md" />

    <div className="grid gap-5 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-center gap-3">
            <Shimmer className="h-10 w-10 rounded-full" />

            <div className="space-y-1.5">
              <Shimmer className="h-3.5 w-24 rounded-md" />
              <Shimmer className="h-3 w-16 rounded-md" />
            </div>
          </div>

          <Shimmer className="h-3 w-full rounded-md" />
          <Shimmer className="h-3 w-full rounded-md" />
          <Shimmer className="h-3 w-2/3 rounded-md" />
        </div>
      ))}
    </div>
  </div>
);

export const MapSkeleton = () => (
  <Shimmer className="h-[360px] w-full rounded-3xl" />
);

export const RelatedVenuesSkeleton = () => (
  <div className="flex gap-5 overflow-hidden">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="w-72 shrink-0">
        <Shimmer className="h-44 w-full rounded-2xl" />
        <Shimmer className="mt-3 h-4 w-3/4 rounded-md" />
        <Shimmer className="mt-2 h-3 w-1/2 rounded-md" />
      </div>
    ))}
  </div>
);
