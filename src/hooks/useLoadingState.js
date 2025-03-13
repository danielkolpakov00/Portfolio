import { useState, useEffect } from 'react';

const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Function to check if document is completely loaded
    const checkDocumentLoaded = () => {
      if (document.readyState === 'complete' && isMounted) {
        // Add slight delay to ensure smooth transition
        setTimeout(() => setIsLoading(false), 800);
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
  }, []);

  return isLoading;
};

export default useLoadingState;
