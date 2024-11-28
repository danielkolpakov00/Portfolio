// src/PortfolioPreview.jsx
import React from 'react';
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

];

const PortfolioPreview = () => {
  return (
    <div className="px-4 lg:px-8 py-12 bg-offwhite">
      <section className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-center text-blue-700 italic -mt-12">My Portfolio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div
                className="rounded-lg h-36 flex items-center justify-center mb-4"
                style={{ backgroundColor: project.color }}
              >
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">{project.description}</p>
              <Link to={`/projects/${project.id}`}>
                <button
                  className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300"
                  aria-label={`View details of ${project.title}`}
                >
                  {project.buttonText}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPreview;