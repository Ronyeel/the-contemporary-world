import cloud1 from "../../../assets/cloud 1.png";
import cloud2 from "../../../assets/cloud 2.png";
import "./CloudOverlay.css";

const CloudOverlay = () => {
  return (
    <div className="clouds-wrapper">
      <div className="clouds-container">
        {/* Cloud Layer 1: Left side fluffy cloud */}
        <img 
          src={cloud1} 
          className="cloud-layer cloud-layer--1" 
          alt="Transition Cloud Left" 
        />
        
        {/* Cloud Layer 2: Center overlapping cloud */}
        <img 
          src={cloud2} 
          className="cloud-layer cloud-layer--center" 
          alt="Transition Cloud Center" 
        />
        
        {/* Cloud Layer 3: Right side volumetric cloud */}
        <img 
          src={cloud1} 
          className="cloud-layer cloud-layer--2" 
          alt="Transition Cloud Right" 
        />
        
        {/* Blending overlay to merge the bottom edge into the white section */}
        <div className="cloud-blend-overlay"></div>
      </div>
    </div>
  );
};

export default CloudOverlay;
