import HeroFeatures from "./HeroFeatures";
import HeroActions from "./HeroActions";
import HeroStats from "./HeroStats";

const HeroContent = () => {
  return (
    <div className="animate-fade-in-up">
      <div className="inline-flex items-center gap-2 mb-6">
        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

        <p className="text-red-600 font-semibold tracking-[0.2em] text-xs uppercase">
          Find • Book • Celebrate
        </p>
      </div>

      <h1
        className="
          text-4xl
          sm:text-5xl
          lg:text-[3.4rem]
          font-bold
          tracking-tight
          leading-[1.12]
          text-gray-900
        "
      >
        Find Your Perfect
        <br />
        <span className="text-red-600">Event Venues</span>
      </h1>

      <p className="text-gray-600 mt-6 text-lg leading-relaxed max-w-lg">
        Book wedding halls, convention centers, party venues, resorts and
        event spaces across India with confidence.
      </p>

      <HeroActions />

      <HeroStats />

      {/* <HeroFeatures /> */}
    </div>
  );
};

export default HeroContent;
