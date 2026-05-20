import React, { useRef, useState, useEffect } from 'react';
import './VisualJourney.css';

const VisualJourney = () => {
  const images = [
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
  ];

  // We duplicate three times to ensure smooth infinite dragging in both directions
  const carouselImages = [...images, ...images, ...images];

  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll loop
  useEffect(() => {
    let animationFrameId;
    
    const play = () => {
      if (!isDragging && carouselRef.current) {
        carouselRef.current.scrollLeft += 1;
        
        const singleSetWidth = carouselRef.current.scrollWidth / 3;
        
        // Reset when we've scrolled past the middle set to loop seamlessly
        if (carouselRef.current.scrollLeft >= singleSetWidth * 2) {
          carouselRef.current.scrollLeft = singleSetWidth;
        }
      }
      animationFrameId = requestAnimationFrame(play);
    };

    // Initialize scroll position to the middle set so we can drag left immediately
    if (carouselRef.current && carouselRef.current.scrollLeft === 0) {
       carouselRef.current.scrollLeft = carouselRef.current.scrollWidth / 3;
    }

    animationFrameId = requestAnimationFrame(play);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    const pageX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    setStartX(pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent text selection or native scrolling
    const pageX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const x = pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    
    let newScrollLeft = scrollLeft - walk;
    const singleSetWidth = carouselRef.current.scrollWidth / 3;

    // Infinite wrap around during manual drag
    if (newScrollLeft >= singleSetWidth * 2) {
      newScrollLeft -= singleSetWidth;
      setStartX(pageX - carouselRef.current.offsetLeft);
      setScrollLeft(newScrollLeft);
    } else if (newScrollLeft <= 0) {
      newScrollLeft += singleSetWidth;
      setStartX(pageX - carouselRef.current.offsetLeft);
      setScrollLeft(newScrollLeft);
    }

    carouselRef.current.scrollLeft = newScrollLeft;
  };

  return (
    <section className="visual-journey-section" id="visual-journey">
      <div className="vj-header">
        <h2 className="vj-title">One World, Many Connections</h2>
        <p className="vj-subtitle">
          A visual journey through globalization, global challenges, and human interdependence.
        </p>
      </div>

      <div 
        className="vj-carousel-container"
        ref={carouselRef}
        onMouseDown={handleDragStart}
        onMouseLeave={handleDragEnd}
        onMouseUp={handleDragEnd}
        onMouseMove={handleDragMove}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        onTouchMove={handleDragMove}
      >
        <div className="vj-carousel-track">
          {carouselImages.map((src, index) => (
            <div className="vj-carousel-item" key={index}>
              {src ? (
                <img src={src} alt={`Global connection ${index + 1}`} loading="lazy" />
              ) : (
                <div className="vj-placeholder-img">
                  <span>Your Photo Here</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="vj-quote-container">
        <div className="vj-quote-icon">❞</div>
        <p className="vj-quote-text">
          Globalization is not just about countries connecting — <br />
          it is about lives, cultures, and futures becoming intertwined.
        </p>
      </div>
    </section>
  );
};

export default VisualJourney;
