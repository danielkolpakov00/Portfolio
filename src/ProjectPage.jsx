import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import './dk-blue.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3Alt, faJs } from '@fortawesome/free-brands-svg-icons';
import { getProjectDescription } from './components/ProjectDescriptions';

const ProjectPage = () => {
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [codeContent, setCodeContent] = useState('');
  const codeBlockRef = useRef(null);

  const fetchCodeFile = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('File not found');
      return await response.text();
    } catch (err) {
      setError('Could not load code file.');
      return '';
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await fetch('/projects.json'); // Fetching from public/projects.json
        if (!response.ok) throw new Error('Failed to load projects data');
        const data = await response.json();

        const project = data.find((proj) => proj.id === parseInt(id, 10));
        if (!project) throw new Error('Project not found.');

        if (isMounted) {
          setSelectedProject(project);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const loadTabContent = async () => {
      if (!selectedProject || !activeTab) return;

      const currentTab = activeTab;

      let fileUrl;
      switch (currentTab) {
        case 'html':
          fileUrl = selectedProject.htmlFile;
          break;
        case 'css':
          fileUrl = selectedProject.cssFile;
          break;
        case 'js':
          fileUrl = selectedProject.jsFile;
          break;
        default:
          return;
      }

      const content = await fetchCodeFile(fileUrl);

      if (currentTab === activeTab) {
        setCodeContent(content);
      }
    };

    loadTabContent();
  }, [activeTab, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      setActiveTab('html');
    }
  }, [selectedProject]);

  useEffect(() => {
    if (codeBlockRef.current && codeContent) {
      // Force a new highlight when tab or content changes
      hljs.configure({ languages: ['html', 'css', 'javascript'] });
      hljs.highlightElement(codeBlockRef.current);
    }
  }, [codeContent, activeTab]);

  if (error)
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!selectedProject || codeContent === '')
    return <p className="text-center mt-4">Loading...</p>;

  const DescriptionComponent = selectedProject ? getProjectDescription(selectedProject.id) : null;

  return (
    <div className="project-page bg-offwhite max-w-7xl mx-auto p-4 lg:p-8">
      <h1 className="text-4xl font-bold text-blue-600 text-center my-8">
        {selectedProject.title}
      </h1>

      {/* Display Project Icon */}
      <div className="relative text-center mb-4">
        <img
          src={selectedProject.library}
          alt={`${selectedProject.title} Icon`}
          title={selectedProject.threejs} // Optional for accessibility
          className="inline-block h-12 w-12 fill-blue2 hover-trigger"
          aria-label={selectedProject.libraryname}
        />
        <span className="tooltip hidden absolute bg-black text-white text-sm rounded px-2 py-1">
          Three.js
        </span>
      </div>

      <div className="project-demo flex justify-center">
        {selectedProject.demoUrl ? (
          <div className="w-full max-w-6xl aspect-[4/3] md:aspect-[16/9] lg:h-[800px] overflow-hidden shadow-lg mb-0">
            <iframe
              src={selectedProject.demoUrl}
              title={`${selectedProject.title} Demo`}
              className="w-full h-full border-0"
              allow="fullscreen"
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-500">
            Live demo not available for this project.
          </p>
        )}
      </div>

      <div className="flex justify-center -mt-[1px]">
        <div className="code-block w-full max-w-6xl bg-gray-900 shadow-lg overflow-hidden">
          <div className="flex">
            {['html', 'css', 'js'].map((tab) => {
              const icons = {
                html: faHtml5,
                css: faCss3Alt,
                js: faJs,
              };

              const textColors = {
                html: 'text-orange-500',
                css: 'text-blue-400',
                js: 'text-yellow-500',
              };

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 font-semibold ${
                    activeTab === tab ? 'bg-gray-800' : 'bg-gray-700'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={icons[tab]}
                    className={textColors[tab]}
                  />
                  <span className={textColors[tab]}>{tab.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 text-white overflow-x-auto min-h-[400px] max-h-[400px] overflow-y-auto">
            <pre className="hljs" key={`${activeTab}-${codeContent}`}>
              <code 
                ref={codeBlockRef} 
                className={`language-${activeTab === 'js' ? 'javascript' : activeTab}`}
              >
                {codeContent}
              </code>
            </pre>
          </div>
        </div>
      </div>

      <div className="project-description w-full max-w-2xl text-gray-700 mt-8 mx-auto">
        <h3 className="text-2xl font-semibold mb-6 text-center">About This Project</h3>
        {DescriptionComponent && <DescriptionComponent />}
      </div>
    </div>
  );
};

export default ProjectPage;