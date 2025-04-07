import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook to track navigation events, including back/forward button presses
 * @returns {Object} Navigation state including whether a navigation is happening
 */
const useNavigationTracker = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevPath, setPrevPath] = useState(null);
  const navigate = useNavigate();

  // Track location changes to detect navigation events
  useEffect(() => {
    // Always set navigating to true on location change, including initial render
    // This ensures the loading screen shows on every navigation
    setIsNavigating(true);
    
    // Log navigation for debugging
    if (prevPath !== null) {
      console.log(`Navigation detected: ${prevPath} -> ${location.pathname}`);
    }
    
    // Reset the navigation state after a delay
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 1500); // Ensure loading screen shows for at least 1.5 seconds
    
    // Update previous path for future comparisons
    setPrevPath(location.pathname);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Add a listener for popstate events (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      console.log("Back/forward button pressed");
      setIsNavigating(true);
      
      // Clear any cached loading state to ensure visuals reload properly
      localStorage.removeItem('visualsLoaded');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Create a wrapped navigate function that sets navigation state
  const navigateWithLoading = (to, options) => {
    setIsNavigating(true);
    navigate(to, options);
  };

  return {
    isNavigating,
    setIsNavigating,
    navigateWithLoading,
    currentPath: location.pathname,
    prevPath
  };
};

export default useNavigationTracker;