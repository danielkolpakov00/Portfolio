// src/PortfolioPreview.jsx
import React from 'react';
import YellowSphere from './YellowSphere';
import PlinkoPreview from './PlinkoPreview';
import BedroomPreview from './BedroomScenePreview';
import MusicPreview from './MusicPreview';
import { Link } from 'react-router-dom';

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
    <div className="px-4 lg:px-8 py-12 bg-offwhite">
      <section className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-center text-blue-700 italic -mt-12">My Portfolio</h2>
        {projects.map(project => (
          <div key={project.id} className="my-8">
            {project.title === 'Weather API Project' && <YellowSphere />}
            {project.title === 'Matter.js Plinko' && <PlinkoPreview />}
            {project.title === '3D Bedroom Scene' && <BedroomPreview />}
            {project.title === 'Music Visualizer' && <MusicPreview />}
            <h3 className="text-2xl font-semibold mt-4">{project.title}</h3>
            <p className="text-gray-700">{project.description}</p>
            <Link 
              to={`/projects/${project.id}`}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded inline-block hover:bg-blue-600 transition-colors"
            >
              {project.buttonText}   </Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PortfolioPreview;