// src/PortfolioPreview.jsx
import React from 'react';
import YellowSphere from './YellowSphere';
import PlinkoPreview from './PlinkoPreview';
import BedroomPreview from './BedroomScenePreview';
import MusicPreview from './MusicPreview';
import { Link } from 'react-router-dom';
import './index.css';

const projects = [
  {
    id: 1,
    title: 'Weather API Project',
    description: 'I built a Three.js scene that grabs weather data from OpenWeather API and displays the current temperature in Vancouver.',
    buttonText: 'Check it out!',
    color: '#284af7',
  },
  {
    id: 2,
    title: 'Matter.js Plinko',
    description: 'Using a physics engine, I made a fun and interesting Plinko game, and balanced it as much as possible using y-axis forces and testing peg layouts.',
    buttonText: 'Check it out!',
    color: '#284af7',
  },
  {
    id: 3,
    title: '3D Bedroom Scene',
    description: 'As I have a desire for learning 3D design, I created a Three.js scene that resembles a bedroom.',
    buttonText: 'Check it out!',
    color: '#284af7',
  },
  {
    id: 4,
    title: 'Music Visualizer',
    description: 'I created a music visualizer using Three.js and Web Audio API. The visualizer reacts to the music and creates a unique visual experience.',
    buttonText: 'Check it out!',
    color: '#284af7',
  }
];

const PortfolioPreview = () => {
  return (
    <div className="px-4 lg:px-8 py-16 bg-offwhite">
      <style>
        {`
          .shine-effect {
            position: relative;
            overflow: hidden;
          }
          .shine-effect::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              to right,
              transparent 0%,
              rgba(255, 255, 255, 0.3) 50%,
              transparent 100%
            );
            transform: rotate(45deg);
            transition: all 0.5s;
            opacity: 0;
          }
          .shine-effect:hover::after {
            opacity: 1;
            transform: rotate(45deg) translate(50%, -100%);
          }
        `}
      </style>
      <h2 className="text-center text-6xl font-georama text-white font-bold italic mb-12"
          style={{ textShadow: '2px 2px 0px #1B69FA, -2px -2px 0px #1B69FA, 2px -2px 0px #1B69FA, -2px 2px 0px #1B69FA' }}>
        My Work
      </h2>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map(project => (
            <div key={project.id} 
                 className="bg-white rounded-xl shadow-lg hover:shadow-[0_8px_12px_-3px_rgba(27,105,250,0.3)] transition-all duration-300 overflow-hidden shine-effect">
              <div className="h-90 relative overflow-hidden">
                {project.title === 'Weather API Project' && <YellowSphere />}
                {project.title === 'Matter.js Plinko' && <PlinkoPreview />}
                {project.title === '3D Bedroom Scene' && <BedroomPreview />}
                {project.title === 'Music Visualizer' && <MusicPreview />}
              </div>
              <div className="p-6">
                <h3 className="text-4xl font-georama leading-relaxed mb-3 text-blue2">{project.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed font-georama">{project.description}</p>
                <Link 
                  to={`/projects/${project.id}`}
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
                           hover:bg-blue-700 transition-all duration-200
                           shadow-md hover:shadow-lg"
                >
                  {project.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;