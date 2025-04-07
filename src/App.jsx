// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import useNavigationTracker from './hooks/useNavigationTracker';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedCursor from "react-animated-cursor"
import { CursorTooltipProvider } from './components/CursorTooltip';
import RelayedCursor from './components/MouseTracker';


// Create a component that conditionally renders TsParticles based on the current route
const ParticlesController = () => {
  const location = useLocation();
  // Only render TsParticles if we're not on the Hero page (home route)
  return location.pathname !== '/' ? <TsParticles /> : null;
};

// Main app content with navigation and loading functionality
const AppContent = () => {
  const [isIframeHovered, setIsIframeHovered] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [useCustomCursor, setUseCustomCursor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const animatedCursorRef = useRef(null);
  const location = useLocation();
  
  // Use our enhanced navigation tracking hook
  const { isNavigating, currentPath, prevPath } = useNavigationTracker();
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // SAFETY MECHANISM: Force hide loading screen after a specific timeout
  const [forceHideLoading, setForceHideLoading] = useState(false);
  
  // Use our custom hook for comprehensive loading state
  const isLoadingAssets = useLoadingState();

  // Reset force hide loading when navigation occurs
  useEffect(() => {
    if (prevPath !== null && prevPath !== currentPath) {
      // Reset force hide loading state on each navigation
      setForceHideLoading(false);
      
      // Clear the visualsLoaded flag from localStorage
      localStorage.removeItem('visualsLoaded');
      
      // This will force the components to fully reload their visuals
      window.dispatchEvent(new Event('navigation'));
    }
  }, [currentPath, prevPath]);
  
  useEffect(() => {
    // Absolute failsafe: Hide loading screen after 6 seconds no matter what
    const forceHideTimer = setTimeout(() => {
      console.log('FAILSAFE ACTIVATED: Forcing loading screen to hide');
      setForceHideLoading(true);
    }, 6000);
    
    // Reset the timer when navigation occurs
    return () => clearTimeout(forceHideTimer);
  }, [currentPath]); // Reset timer on path change
  
  // Add CSS for animated cursor elements
  const cursorStyles = `
    .animated-cursor {
      transition: opacity 0.2s ease-out !important;
    }
  `;

  // Effect to detect when an iframe container is hovered
  useEffect(() => {
    const handleIframeHover = (e) => {
      const isHovering = e.type === 'mouseenter';
      setIsIframeHovered(isHovering);
      
      // Toggle between animated cursor and relayed cursor
      setUseCustomCursor(!isHovering);
      
      // More aggressive targeting of all cursor elements with a slight delay
      setTimeout(() => {
        const allCursorElements = document.querySelectorAll('.animated-cursor, .react-animated-cursor, div[data-cursor="true"]');
        allCursorElements.forEach(el => {
          el.style.opacity = isHovering ? '0' : '1';
          el.style.visibility = isHovering ? 'hidden' : 'visible';
          el.style.display = isHovering ? 'none' : 'block';
        });
        
        // Handle specific outer cursor elements that might have different class names
        const outerCursors = document.querySelectorAll('.animated-cursor-outer');
        outerCursors.forEach(el => {
          el.style.opacity = isHovering ? '0' : '1';
          el.style.visibility = isHovering ? 'hidden' : 'visible';
          el.style.display = isHovering ? 'none' : 'block';
        });
      }, 50);
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
  }, [location.pathname]); // Re-run when path changes to catch newly rendered iframes

  // Combine all loading states - initial load, navigation, and force hide override
  const showLoadingScreen = (isLoadingAssets || isNavigating) && !forceHideLoading;

  return (
    <>
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
      <style>{cursorStyles}</style>
      <>
        <Navbar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
        {/* Conditionally render TsParticles based on route */}
        <ParticlesController />
        <div id="page-wrap" className={`${isNavOpen ? 'relative animate-marchingAnts rounded-xl' : ''}`}>
          <main className="relative">
            {/* Use our loading screen with combined loading states */}
            <LoadingScreen isLoading={showLoadingScreen} message="One sec.." />
            <Routes>
              <Route path="/" element={<Hero key={currentPath} />} />
              <Route path="/about" element={<AboutMe key={currentPath} />} />
              <Route path="/portfolio" element={<PortfolioPreview key={currentPath} />} />
              <Route path="/contact" element={<Contact key={currentPath} />} />
              <Route path="/projects/:id" element={<ProjectPage key={currentPath} />} />
              <Route path="/react-projects/:id" element={<ReactProjectPage key={currentPath} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </>
      
      {/* Only render cursor components on non-mobile devices */}
      {!isMobile && !isIframeHovered ? (
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
      ) : !isMobile && (
        /* Use RelayedCursor when hovering over iframes for seamless cursor tracking */
        <RelayedCursor 
          targetSelector=".iframe-cursor-container"
          innerColor="#ff2d00"
          outerColor="#ff2d00"
          innerSize={8}
          outerSize={35}
          outerAlpha={0.3}
          innerScale={1.2}
          outerScale={1.7}
          enableTooltips={true}
          debugMode={false}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <CursorTooltipProvider>
        <Router>
          <div id="outer-container" className="relative min-h-screen bg-transparent z-10">
            <AppContent />
          </div>
        </Router>
      </CursorTooltipProvider>
    </ErrorBoundary>
  );
};

export default App;