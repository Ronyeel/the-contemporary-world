import { useState } from "react";
import "./topicPage.css";
import lessonsData from "../data/lessonsData.json";
import BookCard from "../components/common/BookCard/BookCard";

const BOOKS = lessonsData.lessons.map((lesson, index) => ({
    id: lesson.id,
    title: lesson.title.split(":")[0] || lesson.title,
    subtitle: lesson.title.includes(":") ? lesson.title.split(":")[1].trim() : `Chapter ${index + 1}`,
    cover: lesson.img || null,
    // Extract base colors from the linear-gradient accent for the 3D effects
    color: lesson.accent.match(/#([0-9a-fA-F]{6})/g)?.[0] || "#14375a",
    accent: lesson.accent.match(/#([0-9a-fA-F]{6})/g)?.[1] || "#29aef0"
}));



const TopicsPage = ({ onSelectLesson }) => {
    const [search, setSearch] = useState("");

    const filtered = BOOKS.filter(
        (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.subtitle.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="topics-page" id="topics">

            <div className="topics-search-wrapper">
                <div className="topics-search-bar">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search Topic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch("")}>×</button>
                    )}
                </div>
            </div>

            <div className="topics-section">
                <h2 className="topics-section-title">TOPICS TO READ</h2>
                {filtered.length > 0 ? (
                    <div className="topics-grid">
                        {filtered.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onClick={(b) => onSelectLesson && onSelectLesson(b.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="topics-empty">
                        <p>No topics found for "<strong>{search}</strong>"</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default TopicsPage;