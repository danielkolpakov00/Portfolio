import React, { useState, useEffect, useRef } from 'react';
import { isLowPerformanceDevice } from '../utils/performanceUtils';

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
  const [isInView, setIsInView] = useState(priority);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  // Detect low performance devices
  const isLowPerformance = isLowPerformanceDevice();
  
  // Use simplified loading strategy for low performance devices
  useEffect(() => {
    // Skip optimizations for priority images and low performance devices
    if (priority || isLowPerformance) {
      setImageSrc(src);
      return () => {};
    }

    // Function to load the image
    const loadImage = () => {
      setImageSrc(src);
    };

    // Use native lazy loading when available
    if ('loading' in HTMLImageElement.prototype) {
      loadImage();
      return () => {};
    }

    // Use IntersectionObserver for older browsers
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          setIsInView(true);
          loadImage();
          // Disconnect once loaded
          if (observerRef.current && imageRef.current) {
            observerRef.current.unobserve(imageRef.current);
            observerRef.current.disconnect();
          }
        }
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before it enters viewport
        threshold: 0.01,
      }
    );

    // Start observing when component mounts
    if (imageRef.current && observerRef.current) {
      observerRef.current.observe(imageRef.current);
    }

    // Clean up the observer when component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority, isLowPerformance]);

  // Handle image loading complete
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  return (
    <div 
      ref={imageRef}
      className={`optimized-image-container relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200"
          style={{ 
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      
      {/* Actual image */}
      <img
        src={imageSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        onLoad={handleImageLoad}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
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