import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import './dk-blue.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3Alt, faJs } from '@fortawesome/free-brands-svg-icons';
import { faCaretDown, faExpand, faMobileAlt as faMobileAltSolid, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { getProjectDescription } from './components/ProjectDescriptions';
import LoadingScreen from './components/LoadingScreen';
import TsParticles from './components/TsParticles';
import PlinkoDemoDescription from './components/project-descriptions/PlinkoDemoDescription';
import WeatherDemoDescription from './components/project-descriptions/WeatherDemoDescription';
import BedroomDemoDescription from './components/project-descriptions/BedroomDemoDescription';
import MusicDemoDescription from './components/project-descriptions/MusicDemoDescription';
import MailDemoDescription from './components/project-descriptions/MailDemoDescription';
import WeatherDescription from './components/project-descriptions/WeatherDescription';
import PlinkoDescription from './components/project-descriptions/PlinkoDescription';
import BedroomDescription from './components/project-descriptions/BedroomDescription';
import MusicDescription from './components/project-descriptions/MusicDescription';
import MailDescription from './components/project-descriptions/MailDescription';
import GradientDemoDescription from './components/project-descriptions/GradientDemoDescription';
import LastFmDemoDescription from './components/project-descriptions/LastFmDemoDescription';


const ProjectPage = () => {
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [codeContent, setCodeContent] = useState('');
  const codeBlockRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const iframeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const demoSectionRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const topSectionRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) { /* Safari */
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) { /* IE11 */
        iframe.msRequestFullscreen();
      }
    }
  };

  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    // Hide button after click
    setShowScrollButton(false);
  };

  // Observer to detect when user scrolls back to top
  useEffect(() => {
    const topSection = topSectionRef.current;
    if (!topSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Show button when top section is visible
        if (entry.isIntersecting) {
          setShowScrollButton(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(topSection);
    
    return () => {
      if (topSection) {
        observer.unobserve(topSection);
      }
    };
  }, []);

  const tabs =
    selectedProject && selectedProject.stack === 'backend'
      ? selectedProject.jsFiles || []
      : ['html', 'css', 'js'];

  if (error)
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!selectedProject || codeContent === '')
    return <LoadingScreen isLoading={true} />;

  const DescriptionComponent = selectedProject ? getProjectDescription(selectedProject.id) : null;

  const renderProjectDemo = () => {
    if (!selectedProject) return null;
    
    // Show warning for non-mobile-friendly sites on mobile devices
    if (isMobile && !selectedProject.isMobileFriendly) {
      return (
        <div className="flex justify-center">
          <div className="w-full max-w-6xl bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faMobileAltSolid} className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm md:text-base text-yellow-700">
                  This project is not optimized for mobile devices. For the best experience, please view on a desktop or laptop computer.
                </p>
                <div className="mt-4">
                  <a 
                    href={selectedProject.demoUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
                  >
                    Open anyway
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    const descriptionComponents = {
        PlinkoDemoDescription: PlinkoDemoDescription,
        WeatherDemoDescription: WeatherDemoDescription,
        BedroomDemoDescription: BedroomDemoDescription,
        MusicDemoDescription: MusicDemoDescription,
        MailDemoDescription: MailDemoDescription
    };

    // Otherwise show the iframe
    return (
      <div className="project-demo flex flex-col">
        {selectedProject.demoUrl ? (
          <>
          <div className={`w-full max-w-6xl aspect-[4/4] md:aspect-[16/9] ${isMobile ? 'lg:h-[500px]' : 'lg:h-[600px]'} overflow-hidden shadow-lg relative`}>
            <iframe
              ref={iframeRef}
              src={selectedProject.demoUrl}
              title={`${selectedProject.title} Demo`}
              className="w-full h-full border-0"
              allow="fullscreen"
              allowFullScreen
              style={{ transform: 'scale(1)', transformOrigin: 'center' }}
            ></iframe>
            <button
              onClick={handleFullscreen}
              className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 font-medium"
              aria-label="View fullscreen"
            >
              <FontAwesomeIcon icon={faExpand} />
              <span>Fullscreen</span>
            </button>
          </div>
          <div className="w-full max-w-6xl p-4 bg-blue2">
            <p className="text-white">
              {/* Display the custom demo description or the last paragraph */}
              {selectedProject.demoDescriptionComponent ? (
                  (() => {
                      const DescriptionComponent = descriptionComponents[selectedProject.demoDescriptionComponent];
                      if (DescriptionComponent) {
                          return <DescriptionComponent />;
                      }
                      return null;
                  })()
              ) : DescriptionComponent && (
                (() => {
                  const Description = DescriptionComponent();
                  if (Description && Description.props && Description.props.children) {
                    const childrenArray = React.Children.toArray(Description.props.children);
                    
                    // Find the last paragraph
                    let lastParagraph = null;
                    for (let i = childrenArray.length - 1; i >= 0; i--) {
                      const child = childrenArray[i];
                      if (child && child.type === 'p') {
                        lastParagraph = child;
                        break;
                      }
                    }
                    
                    // Render the last paragraph
                    return lastParagraph;
                  }
                  return null;
                })()
              )}
            </p>
          </div>
        </>
        ) : (
          <div className="h-[1200px] flex items-center justify-center bg-blue2/40">
            <p className="text-white">Demo not available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <TsParticles />
      <div className="project-page mx-auto min-h-screen overflow-x-hidden">
        <style>{tailwindAnimations}</style>
        
        {/* Header with ref for intersection observer */}
        <div ref={topSectionRef} className="max-w-9xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
            {selectedProject.title}
          </h1>
        </div>

        {/* Full-width container with background - improved padding */}
        <div className="project-description-container w-full bg-blue2/100 py-10 px-12 mb-12 shadow-md">
          {/* Content container that's centered and width-constrained */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {DescriptionComponent && <div className="prose prose-lg max-w-none text-white"><DescriptionComponent /></div>}
          </div>
        </div>

        {/* Demo section with consistent padding */}
        <div ref={demoSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center items-center">
          {renderProjectDemo()}
        </div>
        
        {/* Code section with improved spacing */}
        {selectedProject.stack !== 'backend' && (
        <div className="flex justify-center max-w-7xl mx-auto px-4 sm:px-6 pb-16">
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

        {/* Fixed scroll-to-demo button - now with conditional display */}
        {showScrollButton && (
          <button 
            onClick={scrollToDemo}
            className="fixed bottom-8 right-8 bg-blue2 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll to demo"
          >
            <FontAwesomeIcon icon={faArrowDown} className="text-xl" />
          </button>
        )}
      </div>
    </>
  );
};

export default ProjectPage;