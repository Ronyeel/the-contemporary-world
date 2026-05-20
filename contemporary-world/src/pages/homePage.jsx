import NavBar from "../components/layout/NavBar/NavBar";
import HeroSection from "../components/home/HeroSection/HeroSection";
import CloudOverlay from "../components/home/CloudOverlay/CloudOverlay";
import LessonsCarousel from "../components/home/LessonsCarousel/LessonsCarousel";
import IntroSection from "../components/home/IntroSection/IntroSection";
import VisualJourney from "../components/home/VisualJourney/VisualJourney";
import InteractiveMap from "../components/home/InteractiveMap/InteractiveMap";
import Footer from "../components/layout/Footer/Footer";
import "./homePage.css";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <NavBar />
      <HeroSection />
      {/* Positioned on the boundary line between Hero and Lessons */}
      <CloudOverlay />
      <LessonsCarousel />
      <IntroSection />
      <VisualJourney />
      <InteractiveMap />
      <Footer />
    </div>
  );
};

export default HomePage;
