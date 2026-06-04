import HeroFeatures from "./HeroFeatures";

const HeroContent = () => {
  return (
    <div>

      <p
        className="
          text-red-600
          font-semibold
          tracking-widest
          text-sm
          uppercase
          mb-5
        "
      >
        Find • Book • Celebrate
      </p>

      <h1
        className="
          text-4xl
          lg:text-5xl
          font-bold
          leading-tight
        "
      >
        Find The Perfect Venue
        <br />

        For
        <span className="text-red-600">
          {" "}
          Every Occasion
        </span>
      </h1>

      <p
        className="
          text-gray-600
          mt-6
          text-lg
          max-w-xl
        "
      >
        Discover and book amazing venues
        for weddings, birthdays,
        corporate events and more.
      </p>

      <HeroFeatures />

    </div>
  );
};

export default HeroContent;