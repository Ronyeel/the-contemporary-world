import { useState, useEffect } from "react";
import "./LessonsCarousel.css";

import lessonsData from "../../../data/lessonsData.json";

import BookCard from "../../common/BookCard/BookCard";

const lessons = lessonsData.lessons.map((lesson, index) => ({
    id: lesson.id,
    title: lesson.title.split(":")[0] || lesson.title,
    subtitle: lesson.title.includes(":") ? lesson.title.split(":")[1].trim() : `Chapter ${index + 1}`,
    cover: lesson.img || null,
    color: lesson.accent.match(/#([0-9a-fA-F]{6})/g)?.[0] || "#14375a",
    accent: lesson.accent.match(/#([0-9a-fA-F]{6})/g)?.[1] || "#29aef0"
}));

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
          <BookCard
            book={lessons[prevIdx]}
            className="lesson-card--side"
            onClick={() => setActiveIndex(prevIdx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveIndex(prevIdx)}
          />

          {/* Center featured card */}
          <BookCard
            book={lessons[activeIndex]}
            className="lesson-card--featured clickable-featured-card"
            onClick={(book) => onSelectLesson && onSelectLesson(book.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelectLesson && onSelectLesson(lessons[activeIndex].id)}
            title="Click to view details"
          />

          {/* Right side card */}
          <BookCard
            book={lessons[nextIdx]}
            className="lesson-card--side"
            onClick={() => setActiveIndex(nextIdx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveIndex(nextIdx)}
          />
        </div>
      </div>
    </section>
  );
};

export default LessonsCarousel;
