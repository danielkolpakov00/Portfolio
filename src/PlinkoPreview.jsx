// src/PlinkoPreview.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PlinkoPreview = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#284af7'); // Set background color to blue
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Add spheres in a triangular layout
    const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const spheres = [];

    const rows = 5;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= row; col++) {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(col - row / 2, 0, -row);
        spheres.push(sphere);
        scene.add(sphere);
      }
    }

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Orbiting logic
      const time = Date.now() * 0.001;
      spheres.forEach((sphere, index) => {
        sphere.position.x += Math.sin(time + index) * 0.01;
        sphere.position.y += Math.cos(time + index) * 0.01;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '200px' }} />;
};

export default PlinkoPreview;