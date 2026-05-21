import HeroSection from "../components/home/HeroSection/HeroSection";
import CloudOverlay from "../components/home/CloudOverlay/CloudOverlay";
import LessonsCarousel from "../components/home/LessonsCarousel/LessonsCarousel";
import IntroSection from "../components/home/IntroSection/IntroSection";
import VisualJourney from "../components/home/VisualJourney/VisualJourney";
import InteractiveMap from "../components/home/InteractiveMap/InteractiveMap";
import "./homePage.css";

const HomePage = ({ onSelectLesson, onNavigate }) => {
  return (
    <div className="homepage-container">
      <HeroSection onNavigate={onNavigate} />
      {/* Positioned on the boundary line between Hero and Lessons */}
      <CloudOverlay />
      <LessonsCarousel onSelectLesson={onSelectLesson} />
      <IntroSection onNavigate={onNavigate} />
      <VisualJourney />
      <InteractiveMap />
    </div>
  );
};

export default HomePage;
