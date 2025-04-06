import React, { useEffect, useRef, useState } from 'react';

/**
 * MouseTracker component that creates a custom cursor when mouse is over specific target elements
 * This approach works with iframes by creating a completely separate cursor element
 */
const MouseTracker = ({ 
  targetSelector = '.iframe-container',
  innerSize = 8,
  outerSize = 35,
  innerColor = '#ff2d00',
  outerColor = '#ff2d00',
  outerAlpha = 0,
  innerScale = 1.2,
  outerScale = 1.7,
  clickables = [] 
}) => {
  const innerCursorRef = useRef(null);
  const outerCursorRef = useRef(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorEnlarged, setCursorEnlarged] = useState(false);
  const [targetHovered, setTargetHovered] = useState(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  
  // Default clickables
  const defaultClickables = [
    'a',
    'button',
    '.link',
    '.project-card',
    '.clickable',
    '.nav-item',
    'input[type="text"]',
    'input[type="email"]',
    'input[type="number"]',
    'input[type="submit"]',
    'textarea',
    'select',
    'label[for]',
    '.social-icon'
  ];
  
  const allClickables = [...defaultClickables, ...clickables].join(',');

  useEffect(() => {
    // Create cursor elements
    const innerCursor = document.createElement('div');
    innerCursor.classList.add('custom-inner-cursor');
    innerCursor.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: ${innerSize}px;
      height: ${innerSize}px;
      background: ${innerColor};
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: exclusion;
      transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
      opacity: 0;
    `;
    
    const outerCursor = document.createElement('div');
    outerCursor.classList.add('custom-outer-cursor');
    outerCursor.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: ${outerSize}px;
      height: ${outerSize}px;
      border: 3px solid ${outerColor};
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9998;
      opacity: ${outerAlpha};
      mix-blend-mode: exclusion;
      transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
    `;
    
    document.body.appendChild(innerCursor);
    document.body.appendChild(outerCursor);
    
    innerCursorRef.current = innerCursor;
    outerCursorRef.current = outerCursor;
    
    // Event handlers
    const onMouseMove = (e) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      
      if (!cursorVisible) {
        setCursorVisible(true);
        innerCursorRef.current.style.opacity = '1';
        outerCursorRef.current.style.opacity = String(outerAlpha);
      }
      
      if (targetHovered) {
        innerCursorRef.current.style.left = `${e.clientX}px`;
        innerCursorRef.current.style.top = `${e.clientY}px`;
        outerCursorRef.current.style.left = `${e.clientX}px`;
        outerCursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    
    const onMouseOut = () => {
      setCursorVisible(false);
      innerCursorRef.current.style.opacity = '0';
      outerCursorRef.current.style.opacity = '0';
    };
    
    const onMouseDown = () => {
      innerCursorRef.current.style.transform = `translate(-50%, -50%) scale(${innerScale * 0.8})`;
      outerCursorRef.current.style.transform = `translate(-50%, -50%) scale(${outerScale * 0.8})`;
    };
    
    const onMouseUp = () => {
      innerCursorRef.current.style.transform = cursorEnlarged
        ? `translate(-50%, -50%) scale(${innerScale})`
        : 'translate(-50%, -50%) scale(1)';
      outerCursorRef.current.style.transform = cursorEnlarged
        ? `translate(-50%, -50%) scale(${outerScale})`
        : 'translate(-50%, -50%) scale(1)';
    };
    
    // Target element detection
    const detectTarget = () => {
      const targets = document.querySelectorAll(targetSelector);
      const clickableElements = document.querySelectorAll(allClickables);
      
      const handleMouseEnterTarget = () => {
        setTargetHovered(true);
        document.body.style.cursor = 'none';
      };
      
      const handleMouseLeaveTarget = () => {
        setTargetHovered(false);
      };
      
      const handleMouseEnterClickable = () => {
        setCursorEnlarged(true);
        innerCursorRef.current.style.transform = `translate(-50%, -50%) scale(${innerScale})`;
        outerCursorRef.current.style.transform = `translate(-50%, -50%) scale(${outerScale})`;
      };
      
      const handleMouseLeaveClickable = () => {
        setCursorEnlarged(false);
        innerCursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        outerCursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
      };
      
      targets.forEach(target => {
        target.addEventListener('mouseenter', handleMouseEnterTarget);
        target.addEventListener('mouseleave', handleMouseLeaveTarget);
      });
      
      clickableElements.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnterClickable);
        element.addEventListener('mouseleave', handleMouseLeaveClickable);
      });
      
      return () => {
        targets.forEach(target => {
          target.removeEventListener('mouseenter', handleMouseEnterTarget);
          target.removeEventListener('mouseleave', handleMouseLeaveTarget);
        });
        
        clickableElements.forEach(element => {
          element.removeEventListener('mouseenter', handleMouseEnterClickable);
          element.removeEventListener('mouseleave', handleMouseLeaveClickable);
        });
      };
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    const cleanupTargets = detectTarget();
    
    // Animation frame loop for smooth cursor movement for non-iframe elements
    let animationFrameId;
    
    const render = () => {
      if (!targetHovered && innerCursorRef.current && outerCursorRef.current) {
        innerCursorRef.current.style.left = `${mousePositionRef.current.x}px`;
        innerCursorRef.current.style.top = `${mousePositionRef.current.y}px`;
        
        // Slight delay for outer cursor (trailing effect)
        outerCursorRef.current.style.left = `${mousePositionRef.current.x}px`;
        outerCursorRef.current.style.top = `${mousePositionRef.current.y}px`;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      cleanupTargets();
      
      if (innerCursorRef.current) document.body.removeChild(innerCursorRef.current);
      if (outerCursorRef.current) document.body.removeChild(outerCursorRef.current);
    };
  }, [innerSize, outerSize, innerColor, outerColor, outerAlpha, innerScale, outerScale, allClickables, targetSelector, cursorEnlarged, cursorVisible, targetHovered]);
  
  return null; // This component doesn't render anything
};

export default MouseTracker;