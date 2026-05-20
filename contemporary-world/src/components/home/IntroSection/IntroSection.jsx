import { useRef, useEffect } from 'react';
import './IntroSection.css';

const IntroSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4; // Slows down the video playback speed
    }
  }, []);

  return (
    <section className="intro-section" id="intro">
      <div className="intro-header">
        <div className="intro-inner">
          <h2 className="intro-heading">What is Contemporary World?</h2>
        </div>
      </div>
      
      <div className="intro-content-area">
        <video 
          ref={videoRef}
          className="intro-bg-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/topography.mp4" type="video/mp4" />
        </video>

        <div className="intro-inner intro-content-overlay">
          <div className="intro-media-placeholder">
            {/* You can replace this placeholder with a video iframe, image, or text content later */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
