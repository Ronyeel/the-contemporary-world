import { useState, useEffect } from "react";
import Logo from "../../common/Logo/Logo";
import "./NavBar.css";

const NavBar = ({ currentView, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isSticky, setIsSticky] = useState(false);
  const navItems = ["Home", "Topics", "References", "About Us"];

  const sectionMap = {
    "Home": "home",
    "Topics": "topics",
    "References": "interactive-map",
    "About Us": "intro"
  };

  useEffect(() => {
    // If we're on a lesson page, it should always highlight 'Topics'
    if (currentView && currentView.type === "lesson") {
      setActiveTab("Topics");
    }
  }, [currentView]);

  useEffect(() => {
    const handleScroll = () => {
      // If we're on a lesson detail view, we want the navbar to be always sticky/fixed
      if (currentView && currentView.type === "lesson") {
        setIsSticky(true);
        return;
      }

      const topicsEl = document.getElementById("topics");
      const scrollPosition = 
        window.pageYOffset || 
        document.documentElement.scrollTop || 
        document.body.scrollTop || 
        0;

      let shouldBeSticky = scrollPosition >= window.innerHeight - 80;

      if (topicsEl) {
        const rect = topicsEl.getBoundingClientRect();
        if (rect.top <= 80) {
          shouldBeSticky = true;
        }
      }

      setIsSticky(shouldBeSticky);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [currentView]);

  const handleLogoClick = () => {
    setActiveTab("Home");
    if (onNavigateHome) {
      onNavigateHome("home");
    }
  };

  const handleNavLinkClick = (e, item) => {
    e.preventDefault();
    setActiveTab(item);
    if (onNavigateHome) {
      onNavigateHome(sectionMap[item]);
    }
  };

  return (
    <nav className={`navbar ${isSticky || (currentView && currentView.type === "lesson") ? "sticky" : ""}`}>
      <Logo onClick={handleLogoClick} />
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item} className={activeTab === item ? "active" : ""}>
            <a 
              href={`#${sectionMap[item]}`} 
              onClick={(e) => handleNavLinkClick(e, item)}
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
