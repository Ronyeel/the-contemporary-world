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

  // ── Theme-specific real-time stats (based on reliable official sources) ──
  
  // 1. Media & Technology
  const mediaNet = useRealTimeStat(5430000000, 2.8);   // baseline 5.43 Billion internet users
  const mediaSoc = useRealTimeStat(5040000000, 3.4);   // baseline 5.04 Billion active social profiles
  const mediaMob = useRealTimeStat(8920000000, 4.1);   // baseline 8.92 Billion mobile subscriptions
  const mediaDat = useRealTimeStat(328000000, 3.8);     // baseline 328 Million Terabytes daily

  // 2. Global Cities
  const citiesUrb = useRealTimeStat(5620, 0.0005);      // baseline 56.20% (multiplied by 100 to support decimals)
  const citiesMeg = useRealTimeStat(582000000, 0.6);    // baseline 582 Million people in megacities
  const citiesGdp = useRealTimeStat(8000, 0.0001);      // baseline 80.00% (multiplied by 100 to support decimals)
  const citiesIot = useRealTimeStat(16700000000, 28.5); // baseline 16.7 Billion active IoT city devices

  // 3. Migration
  const migMig = useRealTimeStat(281400000, 0.08);      // baseline 281.4 Million international migrants
  const migDis = useRealTimeStat(110400000, 0.05);      // baseline 110.4 Million displaced persons
  const migRem = useRealTimeStat(860000000000, 180.0);  // baseline $860 Billion remittance outflow
  const migBrd = useRealTimeStat(4120000, 1.2);         // baseline 4.12 Million daily border crossings

  // 4. Food Security & Agriculture
  const foodHun = useRealTimeStat(735000000, 0.1);      // baseline 735 Million people facing hunger
  const foodLnd = useRealTimeStat(4850000000, 0.2);     // baseline 4.85 Billion hectares farmed
  const foodWst = useRealTimeStat(1300000000, 12.5);    // baseline 1.3 Billion tons food wasted annually (YTD)
  const foodFer = useRealTimeStat(190000000, 1.8);      // baseline 190 Million tons fertilizer used (YTD)

  // Mapping configurations
  const statsConfig = {
    media: [
      { value: mediaNet, formatType: 'billion', prefix: '', suffix: 'B+', label: 'Internet Users' },
      { value: mediaSoc, formatType: 'billion', prefix: '', suffix: 'B+', label: 'Active Social Accounts' },
      { value: mediaMob, formatType: 'billion', prefix: '', suffix: 'B+', label: 'Mobile Connections' },
      { value: mediaDat, formatType: 'million', prefix: '', suffix: 'M+', label: 'Daily Data Generated (TB)' }
    ],
    cities: [
      { value: citiesUrb, formatType: 'percent', prefix: '', suffix: '%', label: 'Global Urbanization Rate' },
      { value: citiesMeg, formatType: 'million', prefix: '', suffix: 'M+', label: 'Megacity Residents' },
      { value: citiesGdp, formatType: 'percent', prefix: '', suffix: '%', label: 'Global GDP from Cities' },
      { value: citiesIot, formatType: 'billion', prefix: '', suffix: 'B+', label: 'Active IoT City Sensors' }
    ],
    migration: [
      { value: migMig, formatType: 'million', prefix: '', suffix: 'M+', label: 'International Migrants' },
      { value: migDis, formatType: 'million', prefix: '', suffix: 'M+', label: 'Forcibly Displaced Persons' },
      { value: migRem, formatType: 'billion', prefix: '$', suffix: 'B+', label: 'Global Remittances (YTD)' },
      { value: migBrd, formatType: 'million', prefix: '', suffix: 'M+', label: 'Daily Border Crossings' }
    ],
    food: [
      { value: foodHun, formatType: 'million', prefix: '', suffix: 'M+', label: 'People Facing Hunger' },
      { value: foodLnd, formatType: 'billion', prefix: '', suffix: 'B+', label: 'Hectares of Farmed Land' },
      { value: foodWst, formatType: 'million', prefix: '', suffix: 'M+', label: 'Tons of Food Wasted (YTD)' },
      { value: foodFer, formatType: 'million', prefix: '', suffix: 'M+', label: 'Tons of Fertilizer Applied' }
    ]
  };

  const activeStats = statsConfig[activeTheme] || [];

  const formatStatValue = (val, type) => {
    if (type === 'billion') {
      return (val / 1000000000).toFixed(2);
    }
    if (type === 'million') {
      return (val / 1000000).toFixed(1);
    }
    if (type === 'percent') {
      return (val / 100).toFixed(2);
    }
    return val.toLocaleString();
  }; 

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
        {activeStats.map((stat, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-number">
              {stat.prefix && <span className="stat-prefix">{stat.prefix}</span>}
              {stat.suffix && <span className="stat-suffix-spacer">{stat.suffix}</span>}
              
              <span className="stat-value">
                {formatStatValue(stat.value, stat.formatType)}
              </span>
              
              {stat.prefix && <span className="stat-prefix-spacer">{stat.prefix}</span>}
              {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InteractiveMap;
