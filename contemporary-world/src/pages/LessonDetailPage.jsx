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
              
              {/* Optional top-level subtopic image */}
              {subtopic.image && (
                <div className="subtopic-image-container">
                  <img src={subtopic.image} alt={subtopic.title} className="subtopic-image" />
                  {subtopic.imageCaption && <p className="subtopic-image-caption">{subtopic.imageCaption}</p>}
                </div>
              )}

              {Array.isArray(subtopic.content)
                ? (() => {
                    const elements = [];
                    let i = 0;
                    while (i < subtopic.content.length) {
                      const item = subtopic.content[i];
                      if (item.type === "numbered") {
                        // Group consecutive numbered items
                        const numberedItems = [];
                        while (i < subtopic.content.length && subtopic.content[i].type === "numbered") {
                          numberedItems.push(subtopic.content[i]);
                          i++;
                        }
                        elements.push(
                          <div key={`num-group-${i}`} className="numbered-group">
                            {numberedItems.map((ni, j) => (
                              <p key={j} className="content-numbered">{ni.text}</p>
                            ))}
                          </div>
                        );
                      } else if (item.type === "heading") {
                        elements.push(<p key={i} className="content-heading">{item.text}</p>);
                        i++;
                      } else if (item.type === "bullet") {
                        elements.push(<p key={i} className="content-bullet">{item.text}</p>);
                        i++;
                      } else if (item.type === "image") {
                        elements.push(
                          <div key={i} className="content-image-container">
                            <img src={item.url} alt={item.caption || "Content image"} className="content-image" />
                            {item.caption && <p className="content-image-caption">{item.caption}</p>}
                          </div>
                        );
                        i++;
                      } else {
                        elements.push(<p key={i} className="subtopic-content">{item.text}</p>);
                        i++;
                      }
                    }
                    return elements;
                  })()
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