// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Scene from './Scene';
import Hero from './Hero';
import AboutMe from './AboutMe';
import Contact from './Contact';
import PortfolioPreview from './PortfolioPreview';
import ProjectPage from './ProjectPage';
import Navbar from './Navbar';

const App = () => {
  const [showScene, setShowScene] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSceneComplete = () => setShowScene(false);

  return (
    <Router>
      <div id="outer-container">
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