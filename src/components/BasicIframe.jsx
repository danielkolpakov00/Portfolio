import React, { useEffect, useRef, useState } from 'react';

/**
 * BasicIframe - A simplified iframe implementation without any cursor overlays or proxies
 */
const BasicIframe = ({ 
  src, 
  title,
  className = '',
  style = {},
  onFullscreen,
  ...props 
}) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const handleLoad = () => {
      console.log('Iframe loaded:', src);
      setIsLoading(false);
    };
    
    iframe.addEventListener('load', handleLoad);
    
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [src]);

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    
    if (iframeRef.current.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    } else if (iframeRef.current.webkitRequestFullscreen) {
      iframeRef.current.webkitRequestFullscreen();
    } else if (iframeRef.current.msRequestFullscreen) {
      iframeRef.current.msRequestFullscreen();
    }
  };

  return (
    <div className={`basic-iframe-container relative ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="loader">Loading...</div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={src}
        title={title || "Content"}
        className="w-full h-full border-2 border-blue-500" // Added visible border for testing
        loading="lazy"
        // Important: These attributes enable content display
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        {...props}
      />
      
      {onFullscreen && (
        <button
          onClick={onFullscreen || handleFullscreen}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 font-medium z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
          </svg>
          <span>Fullscreen</span>
        </button>
      )}
    </div>
  );
};

export default BasicIframe;