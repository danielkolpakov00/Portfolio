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
      "Using a physics engine, I made a fun and interesting Plinko game, and balanced it as much as possible using y-axis forces and testing peg layouts.",
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
  const [reactProjects, setReactProjects] = useState([]);
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    fetch('/react-projects.json')
      .then(res => res.json())
      .then(data => setReactProjects(data.projects));
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
        <h3
          id="vanilla-projects"
          className="text-3xl text-white mb-6"
        >
          Vanilla JavaScript Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id}>
              <ProjectWidget {...project} />
            </div>
          ))}
        </div>
      </section>

      {/* React Projects */}
      <section aria-labelledby="react-projects" id="react-projects" className="mb-16 px-4">
        <h3
          id="react-projects"
          className="text-3xl text-white mb-6"
        >
          React Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reactProjects.map((project) => (
            <div key={project.id}>
              <ProjectWidget
                {...project}
                buttonText="View Project"
                color="#284af7"
                routePrefix="/react-projects" // pass custom route prefix
                visual={project.visual || (() => (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <span className="text-blue-600 text-xl">React Project</span>
                  </div>
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
