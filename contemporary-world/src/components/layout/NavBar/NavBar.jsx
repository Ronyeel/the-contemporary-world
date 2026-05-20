import { useState, useEffect } from "react";
import Logo from "../../common/Logo/Logo";
import "./NavBar.css";

const NavBar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isSticky, setIsSticky] = useState(false);
  const navItems = ["Home", "Topics", "References", "About Us"];

  useEffect(() => {
    const handleScroll = () => {
      const topicsEl = document.getElementById("topics");
      
      if (topicsEl) {
        const rect = topicsEl.getBoundingClientRect();
        // Trigger sticky fixed layout as soon as the Lessons section (white background) reaches the top of viewport.
        // We use 80px as the threshold (approx navbar height) so it switches exactly as the white section meets the navbar.
        if (rect.top <= 80) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      } else {
        // Fallback using scroll height if topics element is not found
        const scrollPosition = 
          window.pageYOffset || 
          document.documentElement.scrollTop || 
          document.body.scrollTop || 
          0;
        
        if (scrollPosition >= window.innerHeight - 80) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    // Listen on multiple targets to ensure scroll events fire instantly across all browsers and devices
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    
    // Run immediately on load/mount to catch refreshed page states
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isSticky ? "sticky" : ""}`}>
      <Logo />
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item} className={activeTab === item ? "active" : ""}>
            <a 
              href={`#${item.toLowerCase().replace(" ", "")}`} 
              onClick={() => setActiveTab(item)}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
