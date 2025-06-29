/**
 * Create Chrome Extension Icons
 * This script generates the required icon files for the extension
 */

// Create a simple canvas-based icon generator
function createIcon(size, filename) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(1, '#45a049');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Add rounded corners
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();
  
  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
  
  // Add sheet icon (simplified)
  const padding = size * 0.2;
  const sheetWidth = size - (padding * 2);
  const sheetHeight = sheetWidth * 0.8;
  const sheetX = padding;
  const sheetY = (size - sheetHeight) / 2;
  
  // Sheet background
  ctx.fillStyle = 'white';
  ctx.fillRect(sheetX, sheetY, sheetWidth, sheetHeight);
  
  // Sheet lines
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  const lineCount = 3;
  for (let i = 1; i <= lineCount; i++) {
    const y = sheetY + (sheetHeight / (lineCount + 1)) * i;
    ctx.beginPath();
    ctx.moveTo(sheetX + padding * 0.5, y);
    ctx.lineTo(sheetX + sheetWidth - padding * 0.5, y);
    ctx.stroke();
  }
  
  // Convert to blob and return
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });
}

// Generate icons when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    const sizes = [16, 48, 128];
    
    for (const size of sizes) {
      const blob = await createIcon(size, `icon${size}.png`);
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `icon${size}.png`;
      link.textContent = `Download ${size}x${size} icon`;
      link.style.display = 'block';
      document.body.appendChild(link);
    }
  });
}