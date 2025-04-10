import React, { useState, useEffect, useMemo, useRef } from 'react';

const fullMarqueeText =
  "dkolp · web design · web development · react.js · three.js · tailwind · design · figma · git · seo · branding · adobe suite · dkolp · web design · web development · react.js · three.js · tailwind · design · figma · git · seo · branding · adobe suite · ";

const VerticalMarquee = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const marqueeRef = useRef(null);

  // Optimized initial load delay
  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(handleLoad, { timeout: 2000 });
    } else {
      const timeoutId = setTimeout(handleLoad, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Memoized container style to avoid recalculating on every render
  const containerStyle = useMemo(
    () => ({
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
      visibility: isLoaded ? 'visible' : 'hidden',
    }),
    [isLoaded]
  );

  const textStyle = {
    transform: 'rotate(90deg)',
    transformOrigin: 'top right',
    whiteSpace: 'nowrap',
    fontSize: '3rem',
    color: '#808080',
    overflow: 'visible',
    width: '100vw',
    opacity: 0.5,
  };

  // Memoized marquee style to improve performance
  const marqueeWrapperStyle = useMemo(
    () => ({
      display: 'inline-block',
      animation: isLoaded ? 'marquee 120s linear infinite' : 'none',
      animationDelay: '-10s',
      height: '100%',
      willChange: isLoaded ? 'transform' : 'auto',
    }),
    [isLoaded]
  );

  if (!isLoaded) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {/* Moved keyframes to a CSS block */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div style={textStyle}>
        <div style={marqueeWrapperStyle} ref={marqueeRef}>
          <span>{fullMarqueeText}</span>
          {/* Duplicate span for continuous looping */}
          <span>{fullMarqueeText}</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalMarquee;
