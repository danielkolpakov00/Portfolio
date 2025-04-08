import { useEffect } from 'react';

/**
 * PreloadAssets component
 * Handles preloading critical assets for the website
 * Doesn't render anything to the DOM
 */
const PreloadAssets = () => {
  useEffect(() => {
    // Critical assets to preload (add any images, fonts, etc. that are needed immediately)
    const criticalAssets = [
      // Key images
      '/assets/images/previewreact1.jpg',
      '/assets/dkolp.svg',
      '/assets/dkolpport.svg',
      
      // Fallback static previews for 3D components
      '/assets/plinko-preview.jpg',
      '/assets/weather-preview.jpg',
    ];

    // Create link elements for preloading
    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.as = asset.endsWith('.svg') ? 'image' : 
               asset.endsWith('.css') ? 'style' :
               asset.endsWith('.woff2') ? 'font' : 'image';
      
      if (asset.endsWith('.woff2')) {
        link.crossOrigin = 'anonymous';
      }
      
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net',
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      if (domain.includes('gstatic')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });

    // Preload critical JavaScript files
    const preloadScripts = () => {
      const scriptUrls = [
        // No scripts here - we'll load them via dynamic imports instead
      ];
      
      scriptUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = url;
        document.head.appendChild(link);
      });
    };
    
    // Schedule script preloading for after initial paint
    setTimeout(preloadScripts, 1000);

  }, []);

  // This component doesn't render anything
  return null;
};

export default PreloadAssets;