import {
  ShieldCheck,
  BadgeDollarSign,
  CalendarCheck,
} from "lucide-react";

const HeroFeatures = () => {
  const features = [
    {
      icon: ShieldCheck,
      text: "Verified Venues",
    },
    {
      icon: BadgeDollarSign,
      text: "Best Price Guarantee",
    },
    {
      icon: CalendarCheck,
      text: "Instant Booking",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mt-8">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.text}
            className="
              flex
              items-center
              gap-2
              px-5
              py-4
              bg-white
              border-gray-800
              rounded-full
              shadow-sm
            "
          >
            <Icon
              size={16}
              className="text-red-600"
            />

            <span className="text-sm font-medium">
              {feature.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HeroFeatures;