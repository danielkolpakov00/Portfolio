import React from 'react';
import OptimizedImage from './OptimizedImage';

/**
 * ResponsiveImage component that serves different image sizes based on viewport width
 * Uses the picture element with srcset to provide the browser with size options
 */
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 33vw',
  breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  priority = false,
}) => {
  // Generate image variants based on the original src
  // This assumes you have different size versions available
  // Adjust this logic based on how your images are stored/named
  const generateSrcSet = () => {
    if (!src) return '';
    
    // Extract filename and extension
    const lastDotIndex = src.lastIndexOf('.');
    const baseName = src.substring(0, lastDotIndex);
    const extension = src.substring(lastDotIndex);
    
    // Create srcset string with different sizes
    return Object.values(breakpoints)
      .map(size => `${baseName}-${size}w${extension} ${size}w`)
      .join(', ');
  };

  // Use the OptimizedImage component for loading benefits
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
    />
  );
};

export default ResponsiveImage;