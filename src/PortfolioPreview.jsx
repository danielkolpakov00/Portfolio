// src/PortfolioPreview.jsx
import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import ReactDOM from 'react-dom/client';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

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
import LoadingScreen from "./components/LoadingScreen"; // Import LoadingScreen component
// Import Dither with lazy loading to prevent immediate errors
import Dither from "./components/ReactBits/Dither";

// Enhanced global reference to track Dither component loading with more reliable loading detection
const ditherLoadingState = {
  isLoaded: false,
  isInitialized: false,
  isRendered: false,
  callbacks: []
};

// Signal to the main component that the Dither effect has been initialized
window.ditherInitialized = () => {
  console.log('Dither shader initialized and ready!');
  ditherLoadingState.isInitialized = true;
  
  // Check if we're fully loaded
  if (ditherLoadingState.isRendered) {
    ditherLoadingState.isLoaded = true;
    // Call any registered callbacks
    if (ditherLoadingState.callbacks.length > 0) {
      console.log('Calling registered callbacks after initialization');
      ditherLoadingState.callbacks.forEach(cb => cb());
      ditherLoadingState.callbacks = [];
    }
  }
};

// Signal that Dither has fully rendered a frame
window.ditherRendered = () => {
  console.log('Dither effect rendered first frame!');
  ditherLoadingState.isRendered = true;
  
  // Mark as fully loaded when both initialized and rendered
  if (ditherLoadingState.isInitialized) {
    ditherLoadingState.isLoaded = true;
    if (ditherLoadingState.callbacks.length > 0) {
      console.log('Calling registered callbacks after render');
      ditherLoadingState.callbacks.forEach(cb => cb());
      ditherLoadingState.callbacks = [];
    }
  }
};

// Improved preload Dither component function
const preloadDither = () => {
  return new Promise((resolve) => {
    if (ditherLoadingState.isLoaded) {
      resolve();
      return;
    }

    ditherLoadingState.callbacks.push(resolve);
    
    // Create a hidden container for preloading
    const preloadContainer = document.createElement('div');
    preloadContainer.id = 'dither-preload-container';
    preloadContainer.style.position = 'fixed';
    preloadContainer.style.top = '-9999px';
    preloadContainer.style.left = '-9999px';
    preloadContainer.style.width = '300px'; // Larger for better initialization
    preloadContainer.style.height = '300px';
    preloadContainer.style.opacity = '0.01'; // Almost invisible but still rendered
    preloadContainer.style.pointerEvents = 'none';
    preloadContainer.style.zIndex = '-1000';
    document.body.appendChild(preloadContainer);
    
    // Create a real Dither component with callbacks
    const ditherProps = {
      waveSpeed: 0.1,
      waveFrequency: 1.0,
      waveAmplitude: 0.1,
      colorNum: 2,
      pixelSize: 8, // Larger pixels for faster loading
      disableAnimation: false, // Need animation for proper initialization
      enableMouseInteraction: false,
      className: "w-full h-full",
      onInitialize: () => window.ditherInitialized(),
      onFirstRender: () => window.ditherRendered()
    };
    
    try {
      // Add the Dither component to our hidden container
      const root = ReactDOM.createRoot(preloadContainer);
      root.render(
        <Suspense fallback={null}>
          <ModifiedDither {...ditherProps} />
        </Suspense>
      );
      
      // Failsafe: mark as loaded after a maximum timeout
      setTimeout(() => {
        if (!ditherLoadingState.isLoaded) {
          console.log('Dither preload timeout reached - forcing completion');
          ditherLoadingState.isLoaded = true;
          ditherLoadingState.callbacks.forEach(cb => cb());
          ditherLoadingState.callbacks = [];
        }
        
        // Try to clean up container but don't remove it right away to ensure rendering completes
        setTimeout(() => {
          try {
            if (document.body.contains(preloadContainer)) {
              document.body.removeChild(preloadContainer);
            }
          } catch (e) {
            console.log('Error cleaning up preload container', e);
          }
        }, 2000);
      }, 8000); // Increase timeout to ensure it has enough time
    } catch (err) {
      console.error('Error preloading Dither:', err);
      
      // Mark as loaded anyway after a delay
      setTimeout(() => {
        ditherLoadingState.isLoaded = true;
        ditherLoadingState.callbacks.forEach(cb => cb());
        ditherLoadingState.callbacks = [];
      }, 2000);
    }
  });
};

// Error boundary to catch React reconciliation errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

// Enhanced fallback component with more information
const DitherFallback = ({ className, errorMessage }) => (
  <div className={`${className} bg-blue-900/20 flex items-center justify-center flex-col p-2`}>
    <div className="text-white text-opacity-60 text-center">
      {errorMessage || "Loading effect..."}
    </div>
  </div>
);

