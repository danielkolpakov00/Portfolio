// src/PortfolioPreview.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Project previews
import WeatherPreview from "./WeatherPreview";
import PlinkoPreview from "./PlinkoPreview";
import BedroomPreview from "./BedroomScenePreview";
import MusicPreview from "./MusicPreview";
import MailPreview from "./MailPreview";
import TsParticles from "./components/TsParticles";
import ProjectWidget from "./components/ProjectWidget";
import { FaReact } from "react-icons/fa";
import projectsData from './data/projects.json';

// Set up responsive grid layout with width provider
const ResponsiveGridLayout = WidthProvider(Responsive);

// Map visual components to their imported references
const visualComponents = {
  "WeatherPreview": WeatherPreview,
  "PlinkoPreview": PlinkoPreview,
  "BedroomPreview": BedroomPreview,
  "MusicPreview": MusicPreview,
  "MailPreview": MailPreview
};

const PortfolioPreview = () => {
  // Create layout state to store and persist grid positions
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('portfolioLayouts');
    return savedLayouts ? JSON.parse(savedLayouts) : null;
  });
  
  const [allProjects, setAllProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeFrameworkFilter, setActiveFrameworkFilter] = useState("all");
  
  // Generate combined projects array
  useEffect(() => {
    // Process vanilla projects from projectsData
    const vanillaProjects = projectsData.vanillaProjects.map(project => ({
      ...project,
      visual: visualComponents[project.visualComponent],
      framework: "vanilla"
    }));
    
    // Fetch React projects from public folder
    const fetchReactProjects = async () => {
      try {
        const response = await fetch('/react-projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        const data = await response.json();
        
        // Create image-based visual components for React projects
        const reactProjects = data.projects.map(project => {
          // Create a custom visual component for each React project
          const ImageVisual = () => (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-600 to-blue-900">
                  <FaReact className="text-white" size={60} />
                </div>
              )}
            </div>
          );

          return {
            ...project,
            framework: "react",
            visual: ImageVisual
          };
        });
        
        // Combine vanilla and React projects
        setAllProjects([...vanillaProjects, ...reactProjects]);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setAllProjects(vanillaProjects);
      }
    };
    
    fetchReactProjects();
  }, []);

  // Save layouts to localStorage when they change
  useEffect(() => {
    if (layouts && Object.keys(layouts).length > 0) {
      localStorage.setItem('portfolioLayouts', JSON.stringify(layouts));
    }
  }, [layouts]);

  // Get unique categories from all projects
  const allCategories = ["all", ...new Set(
    allProjects.map(project => project.category || "other")
  )];

  // Define available frameworks
  const frameworks = ["all", "vanilla", "react"];

  // Filter projects based on activeFilter and activeFrameworkFilter
  const filteredProjects = allProjects.filter(project => {
    const categoryMatch = activeFilter === "all" || project.category === activeFilter;
    const frameworkMatch = activeFrameworkFilter === "all" || project.framework === activeFrameworkFilter;
    return categoryMatch && frameworkMatch;
  });
  
  // Handle layout changes
  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  // Generate initial layouts with 4-column grid
  const generateLayouts = useMemo(() => {
    if (!allProjects.length) return {};
    
    const cols = { lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 };
    const initialLayouts = {};
    
    Object.keys(cols).forEach(breakpoint => {
      initialLayouts[breakpoint] = allProjects.map((project, i) => {
        const colNum = cols[breakpoint];
        const row = Math.floor(i / colNum);
        const col = i % colNum;
        
        return {
          i: `${project.framework}-${project.id}`,
          x: col,
          y: row,
          w: 1,
          h: 2
        };
      });
    });
    
    return initialLayouts;
  }, [allProjects]);

  // Simple category filter handler
  const handleFilterChange = (category) => {
    if (category === activeFilter) return;
    setActiveFilter(category);
  };
  
  // Simple framework filter handler
  const handleFrameworkFilterChange = (framework) => {
    if (framework === activeFrameworkFilter) return;
    setActiveFrameworkFilter(framework);
  };

  // Filter Pills Component - FIXED: Now properly defined
  const FilterPills = () => (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {allCategories.map(category => (
        <button
          key={category}
          onClick={() => handleFilterChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === category 
              ? "bg-blue2 text-white opacity-80" 
              : "bg-blue1 text-white hover:bg-gray-700 opacity-80"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );

  // Framework Filter Pills Component - FIXED: Now properly defined
  const FrameworkFilterPills = () => (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {frameworks.map(framework => (
        <button
          key={framework}
          onClick={() => handleFrameworkFilterChange(framework)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFrameworkFilter === framework 
              ? "bg-blue2 text-white opacity-80" 
              : "bg-blue1 text-white hover:bg-gray-700 opacity-80"
          }`}
        >
          {framework.charAt(0).toUpperCase() + framework.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <TsParticles />
      <h2 className="text-center text-6xl text-blue2 font-bold mb-6 flex items-center justify-center gap-2">
        My Work
      </h2>
      
      <div className="mb-4">
        <FilterPills />
      </div>
      
      <div className="mb-8">
        <FrameworkFilterPills />
      </div>

      <div className="px-4 py-10">
        {filteredProjects.length > 0 && (
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts || generateLayouts}
            onLayoutChange={onLayoutChange}
            isDraggable={true}
            isResizable={false}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={250}
            margin={[16, 16]}
            containerPadding={[20, 20]}
            draggableHandle=".drag-handle"
            compactType="vertical"
            useCSSTransforms={true}
            autoSize={true}
            draggableCancel=".project-link-content"
            isBounded={false}
            allowOverlap={false}
            measureBeforeMount={false}
            // Adjust rearrangement speed with this time value (milliseconds)
            // Higher values make smoother transitions for non-dragged items
            resizeHandles={[]}
          >
            {filteredProjects.map((project, index) => (
              <div 
                key={`${project.framework}-${project.id}`}
                className="project-item"
                style={{ overflow: 'visible' }}
              >
                <ProjectWidget
                  {...project}
                  routePrefix={project.framework === "react" ? "/react-projects" : "/projects"}
                  showCategory={true}
                  titleExtra={project.framework === "react" ? <FaReact className="text-blue-500 flex-shrink-0" size={24} /> : null}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>
      
      {/* Better CSS for smooth rearrangement */}
      <style jsx global>{`
        /* Key change: Only disable transitions for the item being dragged */
        .react-grid-item.react-draggable-dragging {
          z-index: 100 !important;
          cursor: grabbing !important;
          transition: none !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
        }
        
        /* For items being rearranged (not the one being dragged), keep smooth transitions */
        .react-grid-item:not(.react-draggable-dragging) {
          transition: transform 0.3s ease, left 0.3s ease, top 0.3s ease, right 0.3s ease !important;
        }
        
        /* Make placeholder responsive */
        .react-grid-placeholder {
          background-color: rgba(27, 105, 250, 0.2) !important;
          border: 1px dashed #1b69fa !important;
          border-radius: 0.75rem !important;
          transition: all 0.15s ease !important;
        }
        
        /* Basic styling */
        .drag-handle {
          cursor: grab;
        }
        
        .drag-handle:active,
        .react-draggable-dragging .drag-handle {
          cursor: grabbing !important;
        }
        
        /* Optimize for performance */
        .react-grid-item {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default PortfolioPreview;
