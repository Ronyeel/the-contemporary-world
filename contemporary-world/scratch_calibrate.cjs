const fs = require('fs');

const svgContent = fs.readFileSync('public/dotted-map.svg', 'utf8');
const dots = [...svgContent.matchAll(/cx='([\d.]+)'\s+cy='([\d.]+)'/g)].map(m => ({
  x: parseFloat(m[1]),
  y: parseFloat(m[2])
}));

console.log(`Loaded ${dots.length} dots from SVG.`);

// Reference cities with real lat/lon
const cities = [
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sao Paulo", lat: -23.5558, lon: -46.6396 },
  { name: "Washington DC", lat: 38.8899, lon: -77.0090 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 }
];

// Let's test the standard Plate Carree (Equirectangular) mapping:
// We want to find a linear mapping:
// x = a * lon + b
// y = c * lat + d
// If the map spans exactly -180 to 180 longitude across the 2000 width,
// then:
// a = 2000 / 360 = 5.5555...
// b = 1000 (if centered at 0 longitude)
// If it spans exactly -90 to 90 latitude across the 1000 height,
// then:
// c = -1000 / 180 = -5.5555...
// d = 500 (if centered at 0 latitude)

const testMapping = (a, b, c, d) => {
  console.log(`\nTesting mapping: x = ${a.toFixed(3)}*lon + ${b.toFixed(3)}, y = ${c.toFixed(3)}*lat + ${d.toFixed(3)}`);
  let totalDistSq = 0;
  for (const city of cities) {
    const expectedX = a * city.lon + b;
    const expectedY = c * city.lat + d;
    
    // Find closest dot
    let closestDot = null;
    let minDist = Infinity;
    for (const dot of dots) {
      const dist = Math.hypot(dot.x - expectedX, dot.y - expectedY);
      if (dist < minDist) {
        minDist = dist;
        closestDot = dot;
      }
    }
    totalDistSq += minDist * minDist;
    console.log(`  ${city.name.padEnd(15)}: Expected (${expectedX.toFixed(1)}, ${expectedY.toFixed(1)}), Closest Dot (${closestDot.x.toFixed(1)}, ${closestDot.y.toFixed(1)}), Error Dist = ${minDist.toFixed(1)} pixels`);
  }
};

// Let's test standard mapping:
testMapping(2000 / 360, 1000, -1000 / 180, 500);

// Let's see if there is an offset/scale. Let's do a quick grid search to minimize error.
let bestA = 2000 / 360, bestB = 1000, bestC = -1000 / 180, bestD = 500;
let bestError = Infinity;

for (let a = 5.0; a <= 6.0; a += 0.05) {
  for (let b = 950; b <= 1050; b += 5) {
    for (let c = -6.0; c <= -5.0; c += 0.05) {
      for (let d = 450; d <= 550; d += 5) {
        let error = 0;
        for (const city of cities) {
          const expectedX = a * city.lon + b;
          const expectedY = c * city.lat + d;
          let minDist = Infinity;
          for (const dot of dots) {
            const dist = Math.hypot(dot.x - expectedX, dot.y - expectedY);
            if (dist < minDist) minDist = dist;
          }
          error += minDist * minDist;
        }
        if (error < bestError) {
          bestError = error;
          bestA = a;
          bestB = b;
          bestC = c;
          bestD = d;
        }
      }
    }
  }
}

console.log(`\nBest Grid Search Parameters:`);
testMapping(bestA, bestB, bestC, bestD);
