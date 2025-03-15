import React, { useEffect, useRef, Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import VerticalMarquee from '../components/VerticalMarquee';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import '../index.css';
import { Link } from 'react-router-dom';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import TsParticles from '../components/TsParticles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../components/DialogueBox.css'; // Dialogue styles
import { Coolshape } from "coolshapes-react";
import DKModelComponent from '../components/DKModelComponent'; // Import the new component

const Hero = ({ isOpen }) => {
  const location = useLocation();
  const canvasContainerRef = useRef();
  const [init, setInit] = useState(false);

  // Dialogue state and logic
  const [displayedText, setDisplayedText] = useState("Hello! I'm Daniel. I am a web designer looking to kickstart my career.");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const messages = [
    "Hello! I'm Daniel. I am a web designer looking to kickstart my career.",
    "I have a passion for creating super cool web experiences. I'm always looking to learn new things that will help me grow as a developer.",
    "My hobbies include playing video games, and cooking delicious meals.",
    <>
      <div>Click the icon below to open my LinkedIn.</div>
      <Link to="https://www.linkedin.com/in/daniel-kolpakov-829901221/">
        <FontAwesomeIcon icon={faLinkedin} size="2x" className="mt-4" />
      </Link>
    </>,
    <>
      <div>Check out my Github!</div>
      <Link to="https://github.com/danielkolpakov00">
        <FontAwesomeIcon icon={faGithub} size="2x" className="mt-4" />
      </Link>
    </>,
    "Looking forward to working with new clients and creating amazing projects together."
  ];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dialogueTextRef = useRef(null);
  const dkModelRef = useRef(null);
  window.dkModelRef = dkModelRef;

  
  const updateDialogue = (newIndex) => {
    // Play talking animation on DKModel when dialogue changes
    if (dkModelRef.current) {
      dkModelRef.current.playTalking();
     
    }
    // Animate out the current text
    gsap.to(dialogueTextRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setDialogueIndex(newIndex);
        setDisplayedText(messages[newIndex]);
        gsap.fromTo(dialogueTextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      }
    });
  };

  // Set default dialogue message on load
  useEffect(() => {
    setDisplayedText(messages[dialogueIndex]);
  }, []);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotation of dialogue messages
  useEffect(() => {
    const autoInterval = setInterval(() => {
      updateDialogue((dialogueIndex + 1) % messages.length);
    }, 5000);
    return () => clearInterval(autoInterval);
  }, [dialogueIndex, messages.length]);

  // Animation timeline
  useEffect(() => {
    const tl = gsap.timeline();
    if (document.querySelector(".hero-text-hello")) {
      tl.fromTo(".hero-text-hello", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    }
    if (document.querySelector(".title-area")) {
      tl.fromTo(".title-area", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=0.5");
    }
  }, []);

  // Initialize particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Easter egg keyboard sequence for backflip
  useEffect(() => {
    const codeSequence = ['ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    let inputSequence = [];
    const handleSequenceKey = (e) => {
      inputSequence.push(e.key);
      if (inputSequence.length > codeSequence.length) inputSequence.shift();
      if (JSON.stringify(inputSequence) === JSON.stringify(codeSequence)) {
        dkModelRef.current && dkModelRef.current.playBackflip();
      }
    };
    window.addEventListener('keydown', handleSequenceKey);
    return () => window.removeEventListener('keydown', handleSequenceKey);
  }, []);

  // Particle options
  const options = useMemo(() => ({
    background: { color: { value: "#f5fdff" } },
    fpsLimit: 120,
    interactivity: {
      events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "repulse" } },
      modes: { push: { quantity: 3 }, repulse: { distance: 150, duration: 0.4 } }
    },
    particles: {
      color: { value: "#1B69FA" },
      links: { color: "#1B44FA", distance: 150, enable: true, opacity: 0.3, width: 1 },
      move: { enable: true, outModes: { default: "bounce" }, speed: 2 },
      number: { density: { enable: true, area: 800 }, value: 100 },
      opacity: { value: 0.4 },
      shape: { type: "circle" },
      size: { value: { min: 2, max: 3 } }
    },
    detectRetina: true,
  }), []);

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen bg-offwhite p-0 ${isOpen ? 'border-4 border-blue2' : ''}`}>
      <TsParticles />
      <VerticalMarquee />
      <header className="text-center relative z-10">
        
        <div 
          className="title-area" 
          ref={canvasContainerRef}
          style={{ width: '100vw' }}
        >
          <Canvas
            style={{ width: '100%', height: '100%' }}
            resize={{ scroll: false }}
            camera={{ position: [0, 2, 5], fov: 90 }}
            shadows={false}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.3} />
              {/* Using the new DKModelComponent */}
              <DKModelComponent 
                ref={dkModelRef}
                onClick={() => dkModelRef.current?.playTalking()}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Dialogue Box */}
        <div 
          className="dialogue-container p-4 sm:p-8 rounded-lg max-w-[300px] sm:max-w-[400px] min-h-[120px] md:min-h-[200px]"
          onClick={() => { if(isMobile) updateDialogue((dialogueIndex + 1) % messages.length); }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            border: '2px dashed #1B44FA',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            margin: '1rem auto 1.5rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? '120px' : '150px'
          }}>
          <div ref={dialogueTextRef} className="text-center text-sm sm:text-md md:text-lg text-blue2 font-medium">
            {displayedText}
          </div>

        



          
          {!isMobile && (
            <>
              <button 
                onClick={() => updateDialogue((dialogueIndex - 1 + messages.length) % messages.length)}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: '#fff',
                  backgroundColor: '#1B44FA',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  height: '30px',
                  width: '30px'
                }}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button 
                onClick={() => updateDialogue((dialogueIndex + 1) % messages.length)}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: '#fff',
                  backgroundColor: '#1B44FA',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  height: '30px',
                  width: '30px'
                }}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}
        </div>
        
        {/* Navigation links */}
        <div className="mt-4 flex flex-col items-center space-y-6">
          <h2 className="font-georama text-3xl text-blue2 p-6"></h2>
          <Link to="/portfolio" className="bg-blue2 mt-10 text-white py-2 px-8 rounded-lg font-semibold uppercase tracking-wide hover:bg-blue3 transition duration-300 ease-in-out shadow-lg">My Portfolio</Link>
        </div>
      </header>
    </div>
  );
};






export default Hero;
