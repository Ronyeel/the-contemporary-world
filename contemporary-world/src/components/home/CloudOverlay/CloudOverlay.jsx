import { useEffect } from "react";
import cloud1 from "../../../assets/cloud 1.png";
import cloud2 from "../../../assets/cloud 2.png";
import "./CloudOverlay.css";

const CloudOverlay = () => {
  useEffect(() => {
    const leftCloud = document.querySelector(".cloud-layer-wrapper--1");
    const rightCloud = document.querySelector(".cloud-layer-wrapper--2");

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 1000; // Peak reveal displacement by 1000px scroll
      const progress = Math.min(scrollY / maxScroll, 1);
      
      // Part the clouds horizontally (left/right) and float them upwards slightly (parallax)
      if (leftCloud) {
        leftCloud.style.transform = `translate3d(${-progress * 180}px, ${progress * -60}px, 0)`;
      }
      if (rightCloud) {
        rightCloud.style.transform = `translate3d(${progress * 180}px, ${progress * -60}px, 0)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="clouds-wrapper">
      <div className="clouds-container">
        {/* Cloud Layer 1: Left side fluffy cloud wrapper */}
        <div className="cloud-layer-wrapper cloud-layer-wrapper--1">
          <img 
            src={cloud1} 
            className="cloud-layer cloud-layer--1" 
            alt="Transition Cloud Left" 
          />
        </div>
        
        {/* Cloud Layer 2: Right side volumetric cloud wrapper */}
        <div className="cloud-layer-wrapper cloud-layer-wrapper--2">
          <img 
            src={cloud2} 
            className="cloud-layer cloud-layer--2" 
            alt="Transition Cloud Right" 
          />
        </div>
        
        {/* Blending overlay to merge the bottom edge into the white section */}
        <div className="cloud-blend-overlay"></div>
      </div>
    </div>
  );
};

export default CloudOverlay;
