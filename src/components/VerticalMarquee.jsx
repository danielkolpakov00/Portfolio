import React, { useState, useEffect } from 'react';

const marqueeText = "dkolp · web design · web development · react.js · three.js · tailwind · design · figma · git · seo · branding · adobe suite · dkolp · web design · web development · react.js · three.js · tailwind · design · figma · git · seo · branding · adobe suite · ";

const VerticalMarquee = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Delay marquee rendering until after main content load
  useEffect(() => {
    // Use requestIdleCallback for non-critical UI elements if available
    const renderMarquee = () => setIsLoaded(true);
    
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(renderMarquee, { timeout: 2000 });
    } else {
      // Fallback to setTimeout for browsers that don't support requestIdleCallback
      const timeoutId = setTimeout(renderMarquee, 1000);
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
    // Add CSS containment to limit repaint area
    contain: 'content',
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
    // Add will-change to optimize animation rendering
    willChange: 'transform',
  };

  const marqueeWrapperStyle = {
    display: 'inline-block',
    // Only apply animation when component is loaded
    animation: isLoaded ? 'marquee 120s linear infinite' : 'none',
    animationDelay: '-10s',
    height: '100%',
  };

  // If not loaded yet, return null or a minimal placeholder
  if (!isLoaded) {
    return null; // Don't render anything until main content is loaded
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
        <div style={marqueeWrapperStyle}>
          <span>{marqueeText}</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalMarquee;
