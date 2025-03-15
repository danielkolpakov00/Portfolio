import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import './dk-blue.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3Alt, faJs } from '@fortawesome/free-brands-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { getProjectDescription } from './components/ProjectDescriptions';
import LoadingScreen from './components/LoadingScreen';

const ProjectPage = () => {
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [codeContent, setCodeContent] = useState('');
  const codeBlockRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const fetchCodeFile = async (fileUrl) => {
    try {
      // Update file references to use the actual files in the public directory
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch ${fileUrl}`);
      return await response.text();
    } catch (error) {
      console.error('Error fetching code file:', error);
      return `// Error loading ${fileUrl}\n// ${error.message}`;
    }
  };

  const CodeSkeleton = () => (
    <div className="animate-pulse space-y-2">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-700 rounded"
          style={{
            width: `${Math.floor(Math.random() * 40 + 60)}%`,
            opacity: 1 - (i * 0.03)
          }}
        />
      ))}
    </div>
  );

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch('/projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        const projects = await response.json();
        const project = projects.find(p => p.id === parseInt(id));
        
        if (project) {
          setSelectedProject(project);
          if (project.stack === 'backend' && codeBlockRef.current) {
           codeBlockRef.current.classList.add('display-none');
          }
    
        }
        setIsContentLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setIsContentLoading(false);
      }
    };
    loadProject();
  }, [id]);

  useEffect(() => {
    const loadTabContent = async () => {
      if (!selectedProject || !activeTab) return;
      setIsContentLoading(true);
      let fileUrl;
      if (selectedProject.stack === 'backend') {
        fileUrl = activeTab;
      } else {
        switch (activeTab) {
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
      }
      const content = await fetchCodeFile(fileUrl);
      if (activeTab) {
        setCodeContent(content);
        setTimeout(() => setIsContentLoading(false), 300);
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
    if (codeBlockRef.current && codeContent && !isContentLoading) {
      // Force a new highlight when tab or content changes
      hljs.configure({ languages: ['html', 'css', 'javascript'] });
      hljs.highlightElement(codeBlockRef.current);
      
      // Add animation classes to code lines
      requestAnimationFrame(() => {
        const codeLines = codeBlockRef.current.innerHTML.split('\n');
        codeBlockRef.current.innerHTML = codeLines
          .map((line, index) => 
            `<div class="opacity-0 animate-reveal" style="animation-delay: ${index * 50}ms">${line}</div>`
          )
          .join('');
      });
    }
  }, [codeContent, activeTab, isContentLoading]);

  // Add Tailwind animation class
  const tailwindAnimations = `
    @keyframes reveal {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-reveal {
      animation: reveal 0.5s ease-out forwards;
    }
  `;

  const tabs =
    selectedProject && selectedProject.stack === 'backend'
      ? selectedProject.jsFiles || []
      : ['html', 'css', 'js'];

  if (error)
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!selectedProject || codeContent === '')
    return <LoadingScreen isLoading={true} />;

  const DescriptionComponent = selectedProject ? getProjectDescription(selectedProject.id) : null;

  return (
    <div className="project-page max-w-7xl mx-auto p-4 lg:p-8">
      <style>{tailwindAnimations}</style>
      <h1 className="text-4xl font-bold text-blue-600 text-center my-8">
        {selectedProject.title}
      </h1>

     

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
      
      {selectedProject.stack !== 'backend' && (
      <div className="flex justify-center -mt-[1px]">
        <div className="code-block w-full max-w-6xl bg-gray-900 shadow-lg overflow-hidden">
          <div className="flex">
            {tabs.map((tab) => {
              let label, icon, textColor;
              if (selectedProject?.stack === 'backend') {
                label = tab.split('/').pop(); // extract filename
                icon = faJs;
                textColor = 'text-yellow-500';
              } else {
                label = tab.toUpperCase();
                const icons = { html: faHtml5, css: faCss3Alt, js: faJs };
                const textColors = { html: 'text-orange-500', css: 'text-blue-400', js: 'text-yellow-500' };
                icon = icons[tab];
                textColor = textColors[tab];
              }
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 font-semibold ${
                    activeTab === tab ? 'bg-gray-800' : 'bg-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon={icon} className={textColor} />
                  <span className={textColor}>{label}</span>
                </button>
              );
            })}
          </div>
  
          <div className={`relative p-4 text-white transition-[height] duration-300 ease-in-out ${
            isExpanded ? 'h-[800px]' : 'h-[400px]'
          }`}>
            <pre className="hljs h-full overflow-x-auto overflow-y-auto [&>code>div]:leading-6" key={`${activeTab}-${codeContent}`}>
              {isContentLoading ? (
                <CodeSkeleton />
              ) : (
                <code 
                  ref={codeBlockRef} 
                  className={`language-${selectedProject?.stack === 'backend' ? 'javascript' : (activeTab === 'js' ? 'javascript' : activeTab)} block`}
                >
                  {codeContent}
                </code>
              )}
            </pre>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="sticky left-[calc(100%-2.5rem)] bottom-2 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors duration-200"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <FontAwesomeIcon
                icon={faCaretDown}
                className={`text-gray-400 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      )}

      <div className="project-description w-full max-w-8xl text-gray-700 mt-8 mx-auto">
        <h3 className="text-2xl font-semibold mb-6 text-center">About {selectedProject.title}</h3>
        {DescriptionComponent && <DescriptionComponent />}
      </div>
    </div>
  );
};

export default ProjectPage;