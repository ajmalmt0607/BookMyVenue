import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import SearchCard from "../search/SearchCard";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-red-100/40 blur-[100px]" />
        <div className="absolute top-24 -right-24 h-104 w-104 rounded-full bg-red-50/70 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 py-20 lg:py-18">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <HeroContent />

          <HeroImage />
        </div>

        <SearchCard />
      </div>
    </section>
  );
};

export default HeroSection;
