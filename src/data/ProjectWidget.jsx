import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

const ProjectWidget = ({
  title,
  description,
  buttonText,
  color,
  id,
  visual: Visual,  // renamed from ProjectComponent for clarity
  routePrefix, // new prop for route prefix
  category,
  showCategory = false,
}) => {
  return (
    <div className="bg-whit/30 opacity-70 rounded-xl shadow-lg hover:shadow-[0_8px_12px_-3px_rgba(27,105,250,0.3)] transition-all duration-300 overflow-hidden shine-effect backdrop-blur-md relative">
      <div className="h-[300px] relative overflow-hidden bg-transparent backdrop-blur-sm">
        {Visual && <Visual />}
      </div>
      {showCategory && category && (
        <div className="absolute top-2 left-2 z-20">
          <span 
            className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white"
          >
            {category}
          </span>
        </div>
      )}
      <div className="p-6 border-t border-offwhite border-dashed border-opacity-50 backdrop-blur-sm">
        <h3 className="text-4xl font-georama leading-relaxed mb-3 text-blue2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed font-georama">
          {description}
        </p>
        <Link
          to={`${routePrefix}/${id}`}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
                      hover:bg-blue-700 transition-all duration-200
                      shadow-md hover:shadow-lg"
        >
          {buttonText}
        </Link>
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
};

ProjectWidget.defaultProps = {
  routePrefix: "/projects",
};

export default ProjectWidget;
