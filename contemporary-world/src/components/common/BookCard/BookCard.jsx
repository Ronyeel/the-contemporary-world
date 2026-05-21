import "./BookCard.css";

const BookCard = ({ book, onClick, className = "", role, tabIndex, onKeyDown, title }) => (
    <div
        className={`book-card ${className}`}
        onClick={() => onClick && onClick(book)}
        role={role}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        title={title}
    >
        <div className="book-scene">
            {/* Main 3D body — pseudo-elements add spine + page stack */}
            <div
                className="book-body"
                style={{ "--spine-color": book.color || "#14375a" }}
            >
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
                {/* Glare shimmer on the front face */}
                <div className="book-glare" />
            </div>
        </div>

        <p className="book-label-title">{book.title}</p>
        <p className="book-label-sub">{book.subtitle}</p>
    </div>
);

export default BookCard;
