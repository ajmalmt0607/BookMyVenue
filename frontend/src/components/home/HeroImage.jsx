import heroImage from "../../assets/hero.png";

const HeroImage = () => {
  return (
    <div className="relative">

      <img
        src={heroImage}
        alt="Venue"
        className="
          rounded-3xl
          shadow-xl
          w-full
          object-cover
        "
      />

      <div
        className="
          absolute
          bottom-6
          right-6
          bg-red-600
          text-white
          px-6
          py-4
          rounded-2xl
          text-center
        "
      >
        <h3 className="text-2xl font-bold">
          10,000+
        </h3>

        <p className="text-sm">
          Happy Events
        </p>
      </div>

    </div>
  );
};

export default HeroImage;