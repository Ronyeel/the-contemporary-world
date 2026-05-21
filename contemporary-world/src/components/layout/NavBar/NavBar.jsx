import { useState, useEffect } from "react";
import Logo from "../../common/Logo/Logo";
import "./NavBar.css";

const NavBar = ({ currentView, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [prevViewType, setPrevViewType] = useState(currentView?.type);
  const [isSticky, setIsSticky] = useState(false);
  const navItems = ["Home", "Topics", "References", "About Us"];

  const sectionMap = {
    "Home": "home",
    "Topics": "topics",
    "References": "references",
    "About Us": "intro",
  };

  // ── Sync active tab whenever the view changes ──────────────────
  if (currentView && currentView.type !== prevViewType) {
    setPrevViewType(currentView.type);
    if (currentView.type === "lesson" || currentView.type === "topics") {
      setActiveTab("Topics");
    } else if (currentView.type === "references") {
      setActiveTab("References");
    } else if (currentView.type === "home") {
      setActiveTab("Home");
    }
  }

  // ── Sticky logic ───────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      // Force sticky state immediately for sub-pages like Lesson Details and Topics list
      if (currentView && (currentView.type === "lesson" || currentView.type === "topics")) {
        setIsSticky(true);
        return;
      }

      // Treat References and Home dynamically based on scroll offset
      const scrollPosition =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      const shouldBeSticky = scrollPosition >= 50;

      setIsSticky(shouldBeSticky);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [currentView]);

  const handleLogoClick = () => {
    setActiveTab("Home");
    if (onNavigateHome) onNavigateHome("");   // empty string → go home, scroll to top
  };

  const handleNavLinkClick = (e, item) => {
    e.preventDefault();
    setActiveTab(item);
    if (onNavigateHome) onNavigateHome(sectionMap[item]);
  };

  const isOnNonHome =
    currentView && (currentView.type === "lesson" || currentView.type === "topics");

  return (
    <nav className={`navbar ${isSticky || isOnNonHome ? "sticky" : ""}`}>
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