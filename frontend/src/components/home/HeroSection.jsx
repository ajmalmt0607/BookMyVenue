import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import SearchCard from "../search/SearchCard";

const HeroSection = () => {
  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-5
        py-16
      "
    >
      <div
        className="
          grid
          lg:grid-cols-2
          gap-12
          items-center
        "
      >
        <HeroContent />

        <HeroImage />
      </div>

      <SearchCard />
    </section>
  );
};

export default HeroSection; 