import React, { useEffect, useRef, Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import VerticalMarquee from '../components/VerticalMarquee';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import '../index.css';
import { Link } from 'react-router-dom';
// import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
// import TsParticles from '../components/TsParticles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../components/DialogueBox.css'; // Dialogue styles
import { Coolshape } from "coolshapes-react";
import DKModelComponent from '../components/DKModelComponent'; // Import the new component
import BouncingLogo from '@/components/BouncingLogo';
import Particles from '../components/ReactBits/Particles';

const Hero = ({ isOpen }) => {
  const location = useLocation();
  const canvasContainerRef = useRef();
  const dialogueBoxRef = useRef(null);
  const portfolioButtonRef = useRef(null);
  const [init, setInit] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Apply parallax effect to elements - removing dialogue box and portfolio button from parallax
  useEffect(() => {
    // Removing the dialogue box and portfolio button transformations
    // We're keeping the empty useEffect to maintain the component structure
    // and allow for future additions of other parallax elements if needed
  }, [mousePosition]);

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

  // // Initialize particles
  // useEffect(() => {
  //   initParticlesEngine(async (engine) => {
  //     await loadSlim(engine);
  //   }).then(() => {
  //     setInit(true);
  //   });
  // }, []);

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
  // const options = useMemo(() => ({
  //   background: { color: { value: "#f5fdff" } },
  //   fpsLimit: 120,
  //   interactivity: {
  //     events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "repulse" } },
  //     modes: { push: { quantity: 3 }, repulse: { distance: 150, duration: 0.4 } }
  //   },
  //   particles: {
  //     color: { value: "#1B69FA" },
  //     links: { color: "#1B44FA", distance: 150, enable: true, opacity: 0.3, width: 1 },
  //     move: { enable: true, outModes: { default: "bounce" }, speed: 2 },
  //     number: { density: { enable: true, area: 800 }, value: 100 },
  //     opacity: { value: 0.4 },
  //     shape: { type: "circle" },
  //     size: { value: { min: 2, max: 3 } }
  //   },
  //   detectRetina: true,
  // }), []);

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen bg-offwhite p-0 overflow-hidden ${isOpen ? 'border-4 border-blue2' : ''}`}>
      {/* Deep background particles layer - slowest, smallest particles */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ 
        height: '110vh', // Increased height to prevent cutting off
        width: '110vw', // Increased width to prevent cutting off
        position: 'fixed',
        top: '-5vh', // Position slightly outside the viewport
        left: '-5vw', // Position slightly outside the viewport
        overflow: 'visible',
        opacity: '10%' 
      }}>
        <Particles
          particleColors={['#1B60FA', '#1B70FA']}
          particleCount={40}
          particleSpread={25}
          speed={0.05}
          particleBaseSize={300}
          moveParticlesOnHover={true}
          particleHoverFactor={0.2}
          alphaParticles={true}
          disableRotation={false}
          cameraDistance={60}
          className="particles-container-deep"
          
        />
      </div>
      
      {/* Background particles layer - slower, medium particles */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none" 
        style={{ 
          height: '120vh', // Increased height to prevent cutting off
          width: '120vw', // Increased width to prevent cutting off
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          transition: 'transform 0.8s cubic-bezier(0.075, 0.82, 0.165, 1)',
          position: 'fixed',
          top: '-10vh', // Position outside the viewport
          left: '-10vw', // Position outside the viewport
          overflow: 'visible',
          opacity: '30%'
        }}
      >
        <Particles
          particleColors={['#1B44FA', '#1B69FA']}
          particleCount={60}
          particleSpread={18}
          speed={0.08}
          particleBaseSize={400}
          moveParticlesOnHover={true}
          particleHoverFactor={0.5}
          alphaParticles={true}
          disableRotation={false}
          cameraDistance={40}
          className="particles-container-back"
        />
      </div>
      
      {/* Middle particles layer - adds depth */}
      <div 
        className="fixed inset-0 z-20 pointer-events-none" 
        style={{ 
          height: '130vh', // Increased height to prevent cutting off
          width: '130vw', // Increased width to prevent cutting off
          transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`,
          transition: 'transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1)',
          position: 'fixed',
          top: '-15vh', // Position outside the viewport
          left: '-15vw', // Position outside the viewport
          overflow: 'visible',
          opacity: '50%'
        }}
      >
        <Particles
          particleColors={['#1B44FA', '#1B69FA']}
          particleCount={30}
          particleSpread={12}
          speed={0.15}
          particleBaseSize={450}
          moveParticlesOnHover={true}
          particleHoverFactor={1.0}
          alphaParticles={true}
          disableRotation={false}
          cameraDistance={20}
          className="particles-container-middle"
        />
      </div>
      
      <BouncingLogo />
      <VerticalMarquee />

      {/* Interactive content container with higher z-index than all particles */}
      <div className="relative z-[500]" style={{ pointerEvents: 'auto' }}>
        <header className="text-center">
          <div 
            className="title-area" 
            ref={canvasContainerRef}
            style={{ 
              width: '100vw'
            }}
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

          {/* Dialogue Box without parallax effect */}
          <div 
            ref={dialogueBoxRef}
            className="dialogue-container p-4 sm:p-8 rounded-lg max-w-[300px] sm:max-w-[400px] min-h-[120px] md:min-h-[200px] relative"
            onClick={() => { if(isMobile) updateDialogue((dialogueIndex + 1) % messages.length); }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
              border: '2px solid #1B44FA',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
              margin: '1rem auto 1.1rem',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isMobile ? '120px' : '150px',
              pointerEvents: 'auto',
              transition: 'box-shadow 0.3s ease'
            }}
          >
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
                width: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
                width: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              )}
            </div>
            
            {/* Navigation links without parallax effect */}
          <div ref={portfolioButtonRef} className="mt-2 flex flex-col items-center space-y-6 relative">
            <h2 className="font-georama text-3xl text-blue2 p-6"></h2>
            <Link 
              to="/portfolio" 
              className="bg-blue2 mt-10 text-white py-2 px-8 rounded-lg font-semibold uppercase tracking-wide hover:bg-blue3 transition duration-300 ease-in-out shadow-lg pointer-events-auto hover:scale-105"
              style={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
              }}
            >
              My Portfolio
            </Link>
          </div>
        </header>
      </div>
      
      {/* Foreground particles layer - fastest, largest particles */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none" 
        style={{ 
          height: '100vh', 
          width: '100vw',
          transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`,
          transition: 'transform 0.4s cubic-bezier(0.075, 0.82, 0.165, 1)',
          overflow: 'visible' // Allow particles to render outside container
        }}
      >
        <Particles
          particleColors={['#1B44FA', '#1B69FA']}
          particleCount={15}
          particleSpread={100}
          speed={0.1}
          particleBaseSize={600}
          moveParticlesOnHover={true}
          particleHoverFactor={0.1}
          alphaParticles={true}
          disableRotation={false}
          cameraDistance={12}
          className="particles-container-front"
        />
      </div>
      
      {/* Closest particles layer - very sparse, very large particles */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none w-full h-full" 
        style={{ 
          height: '100vh', 
          width: '100vw',
          transition: 'transform 0.2s cubic-bezier(0.075, 0.82, 0.165, 1)',
          overflow: 'visible' // Allow particles to render outside container
        }}
      >
        <Particles
          particleColors={['#1B44FA', '#1B69FA']}
          particleCount={6}
          particleSpread={40}
          speed={0.1}
          particleBaseSize={800}
          moveParticlesOnHover={true}
          particleHoverFactor={0.00001}
          alphaParticles={true}
          disableRotation={false}
          cameraDistance={8}
          className="particles-container-closest bg-blur-sm"
        />
      </div>
    </div>
  );
};

export default Hero;
