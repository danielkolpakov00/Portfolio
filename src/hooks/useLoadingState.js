import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Optimized loading state hook
const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const location = useLocation();

  // Handle initial app load
  useEffect(() => {
    let isMounted = true;

    // Function to check if document is completely loaded
    const checkDocumentLoaded = () => {
      if (document.readyState === 'complete' && isMounted) {
        // Mark initial load as complete
        setInitialLoadComplete(true);
        
        // Fallback: If no visuals event after 1.5 seconds, hide loading screen
        setTimeout(() => {
          if (isMounted && isLoading) {
            console.log('Fallback: Loading timeout reached. Hiding loading screen.');
            setIsLoading(false);
          }
        }, 1500); // Reduced timeout for better UX
      }
    };

    // Check initial state
    checkDocumentLoaded();

    // Event listener for when everything is loaded
    window.addEventListener('load', checkDocumentLoaded);

    // Cleanup
    return () => {
      isMounted = false;
      window.removeEventListener('load', checkDocumentLoaded);
    };
  }, [isLoading, location.pathname]); // Added location dependency to reset on route change

  // Listen for the visualsLoaded event
  useEffect(() => {
    const handleVisualsLoaded = () => {
      console.log('Visual loaded event detected.');
      if (initialLoadComplete) {
        // Add slight delay to ensure smooth transition
        setTimeout(() => setIsLoading(false), 200); // Reduced delay for faster transitions
      }
    };

    // Handle navigation events by resetting loading state
    const handleNavigation = () => {
      console.log('Navigation event detected, resetting loading state');
      setIsLoading(true);
    };

    // Create event listeners
    window.addEventListener('visualsLoaded', handleVisualsLoaded);
    window.addEventListener('navigation', handleNavigation);
    window.addEventListener('popstate', handleNavigation);

    // Only check localStorage if we're not using path-based detection
    if (initialLoadComplete && !location.pathname.includes('/projects/')) {
      // Use Previously loaded state to avoid repeated loading screens
      if (sessionStorage.getItem('visualsLoaded') === 'true') {
        console.log('Session storage indicates visuals were previously loaded.');
        // Still keep a minimum loading time for a consistent experience
        setTimeout(() => setIsLoading(false), 500);
      }
    }

    return () => {
      window.removeEventListener('visualsLoaded', handleVisualsLoaded);
      window.removeEventListener('navigation', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [initialLoadComplete, location.pathname]);

  return isLoading;
};

// Utility function to determine if loading should be hidden
export const shouldHideLoading = () => {
  return document.readyState === 'complete' && sessionStorage.getItem('visualsLoaded') === 'true';
};

// Function to track when dither component has rendered
export const setDitherRendered = () => {
  // Trigger the visualsLoaded event to indicate dither has rendered
  console.log('Dither component rendered successfully');
  window.dispatchEvent(new Event('visualsLoaded'));
  sessionStorage.setItem('visualsLoaded', 'true'); // Use sessionStorage instead of localStorage
};

// Export both as named export and default export
export { useLoadingState };
export default useLoadingState;
