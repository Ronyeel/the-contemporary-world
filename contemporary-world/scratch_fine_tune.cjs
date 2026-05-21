const fs = require('fs');

const svgContent = fs.readFileSync('public/dotted-map.svg', 'utf8');
const dots = [...svgContent.matchAll(/cx='([\d.]+)'\s+cy='([\d.]+)'/g)].map(m => ({
  x: parseFloat(m[1]),
  y: parseFloat(m[2])
}));

const cities = [
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sao Paulo", lat: -23.5558, lon: -46.6396 },
  { name: "Washington DC", lat: 38.8899, lon: -77.0090 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 }
];

let bestA = 5.0, bestB = 975, bestC = -5.0, bestD = 540;
let bestError = Infinity;

for (let a = 4.8; a <= 5.2; a += 0.005) {
  for (let b = 960; b <= 990; b += 0.5) {
    for (let c = -5.2; c <= -4.8; c += 0.005) {
      for (let d = 520; d <= 560; d += 0.5) {
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

console.log(`Best parameters:`);
console.log(`a = ${bestA.toFixed(4)}, b = ${bestB.toFixed(2)}, c = ${bestC.toFixed(4)}, d = ${bestD.toFixed(2)}`);

for (const city of cities) {
  const expectedX = bestA * city.lon + bestB;
  const expectedY = bestC * city.lat + bestD;
  let closestDot = null;
  let minDist = Infinity;
  for (const dot of dots) {
    const dist = Math.hypot(dot.x - expectedX, dot.y - expectedY);
    if (dist < minDist) {
      minDist = dist;
      closestDot = dot;
    }
  }
  console.log(`  ${city.name.padEnd(15)}: Expected (${expectedX.toFixed(1)}, ${expectedY.toFixed(1)}), Closest Dot (${closestDot.x.toFixed(1)}, ${closestDot.y.toFixed(1)}), Dist = ${minDist.toFixed(2)}`);
}
