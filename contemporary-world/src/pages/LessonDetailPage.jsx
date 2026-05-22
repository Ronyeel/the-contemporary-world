import { useEffect } from "react";
import lessonsData from "../data/lessonsData.json";
import "./LessonDetailPage.css";

const LessonDetailPage = ({ lessonId, onBack }) => {
  const lesson = lessonsData.lessons.find((l) => l.id === lessonId);

  useEffect(() => {
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

  return (
    <div className="lesson-detail-page">
      {/* Premium Header Banner (Matching Mockup) */}
      <div className="lesson-detail-banner">
        <div className="banner-content">
          {/* Cover Image Wrapper (Matching Mockup) */}
          <div className="banner-image-container">
            <img
              src={lesson.img}
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
              <h3 className="subtopic-title">{subtopic.title}</h3>
              {Array.isArray(subtopic.content)
                ? subtopic.content.map((item, i) =>
                  item.type === "heading" ? (
                    <p key={i} className="content-heading">{item.text}</p>
                  ) : item.type === "bullet" ? (
                    <p key={i} className="content-bullet">{item.text}</p>
                  ) : item.type === "numbered" ? (
                    <p key={i} className="content-numbered">{item.text}</p>
                  ) : (
                    <p key={i} className="subtopic-content">{item.text}</p>
                  )
                )
                : <p className="subtopic-content">{subtopic.content}</p>
              }
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;