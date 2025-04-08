import React, { useEffect, useRef, useState } from 'react';

/**
 * IframeProxyCursor - A component that creates a proxy div over an iframe 
 * that preserves the animated cursor while allowing interaction with the iframe
 */
const IframeProxyCursor = ({ 
  src, 
  title, 
  className = '', 
  style = {}, 
  onFullscreen,
  iframeRef: externalIframeRef,
  ...iframeProps 
}) => {
  const localIframeRef = useRef(null);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const iframeRef = externalIframeRef || localIframeRef;
  const [isHovered, setIsHovered] = useState(false);
  const [isPointerInIframe, setIsPointerInIframe] = useState(false);
  const iframePosition = useRef({ top: 0, left: 0, width: 0, height: 0 });
  const [iframeReady, setIframeReady] = useState(false);

  // Initialize proxy overlay once the iframe is loaded
  useEffect(() => {
    if (!iframeRef.current) return;

    const handleIframeLoad = () => {
      setIframeReady(true);

      try {
        // Try to hide the cursor in the iframe (may fail for cross-origin iframes)
        const iframeDoc = iframeRef.current.contentWindow.document;
        const styleElem = document.createElement('style');
        styleElem.textContent = `* { cursor: none !important; }`;
        iframeDoc.head.appendChild(styleElem);
      } catch (err) {
        console.warn('Unable to modify iframe styles (cross-origin restriction)', err);
      }

      // Calculate iframe position relative to viewport
      updateIframePosition();
    };

    const updateIframePosition = () => {
      if (!iframeRef.current) return;
      
      const rect = iframeRef.current.getBoundingClientRect();
      iframePosition.current = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      };
    };

    iframeRef.current.addEventListener('load', handleIframeLoad);
    window.addEventListener('resize', updateIframePosition);
    window.addEventListener('scroll', updateIframePosition);

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
      window.removeEventListener('resize', updateIframePosition);
      window.removeEventListener('scroll', updateIframePosition);
    };
  }, [iframeRef]);

  // Handle mouse events over the iframe
  useEffect(() => {
    if (!overlayRef.current || !iframeReady) return;
    
    const overlay = overlayRef.current;
    let proxyEventTarget = null;

    // Helper to get coordinates relative to iframe content
    const getRelativeCoordinates = (clientX, clientY) => {
      const x = clientX - iframePosition.current.left;
      const y = clientY - iframePosition.current.top;
      return { x, y };
    };

    // Simulate all mouse events in the iframe through the proxy overlay
    const createProxyEvent = (type, originalEvent) => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) return;
      
      try {
        const { x, y } = getRelativeCoordinates(
          originalEvent.clientX, 
          originalEvent.clientY
        );

        // Get the element at this position in the iframe
        const iframeDoc = iframeRef.current.contentWindow.document;
        const elementFromPoint = iframeDoc.elementFromPoint(x, y);
        
        if (!elementFromPoint) return;

        // Create a new mouse event in the iframe document
        const eventOptions = {
          bubbles: true,
          cancelable: true,
          view: iframeRef.current.contentWindow,
          detail: originalEvent.detail,
          screenX: originalEvent.screenX,
          screenY: originalEvent.screenY,
          clientX: x,
          clientY: y,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          button: originalEvent.button,
          buttons: originalEvent.buttons,
          relatedTarget: originalEvent.relatedTarget
        };

        const event = new iframeRef.current.contentWindow.MouseEvent(
          type, 
          eventOptions
        );

        // For mousedown events, remember the target for drag operations
        if (type === 'mousedown') {
          proxyEventTarget = elementFromPoint;
        } 
        
        // For mouseup events, dispatch to the cached target from mousedown (if any)
        if (type === 'mouseup' && proxyEventTarget) {
          proxyEventTarget.dispatchEvent(event);
          proxyEventTarget = null;
        } else {
          // All other events go to the element under the cursor
          elementFromPoint.dispatchEvent(event);
        }

        // For click events, make sure elements can be activated
        if (type === 'click') {
          // Handle links
          if (elementFromPoint.tagName === 'A' && elementFromPoint.href) {
            iframeRef.current.contentWindow.location.href = elementFromPoint.href;
          }
          // Handle form elements
          if (elementFromPoint.tagName === 'BUTTON' || 
              elementFromPoint.tagName === 'INPUT') {
            elementFromPoint.click();
          }
        }
      } catch (err) {
        console.warn('Error in proxy event handling', err);
      }
    };

    // Mouse event handlers
    const handleMouseMove = (e) => {
      // Update isPointerInIframe state
      const { x, y } = getRelativeCoordinates(e.clientX, e.clientY);
      const isInside = x >= 0 && y >= 0 && x <= iframePosition.current.width && y <= iframePosition.current.height;
      
      if (isInside !== isPointerInIframe) {
        setIsPointerInIframe(isInside);
      }

      if (isInside) {
        createProxyEvent('mousemove', e);
      }
    };

    const handleMouseDown = (e) => {
      if (isPointerInIframe) {
        e.preventDefault(); // Prevent selecting overlay
        createProxyEvent('mousedown', e);
      }
    };

    const handleMouseUp = (e) => {
      if (isPointerInIframe) {
        createProxyEvent('mouseup', e);
        createProxyEvent('click', e);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      updateIframePosition(); // Update position on enter

      // Make react-animated-cursor follow into the overlay - SAFE IMPLEMENTATION
      try {
        const animatedCursor = document.querySelector('.animated-cursor');
        if (animatedCursor && typeof animatedCursor === 'object') {
          // Ensure cursor is visible and protect against potential null references
          requestAnimationFrame(() => {
            if (animatedCursor.style) {
              animatedCursor.style.opacity = '1';
              animatedCursor.style.pointerEvents = 'none';
            }
          });
        }
      } catch (err) {
        console.warn('Error handling cursor visibility:', err);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsPointerInIframe(false);
      
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          // Dispatch mouseleave to the document when exiting
          const event = new iframeRef.current.contentWindow.MouseEvent(
            'mouseleave', { bubbles: true }
          );
          iframeRef.current.contentWindow.document.dispatchEvent(event);
        } catch (err) {
          // Ignore cross-origin errors
        }
      }
    };

    // Add event listeners to overlay
    overlay.addEventListener('mousemove', handleMouseMove);
    overlay.addEventListener('mousedown', handleMouseDown);
    overlay.addEventListener('mouseup', handleMouseUp);
    overlay.addEventListener('mouseenter', handleMouseEnter);
    overlay.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      overlay.removeEventListener('mousemove', handleMouseMove);
      overlay.removeEventListener('mousedown', handleMouseDown);
      overlay.removeEventListener('mouseup', handleMouseUp);
      overlay.removeEventListener('mouseenter', handleMouseEnter);
      overlay.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [iframeReady, iframeRef, isPointerInIframe]);

  return (
    <div 
      ref={containerRef}
      className={`iframe-proxy-container relative ${className}`}
      style={style}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="w-full h-full"
        {...iframeProps}
      />

      {/* Transparent overlay that captures mouse events */}
      <div 
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          zIndex: 10
        }}
      />
      
      {/* Fullscreen button */}
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 font-medium z-20"
          aria-label="View fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
          </svg>
          <span>Fullscreen</span>
        </button>
      )}
    </div>
  );
};

export default IframeProxyCursor;