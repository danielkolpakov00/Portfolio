import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ProjectWidget from "../ProjectWidget"; // Adjust path if needed

const ResponsiveGridLayout = WidthProvider(Responsive);

const AboutMePortfolioSection = ({ section, projects, sectionRef }) => {
  const [mounted, setMounted] = useState(false);

  // Set mounted after initial render to avoid SSR issues with measurements
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate layouts for the grid - memoized with useCallback
  const generateLayout = useCallback(() => {
    const cols = { lg: 2, md: 2, sm: 2, xs: 1, xxs: 1 };
    const layouts = {};
    
    Object.keys(cols).forEach(breakpoint => {
      const colNum = cols[breakpoint];
      layouts[breakpoint] = projects.slice(0, 4).map((project, i) => {
        return {
          i: `${project.id}`,
          x: i % colNum,
          y: Math.floor(i / colNum),
          w: 1,
          h: 2,
          static: false
        };
      });
    });
    
    return layouts;
  }, [projects]); // Only recreate when projects change

  // Memoize the layouts to prevent unnecessary recalculations
  const memoizedLayouts = useMemo(() => generateLayout(), [generateLayout]);

  return (
    <motion.section
      ref={sectionRef}
      className="mb-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2 text-blue2">{section.title}</h2>
        <p className="text-xl text-gray-600">{section.description}</p>
      </div>

      {/* Boxes content - non-projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {section.boxes.map((box, i) => (
          <div
            key={i}
            className={`p-8 rounded-xl shadow-lg ${box.className || ""}`}
          >
            <h3 className="text-2xl font-bold mb-3">{box.heading}</h3>
            <p>{box.description}</p>
          </div>
        ))}
      </div>

      {/* Projects grid with draggable functionality */}
      {mounted && (
        <ResponsiveGridLayout
          className="layout"
          layouts={memoizedLayouts}
          isDraggable={true}
          isResizable={false}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 2, md: 2, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={250}
          margin={[20, 20]}
          containerPadding={[20, 20]}
          useCSSTransforms={true}
          draggableHandle=".drag-handle"
        >
          {projects.slice(0, 4).map((project) => (
            <div 
              key={`${project.id}`}
              className="project-grid-item"
            >
              <ProjectWidget 
                {...project} 
                showCategory={true}
                category={project.category || "web"}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}

      <style>{`
        .project-grid-item {
          width: 100%;
          height: 100%;
          display: flex;
          min-height: 480px;
        }

        .project-grid-item > div {
          flex: 1;
        }

        .react-grid-item {
          transition-property: left, top, width, height;
        }

        .react-grid-item.react-grid-placeholder {
          background: rgba(27, 105, 250, 0.2);
          border-radius: 0.75rem;
          opacity: 0.8;
          transition-duration: 100ms;
          z-index: 2;
          user-select: none;
        }

        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 3;
          opacity: 0.8;
        }
      `}</style>
    </motion.section>
  );
};

export default AboutMePortfolioSection;
