// src/PortfolioPreview.jsx
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WeatherPreview from "./WeatherPreview";
import PlinkoPreview from "./PlinkoPreview";
import BedroomPreview from "./BedroomScenePreview";
import MusicPreview from "./MusicPreview";
import TsParticles from "./components/TsParticles";
import { Link } from "react-router-dom";
import "./index.css";
import ProjectWidget from "./components/ProjectWidget";  // Fix import path
import { FaReact } from "react-icons/fa";
import projectsData from './data/projects.json';

gsap.registerPlugin(ScrollTrigger);

// Map visual components to their imported references
const visualComponents = {
  "WeatherPreview": WeatherPreview,
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
  const [activeFrameworkFilter, setActiveFrameworkFilter] = useState("all");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Refs for the project containers
  const vanillaContainerRef = useRef(null);
  const reactContainerRef = useRef(null);
  
  // Get unique categories from all projects
  const allCategories = ["all", ...new Set([
    ...projects.map(project => project.category || "other"),
    ...reactProjects.map(project => project.category || "other")
  ])];

  // Define available frameworks
  const frameworks = ["all", "vanilla", "react"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // You can still fetch dynamic react projects if needed
        // or modify to use the JSON file directly
        const response = await fetch('/react-projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        const data = await response.json();
        
        // Add framework property to react projects if not present
        const processedProjects = data.projects.map(project => ({
          ...project,
          framework: project.framework || "react" // Ensure framework is set to "react"
        }));
        
        setReactProjects(processedProjects);
        // Cache the fetched data
        localStorage.setItem('reactProjects', JSON.stringify(processedProjects));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    fetchProjects();
  }, []);

  // Debug logging to see if frameworks are set correctly
  useEffect(() => {
    console.log('Vanilla projects:', projects);
    console.log('React projects:', reactProjects);
  }, [reactProjects]);

  // Function to filter projects based on activeFilter and activeFrameworkFilter
  const filterProjects = (projectsList, framework) => {
    return projectsList.filter(project => {
      // Check if project has category that matches the filter or if filter is "all"
      const categoryMatch = activeFilter === "all" || project.category === activeFilter;
      
      // For framework filter, check both explicit framework property and the provided framework
      const frameworkMatch = activeFrameworkFilter === "all" || 
                             project.framework === activeFrameworkFilter ||
                             framework === activeFrameworkFilter;
      
      return categoryMatch && frameworkMatch;
    });
  };

  // Handle filter changes with smooth transitions
  const handleFilterChange = (category) => {
    if (category === activeFilter) return;
    
    setIsTransitioning(true);
    
    // Animate out current projects
    const vanillaProjects = vanillaContainerRef.current?.querySelectorAll('.project-card') || [];
    const reactProjects = reactContainerRef.current?.querySelectorAll('.project-card') || [];
    
    const allProjects = [...vanillaProjects, ...reactProjects];
    
    gsap.to(allProjects, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.3,
      onComplete: () => {
        // Change the filter after fade out
        setActiveFilter(category);
        
        // Short delay to allow state to update
        setTimeout(() => {
          // Animate new projects in
          const newVanillaProjects = vanillaContainerRef.current?.querySelectorAll('.project-card') || [];
          const newReactProjects = reactContainerRef.current?.querySelectorAll('.project-card') || [];
          
          const newAllProjects = [...newVanillaProjects, ...newReactProjects];
          
          gsap.fromTo(newAllProjects, 
            { opacity: 0, y: 20 },
            { 
              opacity: 1, 
              y: 0, 
              stagger: 0.05, 
              duration: 0.3,
              onComplete: () => setIsTransitioning(false)
            }
          );
        }, 100);
      }
    });
  };
  
  // Handle framework filter changes with smooth transitions
  const handleFrameworkFilterChange = (framework) => {
    if (framework === activeFrameworkFilter) return;
    
    setIsTransitioning(true);
    
    // Animate out current projects
    const vanillaProjects = vanillaContainerRef.current?.querySelectorAll('.project-card') || [];
    const reactProjects = reactContainerRef.current?.querySelectorAll('.project-card') || [];
    
    const allProjects = [...vanillaProjects, ...reactProjects];
    
    gsap.to(allProjects, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.3,
      onComplete: () => {
        // Change the filter after fade out
        setActiveFrameworkFilter(framework);
        
        // Short delay to allow state to update
        setTimeout(() => {
          // Animate new projects in
          const newVanillaProjects = vanillaContainerRef.current?.querySelectorAll('.project-card') || [];
          const newReactProjects = reactContainerRef.current?.querySelectorAll('.project-card') || [];
          
          const newAllProjects = [...newVanillaProjects, ...newReactProjects];
          
          gsap.fromTo(newAllProjects, 
            { opacity: 0, y: 20 },
            { 
              opacity: 1, 
              y: 0, 
              stagger: 0.05, 
              duration: 0.3,
              onComplete: () => setIsTransitioning(false)
            }
          );
        }, 100);
      }
    });
  };
  
  // Set up initial animations when component mounts
  useEffect(() => {
    const vanillaProjects = vanillaContainerRef.current?.querySelectorAll('.project-card') || [];
    const reactProjects = reactContainerRef.current?.querySelectorAll('.project-card') || [];
    
    gsap.fromTo(
      [...vanillaProjects, ...reactProjects],
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.05, 
        duration: 0.5,
        delay: 0.2
      }
    );
  }, [reactProjects]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) { // adjust threshold as needed
        setShowIndicator(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter Pills Component with updated onClick handlers
  const FilterPills = () => (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {allCategories.map(category => (
        <button
          key={category}
          onClick={() => handleFilterChange(category)}
          disabled={isTransitioning}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === category 
              ? "bg-blue2 text-white opacity-80" 
              : "bg-blue1 text-white hover:bg-gray-700 opacity-80"
          } ${isTransitioning ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {category}
        </button>
      ))}
    </div>
  );

  // Framework Filter Pills Component with updated onClick handlers
  const FrameworkFilterPills = () => (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {frameworks.map(framework => (
        <button
          key={framework}
          onClick={() => handleFrameworkFilterChange(framework)}
          disabled={isTransitioning}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFrameworkFilter === framework 
              ? "bg-blue2 text-white opacity-80" 
              : "bg-blue1 text-white hover:bg-gray-700 opacity-80"
          } ${isTransitioning ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {framework.charAt(0).toUpperCase() + framework.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <TsParticles />
      <h2
        className="text-center text-6xl text-blue2 font-bold mb-6"
      >
        My Work
      </h2>
      
      <div className="mb-4">
        <h4 className="text-center text-white text-lg mb-2">Filter by Category</h4>
        <FilterPills />
      </div>
      
      <div className="mb-8">
        <h4 className="text-center text-white text-lg mb-2">Filter by Framework</h4>
        <FrameworkFilterPills />
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

      {/* Both sections always present for animation purposes, but visually hidden when not active */}
      <section 
        aria-labelledby="vanilla-projects" 
        className="mb-16 px-4"
        style={{ 
          display: (activeFrameworkFilter === "all" || activeFrameworkFilter === "vanilla") ? "block" : "none" 
        }}
      >
        <h3 id="vanilla-projects" className="text-3xl text-white mb-6">
          Vanilla JavaScript Projects
        </h3>
        <div 
          ref={vanillaContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mx-auto w-full max-w-6xl transition-all duration-500 ease-in-out"
        >
          {filterProjects(projects, "vanilla").map((project) => (
            <div key={project.id} className="relative h-[500px] project-card transition-all duration-300">
              <ProjectWidget 
                {...project} 
                showCategory={true}
                category={project.category} 
              />
            </div>
          ))}
        </div>
      </section>

      <section 
        aria-labelledby="react-projects" 
        id="react-projects" 
        className="mb-16 px-4"
        style={{ 
          display: (activeFrameworkFilter === "all" || activeFrameworkFilter === "react") ? "block" : "none" 
        }}
      >
        <h3 id="react-projects" className="text-3xl text-white mb-6">
          React Projects
        </h3>
        <div 
          ref={reactContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mx-auto w-full max-w-6xl transition-all duration-500 ease-in-out"
        >
          {filterProjects(reactProjects, "react").map((project) => (
            <div key={project.id} className="relative h-[500px] project-card transition-all duration-300">
              <div className="absolute bottom-1/ right-2 z-10">
                <FaReact className="text-blue-400" size={24} />
              </div>
              <ProjectWidget
                {...project}
                buttonText="View Project"
                color="#284af7"
                routePrefix="/react-projects"
                showCategory={true}
                visual={project.visual || (() => (
                  <img
                    src={project.image || "/path/to/default/react-image.png"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ))}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPreview;
