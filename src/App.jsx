// App.jsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import Scene from './Scene'; // Completely disabled as it's unoptimized
import Hero from './pages/Hero';
import AboutMe from './pages/AboutMe';
import Contact from './Contact';
import PortfolioPreview from './PortfolioPreview';
import ProjectPage from './ProjectPage';
import ReactProjectPage from './ReactProjectPage';
import Navbar from './Navbar';
import BackgroundParticles from './components/BackgroundParticles';
import LoadingScreen from './components/LoadingScreen';
// add the beginning of your app entry
import 'vite/modulepreload-polyfill'
import axios from 'axios';
import useLoadingState from './hooks/useLoadingState';


const App = () => {
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
  const apiUrl = import.meta.env.MODE === 'development' 
    ? 'http://localhost:8080/api/'
    : '/api/'; // This will use the same domain as your frontend in production

  const fetchAPI = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log(response.data.fruits);
    } catch (error) {
      console.error('Error fetching API data:', error);
      // Handle the error gracefully
    } finally {
      setIsApiLoading(false);
    }
  }
 
  useEffect(() => {
    fetchAPI();
  }, []); // Add empty dependency array to run only once

  return (
    <>
      <LoadingScreen isLoading={isLoading} message="Loading Portfolio..." />
      <BackgroundParticles />
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
    </>
  );
};

export default App;