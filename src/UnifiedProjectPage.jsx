import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { scheduleIdleTask } from './utils/performanceUtils';

// Lazy load the iframe component
const BasicIframe = lazy(() => import('./components/BasicIframe'));

// Fallback component for BasicIframe
const IframePlaceholder = () => (
  <div className="w-full h-96 bg-gray-100 animate-pulse flex items-center justify-center rounded-lg">
    <p className="text-gray-400">Loading preview...</p>
  </div>
);

const UnifiedProjectPage = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Track page load performance
    const pageStart = performance.now();
    
    const loadProject = async () => {
      try {
        // Determine which JSON file to load based on URL
        const isReactProject = window.location.hash.includes('/react-projects/');
        const projectsUrl = isReactProject ? '/react-projects.json' : '/projects.json';
        
        // Fetch project data with timeout to avoid hanging
        const fetchPromise = fetch(projectsUrl);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 5000)
        );
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!response.ok) throw new Error('Failed to load projects');
        const data = await response.json();
        
        // Find the appropriate project
        const project = isReactProject
          ? data.projects.find((p) => p.id === id)
          : data.find((p) => p.id === parseInt(id));
        
        if (!project) throw new Error('Project not found');
        
        setProjectData(project);
        setIsLoading(false);
        
        // Log performance metrics
        const pageEnd = performance.now();
        console.log(`Project page loaded in ${pageEnd - pageStart}ms`);
        
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    // Use idle callback if available to avoid blocking main thread
    scheduleIdleTask(() => {
      loadProject();
    }, 2000); // Fallback timeout of 2 seconds
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (isLoading || !projectData) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
          <div className="space-y-3 mb-12">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
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
              loading="lazy" 
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
            <Suspense fallback={<IframePlaceholder />}>
              <BasicIframe
                src={projectData.demoUrl}
                title="Live Demo"
                className="w-full h-96 border-0"
                loading="lazy"
                allowFullScreen
              />
            </Suspense>
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