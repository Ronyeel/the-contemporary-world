import { useState, useEffect } from "react";
import Logo from "../../common/Logo/Logo";
import "./NavBar.css";

const NavBar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isSticky, setIsSticky] = useState(false);
  const navItems = ["Home", "Topics", "References", "About Us"];

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("home");
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
      
      // Once we scroll past the hero section, stick the navbar to the top
      if (window.scrollY >= heroHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
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
