import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage component for better image performance
 * Implements:
 * - Lazy loading with IntersectionObserver
 * - Progressive image loading (blur-up technique)
 * - Responsive sizes
 * - Native browser lazy loading
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDIiPjwvc3ZnPg==',
  sizes = '100vw',
  objectFit = 'cover',
  onLoad = () => {},
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isInView, setIsInView] = useState(false);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority) {
      setImageSrc(src);
      return;
    }

    // Skip the observer if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype && !priority) {
      setImageSrc(src);
      return;
    }

    // Use IntersectionObserver for older browsers
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading 200px before it enters viewport
      threshold: 0.01,
    });

    const element = document.getElementById(`image-${src.replace(/\W/g, '')}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [src, priority]);

  // Handle image loading complete
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const imageId = `image-${src.replace(/\W/g, '')}`;

  return (
    <div 
      className={`optimized-image-container relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Low quality placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ 
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      
      {/* Actual image */}
      <img
        id={imageId}
        src={imageSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        onLoad={handleImageLoad}
        className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          objectFit,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default OptimizedImage;