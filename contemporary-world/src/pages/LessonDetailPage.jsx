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

  return (
    <div className="lesson-detail-page">
      {/* Premium Header Banner (Matching Mockup) */}
      <div className="lesson-detail-banner">
        <div className="banner-content">
          {/* Large Image Card Placeholder */}
          <div className="banner-image-container">
            {lesson.img ? (
              <img 
                src={lesson.img} 
                alt={lesson.title} 
                className="banner-image"
              />
            ) : (
              <div className="banner-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#9ca3af">
                  <path d="M4 19V5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V19M4 19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19M4 19L9.17157 13.8284C9.95262 13.0474 11.219 13.0474 12 13.8284L20 21M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
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
