import React from 'react';

const marqueeText = "dkolp · web design · web development · react.js · three.js · tailwind · design · figma · git · seo · branding · adobe suite · ";

const VerticalMarquee = () => {
  const containerStyle = {
    position: 'absolute',
    top: 0,           // changed from '50%' to 0 for full vertical coverage
    bottom: 0,        // added to span entire height
    right: 0,
    zIndex: 100,
    display: 'flex',  // added flex display
    alignItems: 'center', // vertically center the content
    pointerEvents: 'none', // changed to allow underlying clicks
    
    // Removed transform for vertical centering
  };

  const textStyle = {
    transform: 'rotate(90deg)', // removed translateX(-100%)
    transformOrigin: 'top right',
    whiteSpace: 'nowrap',
    fontSize: '3rem',
    // fontStyle: 'normal', // removed to use default font
    color: '#808080', // updated to gray
    overflow: 'visible',
    width: '100vw',
    opacity: '0.5',
    
  };

  const marqueeWrapperStyle = {
    display: 'inline-block',
    animation: 'marquee 120s linear infinite', // increased duration from 20s to 40s
    animationDelay: '-10s',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div style={textStyle}>
        <div style={marqueeWrapperStyle}>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalMarquee;
