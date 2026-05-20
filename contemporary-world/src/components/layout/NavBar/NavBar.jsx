import { useState, useEffect } from "react";
import Logo from "../../common/Logo/Logo";
import "./NavBar.css";

const NavBar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isSticky, setIsSticky] = useState(false);
  const navItems = ["Home", "Topics", "References", "About Us"];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const heroEl = document.getElementById("home");
          // Fallback to window.innerHeight if hero element isn't in DOM yet
          const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
          
          // Unified scrolling detection across browsers and nested scroll viewports
          const scrollPosition = 
            window.pageYOffset || 
            document.documentElement.scrollTop || 
            document.body.scrollTop || 
            0;

          // Trigger sticky state slightly before leaving the hero to prevent layout gaps (e.g. 50px buffer)
          if (scrollPosition >= heroHeight - 50) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Attach listeners on both window and document to catch all events
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial evaluation
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
