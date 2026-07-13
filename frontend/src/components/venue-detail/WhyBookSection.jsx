import { memo } from "react";
import {
  BadgeCheck,
  CalendarClock,
  Headset,
  ShieldCheck,
  Zap,
} from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: BadgeCheck,
    title: "Verified Venue",
    description: "Every listing is manually reviewed before going live.",
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    description: "Your slot is reserved the moment payment succeeds.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "All transactions are encrypted and processed securely.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Slots",
    description: "Choose from multiple time slots that suit your event.",
  },
  {
    icon: Headset,
    title: "Professional Support",
    description: "Our team is on hand if you need help with your booking.",
  },
];

const WhyBookSection = () => (
  <section>
    <h2 className="text-2xl font-bold text-gray-900">
      Why Book With BookMyVenue
    </h2>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {HIGHLIGHTS.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <Icon size={18} className="text-red-600" />
            </div>

            <p className="mt-4 font-semibold text-gray-900">{item.title}</p>
            <p className="mt-1.5 text-sm text-gray-500">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  </section>
);

export default memo(WhyBookSection);
