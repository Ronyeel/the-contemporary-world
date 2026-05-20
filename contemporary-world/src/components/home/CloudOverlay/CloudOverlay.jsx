import React from "react";
import "./CloudOverlay.css";

const CloudOverlay = () => {
  return (
    <div className="clouds-container">
      {/* Dynamic Layered SVG for fluffy volumetric clouds */}
      <svg className="clouds-svg" viewBox="0 0 1440 220" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cloud-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.18)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
          </linearGradient>
          <linearGradient id="cloud-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(240, 248, 255, 0)" />
            <stop offset="30%" stopColor="rgba(240, 248, 255, 0.35)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.98)" />
          </linearGradient>
          <linearGradient id="cloud-grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          
          <filter id="blur-soft">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="blur-mid">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Back Cloud Layer (Very soft, slower moving/still) */}
        <path 
          d="M-100 120C150 40 400 60 650 110C900 160 1150 70 1400 100C1650 130 1700 80 1800 120V260H-100V120Z" 
          fill="url(#cloud-grad-1)" 
          filter="url(#blur-soft)" 
        />

        {/* Mid Cloud Layer */}
        <path 
          d="M-50 150C200 90 500 160 750 130C1000 100 1250 170 1500 140C1600 128 1700 130 1750 150V260H-50V150Z" 
          fill="url(#cloud-grad-2)" 
          filter="url(#blur-mid)" 
        />

        {/* Front Cloud Layer (Solid, sharp) */}
        <path 
          d="M0 180C300 140 600 200 900 160C1200 120 1350 190 1500 180V260H0V180Z" 
          fill="url(#cloud-grad-3)" 
        />
      </svg>
    </div>
  );
};

export default CloudOverlay;
