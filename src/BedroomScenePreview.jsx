// src/BedroomPreview.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BedroomScenePreview = ({ containerRef }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const container = containerRef?.current || mount;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null;
    
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Materials
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1B69FA });
    const bedMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const deskMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    
    // Room container
    const roomGroup = new THREE.Group();

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
    const animateId = requestAnimationFrame(animate);

    // Handle container resize with the custom event
    const handleContainerResize = (e) => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      const { width, height } = e.detail;
      
      // Update camera
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
    };
    
    // Listen for the custom resize event dispatched by ProjectWidget
    if (containerRef?.current) {
      containerRef.current.addEventListener('container-resize', handleContainerResize);
    }

    // Also handle standard window resize as a fallback
    const handleWindowResize = () => {
      if (!cameraRef.current || !rendererRef.current || !container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', handleWindowResize);
      if (containerRef?.current) {
        containerRef.current.removeEventListener('container-resize', handleContainerResize);
      }
      if (mount && rendererRef.current?.domElement) {
        mount.removeChild(rendererRef.current.domElement);
      }
    };
  }, [containerRef]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }} />;
};

export default BedroomScenePreview;