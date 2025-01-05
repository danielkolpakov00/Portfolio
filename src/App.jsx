// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Scene from './Scene';
import Hero from './Hero';
import AboutMe from './AboutMe';
import Contact from './Contact';
import PortfolioPreview from './PortfolioPreview';
import ProjectPage from './ProjectPage';
import Navbar from './Navbar';

const App = () => {
  const [showScene, setShowScene] = useState(() => {
    // Check if user has seen the scene before
    const hasSeenScene = localStorage.getItem('hasSeenScene');
    // Check if this is a direct access to a route other than home
    const isDirectAccess = window.location.pathname !== '/';
    return !hasSeenScene && !isDirectAccess;
  });
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSceneComplete = () => {
    setShowScene(false);
    localStorage.setItem('hasSeenScene', 'true');
  };

  useEffect(() => {
    // Handle direct access to routes by hiding scene
    if (window.location.pathname !== '/') {
      setShowScene(false);
    }
  }, []);

  return (
    <Router>
      <div id="outer-container">
        <Helmet>
          <title>Daniel Kolpakov | Front End Development, Web Developer</title>
          <meta
            name="description"
            content="Web Developer based in North Vancouver, British Columbia. Specializing in React.js, and front end development."
          />
          <meta
            name="keywords"
            content="web developer vancouver, daniel kolpakov, react.js developer, front end development, ui/ux designer, daniel kolpakov portfolio, daniel kolpakov projects, bcit new media"
          />
        </Helmet>
        {showScene ? (
          <Scene onComplete={handleSceneComplete} />
        ) : (
          <>
            <Navbar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
            <div id="page-wrap" className={isNavOpen ? 'scale-with-border' : ''}>
              <main>
                <Routes>
                  <Route path="/" element={<Hero />} />
                  <Route path="/about" element={<AboutMe />} />
                  <Route path="/portfolio" element={<PortfolioPreview />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/projects/:id" element={<ProjectPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;