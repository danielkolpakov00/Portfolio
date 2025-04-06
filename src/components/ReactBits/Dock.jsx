"use client";

import {
  motion,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";

// Helper function to get responsive value based on screen size
const getResponsiveValue = (value) => {
  if (typeof value !== 'object') return value;
  
  const { base, md, lg } = value;
  if (typeof window !== 'undefined') {
    if (window.innerWidth >= 1024) return lg || md || base;
    if (window.innerWidth >= 768) return md || base;
  }
  return base;
};

function DockItem({
  children,
  className = "",
  onClick,
  index,
  activeItem,
  setActiveItem,
  magnification,
  baseItemSize,
  onMouseEnter: customMouseEnter,
  onMouseLeave: customMouseLeave
}) {
  const isHovered = useMotionValue(0);
  const responsiveMagnification = getResponsiveValue(magnification);
  const responsiveBaseItemSize = getResponsiveValue(baseItemSize);
  
  // Handle hover state
  const handleMouseEnter = () => {
    setActiveItem(index);
    isHovered.set(1);
    if (customMouseEnter) customMouseEnter();
  };
  
  const handleMouseLeave = () => {
    isHovered.set(0);
    if (customMouseLeave) customMouseLeave();
  };

  // Calculate size based on whether item is active
  const size = activeItem === index ? responsiveMagnification : responsiveBaseItemSize;

  return (
    <motion.div
      style={{ width: responsiveBaseItemSize, height: responsiveBaseItemSize }}
      animate={{ 
        width: size, 
        height: size,
        transition: { 
          type: "spring", 
          mass: 0.5, 
          stiffness: 200, 
          damping: 20
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-white/90 border-2 border-blue2 shadow-md md:shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        cloneElement(child, { isHovered })
      )}
    </motion.div>
  );
}

function DockLabel({ children, className = "", isHovered }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 20 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className={`${className} absolute top-0 left-full whitespace-pre rounded-md border border-blue2 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-xs text-blue2 md:py-1 md:text-sm md:font-medium md:shadow-md md:label-fix pointer-events-none`}
                style={{ 
                    transform: 'translateY(-50%)',
                    transformOrigin: 'left center',
                    pointerEvents: 'none'
                }}
                role="tooltip"
            >
                <style jsx>{`
                    @media (min-width: 768px) {
                        .md\\:label-fix {
                            transform: translateY(-50%) rotate(-270deg) !important;
                            left: 50% !important;
                            top: 100% !important;
                            margin-top: 12px !important;
                            margin-left: -50% !important;
                            transform-origin: top center !important;
                            text-align: center !important;
                            white-space: nowrap !important;
                        }
                    }
                `}</style>
                {children}
            </motion.div>
        )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  magnification = 70,
  panelHeight = 64,
  baseItemSize = 50,
  distance = 100,
  spring = { mass: 0.5, stiffness: 120, damping: 20 }
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    // Initial size
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  
  const responsivePanelHeight = getResponsiveValue(panelHeight);
  
  return (
    <div className="relative flex justify-center items-center w-auto">
      <div
        className={`flex items-center justify-center mx-2 ${className}`}
        style={{ height: typeof panelHeight === 'object' ? getResponsiveValue(panelHeight) : panelHeight }}
      >
        <div
          onMouseLeave={() => setActiveItem(null)}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 md:left-[55%] lg:left-[60%] flex items-end w-fit gap-2 md:gap-4 rounded-2xl border-blue2 border-2 pb-2 px-2 md:px-4 transition-all duration-300 shadow-md"
          style={{ 
            height: typeof panelHeight === 'object' ? getResponsiveValue(panelHeight) : panelHeight, 
            maxWidth: '90vw', 
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          role="toolbar"
          aria-label="Application dock"
        >
          {items.map((item, index) => (
            <DockItem
              key={index}
              index={index}
              onClick={item.onClick}
              className={item.className}
              magnification={magnification}
              baseItemSize={baseItemSize}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onMouseEnter={item.onMouseEnter}
              onMouseLeave={item.onMouseLeave}
            >
              <DockIcon>{item.icon}</DockIcon>
              {/* Label removed in favor of tooltips */}
            </DockItem>
          ))}
        </div>
      </div>
    </div>
  );
}
