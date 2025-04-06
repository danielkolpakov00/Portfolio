import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ResponsiveImage component for optimized image loading
 * - Supports srcSet for responsive images
 * - Implements lazy loading
 * - Shows loading state
 * - Handles error states
 */
const ResponsiveImage = ({
  src,
  srcSet,
  sizes = "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw",
  alt,
  className = "",
  width,
  height,
  style = {},
  loading = "lazy",
  onLoad,
  onError,
  placeholder = null
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Handle image loading events
  const handleImageLoaded = (event) => {
    setIsLoaded(true);
    if (onLoad) onLoad(event);
  };

  const handleImageError = (event) => {
    setIsError(true);
    if (onError) onError(event);
  };

  // Reset error state if src changes
  useEffect(() => {
    setIsError(false);
    setIsLoaded(false);
  }, [src, srcSet]);

  return (
    <div 
      className={`responsive-image-container ${className}`}
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        ...style
      }}
    >
      {!isLoaded && !isError && (
        <div 
          className="image-placeholder"
          style={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {placeholder || (
            <div className="pulsate-loader" style={{
              width: '30%',
              height: '30%',
              borderRadius: '50%',
              background: 'rgba(40, 74, 247, 0.2)',
              animation: 'pulsate 1.5s ease-out infinite'
            }} />
          )}
        </div>
      )}
      
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        onLoad={handleImageLoaded}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          display: isError ? 'none' : 'block',
        }}
      />
      
      {isError && (
        <div 
          className="error-placeholder"
          style={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            color: '#666',
            padding: '1rem'
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span style={{ marginTop: '0.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            Image failed to load
          </span>
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulsate {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.node
};

export default ResponsiveImage;