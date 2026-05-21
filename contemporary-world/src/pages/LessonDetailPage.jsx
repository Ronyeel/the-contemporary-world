import { useEffect } from "react";
import lessonsData from "../data/lessonsData.json";
import "./LessonDetailPage.css";

const LessonDetailPage = ({ lessonId, onBack }) => {
  const lesson = lessonsData.lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    // Scroll to the top of the page on render
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="lesson-detail-error">
        <h2>Lesson Not Found</h2>
        <button onClick={onBack} className="btn-back">Go Back Home</button>
      </div>
    );
  }

  let cover = lesson.img || null;
  if (lesson.id === 1) {
    cover = "/book_cover1.png";
  } else if (lesson.id === 2) {
    cover = "/book_cover2.png";
  } else if (lesson.id === 3) {
    cover = "/book_cover3.png";
  }

  return (
    <div className="lesson-detail-page">
      {/* Premium Header Banner (Matching Mockup) */}
      <div className="lesson-detail-banner">
        <div className="banner-content">
          {/* Cover Image Wrapper (Matching Mockup) */}
          <div className="banner-image-container">
            <img 
              src={cover} 
              alt={lesson.title} 
              className="banner-image"
            />
          </div>
          
          {/* Title */}
          <h1 className="lesson-detail-title">{lesson.title}</h1>
        </div>
      </div>

      {/* Lesson Content Section */}
      <div className="lesson-detail-body">
        <div className="lesson-detail-container">
          {lesson.subtopics.map((subtopic, index) => (
            <section key={index} className="subtopic-section">
              <h3 className="subtopic-title">Sub Topic {index + 1}</h3>
              <p className="subtopic-content">{subtopic.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
