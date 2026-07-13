import { memo } from "react";
import { Hotel, Plane, TrainFront, UtensilsCrossed } from "lucide-react";

// Placeholder distances until a real nearby-places API exists.
const NEARBY_ITEMS = [
  { icon: Plane, label: "International Airport", distance: "12.4 km" },
  { icon: Hotel, label: "Nearby Hotels", distance: "1.8 km" },
  { icon: TrainFront, label: "Metro Station", distance: "3.2 km" },
  { icon: UtensilsCrossed, label: "Restaurants & Cafes", distance: "0.6 km" },
];

const NearbySection = () => (
  <section>
    <h2 className="text-2xl font-bold text-gray-900">Nearby Attractions</h2>
    <p className="mt-1 text-gray-500">What&apos;s around this venue.</p>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {NEARBY_ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="
              rounded-2xl border border-gray-200 p-5
              transition-colors duration-200 ease-out hover:border-gray-300
            "
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <Icon size={18} className="text-red-600" />
            </div>

            <p className="mt-4 font-semibold text-gray-900">{item.label}</p>
            <p className="mt-1 text-sm text-gray-500">{item.distance} away</p>
          </div>
        );
      })}
    </div>
  </section>
);

export default memo(NearbySection);
