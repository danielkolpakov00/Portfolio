// src/YellowSphere.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const YellowSphere = () => {
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

    // Add a yellow sphere to the scene
    const yellowGeometry = new THREE.SphereGeometry(1, 32, 32);
    const yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const yellowSphere = new THREE.Mesh(yellowGeometry, yellowMaterial);
    scene.add(yellowSphere);

    // Add a white sphere to the scene
    const whiteGeometry = new THREE.SphereGeometry(1, 32, 32);
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const whiteSphere = new THREE.Mesh(whiteGeometry, whiteMaterial);
    scene.add(whiteSphere);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Random orbiting logic
      const time = Date.now() * 0.001;
      yellowSphere.position.x = Math.sin(time) * 2;
      yellowSphere.position.y = Math.cos(time) * 2;
      whiteSphere.position.x = Math.sin(time + Math.PI) * 2;
      whiteSphere.position.y = Math.cos(time + Math.PI) * 2;

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

export default YellowSphere;