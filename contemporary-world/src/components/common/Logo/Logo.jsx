import "./Logo.css";

const Logo = () => {
  return (
    <div className="logo-container">
      <svg className="logo-icon" width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#0062ff" />
          </linearGradient>
          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stylized "C" path */}
        <path 
          d="M23 10.5C21.2 8.7 18.7 7.5 16 7.5C10.8 7.5 6.5 11.8 6.5 17C6.5 22.2 10.8 26.5 16 26.5C18.7 26.5 21.2 25.3 23 23.5" 
          stroke="url(#logo-grad)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
          filter="url(#logo-glow)"
        />
        {/* Inside circle/globe */}
        <circle cx="16" cy="17" r="2.8" fill="url(#logo-grad)" filter="url(#logo-glow)" />
      </svg>
      <div className="logo-text">
        <span className="text-white">Contemporary</span>
        <span className="text-blue">World</span>
      </div>
    </div>
  );
};

export default Logo;
