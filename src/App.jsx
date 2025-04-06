// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import Scene from './Scene'; // Completely disabled as it's unoptimized
import Hero from './pages/Hero';
import AboutMe from './pages/AboutMe';
import Contact from './Contact';
import PortfolioPreview from './PortfolioPreview';
import ProjectPage from './ProjectPage';
import ReactProjectPage from './ReactProjectPage';
import Navbar from './Navbar';
import TsParticles from './components/TsParticles';
import LoadingScreen from './components/LoadingScreen';
// add the beginning of your app entry
import 'vite/modulepreload-polyfill'
import axios from 'axios';
import useLoadingState from './hooks/useLoadingState';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedCursor from "react-animated-cursor"
import { CursorTooltipProvider } from './components/CursorTooltip';




// Create a component that conditionally renders TsParticles based on the current route
const ParticlesController = () => {
  const location = useLocation();
  // Only render TsParticles if we're not on the Hero page (home route)
  return location.pathname !== '/' ? <TsParticles /> : null;
};

const App = () => {
  const [isIframeHovered, setIsIframeHovered] = useState(false);
  const animatedCursorRef = useRef(null);
  
  // Effect to detect when an iframe container is hovered
  useEffect(() => {
    const handleIframeHover = (e) => {
      const isHovering = e.type === 'mouseenter';
      setIsIframeHovered(isHovering);
      
      // Toggle animated cursor visibility
      if (animatedCursorRef.current) {
        const cursorElements = document.querySelectorAll('.animated-cursor');
        cursorElements.forEach(el => {
          el.style.opacity = isHovering ? '0' : '1';
        });
      }
    };
    
    // Attach event listeners to iframe containers
    const iframeContainers = document.querySelectorAll('.iframe-cursor-container');
    iframeContainers.forEach(container => {
      container.addEventListener('mouseenter', handleIframeHover);
      container.addEventListener('mouseleave', handleIframeHover);
    });
    
    return () => {
      iframeContainers.forEach(container => {
        container.removeEventListener('mouseenter', handleIframeHover);
        container.removeEventListener('mouseleave', handleIframeHover);
      });
    };
  }, []);
  
  // Comment out Scene-related state
  /*
  const [showScene, setShowScene] = useState(() => {
    // Check if user has seen the scene before
    const hasSeenScene = localStorage.getItem('hasSeenScene');
    // Check if this is a direct access to a route other than home
    const isDirectAccess = window.location.hash !== '' && window.location.hash !== '#/';
    return !hasSeenScene && !isDirectAccess;
    
  });
  */
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  // Use our custom hook for comprehensive loading state
  const isLoadingAssets = useLoadingState();
  const [isApiLoading, setIsApiLoading] = useState(true);
  
  // Combined loading state
  const isLoading = isLoadingAssets || isApiLoading;

  // Set isApiLoading to false after component mounts
  useEffect(() => {
    setIsApiLoading(false);
  }, []);

  // Comment out Scene-related handler
  /*
  const handleSceneComplete = () => {
    setShowScene(false);
    localStorage.setItem('hasSeenScene', 'true');
  };

  useEffect(() => {
    // Handle direct access to routes by hiding scene
    if (window.location.hash !== '' && window.location.hash !== '#/') {
      setShowScene(false);
    }
  }, []);
  */

  // Use relative or environment-based API URL
  // const apiUrl = import.meta.env.MODE === 'development' 
  //   ? 'http://localhost:8080/api/'
  //   : '/api/'; // This will use the same domain as your frontend in production


  return (
    
    <ErrorBoundary>
      <CursorTooltipProvider>
        <AnimatedCursor
          ref={animatedCursorRef}
          innerSize={8}
          outerSize={35}
          innerScale={1}
          outerScale={1.7}
          outerAlpha={0}
          hasBlendMode={true}
          innerStyle={{
            backgroundColor: '#ff2d00'
          }}
          outerStyle={{
            border: '3px solid #ff2d00'
          }}
          clickables={[
            'a',
            'button',
            '.link',
            '.project-card',
            '.clickable',
            '.nav-item',
            'input[type="text"]',
            'input[type="email"]',
            'input[type="number"]',
            'input[type="submit"]',
            'textarea',
            'select',
            'label[for]',
            '.social-icon',
            'iframe'
          ]}
          trailingSpeed={8}
          showSystemCursor={false}
          
          // Add custom cursor behaviors
          customCursors={[
            {
              selector: '.draggable, [draggable="true"], .slider, .resize-handle',
              style: {
                innerColor: '#4cf7c3',
                outerColor: '#4cf7c3',
                innerScale: 1.2,
                outerScale: 2,
                innerSize: 8,
                outerSize: 25,
                outerAlpha: 0.3,
                mixBlendMode: 'exclusion',
                text: "+ drag"
              }
            },
            {
              selector: 'button, .button, input[type="submit"]',
              style: {
                innerColor: '#ffdd40',
                outerColor: '#ffdd40',
                innerScale: 1.5,
                outerScale: 1.2
              }
            },
            {
              selector: 'a, .link, .nav-item',
              style: {
                innerColor: '#61dafb',
                outerColor: '#61dafb',
                innerScale: 1.5,
                outerScale: 1.2
              }
            },
            {
              selector: 'input, textarea, select',
              style: {
                innerColor: '#ffffff',
                outerColor: '#ffffff',
                innerScale: 1.2,
                outerScale: 1.5,
                text: "type"
              }
            }
          ]}
        />
        <LoadingScreen isLoading={isLoading} message="Loading Portfolio..." />
        <Router>
          <div id="outer-container" className="relative min-h-screen bg-transparent z-10">
            <Helmet>
              <title>Daniel Kolpakov | Web Developer</title>
              <meta
                name="description"
                content="Web Developer based in North Vancouver, British Columbia. Specializing in React.js, and front end development."
              />
              <meta
                name="keywords"
                content="web developer vancouver, daniel kolpakov, react.js developer, front end development, ui/ux designer, daniel kolpakov portfolio, daniel kolpakov projects, bcit new media"
              />
            </Helmet>
            {/* Scene component removed as it's unoptimized */}
            <>
              <Navbar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
              {/* Conditionally render TsParticles based on route */}
              <ParticlesController />
              <div id="page-wrap" className={`${isNavOpen ? 'relative animate-marchingAnts rounded-xl' : ''}`}>
                <main className="relative">
                  <Routes>
                    <Route path="/" element={<Hero />} />
                    <Route path="/about" element={<AboutMe />} />
                    <Route path="/portfolio" element={<PortfolioPreview />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/projects/:id" element={<ProjectPage />} />
                    <Route path="/react-projects/:id" element={<ReactProjectPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
            </>
          </div>
        </Router>
      </CursorTooltipProvider>
    </ErrorBoundary>
  );
};

export default App;