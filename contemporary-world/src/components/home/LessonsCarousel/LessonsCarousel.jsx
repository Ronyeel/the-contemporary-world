import React, { useState, useEffect } from "react";
import "./LessonsCarousel.css";

const lessons = [
  {
    id: 1,
    title: "Global Cities & Global Demography",
    accent: "linear-gradient(135deg, #0f2c5e 0%, #1a4a8a 50%, #0a1e42 100%)",
    image: null,
  },
  {
    id: 2,
    title: "Global Food Security and Global Citizenship",
    accent: "linear-gradient(135deg, #0d3b1f 0%, #1a6e3a 50%, #0a2914 100%)",
    image: null,
  },
  {
    id: 3,
    title: "Global Connections: Media, Religion, and Technology",
    accent: "linear-gradient(135deg, #2a0d5e 0%, #4a1a8a 50%, #1c0a42 100%)",
    image: null,
  },
  {
    id: 4,
    title: "Globalization",
    accent: "linear-gradient(135deg, #5e1a0d 0%, #8a3a1a 50%, #421008 100%)",
    image: null,
  },
  {
    id: 5,
    title: "Migration and Tourism",
    accent: "linear-gradient(135deg, #3a2a0d 0%, #6b4f1a 50%, #2a1e08 100%)",
    image: null,
  },
  {
    id: 6,
    title: "Global Trade",
    accent: "linear-gradient(135deg, #0d3a5e 0%, #1a6b8a 50%, #08283f 100%)",
    image: null,
  },
  {
    id: 7,
    title: "Human Security",
    accent: "linear-gradient(135deg, #1a3d0d 0%, #2e6b1a 50%, #112808 100%)",
    image: null,
  },
];

const CardCover = ({ lesson }) => (
  <div className="lesson-card__cover" style={{ background: lesson.accent }}>
    {lesson.image ? (
      <img src={lesson.image} alt={lesson.title} />
    ) : (
      <div className="lesson-card__placeholder">
        <div className="placeholder-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="19" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8"/>
            <path d="M5 24 Q14 14 24 24 Q34 14 43 24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" fill="none"/>
            <path d="M5 24 Q14 34 24 24 Q34 34 43 24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" fill="none"/>
            <line x1="24" y1="5" x2="24" y2="43" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8"/>
            <line x1="5" y1="24" x2="43" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8"/>
          </svg>
        </div>
        <span className="placeholder-label">Lesson {lesson.id}</span>
      </div>
    )}
  </div>
);

const LessonsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const total = lessons.length;

  const prevIdx = (activeIndex - 1 + total) % total;
  const nextIdx = (activeIndex + 1) % total;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, 3000); // Auto-advance every 3 seconds
    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="lessons-section" id="topics">
      <div className="lessons-inner">
        <h2 className="lessons-heading">Lessons</h2>

        <div className="carousel-track">
          {/* Left side card */}
          <div
            className="lesson-card lesson-card--side"
            onClick={() => setActiveIndex(prevIdx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveIndex(prevIdx)}
          >
            <CardCover lesson={lessons[prevIdx]} />
            <div className="lesson-card__info">
              <p className="lesson-card__title">{lessons[prevIdx].title}</p>
            </div>
          </div>

          {/* Center featured card */}
          <div className="lesson-card lesson-card--featured">
            <CardCover lesson={lessons[activeIndex]} />
            <div className="lesson-card__info">
              <p className="lesson-card__title">{lessons[activeIndex].title}</p>
            </div>
          </div>

          {/* Right side card */}
          <div
            className="lesson-card lesson-card--side"
            onClick={() => setActiveIndex(nextIdx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveIndex(nextIdx)}
          >
            <CardCover lesson={lessons[nextIdx]} />
            <div className="lesson-card__info">
              <p className="lesson-card__title">{lessons[nextIdx].title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonsCarousel;
