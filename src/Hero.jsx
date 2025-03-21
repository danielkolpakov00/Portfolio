import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import dk9Url from '@/assets/models/dk9.glb'; // Import the GLTF model
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import './index.css';
import TypeIt from "typeit-react";
import { Link } from 'react-router-dom';

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

  return (
    <div className={`flex items-center justify-center min-h-screen bg-offwhite p-0 ${isOpen ? 'border-4 border-blue2' : ''}`}>
      <header className="text-center">
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
          <TypeIt className="font-georama text-3xl text-blue2 p-6">Web Developer.</TypeIt>
          <Link to="/portfolio" className="bg-blue2 mt-10 text-white py-2 px-8 rounded-lg font-semibold uppercase tracking-wide hover:bg-blue3 transition duration-300 ease-in-out shadow-lg">My Portfolio</Link> 
        </div>
      </header>
    </div>
  );
};

export default Hero;
