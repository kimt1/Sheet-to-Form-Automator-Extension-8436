// Node.js script to generate PNG icons
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#45a049');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Add rounded corners
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    const radius = size * 0.15;
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Add sheet/form icon
    const padding = size * 0.2;
    const sheetWidth = size - (padding * 2);
    const sheetHeight = sheetWidth * 0.8;
    const sheetX = padding;
    const sheetY = (size - sheetHeight) / 2;

    // Sheet background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(sheetX, sheetY, sheetWidth, sheetHeight);

    // Sheet border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = Math.max(1, size * 0.03);
    ctx.strokeRect(sheetX, sheetY, sheetWidth, sheetHeight);

    // Add grid lines
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.7)';
    ctx.lineWidth = Math.max(1, size * 0.015);

    // Horizontal lines
    const lineCount = Math.max(3, Math.floor(size / 20));
    for (let i = 1; i < lineCount; i++) {
        const y = sheetY + (sheetHeight / lineCount) * i;
        ctx.beginPath();
        ctx.moveTo(sheetX + padding * 0.3, y);
        ctx.lineTo(sheetX + sheetWidth - padding * 0.3, y);
        ctx.stroke();
    }

    // Vertical lines
    const colCount = 3;
    for (let i = 1; i < colCount; i++) {
        const x = sheetX + (sheetWidth / colCount) * i;
        ctx.beginPath();
        ctx.moveTo(x, sheetY + padding * 0.3);
        ctx.lineTo(x, sheetY + sheetHeight - padding * 0.3);
        ctx.stroke();
    }

    return canvas;
}

// Generate icons
const sizes = [16, 48, 128];

sizes.forEach(size => {
    const canvas = createIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const iconsDir = path.join(__dirname, 'icons');
    
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }
    
    const filePath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Generated ${filePath}`);
});

console.log('🎉 All icons generated successfully!');