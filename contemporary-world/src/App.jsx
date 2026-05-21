import { useState } from "react";
import NavBar from "./components/layout/NavBar/NavBar";
import HomePage from "./pages/homePage";
import TopicsPage from "./pages/topicPage.jsx";  // capital T, matches the file
import LessonDetailPage from "./pages/LessonDetailPage";
import ReferencesPage from "./pages/referencesPage.jsx";
import Footer from "./components/layout/Footer/Footer";

function App() {
  const [currentView, setCurrentView] = useState({ type: "home", lessonId: null });

  const handleSelectLesson = (id) => {
    setCurrentView({ type: "lesson", lessonId: id });
  };

  const handleNavigateHome = (sectionId = "") => {
    // "topics" → show the Topics page
    if (sectionId === "topics") {
      setCurrentView({ type: "topics", lessonId: null });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // "references" → show the References page
    if (sectionId === "references") {
      setCurrentView({ type: "references", lessonId: null });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Everything else → go to the home page
    setCurrentView({ type: "home", lessonId: null });

    if (sectionId && sectionId !== "home") {
      // Scroll to a specific section on the home page
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderView = () => {
    switch (currentView.type) {
      case "topics":
        return <TopicsPage onSelectLesson={handleSelectLesson} />;
      case "references":
        return <ReferencesPage />;
      case "lesson":
        return (
          <LessonDetailPage
            lessonId={currentView.lessonId}
            onBack={() => handleNavigateHome("topics")}
          />
        );
      default:
        return <HomePage onSelectLesson={handleSelectLesson} onNavigate={handleNavigateHome} />;
    }
  };

  return (
    <div className="app-container">
      <NavBar currentView={currentView} onNavigateHome={handleNavigateHome} />
      {renderView()}
      <Footer onNavigateHome={handleNavigateHome} />
    </div>
  );
}

export default App;