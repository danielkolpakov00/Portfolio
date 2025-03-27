import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

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
}) => {
  return (
    <div className="bg-white/10 rounded-xl shadow-lg hover:shadow-[0_8px_12px_-3px_rgba(27,105,250,0.3)] transition-all duration-300 overflow-hidden shine-effect relative flex flex-col h-full cursor-pointer border-2 border-blue1">
      {/* macOS style toolbar with drag handle */}
      <div className="h-8 bg-gradient-to-r from-blue-600 to-blue-500 flex items-center px-3 shadow-sm drag-handle cursor-move">
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
      
      {/* Visual component container */}
      <div className="h-[200px] sm:h-[250px] relative overflow-hidden bg-transparent flex-shrink-0">
        {Visual && <Visual />}
      </div>
      
      {/* Content area */}
      <div className="p-4 sm:p-6 border-t border-blue-500/30 flex flex-col flex-grow">
        <h3 className="text-2xl sm:text-3xl font-georama leading-tight mb-2 sm:mb-3 text-blue2 line-clamp-2 flex items-center">
          {title}
          {titleExtra && <span className="ml-2">{titleExtra}</span>}
        </h3>
        <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed font-georama flex-grow overflow-hidden line-clamp-4 sm:line-clamp-3 text-sm sm:text-base">
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
};

ProjectWidget.defaultProps = {
  routePrefix: "/projects",
};

export default ProjectWidget;
