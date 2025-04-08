// App.jsx
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Core components that are needed immediately
import Navbar from './Navbar';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { CursorTooltipProvider } from './components/CursorTooltip';
import PreloadAssets from './components/PreloadAssets';

// Add polyfill for older browsers
import 'vite/modulepreload-polyfill';

// Utilities
import useLoadingState from './hooks/useLoadingState';
import useNavigationTracker from './hooks/useNavigationTracker';
import { isLowPerformanceDevice } from './utils/performanceUtils';

// Lazy load heavy components
const Hero = lazy(() => import('./pages/Hero'));
const AboutMe = lazy(() => import('./pages/AboutMe'));
const Contact = lazy(() => import('./Contact'));
const PortfolioPreview = lazy(() => import('./PortfolioPreview'));
const ProjectPage = lazy(() => import('./ProjectPage'));
const ReactProjectPage = lazy(() => import('./ReactProjectPage'));
const UnifiedProjectPage = lazy(() => import('./UnifiedProjectPage'));
const TsParticles = lazy(() => import('./components/TsParticles'));
// Replace AnimatedCursor with SafeCursor
const SafeCursor = lazy(() => import('./components/SafeCursor'));
const RelayedCursor = lazy(() => import('./components/MouseTracker'));

// Custom cursor styles
const cursorStyles = `
  .custom-cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.15s ease;
  }
  .cursor-inner {
    width: 6px;
    height: 6px;
    background-color: #fff;
    border-radius: 50%;
    opacity: 1;
  }
  .cursor-outer {
    width: 24px;
    height: 24px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

// Create a component that conditionally renders TsParticles based on the current route
const ConditionalParticles = ({ pathname }) => {
  // Only render particles on specific routes
  // Exclude hero page ('/'), project pages, and react project pages
  const showParticles = pathname !== '/' && 
                       !pathname.includes('/projects/') && 
                       !pathname.includes('/react-projects/');
  
  // Check if we're on a low performance device
  const isLowPerformance = isLowPerformanceDevice();
  
  // Don't render particles on low-performance devices
  if (isLowPerformance) return null;
  
  return showParticles ? (
    <ErrorBoundary fallback={<div className="hidden">Particles error</div>}>
      <Suspense fallback={null}>
        <TsParticles />
      </Suspense>
    </ErrorBoundary>
  ) : null;
};

// Main app content with route-specific logic
const AppContent = () => {
  const location = useLocation();
  const { currentPath, prevPath, isNavigating } = useNavigationTracker();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [forceHideLoading, setForceHideLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Custom loading state hook
  const isLoadingAssets = useLoadingState();

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Safety mechanism: Force hide loading screen after timeout
  useEffect(() => {
    if (prevPath !== null && prevPath !== currentPath) {
      // Reset force hide loading state on each navigation
      setForceHideLoading(false);
      // Clear the visualsLoaded flag from localStorage
      localStorage.removeItem('visualsLoaded');
      // Force components to reload visuals
      window.dispatchEvent(new Event('navigation'));
    }
  }, [currentPath, prevPath]);
  
  useEffect(() => {
    // Absolute failsafe: Hide loading screen after 5 seconds
    const forceHideTimer = setTimeout(() => {
      console.log('FAILSAFE ACTIVATED: Forcing loading screen to hide');
      setForceHideLoading(true);
    }, 5000);
    
    return () => clearTimeout(forceHideTimer);
  }, [location.pathname]);

  // Setup iframe mouse tracking
  useEffect(() => {
    document.querySelectorAll('iframe').forEach(iframe => {
      // Skip iframes that are from other domains (security)
      if (!iframe.src.includes(window.location.hostname)) return;
      
      const container = iframe.parentElement;
      if (!container) return;
      
      const handleIframeHover = () => {
        document.dispatchEvent(new CustomEvent('iframe-hover'));
      };
      
      container.addEventListener('mouseenter', handleIframeHover);
      container.addEventListener('mouseleave', handleIframeHover);
      
      return () => {
        container.removeEventListener('mouseenter', handleIframeHover);
        container.removeEventListener('mouseleave', handleIframeHover);
      };
    });
  }, [location.pathname]);

  // Combine loading states
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
        {/* Preconnect to essential domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Add preload hints for critical assets */}
        <link rel="preload" as="image" href="/assets/images/previewreact1.jpg" />
      </Helmet>
      <PreloadAssets />
      <style>{cursorStyles}</style>
      <>
        <Navbar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
        <ConditionalParticles pathname={location.pathname} />
        
        <CursorTooltipProvider>
          <ErrorBoundary>
            {!isMobile && (
              <Suspense fallback={null}>
                <ErrorBoundary fallback={<div className="hidden">Cursor error</div>}>
                  {typeof window !== 'undefined' && document.body && (
                    <SafeCursor
                      innerSize={8}
                      outerSize={24}
                      outerAlpha={0.3}
                      innerScale={0.7}
                      outerScale={2}
                      trailingSpeed={7}
                    />
                  )}
                </ErrorBoundary>
              </Suspense>
            )}
            <main>
              <Suspense fallback={<LoadingScreen isLoading={true} />}>
                <Routes>
                  <Route path="/" element={<Hero isOpen={isNavOpen} />} />
                  <Route path="/about" element={<AboutMe />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/portfolio" element={<PortfolioPreview />} />
                  <Route path="/projects/:id" element={<ProjectPage />} />
                  <Route path="/react-projects/:id" element={<ReactProjectPage />} />
                  <Route path="/unified-projects/:id" element={<UnifiedProjectPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </main>
          </ErrorBoundary>
        </CursorTooltipProvider>
      </>
      <LoadingScreen isLoading={showLoadingScreen} />
    </>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
}

export default App;