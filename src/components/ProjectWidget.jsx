import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { useCursorTooltip } from './CursorTooltip';

const ProjectWidget = ({
  title,
  description,
  color,
  id,
  visual: Visual,
  routePrefix,
  category,
  showCategory = false,
  titleExtra,
  onVisualLoad,
}) => {
  const visualContainerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { showTooltip, hideTooltip, setTooltipText } = useCursorTooltip();
  
  // Set up resize observer to track container size
  useEffect(() => {
    if (!visualContainerRef.current) return;
    
    const updateSize = () => {
      if (visualContainerRef.current) {
        const { width, height } = visualContainerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };
    
    // Initial size calculation
    updateSize();
    
    // Create resize observer
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || !entries[0]) return;
      updateSize();
    });
    
    resizeObserver.observe(visualContainerRef.current);
    
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // Handle visual loading and notify parent component
  useEffect(() => {
    // If there's no visual component, consider it loaded immediately
    if (!Visual) {
      console.log(`No visual for project ${id}, marking as loaded`);
      if (onVisualLoad) onVisualLoad(id);
      return;
    }
    
    // Always mark all components as loaded after a timeout
    // This prevents the loading screen from getting stuck if a visual component fails to trigger onLoad
    const timer = setTimeout(() => {
      console.log(`Forcing load completion for project ${id} after timeout`);
      if (onVisualLoad) onVisualLoad(id);
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(timer);
  }, [Visual, id, onVisualLoad]);
  
  // Handle tooltip display
  const handleMouseEnter = () => {
    setTooltipText("drag_me");
    showTooltip();
  };

  // Handle visual load
  const handleVisualLoad = () => {
    console.log(`Visual for project ${id} completed loading`);
    if (onVisualLoad) onVisualLoad(id);
  };
  
  return (
    <div className="bg-white/10 rounded-xl shadow-lg hover:shadow-[0_8px_12px_-3px_rgba(27,105,250,0.3)] transition-all duration-300 overflow-hidden shine-effect relative flex flex-col h-full cursor-pointer border-2 border-blue1">
      {/* macOS style toolbar with drag handle */}
      <div 
        className="h-8 bg-gradient-to-r from-blue-600 to-blue-500 flex items-center px-3 shadow-sm drag-handle cursor-move"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hideTooltip}
      >
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        {showCategory && category && (
          <span className="ml-auto px-3 py-0.5 rounded-full text-xs font-medium bg-blue-700 text-white">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        )}
      </div>
      
      {/* Visual component container with responsive sizing */}
      <div 
        ref={visualContainerRef}
        className="relative overflow-hidden bg-transparent flex-shrink-0 flex items-center justify-center"
        style={{ 
          height: "180px",  // Reduced from 200px
          maxHeight: "220px" // Reduced from 250px
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {Visual && (
            <Visual 
              containerRef={visualContainerRef} 
              containerSize={containerSize} 
              onLoad={handleVisualLoad} 
            />
          )}
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-4 sm:p-5 border-t border-blue-500/30 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl md:text-2xl font-georama leading-tight mb-2 text-blue2 line-clamp-2 flex items-center">
          {title}
          {titleExtra && <span className="ml-2">{titleExtra}</span>}
        </h3>
        <p className="text-gray-600 mb-2 leading-relaxed font-georama flex-grow overflow-hidden line-clamp-3 sm:line-clamp-2 text-xs sm:text-sm">
          {description}
        </p>
      </div>
      
      {/* The link overlays the entire widget for clickability but excludes the drag handle */}
      <Link
        to={`${routePrefix}/${id}`}
        className="absolute inset-0 project-link z-10 pointer-events-none"
      >
        <div className="w-full h-full pointer-events-auto mt-8">
          <span className="sr-only">View {title} project</span>
        </div>
      </Link>
    </div>
  );
};

ProjectWidget.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  visual: PropTypes.elementType,
  routePrefix: PropTypes.string,
  category: PropTypes.string,
  showCategory: PropTypes.bool,
  titleExtra: PropTypes.node,
  onVisualLoad: PropTypes.func,
};

ProjectWidget.defaultProps = {
  routePrefix: "/projects",
};

export default ProjectWidget;