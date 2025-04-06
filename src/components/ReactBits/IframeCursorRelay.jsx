import React, { useEffect, useRef } from 'react';

/**
 * Component that relays cursor position from an iframe to the parent document
 * to enable the animated cursor to work inside iframes.
 */
const IframeCursorRelay = ({ src, title, className, allowFullscreen = true, style = {}, ...props }) => {
  const iframeRef = useRef(null);
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    // Function to handle iframe load
    const handleIframeLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Inject cursor tracking script into the iframe
        const script = iframeDoc.createElement('script');
        script.innerHTML = `
          (function() {
            // Track mouse movements inside iframe and relay to parent
            document.addEventListener('mousemove', function(e) {
              // Calculate position relative to the iframe
              const rect = window.frameElement.getBoundingClientRect();
              const x = e.clientX + rect.left;
              const y = e.clientY + rect.top;
              
              // Send event to parent window
              window.parent.postMessage({
                type: 'iframe-cursor-position',
                x: x,
                y: y
              }, '*');
            });
            
            // Track mouse enter/leave events
            document.addEventListener('mouseenter', function() {
              window.parent.postMessage({
                type: 'iframe-cursor-enter'
              }, '*');
            });
            
            document.addEventListener('mouseleave', function() {
              window.parent.postMessage({
                type: 'iframe-cursor-leave'
              }, '*');
            });
            
            // Prevent default cursor in iframe
            const style = document.createElement('style');
            style.innerHTML = '* { cursor: none !important; }';
            document.head.appendChild(style);
          })();
        `;
        
        // Append the script to the iframe document
        iframeDoc.body.appendChild(script);
      } catch (error) {
        console.warn('Could not inject cursor tracking into iframe:', error);
        // For cross-origin iframes, we can't directly inject scripts
        // In this case, we'll need to use a different approach
      }
    };
    
    // Set up load event listener
    iframe.addEventListener('load', handleIframeLoad);
    
    // Set up parent window message listener
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'iframe-cursor-position') {
        // Create a synthetic mousemove event
        const syntheticEvent = new MouseEvent('mousemove', {
          clientX: event.data.x,
          clientY: event.data.y,
          bubbles: true,
          cancelable: true
        });
        
        // Dispatch the event on the parent document
        document.dispatchEvent(syntheticEvent);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      className={className}
      style={{ ...style }}
      allow="fullscreen"
      allowFullScreen={allowFullscreen}
      {...props}
    />
  );
};

export default IframeCursorRelay;