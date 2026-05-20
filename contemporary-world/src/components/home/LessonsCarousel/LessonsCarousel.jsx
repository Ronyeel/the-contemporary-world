import { useState, useEffect } from "react";
import "./LessonsCarousel.css";

import lessonsData from "../../../data/lessonsData.json";

const lessons = lessonsData.lessons;

const CardCover = ({ lesson }) => (
  <div className="lesson-card__cover" style={{ background: lesson.accent }}>
    {lesson.img ? (
      <img 
        src={lesson.img} 
        alt={lesson.title} 
        key={lesson.id} 
        className="carousel-fade-in" 
      />
    ) : (
      <div 
        className="lesson-card__placeholder carousel-fade-in" 
        key={lesson.id}
      >
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

const LessonsCarousel = ({ onSelectLesson }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const total = lessons.length;

  const prevIdx = (activeIndex - 1 + total) % total;
  const nextIdx = (activeIndex + 1) % total;

  useEffect(() => {
    if (isPaused) return; // Pause auto-advance when hovered
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, 3000); // Auto-advance every 3 seconds
    return () => clearInterval(timer);
  }, [total, isPaused]);

  return (
    <section className="lessons-section" id="topics">
      <div className="lessons-inner">
        <h2 className="lessons-heading">Lessons</h2>

        <div 
          className="carousel-track"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
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
              <p 
                className="lesson-card__title carousel-fade-in" 
                key={lessons[prevIdx].id}
              >
                {lessons[prevIdx].title}
              </p>
            </div>
          </div>

          {/* Center featured card */}
          <div 
            className="lesson-card lesson-card--featured clickable-featured-card"
            onClick={() => onSelectLesson && onSelectLesson(lessons[activeIndex].id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelectLesson && onSelectLesson(lessons[activeIndex].id)}
            title="Click to view details"
          >
            <CardCover lesson={lessons[activeIndex]} />
            <div className="lesson-card__info">
              <p 
                className="lesson-card__title carousel-fade-in" 
                key={lessons[activeIndex].id}
              >
                {lessons[activeIndex].title}
              </p>
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
              <p 
                className="lesson-card__title carousel-fade-in" 
                key={lessons[nextIdx].id}
              >
                {lessons[nextIdx].title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonsCarousel;
