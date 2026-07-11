import { Star, BadgeCheck, Users } from "lucide-react";

import heroImage from "../../assets/hero.png";

const FloatingCard = ({ icon: Icon, title, subtitle, className }) => (
  <div
    className={`
      absolute flex items-center gap-3 px-4 py-3
      bg-white/80 backdrop-blur-md border border-white/60
      rounded-2xl shadow-xl
      transition-transform duration-300 ease-out
      hover:-translate-y-1
      ${className}
    `}
  >
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
      <Icon size={18} className="text-red-600" />
    </span>

    <div className="leading-tight whitespace-nowrap">
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const HeroImage = () => {
  return (
    <div className="relative animate-fade-in-up [animation-delay:150ms]">
      <div
        className="
          relative overflow-hidden rounded-4xl
          border border-gray-100
          shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)]
        "
      >
        <img
          src={heroImage}
          alt="Premium wedding hall decorated for a celebration"
          className="w-full h-105 sm:h-120 lg:h-100 object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
      </div>

      <FloatingCard
        icon={Users}
        title="Up to 3,000 Guests"
        subtitle="Wedding Hall"
        className="hidden sm:flex bottom-5 right-4 animate-float"
      />
    </div>
  );
};

export default HeroImage;
