import { useRef, useEffect } from 'react';
import './IntroSection.css';

const IntroSection = ({ onNavigate }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4;
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
          <div className="intro-card-layout">
            {/* Left — colored description card */}
            <div className="intro-desc-card">
              <span className="intro-desc-label">About the Subject</span>
              <h3 className="intro-desc-title">The Contemporary World</h3>
              <p className="intro-desc-body">
                The Contemporary World studies how power, culture, technology,
                migration, and global systems reshape everyday life. It explores
                why cities become global hubs, why people move across borders,
                how media influences identity, why inequality and food insecurity
                persist, and how globalization creates both connection and
                conflict in modern society.
              </p>
            </div>

            {/* Right — summary + action */}
            <div className="intro-side-panel">
              <p className="intro-side-text">
                Understand the forces that shape our interconnected world — from
                global trade and migration to media, religion, and technology.
              </p>
              <a href="#topics" className="intro-side-link" onClick={(e) => {
                e.preventDefault();
                if (onNavigate) {
                  onNavigate("topics");
                } else {
                  const el = document.getElementById('topics');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                Explore the Topics
                <span className="intro-side-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
