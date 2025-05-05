const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Parameters
const size = 700;
const maxRange = 250;
const peakDistance = 175;
const cellSize = 1;

// Create canvas
const canvas = createCanvas(size * cellSize, size * cellSize);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#141414';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw the distance-based pattern
const center = Math.floor(size / 2);
for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    const distance = Math.sqrt(Math.pow(i - center, 2) + Math.pow(j - center, 2));
    const intensity = Math.max(0, Math.min(1, 1 - 0.01 * Math.abs(peakDistance - distance)));
    
    if (intensity > 0) {
      ctx.fillStyle = `rgba(148, 57, 57, ${intensity})`;
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

// Ensure the images directory exists
const imagesDir = path.join(__dirname, '..', 'src', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(imagesDir, 'distance-pattern.png'), buffer); 