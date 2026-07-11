import {
  ShieldCheck,
  BadgeDollarSign,
  CalendarCheck,
} from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, text: "Verified Venues" },
  { icon: BadgeDollarSign, text: "Best Price Guarantee" },
  { icon: CalendarCheck, text: "Instant Booking" },
];

const HeroFeatures = () => {
  return (
    <div className="flex flex-wrap gap-3 mt-8">
      {FEATURES.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.text}
            className="
              flex items-center gap-2 px-5 py-3
              bg-red-50/60 border border-red-100 rounded-full
              text-sm font-medium text-gray-700
              shadow-sm transition-all duration-300 ease-out
              hover:-translate-y-0.5 hover:shadow-md
              hover:bg-red-50 hover:border-red-200
            "
          >
            <Icon size={16} className="text-red-600" />
            {feature.text}
          </div>
        );
      })}
    </div>
  );
};

export default HeroFeatures;
