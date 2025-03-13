// src/PortfolioPreview.jsx
import React, { useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import YellowSphere from "./YellowSphere";
import PlinkoPreview from "./PlinkoPreview";
import BedroomPreview from "./BedroomScenePreview";
import MusicPreview from "./MusicPreview";
import TsParticles from "./components/TsParticles";
import { Link } from "react-router-dom";
import "./index.css";
import ProjectWidget from "./components/ProjectWidget";
import { FaReact } from "react-icons/fa";
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
  const [activeTag, setActiveTag] = useState('all');

  // Extract all unique tags from both project types
  const allTags = useMemo(() => {
    const tagSet = new Set(['all']);
    
    // Add tags from vanilla projects
    projects.forEach(project => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    // Add tags from React projects
    reactProjects.forEach(project => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    return Array.from(tagSet);
  }, [reactProjects]);

  // Filter projects based on active tag
  const filteredVanillaProjects = useMemo(() => {
    if (activeTag === 'all') return projects;
    return projects.filter(project => 
      project.tags && project.tags.includes(activeTag)
    );
  }, [activeTag, projects]);

  const filteredReactProjects = useMemo(() => {
    if (activeTag === 'all') return reactProjects;
    return reactProjects.filter(project => 
      project.tags && project.tags.includes(activeTag)
    );
  }, [activeTag, reactProjects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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

  return (
    <div className="relative">
      <TsParticles />
      <h3

     
      >
        My Work
      </h3>

      {/* Project Filter Pills */}
      <div className="flex justify-center flex-wrap gap-2 mb-8 px-4">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeTag === tag 
                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            {tag === 'all' ? 'All Projects' : tag}
          </button>
        ))}
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
      <section aria-labelledby="vanilla-projects" className="mb-16 px-4">
        <h3 id="vanilla-projects" className="text-3xl text-white mb-6">
          Vanilla JavaScript Projects
        </h3>
        {filteredVanillaProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mx-auto w-full max-w-6xl">
            {filteredVanillaProjects.map((project) => (
              <div key={project.id} className="relative min-h-[400px]">
                <ProjectWidget {...project} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white text-lg">
            No vanilla JavaScript projects match the selected filter.
          </p>
        )}
      </section>

      {/* React Projects */}
      <section aria-labelledby="react-projects" id="react-projects" className="mb-16 px-4">
        <h3 id="react-projects" className="text-3xl text-white mb-6">
          React Projects
        </h3>
        {filteredReactProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mx-auto w-full max-w-6xl">
            {filteredReactProjects.map((project) => (
              <div key={project.id} className="relative min-h-[400px]">
                <div className="absolute bottom-1/ right-2 z-10">
                  <FaReact className="text-blue-400" size={24} />
                </div>
                <ProjectWidget
                  {...project}
                  {...project.description}
                  buttonText="View Project"
                  color="#284af7"
                  routePrefix="/react-projects"
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
        ) : (
          <p className="text-center text-white text-lg">
            No React projects match the selected filter.
          </p>
        )}
      </section>
    </div>
  );
};

export default PortfolioPreview;
