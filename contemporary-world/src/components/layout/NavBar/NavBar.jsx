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
      const scrollPosition = 
        window.pageYOffset || 
        document.documentElement.scrollTop || 
        document.body.scrollTop || 
        0;

      // Safe threshold: Trigger sticky fixed layout if scroll position is past the Hero viewport height (minus navbar padding),
      // OR if the Lessons section top border has scrolled up to the top viewport edge.
      let shouldBeSticky = scrollPosition >= window.innerHeight - 80;

      if (topicsEl) {
        const rect = topicsEl.getBoundingClientRect();
        if (rect.top <= 80) {
          shouldBeSticky = true;
        }
      }

      setIsSticky(shouldBeSticky);
    };

    // Listen to scroll events on both window and document to ensure event capture in all browser setups
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial call to check positioning state on load
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
