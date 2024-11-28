// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutMe from './AboutMe';
import PortfolioPreview from './PortfolioPreview';
import Contact from './Contact';
import Scene from './Scene';
import ProjectPage from './ProjectPage';

const App = () => {
  const [showScene, setShowScene] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSceneComplete = () => setShowScene(false);

  return (
    <Router>
      {/* Show 3D Scene separately without being affected by outer-container */}
      {showScene ? (
        <Scene onComplete={handleSceneComplete} />
      ) : (
        <div id="outer-container">
          {/* Navbar with scaleRotate effect and state management */}
          <Navbar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />

          <main id="page-wrap" className={isNavOpen ? 'scale-with-border' : ''}>
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
      )}
    </Router>
  );
};

export default App;