// Create a memoized static component that won't rerender
const StaticDitherEffect = React.memo(() => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Mark as loaded when the component mounts successfully
    setIsLoaded(true);
    ditherLoadingState.isLoaded = true;
  }, []);
  
  try {
    return (
      <Dither 
        waveSpeed={0.4}
        waveFrequency={1.5}
        waveAmplitude={0.15}
        waveColor={[0.2, 0.4, 0.8]}
        colorNum={4}
        pixelSize={2}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0}
        disableHover={true}
        preventHoverEvents={true}
        optimizeRendering={true}
        forceStatic={true}
        isolateFromDomEvents={true}
        shouldComponentUpdate={false}
      />
    );
  } catch (error) {
    console.error("Error rendering Dither:", error);
    return null;
  }
}, () => true); // Always return true to prevent rerendering

// Modified Dither component with callbacks for initialization and rendering
const ModifiedDither = React.memo((props) => {
  const [frameRendered, setFrameRendered] = useState(false);
  
  useEffect(() => {
    // Signal initialization
    if (props.onInitialize) {
      // Short delay to ensure component is mounted
      setTimeout(props.onInitialize, 200);
    }
    
    // Signal first render after a reasonable delay for shaders to compile
    if (props.onFirstRender && !frameRendered) {
      const timer = setTimeout(() => {
        setFrameRendered(true);
        props.onFirstRender();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [props, frameRendered]);
  
  return <Dither {...props} />;
});

// Updated BlissWithDither component with better error handling and preloading support
const BlissWithDither = ({ className }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ditherError, setDitherError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Handle dither component errors
  const handleDitherError = useCallback(() => {
    console.log("Dither component failed to load, falling back to static image");
    setDitherError(true);
  }, []);

  // Use a simpler approach that's less likely to cause reconciliation issues
  return (
    <div ref={ref} className={`${className} relative w-full h-full overflow-hidden`}>
      {/* Base bliss.jpg image with increased brightness */}
      <img
        src="/assets/bliss.jpg"
        alt="Windows XP Bliss"
        onLoad={() => setImageLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(1.6)' }} // Increased brightness filter
      />
      
      {/* Only attempt to render the Dither component if all conditions are met */}
      {imageLoaded && inView && !ditherError && (
        <ErrorBoundary 
          fallback={
            <DitherFallback 
              className="absolute inset-0" 
              errorMessage="Failed to load special effect" 
            />
          }
          onError={handleDitherError}
        >
          <Suspense fallback={<DitherFallback className="absolute inset-0" />}>
            <div 
              className="absolute inset-0 z-10 opacity-50 pointer-events-none mix-blend-multiply"
              style={{
                pointerEvents: 'none',
                touchAction: 'none',
                userSelect: 'none',
                isolation: 'isolate'
              }}
            >
              {/* Using React.memo with a static component to prevent rerendering */}
              <StaticDitherEffect />
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
      
      {/* Scanlines - always show these regardless of dither effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 4px',
          opacity: 0.15
        }}
      />
      
      {/* Windows XP logo */}
     
    </div>
  );
};

const ResponsiveGridLayout = WidthProvider(Responsive);

const visualComponents = {
  "WeatherPreview": WeatherPreview,
  "PlinkoPreview": PlinkoPreview,
  "BedroomPreview": BedroomPreview,
  "MusicPreview": MusicPreview,
  "MailPreview": MailPreview,
};

// Memoize the Iridescence component to prevent unnecessary re-renders
const MemoizedIridescence = React.memo(Iridescence);

// Memoize TsParticles to prevent unnecessary re-renders
const MemoizedTsParticles = React.memo(TsParticles);

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
  const [loadedVisuals, setLoadedVisuals] = useState(new Set());
  const [totalVisuals, setTotalVisuals] = useState(0);
  const [ditherPreloaded, setDitherPreloaded] = useState(false);

  // Handle visual loading completion
  const handleVisualLoaded = useCallback((id) => {
    setLoadedVisuals(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  // Load and map projects
  useEffect(() => {
    // Skip the preloadDither function completely and set ditherPreloaded directly
    setDitherPreloaded(true);
    console.log('Setting ditherPreloaded to true immediately');

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
          // Special case for lastfm-app to apply dither effect to bliss.jpg
          if (project.id === "lastfm-app") {
            const LastfmVisual = ({ onLoad }) => {
              // Force immediate load signal
              React.useEffect(() => {
                if (onLoad) {
                  console.log('LastFM visual mounted, signaling load');
                  onLoad();
                }
              }, []);
              
              return <BlissWithDither className="w-full h-full" />;
            };

            return { ...project, framework: "react", visual: LastfmVisual };
          }

          if (project.id === "gradient-generator") {
            const GradientVisual = ({ containerRef, containerSize, onLoad }) => {
              // Force immediate load signal
              React.useEffect(() => {
                if (onLoad) {
                  console.log('Gradient generator visual mounted, signaling load');
                  onLoad();
                }
              }, []);
              
              return (
                <div className="w-full h-full" style={{ overflow: 'hidden' }}>
                  <MemoizedIridescence color={[0.4, 0.4, 1]} speed={0.8} amplitude={0.2} />
                </div>
              );
            };
            return { ...project, framework: "react", visual: GradientVisual };
          }

          const ImageVisual = ({ containerRef, containerSize, onLoad }) => {
            // Force immediate load signal
            React.useEffect(() => {
              if (onLoad) {
                console.log(`Image visual for ${project.id} mounted, signaling load`);
                onLoad();
              }
            }, []);
            
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
                    <FaReact 
                      className="text-white" 
                      size={containerSize.width ? Math.min(60, containerSize.width / 4) : 40} 
                    />
                  </div>
                )}
              </div>
            );
          };

          return { ...project, framework: "react", visual: ImageVisual };
        });

        // First, put React projects first, then find NodeMailer project and move it to second position
        let allProjectsArray = [...reactProjects, ...vanillaProjects];
        
        // Find the NodeMailer project index
        const nodeMailerIndex = allProjectsArray.findIndex(p => 
          p.title && p.title.includes("NodeMailer")
        );
        
        // If NodeMailer exists and it's not already in the second position
        if (nodeMailerIndex !== -1 && nodeMailerIndex !== 1) {
          // Remove NodeMailer from its current position
          const nodeMailerProject = allProjectsArray.splice(nodeMailerIndex, 1)[0];
          
          // Insert NodeMailer at position 1 (second element)
          allProjectsArray.splice(1, 0, nodeMailerProject);
        }
        
        setAllProjects(allProjectsArray);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setAllProjects(vanillaProjects);
      } finally {
        // Simplified check that doesn't depend on ditherPreloaded
        setTimeout(() => {
          console.log('Hiding loading screen after timeout');
          setIsLoading(false);
        }, 2000);
      }
    };

    fetchReactProjects();
  }, []);

  // Update loading state when all visuals are loaded
  useEffect(() => {
    if (allProjects.length > 0) {
      // Count projects with visual components
      const projectsWithVisuals = allProjects.filter(project => project.visual).length;
      setTotalVisuals(projectsWithVisuals);
      
      console.log(`Tracking visuals: ${loadedVisuals.size}/${projectsWithVisuals} loaded`);
      
      // Check if all visuals are loaded
      if ((loadedVisuals.size >= projectsWithVisuals && projectsWithVisuals > 0) || projectsWithVisuals === 0) {
        console.log('All visuals loaded, dispatching event');
        setIsLoading(false);
        
        // Dispatch custom event to notify that all visuals are loaded
        const visualsLoadedEvent = new Event('visualsLoaded');
        window.dispatchEvent(visualsLoadedEvent);
        
        // Store in localStorage for future reference
        localStorage.setItem('visualsLoaded', 'true');
      }
    }
  }, [allProjects, loadedVisuals]);

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

  // Pass the visual loading handler to each ProjectWidget
  const renderProjectWidgets = () => {
    return filteredProjects.map((project) => (
      <div
        key={`${project.framework}-${project.id}`}
        className="project-grid-item"
      >
        <ProjectWidget
          {...project}
          buttonText={project.buttonText || "View Project"}
          routePrefix={project.framework === "react" ? "/react-projects" : "/projects"}
          showCategory={true}
          onVisualLoad={handleVisualLoaded}
          titleExtra={
            project.framework === "react" ? (
              <FaReact className="text-blue-500 flex-shrink-0" size={24} />
            ) : null
          }
        />
      </div>
    ));
  };

  // Loading state
  if (isLoading) {
    return <LoadingScreen isLoading={true} message="Loading projects..." />;
  }

  return (
    <div className="relative">
      <MemoizedTsParticles />

      <motion.h2
        className="text-center text-4xl sm:text-5xl md:text-6xl text-blue2 font-bold mb-6 sm:mb-10 mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-6 md:px-12"
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

      {/* Portfolio grid layout */}
      <div className="px-6 md:px-12 lg:px-16 py-10">
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
              margin={[12, 16]}
              containerPadding={[24, 24]}
              useCSSTransforms={true}
              draggableHandle=".drag-handle"
            >
              {renderProjectWidgets()}
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
          padding: 0 0.5rem;
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
