import React, { useEffect, useRef } from 'react';

/**
 * CssDither - A component that creates a CSS-based dithering effect
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.pixelSize - Size of each pixel (default: 4)
 * @param {number} props.colorLevels - Number of color levels (default: 4)
 * @param {string[]} props.dotColors - Colors for the dither pattern (default: blue shades)
 * @param {boolean} props.animate - Whether to animate the effect (default: true)
 * @param {number} props.animationSpeed - Animation speed in seconds (default: 10)
 * @param {boolean} props.enableScanlines - Add scanline effect (default: true)
 */
const CssDither = ({ 
  className, 
  pixelSize = 4,
  colorLevels = 4, 
  dotColors = ['#1B69FA', '#1B44FA'],
  animate = true,
  animationSpeed = 10,
  enableScanlines = true
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the parent container dimensions
    const container = canvas.parentElement;
    const { width, height } = container.getBoundingClientRect();
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Get the 2D context
    const ctx = canvas.getContext('2d');
    
    // Create an animation loop
    let animationFrame;
    let lastTime = 0;
    let shiftPhase = 0;

    const render = (time) => {
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate delta time for animation
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Animate the shift phase if animation is enabled
      if (animate) {
        shiftPhase = (shiftPhase + deltaTime * 0.0001) % 1;
      }
      
      // Draw dither pattern
      const dotSize = pixelSize / 2;
      for (let x = 0; x < width; x += pixelSize) {
        for (let y = 0; y < height; y += pixelSize) {
          // Calculate pattern index based on position
          const patternX = Math.floor(x / pixelSize) % 2;
          const patternY = Math.floor(y / pixelSize) % 2;
          const patternIndex = (patternX + patternY) % 2;
          
          // Add animation shift
          const shiftX = animate ? Math.sin(shiftPhase * Math.PI * 2) * dotSize / 2 : 0;
          const shiftY = animate ? Math.cos(shiftPhase * Math.PI * 2) * dotSize / 2 : 0;
          
          // Calculate color and opacity based on position for variety
          const colorIndex = Math.floor((x + y) / pixelSize) % dotColors.length;
          const color = dotColors[colorIndex];
          
          // Draw a dot with the calculated parameters
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.4 + (patternIndex * 0.2);
          ctx.arc(
            x + dotSize + shiftX, 
            y + dotSize + shiftY, 
            dotSize / 2, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      // Request the next frame
      animationFrame = requestAnimationFrame(render);
    };
    
    // Start the animation
    animationFrame = requestAnimationFrame(render);
    
    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [pixelSize, colorLevels, dotColors, animate, animationSpeed]);
  
  return (
    <div className={`${className} relative overflow-hidden`}>
      {/* Canvas for the dither pattern */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Checker pattern layer */}
      <div className="absolute inset-0 z-20" style={{
        backgroundImage: `
          linear-gradient(45deg, rgba(0,0,150,0.15) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(0,0,150,0.15) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(0,0,150,0.15) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(0,0,150,0.15) 75%)
        `,
        backgroundSize: `${pixelSize}px ${pixelSize}px`,
        backgroundPosition: `0 0, 0 ${pixelSize/2}px, ${pixelSize/2}px ${-pixelSize/2}px, ${-pixelSize/2}px 0`,
        opacity: 0.3,
        mixBlendMode: 'multiply'
      }}></div>
      
      {/* Scanlines (optional) */}
      {enableScanlines && (
        <div className="absolute inset-0 z-30" style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
          backgroundSize: `100% ${pixelSize}px`,
          opacity: 0.15
        }}></div>
      )}
      
      {/* Blue color tint overlay */}
      <div className="absolute inset-0 bg-blue-500 opacity-10 z-40"></div>
    </div>
  );
};

export default CssDither;