// src/PortfolioPreview.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { motion } from "framer-motion";

import WeatherPreview from "./WeatherPreview";
import PlinkoPreview from "./PlinkoPreview";
import BedroomPreview from "./BedroomScenePreview";
import MusicPreview from "./MusicPreview";
import MailPreview from "./MailPreview";
import TsParticles from "./components/TsParticles";
import ProjectWidget from "./components/ProjectWidget";
import { FaReact } from "react-icons/fa";
import projectsData from "./data/projects.json";
import Iridescence from "./components/ReactBits/Iridescence";

const ResponsiveGridLayout = WidthProvider(Responsive);

const visualComponents = {
  "WeatherPreview": WeatherPreview,
  "PlinkoPreview": PlinkoPreview,
  "BedroomPreview": BedroomPreview,
  "MusicPreview": MusicPreview,
  "MailPreview": MailPreview,
};

const PortfolioPreview = () => {
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem("portfolioLayouts");
    return savedLayouts ? JSON.parse(savedLayouts) : null;
  });
  const [allProjects, setAllProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeFrameworkFilter, setActiveFrameworkFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load and map projects
  useEffect(() => {
    // Map vanilla projects and attach their visual component and framework
    const vanillaProjects = projectsData.vanillaProjects.map((project) => ({
      ...project,
      visual: visualComponents[project.visualComponent],
      framework: "vanilla",
    }));

    const fetchReactProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/react-projects.json");
        if (!response.ok) throw new Error("Failed to load projects");
        const data = await response.json();

        const reactProjects = data.projects.map((project) => {
          if (project.id === "gradient-generator") {
            const GradientVisual = ({ containerRef, containerSize }) => (
              <div className="w-full h-full" style={{ overflow: 'hidden' }}>
                <Iridescence color={[0.4, 0.4, 1]} speed={0.8} amplitude={0.2} />
              </div>
            );
            return { ...project, framework: "react", visual: GradientVisual };
          }

          const ImageVisual = ({ containerRef, containerSize }) => {
            // Calculate object-fit style based on container size
            const imgStyle = {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            };
            
            return (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    style={imgStyle}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-600 to-blue-900">
                    <FaReact className="text-white" size={containerSize.width ? Math.min(60, containerSize.width / 4) : 40} />
                  </div>
                )}
              </div>
            );
          };

          return { ...project, framework: "react", visual: ImageVisual };
        });

        setAllProjects([...vanillaProjects, ...reactProjects]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setAllProjects(vanillaProjects);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReactProjects();
  }, []);

  // Set mounted after initial render to avoid SSR issues with measurements
  useEffect(() => {
    setMounted(true);
  }, []);

  // Save layouts to localStorage
  useEffect(() => {
    if (layouts && Object.keys(layouts).length > 0) {
      localStorage.setItem("portfolioLayouts", JSON.stringify(layouts));
    }
  }, [layouts]);

  const allCategories = ["all", ...new Set(allProjects.map((p) => p.category || "other"))];
  const frameworks = ["all", "vanilla", "react"];

  const filteredProjects = allProjects.filter((project) => {
    const categoryMatch = activeFilter === "all" || project.category === activeFilter;
    const frameworkMatch =
      activeFrameworkFilter === "all" || project.framework === activeFrameworkFilter;
    return categoryMatch && frameworkMatch;
  });

  const onLayoutChange = useCallback((currentLayout, allLayouts) => {
    setLayouts(allLayouts);
  }, []);

  // Generate fixed layout for the grid
  const generateLayout = useCallback(() => {
    if (!filteredProjects.length) return { lg: [], md: [], sm: [], xs: [], xxs: [] };
    
    const cols = { lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 };
    const layouts = {};
    
    Object.keys(cols).forEach(breakpoint => {
      const colNum = cols[breakpoint];
      layouts[breakpoint] = filteredProjects.map((project, i) => {
        return {
          i: `${project.framework}-${project.id}`,
          x: i % colNum,
          y: Math.floor(i / colNum),
          w: 1,
          h: 2,
          static: false
        };
      });
    });
    
    return layouts;
  }, [filteredProjects]);

  // Get current layout
  const currentLayouts = useMemo(() => {
    return generateLayout();
  }, [generateLayout]);

  // Components for the filter pills
  const FilterPills = () => (
    <div className="flex flex-wrap gap-3 mb-6 justify-center">
      {allCategories.map((category) => (
        <motion.button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm border-2 ${
            activeFilter === category
              ? "bg-blue2 text-white border-blue2 shadow-lg shadow-blue2/30"
              : "bg-white text-blue2 border-blue2 hover:bg-blue2/10"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.button>
      ))}
    </div>
  );

  const FrameworkFilterPills = () => (
    <div className="flex flex-wrap gap-3 mb-6 justify-center">
      {frameworks.map((framework) => (
        <motion.button
          key={framework}
          onClick={() => setActiveFrameworkFilter(framework)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm border-2 ${
            activeFrameworkFilter === framework
              ? "bg-blue2 text-white border-blue2 shadow-lg shadow-blue2/30"
              : "bg-white text-blue2 border-blue2 hover:bg-blue2/10"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {framework.charAt(0).toUpperCase() + framework.slice(1)}
        </motion.button>
      ))}
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <TsParticles />

      <motion.h2
        className="text-center text-6xl text-blue2 font-bold mb-10 mt-12 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          My
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700"
        >
          Portfolio
        </motion.span>
      </motion.h2>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <FilterPills />
      </motion.div>
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <FrameworkFilterPills />
      </motion.div>

      {/* Portfolio grid layout */}
      <div className="px-4 py-10">
        {filteredProjects.length > 0 ? (
          mounted && (
            <ResponsiveGridLayout
              className="layout"
              layouts={currentLayouts}
              onLayoutChange={onLayoutChange}
              isDraggable={true}
              isResizable={false}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
              rowHeight={240}
              margin={[20, 20]}
              containerPadding={[20, 20]}
              useCSSTransforms={true}
              draggableHandle=".drag-handle"
            >
              {filteredProjects.map((project) => (
                <div 
                  key={`${project.framework}-${project.id}`} 
                  className="project-grid-item"
                >
                  <ProjectWidget
                    {...project}
                    buttonText={project.buttonText || "View Project"}
                    routePrefix={project.framework === "react" ? "/react-projects" : "/projects"}
                    showCategory={true}
                    titleExtra={
                      project.framework === "react" ? (
                        <FaReact className="text-blue-500 flex-shrink-0" size={24} />
                      ) : null
                    }
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
          )
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">No projects match the selected filters.</p>
          </div>
        )}
      </div>

      <style>{`
        html, body, #root {
          height: auto !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        .layout {
          position: relative;
          width: 100%;
        }

        .react-grid-layout {
          position: relative;
          transition: height 200ms ease;
        }

        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top, width, height;
        }

        .react-grid-item.react-grid-placeholder {
          background: rgba(27, 105, 250, 0.2);
          border-radius: 0.75rem;
          opacity: 0.8;
          transition-duration: 100ms;
          z-index: 2;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          user-select: none;
        }

        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 3;
          opacity: 0.8;
        }

        .react-grid-item.cssTransforms {
          transition-property: transform;
        }

        .react-grid-item.resizing {
          z-index: 1;
          will-change: width, height;
        }

        .project-grid-item {
          width: 100%;
          height: 100%;
          display: flex;
          min-height: 480px;
        }

        .project-grid-item > div {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .text-gradient {
          background-image: linear-gradient(to right, #1B69FA, #1B44FA);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default PortfolioPreview;
