import React, { useState, useEffect } from 'react';
import AnimatedCursor from 'react-animated-cursor';

// This component safely initializes the AnimatedCursor
// by ensuring the DOM is fully loaded and ready
const SafeCursor = (props) => {
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    // Make sure document and body are available
    if (typeof window !== 'undefined' && document && document.body) {
      // Short timeout to ensure DOM is fully processed
      const timer = setTimeout(() => {
        setDomReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Don't render anything until DOM is ready
  if (!domReady) return null;

  try {
    return <AnimatedCursor {...props} />;
  } catch (error) {
    console.error("Failed to initialize cursor:", error);
    return null; // Fail gracefully
  }
};

export default SafeCursor;