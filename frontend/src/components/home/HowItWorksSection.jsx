import { Link } from "react-router-dom";
import { Search, CalendarCheck, PartyPopper, ArrowRight } from "lucide-react";

import { ROUTES } from "../../constants/routes";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Search & Discover",
    description:
      "Browse thousands of verified venues by location, capacity and budget to find spaces that match your vision.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Compare & Reserve",
    description:
      "Check real-time availability, compare pricing and amenities, then lock in your date with instant booking.",
  },
  {
    number: "03",
    icon: PartyPopper,
    title: "Celebrate with Ease",
    description:
      "Get instant confirmation and dedicated support so you can focus on making the moment unforgettable.",
  },
];

const StepCard = ({ step, delay }) => {
  const Icon = step.icon;

  return (
    <div
      className="
        group relative flex-1 overflow-hidden rounded-3xl bg-white
        border border-gray-100 p-8
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.1)]
        animate-fade-in-up
      "
      style={{ animationDelay: delay }}
    >
      <span className="absolute -top-3 -right-1 text-7xl font-extrabold text-gray-50 select-none">
        {step.number}
      </span>

      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
        <Icon className="text-red-600" size={26} />
      </div>

      <h3 className="relative mt-6 text-xl font-bold text-gray-900">
        {step.title}
      </h3>

      <p className="relative mt-3 text-gray-600 leading-relaxed">
        {step.description}
      </p>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50/60">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-50/60 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            <p className="text-red-600 font-semibold tracking-[0.2em] text-xs uppercase">
              Simple & Seamless
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            How It Works
          </h2>

          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            Three simple steps stand between you and your perfect event
            venue.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-1 items-start gap-6 lg:contents"
            >
              <StepCard step={step} delay={`${index * 150}ms`} />

              {index < STEPS.length - 1 && (
                <div className="hidden lg:flex shrink-0 items-center pt-16">
                  <ArrowRight className="text-gray-300" size={28} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 text-center animate-fade-in-up">
          <Link
            to={ROUTES.HOW_IT_WORKS}
            className="
              group inline-flex items-center gap-1.5
              text-red-600 font-semibold
              transition-colors duration-300 hover:text-red-700
            "
          >
            See the full step-by-step guide
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
