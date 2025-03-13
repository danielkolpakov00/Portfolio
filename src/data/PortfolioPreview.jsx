// src/PortfolioPreview.jsx
import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import YellowSphere from "./YellowSphere";
import PlinkoPreview from "./PlinkoPreview";
import BedroomPreview from "./BedroomScenePreview";
import MusicPreview from "./MusicPreview";
import TsParticles from "./components/TsParticles";
import { Link } from "react-router-dom";
import "./index.css";
import ProjectWidget from "./ProjectWidget";  // Changed from "./components/ProjectWidget"
import { FaReact, FaJs } from "react-icons/fa";
import projectsData from './data/projects.json';

gsap.registerPlugin(ScrollTrigger);

// Map visual components to their imported references
const visualComponents = {
  "YellowSphere": YellowSphere,
  "PlinkoPreview": PlinkoPreview,
  "BedroomPreview": BedroomPreview,
  "MusicPreview": MusicPreview
};

// Replace hardcoded projects with data from JSON
const projects = projectsData.vanillaProjects.map(project => ({
  ...project,
  visual: visualComponents[project.visualComponent]
}));

const PortfolioPreview = () => {
  const [reactProjects, setReactProjects] = useState(() => {
    // Try to get cached data from localStorage first
    const cached = localStorage.getItem('reactProjects');
    return cached ? JSON.parse(cached) : [];
  });
  const [showIndicator, setShowIndicator] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeFramework, setActiveFramework] = useState("all");
  
  // Get unique categories from all projects
  const allCategories = ["all", ...new Set([
    ...projects.map(project => project.category || "other"),
    ...reactProjects.map(project => project.category || "other")
  ])];

  // Define framework options
  const frameworkOptions = ["all", "vanilla", "react"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // You can still fetch dynamic react projects if needed
        // or modify to use the JSON file directly
        const response = await fetch('/react-projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        const data = await response.json();
        setReactProjects(data.projects);
        // Cache the fetched data
        localStorage.setItem('reactProjects', JSON.stringify(data.projects));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    fetchProjects();
  }, []);

  // Function to filter projects based on activeFilter and activeFramework
  const filterProjects = (projectsList) => {
    return projectsList.filter(project => {
      const categoryMatch = activeFilter === "all" || project.category === activeFilter;
      const frameworkMatch = activeFramework === "all" || project.framework === activeFramework;
      return categoryMatch && frameworkMatch;
    });
  };

  // New scroll event to hide the "React Projects" button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) { // adjust threshold as needed
        setShowIndicator(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced Filter Pills Component for Categories with better visibility
  const CategoryFilterPills = () => (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-center text-white font-medium text-lg">
        Filter by Category
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {allCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 ${
              activeFilter === category 
                ? "bg-blue-600 border-white text-white" 
                : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:border-gray-400"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const FrameworkFilterPills = () => (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-center text-white font-medium text-lg">
        Filter by Framework
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {frameworkOptions.map(framework => (
          <button
            key={framework}
            onClick={() => setActiveFramework(framework)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 border-2 ${
              activeFramework === framework 
                ? "bg-blue-600 border-white text-white" 
                : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:border-gray-400"
            }`}
          >
            {framework === "react" && <FaReact />}
            {framework === "vanilla" && <FaJs />}
            {framework.charAt(0).toUpperCase() + framework.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const allProjects = [
    ...projects.map(proj => ({ ...proj, framework: proj.framework || "vanilla" })),
    ...reactProjects.map(project => ({
      ...project,
      framework: project.framework || "react",
      visual: () => (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      ),
      routePrefix: "/react-projects",
      buttonText: "View Project",
      color: "#284af7"
    }))
  ];

  // Log some debugging information
  useEffect(() => {
    console.log("Active Framework:", activeFramework);
    console.log("Active Category:", activeFilter);
    console.log("All Projects:", allProjects);
  }, [activeFramework, activeFilter, allProjects]);

  const filteredProjects = allProjects.filter(project => {
    const categoryMatch = activeFilter === "all" || project.category === activeFilter;
    const frameworkMatch = activeFramework === "all" || project.framework === activeFramework;
    return categoryMatch && frameworkMatch;
  });

  // Separate filtered projects by framework
  const filteredVanillaProjects = filteredProjects.filter(project => project.framework === "vanilla");
  const filteredReactProjects = filteredProjects.filter(project => project.framework === "react");

  return (
    <div className="relative">
      <TsParticles />
      <h2
        className="text-center text-6xl font-georama text-white font-bold italic mb-6"
        style={{
          textShadow: "2px 2px #1B69FA, -2px -2px #1B69FA"
        }}
      >
        My Work
      </h2>
      
      {/* Filter section with enhanced visibility */}
      <div className="mb-12 px-4 py-6 bg-gray-900 bg-opacity-70 rounded-lg mx-auto max-w-4xl">
        <h3 className="text-2xl text-white mb-4 text-center">Filter Projects</h3>
        <div className="flex flex-wrap gap-4 justify-center">
        <CategoryFilterPills />
        <FrameworkFilterPills />
        </div>
      </div>

      <aside className="fixed top-1/2 right-4 z-50 flex items-center justify-center">
        <div
          className={`cursor-pointer flex flex-col items-center transition-opacity duration-300 ${showIndicator ? "opacity-80" : "opacity-0 pointer-events-none"}`}
          onClick={() => {
            setShowIndicator(false);
            document
              .getElementById("react-projects")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          role="link"
          tabIndex={0}
          aria-label="Scroll to React Projects"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setShowIndicator(false);
              document
                .getElementById("react-projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600 transform rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <span className="mt-2 text-sm text-blue-600">React Projects</span>
        </div>
      </aside>

      {/* Vanilla JS Projects */}
      {(activeFramework === "all" || activeFramework === "vanilla") && (
        <section aria-labelledby="vanilla-projects" className="mb-16 px-4">
          <h3 id="vanilla-projects" className="text-3xl text-white mb-6 flex items-center gap-2">
            <FaJs className="text-yellow-400" /> Vanilla JavaScript Projects
          </h3>
          {filteredVanillaProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mx-auto w-full max-w-6xl">
              {filteredVanillaProjects.map((project) => (
                <div key={project.id} className="relative min-h-[400px]">
                  <ProjectWidget 
                    {...project} 
                    showCategory={true}
                    category={project.category} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white text-lg p-8 bg-gray-800 bg-opacity-50 rounded-lg">
              No vanilla JS projects match the current filters.
            </p>
          )}
        </section>
      )}

      {/* React Projects */}
      {(activeFramework === "all" || activeFramework === "react") && (
        <section aria-labelledby="react-projects" id="react-projects" className="mb-16 px-4">
          <h3 id="react-projects" className="text-3xl text-white mb-6 flex items-center gap-2">
            <FaReact className="text-blue-400" /> React Projects
          </h3>
          {filteredReactProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mx-auto w-full max-w-6xl">
              {filteredReactProjects.map((project) => (
                <div key={project.id} className="relative min-h-[400px]">
                  <div className="absolute top-2 right-2 z-10">
                    <FaReact className="text-blue-400" size={24} />
                  </div>
                  <ProjectWidget
                    {...project}
                    showCategory={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white text-lg p-8 bg-gray-800 bg-opacity-50 rounded-lg">
              No React projects match the current filters.
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default PortfolioPreview;
