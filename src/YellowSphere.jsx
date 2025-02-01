// src/YellowSphere.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const YellowSphere = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Make background transparent
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    const points = [];
    const segments = 50;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(theta) * 2,
        Math.sin(theta) * 2,
        0
      ));
    }
   
   
// Create orbit trail
const trailGeometry = new THREE.BufferGeometry();
const trailMaterial = new THREE.LineBasicMaterial({ 
  color: 0x284af7,
  transparent: true,
  opacity: 0.3
});
trailGeometry.setFromPoints(points);
const trail = new THREE.Line(trailGeometry, trailMaterial);
scene.add(trail);
    // Create central sphere (sun)
    const sunGeometry = new THREE.CircleGeometry(0.5, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0x284af7 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create orbiting sphere
    const planetGeometry = new THREE.CircleGeometry(0.2, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.x = -1000;
    planet.position.z = 0.1; // Add this line to position planet above the line
    scene.add(planet);
 // Create orbit points

    
   
    camera.position.z = 5;

    // Animation loop with smoother motion
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      
      // Orbit animation
      planet.position.x = Math.cos(time * 0.5) * 2;
      planet.position.y = Math.sin(time * 0.5) * 2;

      // Gentle pulsing effect
      const pulse = Math.sin(time * 2) * 0.1 + 1;
      sun.scale.set(pulse, pulse, 1);
      
      // Rotate trail slightly
      trail.rotation.z = Math.sin(time * 0.1) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '200px' }} />;
};

export default YellowSphere;