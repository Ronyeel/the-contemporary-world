import "./Footer.css";

const Footer = ({ onNavigateHome }) => {
  const handleFooterLinkClick = (e, sectionId) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome(sectionId);
    }
  };

  return (
    <footer className="cw-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Column 1: Logo, Title & Description */}
          <div className="footer-col col-main">
            <div className="footer-logo">
              <svg className="logo-icon-svg" width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footer-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d2ff" />
                    <stop offset="100%" stopColor="#0062ff" />
                  </linearGradient>
                  <filter id="footer-logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path 
                  d="M23 10.5C21.2 8.7 18.7 7.5 16 7.5C10.8 7.5 6.5 11.8 6.5 17C6.5 22.2 10.8 26.5 16 26.5C18.7 26.5 21.2 25.3 23 23.5" 
                  stroke="url(#footer-logo-grad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  filter="url(#footer-logo-glow)"
                />
                <circle cx="16" cy="17" r="2.8" fill="url(#footer-logo-grad)" filter="url(#footer-logo-glow)" />
              </svg>
              <span className="footer-title">Contemporary World</span>
            </div>
            <p className="footer-desc">
              A curated collection of topics discussed in Contemporary World — covering how 
              globalization, migration, trade, and technology shape our lives today.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => handleFooterLinkClick(e, "home")}>Home</a></li>
              <li><a href="#topics" onClick={(e) => handleFooterLinkClick(e, "topics")}>Topics</a></li>
              <li><a href="#references" onClick={(e) => handleFooterLinkClick(e, "references")}>Reference</a></li>
              <li><a href="#about" onClick={(e) => handleFooterLinkClick(e, "intro")}>About Us</a></li>
            </ul>
          </div>

          {/* Column 3: Instructor */}
          <div className="footer-col">
            <h4 className="footer-col-title">Instructor</h4>
            {/* Kept empty as per design image */}
          </div>

          {/* Column 4: Get in Touch */}
          <div className="footer-col">
            <h4 className="footer-col-title">Get in Touch</h4>
            <div className="footer-socials">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="https://www.facebook.com/solayao.jushua.2025" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="mailto:info@contemporaryworld.com" className="social-icon-btn" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copy">
            <span className="copy-badge">C</span>
            <span>2026 Contemporary World All rights Reserved</span>
          </div>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms & Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
