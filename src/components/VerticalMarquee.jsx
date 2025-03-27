import React, { useState, useEffect, useRef } from 'react';

const fullMarqueeText = "dkolp · web design · web development · react.js · three.js · tailwind · design · figma · git · seo · branding · adobe suite · dkolp · web design · web development · react.js · three.js · tailwind · design · figma · git · seo · branding · adobe suite · ";

const VerticalMarquee = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const marqueeRef = useRef(null);
  
  // Initial load delay
  useEffect(() => {
    const initialRender = () => setIsLoaded(true);
    
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initialRender, { timeout: 2000 });
    } else {
      const timeoutId = setTimeout(initialRender, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const containerStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    // Remove the contain property that might be causing issues
    visibility: isLoaded ? 'visible' : 'hidden',
  };

  const textStyle = {
    transform: 'rotate(90deg)',
    transformOrigin: 'top right',
    whiteSpace: 'nowrap',
    fontSize: '3rem',
    color: '#808080',
    overflow: 'visible',
    width: '100vw',
    opacity: '0.5',
  };

  const marqueeWrapperStyle = {
    display: 'inline-block',
    animation: isLoaded ? 'marquee 120s linear infinite' : 'none',
    animationDelay: '-10s',
    height: '100%',
    // Only use willChange without the other performance optimizations that might be causing issues
    willChange: isLoaded ? 'transform' : 'auto',
  };

  // If not loaded yet, return null
  if (!isLoaded) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div style={textStyle}>
        <div 
          style={marqueeWrapperStyle}
          ref={marqueeRef}
        >
          <span>{fullMarqueeText}</span>
          {/* Add a duplicate span to ensure continuous looping */}
          <span>{fullMarqueeText}</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalMarquee;
