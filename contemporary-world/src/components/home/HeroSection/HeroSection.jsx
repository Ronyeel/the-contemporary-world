import Button from "../../common/Button/Button";
import Earth3D from "../Earth3D/Earth3D";
import CloudOverlay from "../CloudOverlay/CloudOverlay";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-grid">
        <div className="hero-left">
          <h1 className="hero-title">
            <span className="title-top">Global Perspectives:</span>
            <span className="title-mid">Society, Culture,</span>
            <span className="title-bottom">and Development.</span>
          </h1>
          
          <p className="hero-desc">
            A curated collection of topics discussed in Contemporary World — 
            covering how globalization, migration, trade, and technology shape 
            our lives today.
          </p>
          
          <div className="hero-cta-buttons">
            <Button variant="primary" href="#topics">
              Explore Lessons
            </Button>
            <Button variant="secondary" href="#references">
              Start Reading
            </Button>
          </div>
        </div>
        
        <div className="hero-right">
          <div className="earth-container">
            <Earth3D />
          </div>
        </div>
      </div>
      
      {/* Cloud Overlay at the bottom of the Hero section, transitioning to the Lessons section */}
      <CloudOverlay />
    </section>
  );
};

export default HeroSection;
