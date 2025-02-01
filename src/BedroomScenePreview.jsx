// src/BedroomPreview.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BedroomScenePreview = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Materials
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1B69FA });
    
    // Room container
    const roomGroup = new THREE.Group();




const bedMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });


    // Floor outline
    const floorGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2, -1, -2),
      new THREE.Vector3(2, -1, -2),
      new THREE.Vector3(2, -1, 2),
      new THREE.Vector3(-2, -1, 2),
      new THREE.Vector3(-2, -1, -2),
    ]);
    const floor = new THREE.Line(floorGeometry, lineMaterial);
    roomGroup.add(floor);
  

    // Walls outlines
    const wallsGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2, -1, -2),
      new THREE.Vector3(-2, 2, -2),
      new THREE.Vector3(2, 2, -2),
      new THREE.Vector3(2, -1, -2),
      new THREE.Vector3(2, -1, 2),
      new THREE.Vector3(2, 2, 2),
      new THREE.Vector3(2, 2, -2),
    ]);
    const walls = new THREE.Line(wallsGeometry, lineMaterial);
    roomGroup.add(walls);

    // Bed outline
    const bedGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.5, -0.9, -1.5),
      new THREE.Vector3(-0.5, -0.9, -1.5),
      new THREE.Vector3(-0.5, -0.9, 0),
      new THREE.Vector3(-1.5, -0.9, 0),
      new THREE.Vector3(-1.5, -0.9, -1.5),
      new THREE.Vector3(-1.5, -0.5, -1.5),
      new THREE.Vector3(-0.5, -0.5, -1.5),
      new THREE.Vector3(-0.5, -0.5, 0),
      new THREE.Vector3(-1.5, -0.5, 0),
      new THREE.Vector3(-1.5, -0.5, -1.5),
    ]);
    const bed = new THREE.Line(bedGeometry, bedMaterial);
    roomGroup.add(bed);


    const deskMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });


    // Desk outline
    const deskGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.5, -0.9, -1.5),
      new THREE.Vector3(1.5, -0.9, -1.5),
      new THREE.Vector3(1.5, -0.9, -0.5),
      new THREE.Vector3(0.5, -0.9, -0.5),
      new THREE.Vector3(0.5, -0.9, -1.5),
      new THREE.Vector3(0.5, -0.3, -1.5),
      new THREE.Vector3(1.5, -0.3, -1.5),
      new THREE.Vector3(1.5, -0.3, -0.5),
      new THREE.Vector3(0.5, -0.3, -0.5),
      new THREE.Vector3(0.5, -0.3, -1.5),
    ]);
    const desk = new THREE.Line(deskGeometry, deskMaterial);
    roomGroup.add(desk);

    scene.add(roomGroup);

    // Set camera position for isometric view
    camera.position.set(5, 4, 5);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gentle floating motion
      roomGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      roomGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
      
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

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '200px' }} />;
};

export default BedroomScenePreview;