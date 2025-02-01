import React, { useEffect, useRef, Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import dk9Url from '@/assets/models/DK9.glb'; // Import the GLTF model
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import '../index.css';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import TsParticles from '../components/TsParticles';

const DKModel = () => {
  const groupRef = useRef();
  const { scene } = useGLTF(dk9Url); // Use the imported URL

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Adjust rotation speed as desired
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene} scale={0.2} />
    </group>
  );
};

const Hero = ({ isOpen }) => {
  const location = useLocation();
  const canvasContainerRef = useRef();
  const [init, setInit] = useState(false);

  useEffect(() => {
    const adjustCanvasSize = () => {
      if (canvasContainerRef.current) {
        canvasContainerRef.current.style.width = '100%';
        canvasContainerRef.current.style.height = '50vh';
      }
    };

    // Adjust canvas size on component mount and on location change
    adjustCanvasSize();
    window.addEventListener('resize', adjustCanvasSize);

    return () => window.removeEventListener('resize', adjustCanvasSize);
  }, [location.pathname]); // Run effect whenever route changes

  useEffect(() => {
    const tl = gsap.timeline();
    if (document.querySelector(".hero-text-hello")) {
      tl.fromTo(".hero-text-hello", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    }
    if (document.querySelector(".title-area")) {
      tl.fromTo(".title-area", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=0.5");
    }
  }, []);

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#f5fdff", // matches offwhite
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 3,
          },
          repulse: {
            distance: 150,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#1B69FA", // matches blue1
        },
        links: {
          color: "#1B44FA", // matches blue2
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 100,
        },
        opacity: {
          value: 0.4,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 2, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <div className={`relative flex items-center justify-center min-h-screen bg-offwhite p-0 ${isOpen ? 'border-4 border-blue2' : ''}`}>
      <TsParticles />
      
      <header className="text-center relative z-10">
        <div 
          className="title-area" 
          ref={canvasContainerRef} 
          style={{ width: '100vw', height: '50vh' }} // Ensure full width and height in viewport units
        >
          <Canvas
            style={{ width: '100%', height: '100%' }}
            resize={{ scroll: false }} // Disable scroll-based resizing
            camera={{ position: [0, 2, 5], fov: 90 }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={2} />
              <DKModel />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Links and Icons Below the 3D Model */}
        <div className="mt-4 flex flex-col items-center space-y-6">
          <h2 className="font-georama text-3xl text-blue2 p-6">Web Developer.</h2>
          <Link to="/portfolio" className="bg-blue2 mt-10 text-white py-2 px-8 rounded-lg font-semibold uppercase tracking-wide hover:bg-blue3 transition duration-300 ease-in-out shadow-lg">My Portfolio</Link> 
        </div>
      </header>
    </div>
  );
};

export default Hero;
