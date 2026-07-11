import { Fragment } from "react";
import { MapPin } from "lucide-react";

const STATS = [
  { value: "10,000+", label: "Bookings" },
  { value: "500+", label: "Verified Venues" },
  { value: "4.9★", label: "Customer Rating" },
];

const HeroStats = () => {
  return (
    <div className="mt-10 pt-8 border-t border-gray-100">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {STATS.map((stat, index) => (
          <Fragment key={stat.label}>
            {index > 0 && (
              <span className="hidden sm:block h-10 w-px bg-gray-200" />
            )}

            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default HeroStats;
