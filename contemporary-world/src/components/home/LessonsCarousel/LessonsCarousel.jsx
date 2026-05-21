import { useState, useEffect } from "react";
import "./LessonsCarousel.css";

import lessonsData from "../../../data/lessonsData.json";

// Map the shared JSON data to the format expected by the flat carousel cards
const lessons = lessonsData.lessons.map((lesson) => {
  return {
    id: lesson.id,
    title: lesson.title,
    cover: lesson.img || null,
    color: lesson.accent.match(/#([0-9a-fA-F]{6})/g)?.[0] || "#14375a",
    accent: lesson.accent.match(/#([0-9a-fA-F]{6})/g)?.[1] || "#29aef0"
  };
});

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
            className={`lesson-card lesson-card--side`}
            onClick={() => setActiveIndex(prevIdx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveIndex(prevIdx)}
          >
            <div className="lesson-card__cover-wrapper">
              <img 
                src={lessons[prevIdx].cover} 
                alt={lessons[prevIdx].title} 
                className="lesson-card__flat-cover" 
              />
            </div>
            <p className="lesson-card__flat-title">{lessons[prevIdx].title}</p>
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
            <div className="lesson-card__cover-wrapper">
              <img 
                src={lessons[activeIndex].cover} 
                alt={lessons[activeIndex].title} 
                className="lesson-card__flat-cover" 
              />
            </div>
            <p className="lesson-card__flat-title">{lessons[activeIndex].title}</p>
          </div>

          {/* Right side card */}
          <div
            className={`lesson-card lesson-card--side`}
            onClick={() => setActiveIndex(nextIdx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveIndex(nextIdx)}
          >
            <div className="lesson-card__cover-wrapper">
              <img 
                src={lessons[nextIdx].cover} 
                alt={lessons[nextIdx].title} 
                className="lesson-card__flat-cover" 
              />
            </div>
            <p className="lesson-card__flat-title">{lessons[nextIdx].title}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonsCarousel;
