// src/ProjectPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import './dk-blue.css'; // Custom styles (if any)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3Alt, faJs } from '@fortawesome/free-brands-svg-icons';
import TypeIt from 'typeit-react';

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
    if (codeBlockRef.current) {
      hljs.highlightElement(codeBlockRef.current);
    }
  }, [codeContent]);

  if (error)
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!selectedProject || codeContent === '')
    return <p className="text-center mt-4">Loading...</p>;

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
          <div className="w-full max-w-4xl h-[calc(100vw*(3/4))] lg:h-[600px] overflow-hidden shadow-lg">
            <iframe
              src={selectedProject.demoUrl}
              title={`${selectedProject.title} Demo`}
              className="w-full h-full"
              allow="fullscreen"
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-500">
            Live demo not available for this project.
          </p>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <div className="code-block w-full max-w-4xl bg-gray-900 shadow-lg overflow-hidden">
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

          <div className="p-4 text-white overflow-x-auto max-h-96 overflow-y-auto">
            <TypeIt
              key={`${activeTab}-${codeContent}`}
              options={{
                speed: 0.1,
                waitUntilVisible: true,
              }}
            >
              <pre className="whitespace-pre-wrap">
                <code ref={codeBlockRef} className={`language-${activeTab} bg-gray-900`}>
                  {codeContent}
                </code>
              </pre>
            </TypeIt>
          </div>
        </div>
      </div>

      <div className="project-description w-full max-w-lg text-lg text-gray-700 mt-8 mx-auto text-center">
        <h3 className="text-2xl font-semibold mb-4">Description</h3>
        <p>{selectedProject.description}</p>
      </div>
    </div>
  );
};

export default ProjectPage;