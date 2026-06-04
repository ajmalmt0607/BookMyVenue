import HeroSection from "../../components/home/HeroSection";
import Navbar from "../../components/layout/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <div className="p-10">
        <HeroSection />
      </div>
    </>
  );
};

export default HomePage;