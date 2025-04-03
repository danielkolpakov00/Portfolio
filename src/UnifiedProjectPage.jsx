import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UnifiedProjectPage = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const isReactProject = window.location.hash.includes('/react-projects/');
        const projectsUrl = isReactProject ? '/react-projects.json' : '/projects.json';
        const response = await fetch(projectsUrl);
        if (!response.ok) throw new Error('Failed to load projects');
        const data = await response.json();
        const project = isReactProject
          ? data.projects.find((p) => p.id === id)
          : data.find((p) => p.id === parseInt(id));
        if (!project) throw new Error('Project not found');
        setProjectData(project);
      } catch (err) {
        setError(err.message);
      }
    };
    loadProject();
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!projectData) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-600">{projectData.title}</h1>
        <p className="text-lg text-gray-500 mt-2">{projectData.date || 'Date not available'}</p>
        <p className="text-xl text-gray-700 mt-6">{projectData.description}</p>
      </header>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6">Overview</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <p className="text-lg text-gray-700 flex-1">{projectData.overview || 'Overview not available'}</p>
          {projectData.imageUrl && (
            <img
              src={projectData.imageUrl}
              alt={projectData.title}
              className="w-full md:w-1/2 rounded-lg shadow-md border border-gray-200"
            />
          )}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6">Tech Stack</h2>
        <ul className="list-disc list-inside space-y-4">
          {projectData.techStack?.map((tech, index) => (
            <li key={index} className="text-lg text-gray-700">
              {tech}
            </li>
          )) || <p className="text-gray-500">No tech stack available</p>}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6">View Live</h2>
        <div className="relative border rounded-lg overflow-hidden shadow-md">
          {projectData.demoUrl ? (
            <iframe
              src={projectData.demoUrl}
              title="Live Demo"
              className="w-full h-96 border-0"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-center text-gray-500 py-4">Demo not available</p>
          )}
          {projectData.liveUrl && (
            <a
              href={projectData.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              View Live
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default UnifiedProjectPage;