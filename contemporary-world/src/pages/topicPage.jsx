import { useState } from "react";
import "./topicPage.css";

const BOOKS = [
    { id: 1, title: "Global Connection:", subtitle: "Media Religion and Technology", cover: "/book_cover1.png", color: "#14375a", accent: "#29aef0" },
    { id: 2, title: "Globalization of Religion", subtitle: "Chapter 2", cover: null, color: "#2a1848", accent: "#9c6ef5" },
    { id: 3, title: "Globalization of Technology", subtitle: "Chapter 3", cover: null, color: "#123828", accent: "#28d98a" },
    { id: 4, title: "Migration and Society", subtitle: "Chapter 4", cover: null, color: "#3a1410", accent: "#ff6040" },
    { id: 5, title: "Global Trade Networks", subtitle: "Chapter 5", cover: null, color: "#102838", accent: "#38b0e8" },
    { id: 6, title: "Environmental Challenges", subtitle: "Chapter 6", cover: null, color: "#102810", accent: "#48d448" },
];

const BookCard = ({ book, onClick }) => (
    <div className="book-card" onClick={() => onClick(book)}>

        {/* Camera / perspective wrapper */}
        <div className="book-root">
            <div className="book-3d">

                {/* ── FRONT face ── */}
                <div className="book-face book-front">
                    {book.cover ? (
                        <img src={book.cover} alt={book.title} className="book-cover-img" />
                    ) : (
                        <div
                            className="book-placeholder"
                            style={{ "--bk-color": book.color, "--bk-accent": book.accent }}
                        >
                            <div className="bk-logo-row">
                                <span className="bk-logo-dot">C</span>
                                <span className="bk-logo-label">Contemporary<br />World</span>
                            </div>
                            <div className="bk-globe-area">
                                <div className="bk-globe" />
                            </div>
                            <div className="bk-lines"><span /><span /><span /></div>
                            <div className="bk-footer">
                                <p className="bk-title">{book.title}</p>
                                <p className="bk-sub">{book.subtitle}</p>
                            </div>
                        </div>
                    )}
                    <div className="book-glare" />
                </div>

                {/* ── BACK face (hidden but needed for GPU layer) ── */}
                <div className="book-face book-back" />

                {/* ── SPINE (left edge) ── */}
                <div
                    className="book-spine"
                    style={{
                        background: `linear-gradient(to right, ${book.color}99 0%, ${book.color} 40%, ${book.color}cc 100%)`,
                        filter: "brightness(0.5)",
                    }}
                >
                    <span className="spine-label">{book.title}</span>
                </div>

                {/* ── RIGHT page stack ── */}
                <div className="book-pages" />

                {/* ── TOP page stack ── */}
                <div className="book-top" />

            </div>
        </div>

        {/* Shadow beneath book */}
        <div className="book-shadow" />

        <p className="book-label-title">{book.title}</p>
        <p className="book-label-sub">{book.subtitle}</p>
    </div>
);

const TopicsPage = ({ onSelectLesson }) => {
    const [search, setSearch] = useState("");

    const filtered = BOOKS.filter(
        (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.subtitle.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="topics-page" id="topics">

            <div className="topics-hero">
                <h1 className="topics-hero-title">Topics to Read</h1>
                <p className="topics-hero-sub">One World: Understanding Global Issues and Development</p>
            </div>

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