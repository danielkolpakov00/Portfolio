import React, { useState, useEffect, createContext, useContext } from 'react';

// Create a context for cursor tooltip
const CursorTooltipContext = createContext({
  text: '',
  isVisible: false,
  showTooltip: () => {},
  hideTooltip: () => {},
  setTooltipText: () => {}
});

// Provider component to manage tooltip state
export const CursorTooltipProvider = ({ children }) => {
  const [tooltipState, setTooltipState] = useState({
    text: '',
    isVisible: false
  });

  const showTooltip = () => {
    setTooltipState(prev => ({ ...prev, isVisible: true }));
  };

  const hideTooltip = () => {
    setTooltipState(prev => ({ ...prev, isVisible: false }));
  };

  const setTooltipText = (text) => {
    setTooltipState(prev => ({ ...prev, text }));
  };

  return (
    <CursorTooltipContext.Provider 
      value={{
        ...tooltipState,
        showTooltip,
        hideTooltip,
        setTooltipText
      }}
    >
      {children}
      <CursorTooltip 
        text={tooltipState.text} 
        active={tooltipState.isVisible} 
      />
    </CursorTooltipContext.Provider>
  );
};

// Hook to use the cursor tooltip context
export const useCursorTooltip = () => useContext(CursorTooltipContext);

// Simplified CursorTooltip component
const CursorTooltip = ({ text, active }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Basic movement handler
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX + 16, // 16px right of cursor
        y: e.clientY       // Same y-level as cursor
      });
    };
    
    if (active) {
      // Set initial position from current mouse position if available
      const event = window.event;
      if (event && event.clientX) {
        setPosition({
          x: event.clientX + 16,
          y: event.clientY
        });
      }
      
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active]);
  
  if (!active) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(27, 105, 250, 0.0)',
        color: 'rgba(255, 0, 0, 1)',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.0)',
        boxShadow: '0 4px 12px rgba(27, 105, 250, 0.0)',
        border: '1px solidrgba(245, 253, 255, 0)',
        opacity: 0.95,
        fontFamily: 'Georama, sans-serif',
        letterSpacing: '0.5px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  );
};

export default CursorTooltip;
