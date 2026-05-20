import { useState } from "react";
import NavBar from "./components/layout/NavBar/NavBar";
import HomePage from "./pages/homePage";
import LessonDetailPage from "./pages/LessonDetailPage";
import Footer from "./components/layout/Footer/Footer";

function App() {
  const [currentView, setCurrentView] = useState({ type: "home", lessonId: null });

  const handleSelectLesson = (id) => {
    setCurrentView({ type: "lesson", lessonId: id });
  };

  const handleNavigateHome = (sectionId = "") => {
    setCurrentView({ type: "home", lessonId: null });
    
    if (sectionId) {
      // Delay slightly to let the Home DOM mount, then scroll to section
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="app-container">
      <NavBar 
        currentView={currentView} 
        onNavigateHome={handleNavigateHome} 
      />
      {currentView.type === "home" ? (
        <HomePage onSelectLesson={handleSelectLesson} />
      ) : (
        <LessonDetailPage 
          lessonId={currentView.lessonId} 
          onBack={() => handleNavigateHome("topics")} 
        />
      )}
      <Footer onNavigateHome={handleNavigateHome} />
    </div>
  );
}

export default App;
