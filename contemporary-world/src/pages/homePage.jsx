import HeroSection from "../components/home/HeroSection/HeroSection";
import CloudOverlay from "../components/home/CloudOverlay/CloudOverlay";
import LessonsCarousel from "../components/home/LessonsCarousel/LessonsCarousel";
import IntroSection from "../components/home/IntroSection/IntroSection";
import VisualJourney from "../components/home/VisualJourney/VisualJourney";
import InteractiveMap from "../components/home/InteractiveMap/InteractiveMap";
import "./homePage.css";

const HomePage = ({ onSelectLesson }) => {
  return (
    <div className="homepage-container">
      <HeroSection />
      {/* Positioned on the boundary line between Hero and Lessons */}
      <CloudOverlay />
      <LessonsCarousel onSelectLesson={onSelectLesson} />
      <IntroSection />
      <VisualJourney />
      <InteractiveMap />
    </div>
  );
};

export default HomePage;
