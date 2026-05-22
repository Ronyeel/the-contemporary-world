import { useState } from "react";
import "./aboutPage.css";

const AboutPage = () => {
  const [showMembers, setShowMembers] = useState(false);

  // Member list with rotating accent colors
  const accents = ["cyan", "purple", "blue", "gold", "red"];
  const memberData = [
    { name: "Ronniel S. Victa", role: "Developer" },
    { name: "Jushua P. Solayao", role: "Developer" },
    { name: "Railey Joaquin D. Pineda", role: "UI/UX" },
    { name: "Harvey F. Portez", role: "UI/UX" },
    { name: "Nicole H. Cabarle", role: "Content Writer" },
    { name: "Rayjen R. Bermudo", role: "Content Writer" },
    { name: "Maria Shayne D. Balane", role: "Member" },
    { name: "Jay Clifford J. Bernardino", role: "Member" },
    { name: "Samantha V. Caayao", role: "Member" },
    { name: "Kyle Brendan I. Era", role: "Member" },
    { name: "Maureen Joy A. Esperida", role: "Member" },
    { name: "Exsequiel Gabo", role: "Member" },
    { name: "Russel Dan Garfin", role: "Member" },
    { name: "Yhemrie C. Gundran", role: "Member" },
    { name: "Sophia Nicole M. Marca", role: "Member" },
    { name: "Louise James Rada", role: "Member" },
    { name: "Kerby Ann D. Salvador", role: "Member" }
  ];

  const members = memberData.map((data, i) => ({
    ...data,
    accent: accents[i % accents.length],
  }));

  return (
    <div className="about-container">
      {/* Immersive Header Banner */}
      <header className="about-banner">
        <div className="about-banner-overlay"></div>
        <div className="about-banner-content">
          <h1 className="about-banner-title">About Us</h1>
          <p className="about-banner-subtitle">
            Welcome to our website about Globalization. This platform was created to provide
            information, insights, and understanding about how globalization affects different aspects of
            society such as education, lifestyle, culture, migration, technology, and the economy.
          </p>
        </div>
      </header>

      {/* Main Section */}
      <main className="about-main">
        <section className="about-who-card">
          <h2 className="about-card-title">Who are we?</h2>
          <p className="about-card-body">
            We are Bachelor of Science in Information Systems students from Camarines Norte State
            College who developed this website as part of our academic requirement.
          </p>

          <button
            className={`about-btn ${showMembers ? "active" : ""}`}
            onClick={() => setShowMembers(!showMembers)}
            aria-expanded={showMembers}
          >
            <svg
              className="about-btn-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{showMembers ? "Hide Member List" : "View Member List"}</span>
          </button>
        </section>

        {/* Dynamic Member List Grid */}
        <section className={`about-members-section ${showMembers ? "visible" : ""}`}>
          <div className="about-members-grid">
            {members.map((member, index) => (
              <div
                key={member.name}
                className="about-member-card"
                style={{
                  "--card-accent": `var(--accent-${member.accent})`,
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <div className="member-avatar-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="member-avatar-svg"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="member-card-body">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Purpose Section */}
        <section className="about-purpose-section">
          <h2 className="about-purpose-title">Our Purpose</h2>
          <p className="about-purpose-text">
            Our purpose is to educate and inform readers about the different aspects
            and effects of globalization in today's modern society. Through this website,
            we aim to share knowledge about global connections in education, lifestyle,
            migration, technology, and communication while encouraging awareness,
            understanding, and critical thinking among students and readers.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
