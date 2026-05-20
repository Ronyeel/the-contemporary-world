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
          // Instead of calculating the dynamic height of the Hero section,
          // we directly measure the distance of the Lessons section ("#topics") to the viewport top.
          const topicsEl = document.getElementById("topics");
          
          if (topicsEl) {
            const rect = topicsEl.getBoundingClientRect();
            // Trigger sticky fixed layout as soon as the Lessons section reaches the top of viewport (with 80px offset)
            if (rect.top <= 80) {
              setIsSticky(true);
            } else {
              setIsSticky(false);
            }
          } else {
            // Fallback calculation using window height if the topics section element is not yet in the DOM
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
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    
    // Run immediately to establish initial state on page loads (e.g. user refreshed mid-scroll)
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
