import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import './dk-blue.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact } from '@fortawesome/free-brands-svg-icons';
import { faCode, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { getProjectDescription } from './components/ProjectDescriptions';

// Replace the glob pattern to include the "public" folder:
const allProjectJSXFiles = import.meta.glob('/public/reactprojects/*/src/**/*.jsx', { as: 'raw' });

// ...existing helper function...
const extractFileName = (filePath) =>
  filePath.substring(filePath.lastIndexOf('/') + 1);

const ReactProjectPage = () => {
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);
  // activeTab now holds a file path from the glob
  const [activeTab, setActiveTab] = useState(null);
  const [codeContent, setCodeContent] = useState('');
  const codeBlockRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  // New state: available files in the project folder
  const [availableFiles, setAvailableFiles] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const response = await fetch('/react-projects.json');
        if (!response.ok) throw new Error('Failed to load projects data');
        const data = await response.json();
        const project = data.projects.find((proj) => proj.id === id);
        if (!project) throw new Error('Project not found.');
        if (isMounted) setSelectedProject(project);
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    };
    fetchProjects();
    return () => { isMounted = false; };
  }, [id]);

  // When a project is loaded, filter allProjectJSXFiles to include only files under the project src folder
  useEffect(() => {
    if (selectedProject) {
      const filesArr = Object.keys(allProjectJSXFiles)
        .filter(path => path.includes(`/reactprojects/${selectedProject.id}/src/`))
        .map((path) => ({
          path,
          name: extractFileName(path),
          loader: allProjectJSXFiles[path],
        }));
      console.log("Found JSX files:", filesArr);
      if (filesArr.length === 0) {
        setError('No JSX files found in the project folder.');
      } else {
        setAvailableFiles(filesArr);
        setActiveTab(filesArr[0].path);
      }
    }
  }, [selectedProject]);

  // When activeTab changes, load its content via the loader.
  useEffect(() => {
    const loadTabContent = async () => {
      if (!activeTab) return;
      setIsContentLoading(true);
      const fileObj = availableFiles.find(file => file.path === activeTab);
      if (fileObj) {
        try {
          const content = await fileObj.loader();
          setCodeContent(content);
        } catch (err) {
          setError('Could not load code file.');
        }
      }
      setTimeout(() => setIsContentLoading(false), 300);
    };
    loadTabContent();
  }, [activeTab, availableFiles]);

  // Update highlighting on code change.
  useEffect(() => {
    if (codeBlockRef.current && codeContent && !isContentLoading) {
      hljs.configure({ languages: ['javascript', 'jsx', 'typescript'] });
      codeBlockRef.current.className = 'language-jsx';
      hljs.highlightElement(codeBlockRef.current);
    }
  }, [codeContent, isContentLoading]);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-600">
            {selectedProject?.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedProject?.technologies?.map((tech, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Removed Project Demo iFrame */}
        {/*
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {selectedProject?.demoUrl ? (
            <div className="aspect-video">
              <iframe
                src={selectedProject.demoUrl}
                title={`${selectedProject.title} Demo`}
                className="w-full h-full border-0"
                allow="fullscreen"
              />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Demo coming soon</p>
            </div>
          )}
        </div>
        */}

        {/* Code Viewer */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
          {/* Tab Navigation */}
          <div className="grid grid-cols-3 border-b border-gray-700">
            {availableFiles.map(file => (
              <button
                key={file.path}
                onClick={() => setActiveTab(file.path)}
                className={`
                  flex items-center justify-center gap-2 py-4 px-4
                  transition-colors duration-200
                  ${activeTab === file.path 
                    ? 'bg-gray-800 text-blue-400' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}
                `}
              >
                <span className="font-medium">
                  {file.name}
                </span>
              </button>
            ))}
          </div>

          {/* Code Content */}
          <div className="relative">
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'h-[800px]' : 'h-[400px]'}`}>
              <div className="absolute inset-0 p-6 overflow-auto">
                {isContentLoading ? (
                  <div className="animate-pulse space-y-2">
                    {/* ...skeleton code... */}
                  </div>
                ) : (
                  <pre className="m-0">
                    <code ref={codeBlockRef}>
                      {codeContent}
                    </code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            {selectedProject?.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactProjectPage;
