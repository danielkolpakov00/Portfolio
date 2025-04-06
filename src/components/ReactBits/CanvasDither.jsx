import React, { useRef, useEffect } from 'react';

/**
 * CanvasDither - A component that creates a dithered effect using plain HTML Canvas
 * without Three.js dependencies
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.pixelSize - Size of the pixels (default: 4)
 * @param {number} props.colorLevels - Number of color levels (default: 4)
 * @param {string} props.baseColor - Base color for the dither effect (default: '#1B44FA')
 * @param {boolean} props.animate - Whether to animate the effect (default: true)
 */
const CanvasDither = ({
  className = '',
  pixelSize = 4,
  colorLevels = 4,
  baseColor = '#1B44FA',
  animate = true
}) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Parse color to rgb
  const parseColor = (color) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    const rgbValues = window.getComputedStyle(tempDiv).color.match(/\d+/g).map(Number);
    document.body.removeChild(tempDiv);
    return rgbValues;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    // Get the base RGB color
    const [r, g, b] = parseColor(baseColor);
    
    // Bayer 8x8 matrix for ordered dithering
    const bayerMatrix8x8 = [
      [0, 48, 12, 60, 3, 51, 15, 63],
      [32, 16, 44, 28, 35, 19, 47, 31],
      [8, 56, 4, 52, 11, 59, 7, 55],
      [40, 24, 36, 20, 43, 27, 39, 23],
      [2, 50, 14, 62, 1, 49, 13, 61],
      [34, 18, 46, 30, 33, 17, 45, 29],
      [10, 58, 6, 54, 9, 57, 5, 53],
      [42, 26, 38, 22, 41, 25, 37, 21]
    ].map(row => row.map(val => val / 64.0));
    
    // Resize the canvas to match its container
    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    
    // Initial resize
    resize();
    
    // Add resize listener
    window.addEventListener('resize', resize);
    
    // Create perlin noise
    const noise = (function() {
      const permutation = [];
      for (let i = 0; i < 256; i++) permutation.push(i);
      
      // Fisher-Yates shuffle
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
      }
      
      // Extend the permutation to avoid overflow checks
      const p = new Array(512);
      for (let i = 0; i < 512; i++) {
        p[i] = permutation[i & 255];
      }
      
      function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
      function lerp(t, a, b) { return a + t * (b - a); }
      function grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
      }
      
      return function(x, y, z) {
        // Find unit grid cell containing point
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        
        // Get relative xyz coordinates of point within cell
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        
        // Compute fade curves for each of x, y, z
        const u = fade(x);
        const v = fade(y);
        const w = fade(z);
        
        // Hash coordinates of the 8 cube corners
        const A = p[X] + Y;
        const AA = p[A] + Z;
        const AB = p[A + 1] + Z;
        const B = p[X + 1] + Y;
        const BA = p[B] + Z;
        const BB = p[B + 1] + Z;
        
        // Add blended results from 8 corners of cube
        return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), 
                                        grad(p[BA], x-1, y, z)), 
                                 lerp(u, grad(p[AB], x, y-1, z), 
                                        grad(p[BB], x-1, y-1, z))),
                         lerp(v, lerp(u, grad(p[AA+1], x, y, z-1), 
                                        grad(p[BA+1], x-1, y, z-1)), 
                                 lerp(u, grad(p[AB+1], x, y-1, z-1),
                                        grad(p[BB+1], x-1, y-1, z-1))));
      };
    })();
    
    // Fractal Brownian Motion
    function fbm(x, y, z, octaves = 6, lacunarity = 2.0, gain = 0.5) {
      let amplitude = 1.0;
      let frequency = 1.0;
      let sum = 0.0;
      
      for (let i = 0; i < octaves; i++) {
        sum += amplitude * noise(x * frequency, y * frequency, z);
        amplitude *= gain;
        frequency *= lacunarity;
      }
      
      return sum;
    }
    
    // Render function
    const render = () => {
      if (!canvas) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create pixelated dithering effect
      for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = 0; y < canvas.height; y += pixelSize) {
          // Generate a dynamic pattern using perlin noise
          const nx = x / canvas.width;
          const ny = y / canvas.height;
          let noiseValue = 0;
          
          if (animate) {
            noiseValue = fbm(nx * 5, ny * 5, time * 0.1);
          } else {
            noiseValue = fbm(nx * 5, ny * 5, 0.5);
          }
          
          // Apply dithering using Bayer matrix
          const bayerX = Math.floor(x / pixelSize) % 8;
          const bayerY = Math.floor(y / pixelSize) % 8;
          const bayerValue = bayerMatrix8x8[bayerY][bayerX];
          
          // Calculate the color value with dithering
          let colorValue = noiseValue + bayerValue * (1.0 / colorLevels);
          colorValue = Math.floor(colorValue * colorLevels) / colorLevels;
          colorValue = Math.max(0, Math.min(1, colorValue));
          
          // Apply the color with alpha
          const pixelR = Math.floor(r * colorValue);
          const pixelG = Math.floor(g * colorValue);
          const pixelB = Math.floor(b * colorValue);
          const alpha = 0.6;
          
          ctx.fillStyle = `rgba(${pixelR}, ${pixelG}, ${pixelB}, ${alpha})`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
      
      // Update the animation time
      time += 0.02;
      
      // Continue animation
      if (animate) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };
    
    // Start the rendering
    render();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pixelSize, colorLevels, baseColor, animate]);
  
  return (
    <div className={`${className} relative overflow-hidden`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: `100% ${pixelSize}px`,
          opacity: 0.15,
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
};

export default CanvasDither;