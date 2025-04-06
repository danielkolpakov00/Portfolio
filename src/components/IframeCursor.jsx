import React, { useRef, useEffect } from 'react';
import MouseTracker from './MouseTracker';

/**
 * IframeCursor component 
 * 
 * Creates a container for iframes with custom cursor tracking that passes through
 * interactions to the iframe itself while maintaining cursor visibility
 */
const IframeCursor = ({ 
  src, 
  title, 
  style = {}, 
  className = '', 
  onFullscreen,
  iframeRef,
  ...iframeProps 
}) => {
  const localIframeRef = useRef(null);
  const containerRef = useRef(null);
  
  // Use the provided ref or the local one
  const resolvedRef = iframeRef || localIframeRef;

  // Handle iframe load event
  useEffect(() => {
    const iframe = resolvedRef.current;
    if (!iframe) return;
    
    const handleLoad = () => {
      try {
        // Try to access iframe document - may fail with cross-origin iframes
        const iframeDoc = iframe.contentWindow.document;
        
        // Create and inject styles to hide cursor within iframe
        const style = document.createElement('style');
        style.textContent = `
          * { 
            cursor: none !important; 
          }
          body {
            cursor: none !important;
          }
        `;
        
        iframeDoc.head.appendChild(style);
      } catch (error) {
        console.warn('Could not modify iframe cursor (likely due to cross-origin restrictions)');
      }
    };
    
    iframe.addEventListener('load', handleLoad);
    
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [resolvedRef]);
  
  return (
    <>
      {/* Custom cursor tracker that only activates within iframes */}
      <MouseTracker 
        targetSelector=".iframe-cursor-container"
        innerColor="#ff2d00"
        outerColor="#ff2d00"
        innerSize={8}
        outerSize={35}
        outerAlpha={0}
        innerScale={1.2}
        outerScale={1.7}
      />
      
      <div 
        ref={containerRef}
        className={`iframe-cursor-container relative ${className}`}
        style={{ 
          ...style,
          cursor: 'none' // Hide default cursor
        }}
      >
        {/* The iframe itself */}
        <iframe
          ref={resolvedRef}
          src={src}
          title={title}
          className="w-full h-full border-0"
          allow="fullscreen"
          allowFullScreen
          {...iframeProps}
        />
        
        {/* Fullscreen button */}
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 font-medium z-50"
            aria-label="View fullscreen"
            style={{ cursor: 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
            </svg>
            <span>Fullscreen</span>
          </button>
        )}
      </div>
    </>
  );
};

export default IframeCursor;