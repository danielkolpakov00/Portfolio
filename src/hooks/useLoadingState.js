import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to manage loading states across the application
 * Now enhanced to reset on every navigation including back/forward navigation
 * @returns {boolean} Whether the application is in a loading state
 */
export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const location = useLocation();
  const prevPathRef = useRef(null);

  // Reset loading state when location changes
  useEffect(() => {
    // Skip the first render
    if (prevPathRef.current !== null && prevPathRef.current !== location.pathname) {
      // When route changes, reset loading state
      setIsLoading(true);
      console.log('Route changed, resetting loading state');
    }

    // Update previous path reference
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  // Basic document loading state
  useEffect(() => {
    let isMounted = true;

    // Function to check if document is completely loaded
    const checkDocumentLoaded = () => {
      if (document.readyState === 'complete' && isMounted) {
        // Mark initial load as complete
        setInitialLoadComplete(true);
        
        // Fallback: If no visuals event after 2 seconds, hide loading screen
        setTimeout(() => {
          if (isMounted && isLoading) {
            console.log('Fallback: Loading timeout reached. Hiding loading screen.');
            setIsLoading(false);
          }
        }, 1500); // Reduced timeout to ensure loading screen shows for adequate time
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
        setTimeout(() => setIsLoading(false), 500); // Delay to allow for animations
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
      // Only skip if we're not viewing a project (projects should always load completely)
      if (localStorage.getItem('visualsLoaded') === 'true') {
        console.log('LocalStorage indicates visuals were previously loaded.');
        // Still keep a minimum loading time for a consistent experience
        setTimeout(() => setIsLoading(false), 800);
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
  return document.readyState === 'complete' && localStorage.getItem('visualsLoaded') === 'true';
};

// Function to track when dither component has rendered
export const setDitherRendered = () => {
  // Trigger the visualsLoaded event to indicate dither has rendered
  console.log('Dither component rendered successfully');
  window.dispatchEvent(new Event('visualsLoaded'));
  localStorage.setItem('visualsLoaded', 'true');
};

// Also maintain default export for backward compatibility
export default useLoadingState;
