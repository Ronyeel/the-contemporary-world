const fs = require('fs');
const path = 'd:/Project/contemporary-world/src/components/home/InteractiveMap/InteractiveMap.jsx';
let content = fs.readFileSync(path, 'utf8');

// Remove WORLD_MAP_ASCII
content = content.replace(/const WORLD_MAP_ASCII = \[\s*[\s\S]*?\s*\].join\('\\n'\);\s*/, '');

// Replace pre tag with img
content = content.replace(/<pre className="map-ascii-art"[^>]*>\{WORLD_MAP_ASCII\}<\/pre>/, '<img src="/dotted-map.png" alt="World Map" className="map-base-img" />');

fs.writeFileSync(path, content);
console.log('Replaced JSX');
