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
import ProjectWidget from "./components/ProjectWidget";
import { FaReact } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "Weather API Project",
    description:
      "I built a Three.js scene that grabs weather data from OpenWeather API and displays the current temperature in Vancouver.",
    buttonText: "Check it out!",
    color: "#284af7",
    visual: YellowSphere,
  },
  {
    id: 2,
    title: "Matter.js Plinko",
    description:
      "Using a physics engine, I made a Plinko game and balanced it as much as possible using y-axis forces and testing peg layouts.",
    buttonText: "Check it out!",
    color: "#284af7",
    visual: PlinkoPreview,
  },
  {
    id: 3,
    title: "3D Bedroom Scene",
    description:
      "As I have a desire for learning 3D design, I created a Three.js scene that resembles a bedroom.",
    buttonText: "Check it out!",
    color: "#284af7",
    visual: BedroomPreview,
  },
  {
    id: 4,
    title: "Music Visualizer",
    description:
      "I created a music visualizer using Three.js and Web Audio API. The visualizer reacts to the music and creates a unique visual experience.",
    buttonText: "Check it out!",
    color: "#284af7",
    visual: MusicPreview,
  },
];

const PortfolioPreview = () => {
  const [reactProjects, setReactProjects] = useState(() => {
    // Try to get cached data from localStorage first
    const cached = localStorage.getItem('reactProjects');
    return cached ? JSON.parse(cached) : [];
  });
  const [showIndicator, setShowIndicator] = useState(true);

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
      <h2
        className="text-center text-6xl font-georama text-white font-bold italic mb-12"
        style={{
          textShadow: "2px 2px #1B69FA, -2px -2px #1B69FA"
        }}
      >
        My Work
      </h2>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mx-auto w-full max-w-6xl">
          {projects.map((project) => (
            <div key={project.id} className="relative min-h-[400px]">
              <ProjectWidget {...project} />
            </div>
          ))}
        </div>
      </section>

      {/* React Projects */}
      <section aria-labelledby="react-projects" id="react-projects" className="mb-16 px-4">
        <h3 id="react-projects" className="text-3xl text-white mb-6">
          React Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mx-auto w-full max-w-6xl">
          {reactProjects.map((project) => (
            <div key={project.id} className="relative min-h-[400px]">
              <div className="absolute top-2 right-2 z-10">
                <FaReact className="text-blue1" size={24} />
              </div>
              <ProjectWidget
                {...project}
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
      </section>
    </div>
  );
};

export default PortfolioPreview;
