import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const CursorPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [portalContainer] = useState(() => {
    const el = document.createElement('div');
    el.id = 'cursor-portal';
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '100vw';
    el.style.height = '100vh';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999999';
    return el;
  });

  useEffect(() => {
    document.body.appendChild(portalContainer);
    setMounted(true);
    return () => {
      document.body.removeChild(portalContainer);
    };
  }, [portalContainer]);

  return mounted ? ReactDOM.createPortal(children, portalContainer) : null;
};

export default CursorPortal;
