import { useState } from "react";
import Logo from "../../common/Logo/Logo";
import "./NavBar.css";

const NavBar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const navItems = ["Home", "Topics", "References", "About Us"];

  return (
    <nav className="navbar">
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
