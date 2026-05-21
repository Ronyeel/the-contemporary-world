import { useState } from "react";
import { useReferences } from "../hooks/useReferences";
import "./referencesPage.css";

const ReferencesPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const { references, loading, error } = useReferences(activeFilter);

  const filters = ["All", "Books", "Journals", "Websites"];

  const handleFilterClick = (e, filter) => {
    e.preventDefault();
    setActiveFilter(filter);
  };

  return (
    <div className="references-container">
      {/* Visual Banner Header */}
      <header className="references-banner">
        <div className="references-banner-content">
          <h1 className="references-banner-title">Related Articles</h1>
        </div>
      </header>

      {/* Filter Navigation Bar */}
      <nav className="references-filter-bar" aria-label="Reference categories">
        <ul className="filter-links">
          {filters.map((filter) => (
            <li key={filter}>
              <a
                href={`#filter-${filter.toLowerCase()}`}
                className={`filter-item ${activeFilter === filter ? "active" : ""}`}
                onClick={(e) => handleFilterClick(e, filter)}
              >
                {filter}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Grid Content */}
      <main className="references-grid-container">
        {loading && (
          <div className="references-status-container" aria-live="polite">
            <div className="loading-spinner"></div>
            <p>Fetching related studies from API...</p>
          </div>
        )}

        {error && (
          <div className="references-status-container" role="alert">
            <p className="error-message">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="references-grid">
            {references.map((study) => (
              <a
                key={study.id}
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reference-card"
                title={`Read: ${study.title}`}
              >
                <div className="reference-card-image-wrapper">
                  <img
                    src={`https://api.microlink.io/?url=${encodeURIComponent(study.url)}&screenshot=true&embed=screenshot.url`}
                    alt={`Website preview for ${study.title}`}
                    className="reference-card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      e.target.parentElement.classList.add("fallback-gradient");
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="reference-card-body">
                  <span className="reference-card-category">{study.label}</span>
                  <h2 className="reference-card-title">{study.title}</h2>
                  <span className="reference-card-author">By {study.author}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReferencesPage;
