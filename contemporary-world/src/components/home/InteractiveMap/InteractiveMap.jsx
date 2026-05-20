import { useState, useEffect, useRef } from 'react';
import useRealTimeStat from '../../../hooks/useRealTimeStat';
import './InteractiveMap.css';

import mapData from './mapData.json';

const { themes, themeData } = mapData;

// Formatter to add commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const InteractiveMap = () => {
  const [activeTheme, setActiveTheme] = useState('media');
  const [activeMarker, setActiveMarker] = useState(null);
  const currentData = themeData[activeTheme];

  const mapContainerRef = useRef(null);
  const markerDragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;

    const handleMouseDown = (e) => {
      // Allow only left-click drag panning
      if (e.button !== 0) return;
      isDown = true;
      container.classList.add('grabbing');
      startX = e.pageX - container.offsetLeft;
      startY = e.pageY - container.offsetTop;
      scrollLeft = container.scrollLeft;
      scrollTop = container.scrollTop;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove('grabbing');
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove('grabbing');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;
      const walkX = x - startX;
      const walkY = y - startY;
      container.scrollLeft = scrollLeft - walkX;
      container.scrollTop = scrollTop - walkY;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    // Dynamic centering of map canvas inside scrollable container viewport
    const centerMap = () => {
      const canvasWidth = container.firstElementChild?.clientWidth || 1300;
      const canvasHeight = container.firstElementChild?.clientHeight || 680;
      const scrollX = (canvasWidth - container.clientWidth) / 2;
      const scrollY = (canvasHeight - container.clientHeight) / 2;
      if (scrollX > 0) container.scrollLeft = scrollX;
      if (scrollY > 0) container.scrollTop = scrollY;
    };

    // Delay slightly to ensure browser has resolved viewport layout dims
    const timer = setTimeout(centerMap, 50);
    window.addEventListener('resize', centerMap);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', centerMap);
      clearTimeout(timer);
    };
  }, []);

  const handleMarkerMouseDown = (e) => {
    markerDragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMarkerClick = (e, marker) => {
    const deltaX = Math.abs(e.clientX - markerDragStart.current.x);
    const deltaY = Math.abs(e.clientY - markerDragStart.current.y);
    // Only select marker if mouse stayed in place (click), not dragged (pan)
    if (deltaX < 6 && deltaY < 6) {
      setActiveMarker(marker);
    }
  };

  // Tickers simulating live data
  const popStat = useRealTimeStat(8100234123, 2.4); 
  const netStat = useRealTimeStat(5350123987, 3.1); 
  const migStat = useRealTimeStat(281432102, 0.05); 
  const hunStat = useRealTimeStat(735123000, 0.1); 

  return (
    <section className="map-section" id="interactive-map">
      <div className="map-header">
        <div className="map-info-icon">ⓘ</div>
        <div className="map-title-group">
          <h2>Interactive Map of Globalization and World Systems</h2>
          <p>A visual exploration of global media, migration, cities, health, education, and sustainability.</p>
        </div>
      </div>

      <div className="map-layout">
        
        {/* Left Sidebar */}
        <div className="map-sidebar map-sidebar-left">
          <div className="map-panel theme-panel">
            <h3>Select A Theme</h3>
            <div className="theme-options">
              {themes.map(theme => (
                <label key={theme.id} className="theme-radio">
                  <input 
                    type="radio" 
                    name="theme" 
                    value={theme.id}
                    checked={activeTheme === theme.id}
                    onChange={() => {
                      setActiveTheme(theme.id);
                      setActiveMarker(null);
                    }}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">{theme.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="map-panel legend-panel">
            <h3>Legend</h3>
            <ul className="legend-list">
              {currentData.legend.map((item, i) => (
                <li key={i}>
                  <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Map */}
        <div className="map-center-panel" ref={mapContainerRef}>
          <div 
            className="map-canvas" 
            style={{
              transform: activeMarker ? 'scale(2.2)' : 'scale(1)',
              transformOrigin: activeMarker ? `${activeMarker.x}% ${activeMarker.y}%` : '50% 50%',
              transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform-origin 0.8s ease'
            }}
          >
            <img src="/dotted-map.png" alt="World Map" className="map-base-img" />
            
            {/* Markers overlay */}
            <div className="map-markers-layer">
              {currentData.markers.map(marker => (
                <div 
                  key={marker.id}
                  className={`map-marker cod-style-marker ${activeMarker?.id === marker.id ? 'active-focus' : ''}`}
                  onMouseDown={handleMarkerMouseDown}
                  onClick={(e) => handleMarkerClick(e, marker)}
                  style={{ 
                    left: `${marker.x}%`, 
                    top: `${marker.y}%`,
                    borderColor: marker.color,
                    boxShadow: `0 0 12px ${marker.color}`
                  }}
                  title={marker.title}
                >
                  <div className="marker-dot" style={{ backgroundColor: marker.color }}></div>
                  <div className="marker-hud-overlay"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="map-sidebar map-sidebar-right">
          <div className="map-panel info-panel">
            {activeMarker ? (
              <div className="info-marker-details">
                <div className="streetview-container">
                  <div className="streetview-hud-header">
                    <span className="streetview-tag">● STREET VIEW</span>
                    <span className="streetview-coords">{activeMarker.coords}</span>
                  </div>
                  <img 
                    src={activeMarker.img} 
                    alt={activeMarker.title} 
                    className="info-panel-img streetview-image"
                  />
                  <div className="streetview-compass">▲ N</div>
                  <div className="streetview-watermark">Google</div>
                </div>
                <h3>{activeMarker.title}</h3>
                <p className="info-text">{activeMarker.desc}</p>
                <button className="back-btn" onClick={() => setActiveMarker(null)}>
                  RETURN
                </button>
              </div>
            ) : (
              <div className="info-theme-details">
                <h3>INFO</h3>
                <p className="info-text">{currentData.info}</p>
                <p className="info-hint">Click a photo on the map for more details.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Stats */}
      <div className="map-stats-bar">
        <div className="stat-item">
          <div className="stat-number">{formatNumber(popStat).substring(0, 1)}<span>+</span></div>
          <div className="stat-label">Billion People</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{formatNumber(netStat).substring(0, 1)}<span>+</span></div>
          <div className="stat-label">Billion Internet<br/>Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{formatNumber(migStat).substring(0, 3)}<span>+</span></div>
          <div className="stat-label">Million Migrants</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{formatNumber(hunStat).substring(0, 3)}<span>+</span></div>
          <div className="stat-label">Million Face<br/>Hunger</div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
