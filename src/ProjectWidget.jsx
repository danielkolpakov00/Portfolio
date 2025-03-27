// src/ProjectWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProjectWidget = ({
  title,
  description,
  buttonText,
  color,
  id,
  visual: Visual,
  routePrefix,
  category,
  showCategory = false,
  titleExtra,
}) => {
  const [key, setKey] = useState(0);
  const visualContainerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    if (visualContainerRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const resizeEvent = new CustomEvent("container-resize", {
            detail: {
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            },
          });
          visualContainerRef.current.dispatchEvent(resizeEvent);
        }
      });
      resizeObserverRef.current.observe(visualContainerRef.current);
    }
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        setKey((prevKey) => prevKey + 1);
      }, 500);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserverRef.current && visualContainerRef.current) {
        resizeObserverRef.current.unobserve(visualContainerRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-whit/30 opacity-70 rounded-xl shadow-lg hover:shadow-[0_8px_12px_-3px_rgba(27,105,250,0.3)] transition-all duration-300 overflow-hidden shine-effect backdrop-blur-md relative flex flex-col h-full">
      <div
        ref={visualContainerRef}
        className="relative overflow-hidden bg-transparent backdrop-blur-sm flex-shrink-0"
        style={{ height: "180px", minHeight: "180px", maxHeight: "250px" }}
      >
        {Visual && <Visual key={key} containerRef={visualContainerRef} />}
      </div>
      {showCategory && category && (
        <div className="absolute top-2 left-2 z-20">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
      )}
      <div className="p-4 sm:p-6 border-t border-offwhite border-dashed border-opacity-50 backdrop-blur-sm flex flex-col flex-grow overflow-hidden">
        <h3 className="text-xl sm:text-3xl font-georama leading-tight mb-2 sm:mb-3 text-blue2 line-clamp-2 flex items-center">
          <span className="mr-auto">{title}</span>
          {titleExtra && <span className="flex-shrink-0">{titleExtra}</span>}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed font-georama flex-grow overflow-hidden line-clamp-5 xs:line-clamp-4 sm:line-clamp-3 text-xs xs:text-sm sm:text-base">
          {description}
        </p>
        <div className="mt-auto pt-2">
          <Link
            to={`${routePrefix}/${id}`}
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-xs xs:text-sm sm:text-base"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

ProjectWidget.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  color: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  visual: PropTypes.elementType,
  routePrefix: PropTypes.string,
  category: PropTypes.string,
  showCategory: PropTypes.bool,
  titleExtra: PropTypes.node,
};

ProjectWidget.defaultProps = {
  routePrefix: "/projects",
};

export default ProjectWidget;
