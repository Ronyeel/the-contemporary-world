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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = lessons.length;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [total, isPaused]);

  const getCardClass = (index) => {
    let diff = (index - activeIndex) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;

    if (diff === 0) return 'lesson-card--center clickable-featured-card';
    if (diff === 1 || (diff === -(total - 1) && total > 2)) return 'lesson-card--right';
    if (diff === -1 || (diff === (total - 1) && total > 2)) return 'lesson-card--left';
    return diff > 0 ? 'lesson-card--hidden-right' : 'lesson-card--hidden-left';
  };

  return (
    <section className="lessons-section" id="topics">
      <div className="lessons-inner">
        <h2 className="lessons-heading">Lessons</h2>

        <div 
          className="carousel-track"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {lessons.map((lesson, index) => {
            const cardClass = getCardClass(index);
            const isFeatured = cardClass.includes('center');

            return (
              <div
                key={lesson.id}
                className={`lesson-card ${cardClass}`}
                onClick={() => {
                  if (isFeatured) {
                    onSelectLesson && onSelectLesson(lesson.id);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (isFeatured) {
                      onSelectLesson && onSelectLesson(lesson.id);
                    } else {
                      setActiveIndex(index);
                    }
                  }
                }}
                title={isFeatured ? "Click to view details" : ""}
              >
                <div className="lesson-card__cover-wrapper">
                  <img 
                    src={lesson.cover} 
                    alt={lesson.title} 
                    className="lesson-card__flat-cover" 
                  />
                </div>
                <p className="lesson-card__flat-title">{lesson.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LessonsCarousel;
