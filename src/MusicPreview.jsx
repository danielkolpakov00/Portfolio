import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MusicPreview = ({ containerRef }) => {
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
    scene.background = null; // Make background transparent
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Create blue sphere
    const blueSphere = new THREE.Points(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.05,
      })
    );
    scene.add(blueSphere);

    // Modify vertex colors for red particles
    const positions = blueSphere.geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i += 3) {
      if ((i / 3) % 3 === 0) {
        colors[i] = 1;     // FF - Red
        colors[i + 1] = 0; // 00 - Green
        colors[i + 2] = 0; // 00 - Blue
      } else {
        colors[i] = 0.156;     // Blue (existing values)
        colors[i + 1] = 0.290;
        colors[i + 2] = 0.969;
      }
    }
    blueSphere.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    blueSphere.material.vertexColors = true;

    // Store original vertex positions
    const originalPositions = positions.slice();
    
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update vertices positions for warping effect
      const time = Date.now() * 0.001;
      
      for(let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];
        
        // Create warping effect using sine waves
        const intensity = 0.3;
        const frequency = 2;
        
        positions[i] = x + Math.sin(time + y) * intensity;
        positions[i + 1] = y + Math.cos(time + x) * intensity;
        positions[i + 2] = z + Math.sin(time + x + y) * intensity;
      }
      
      blueSphere.geometry.attributes.position.needsUpdate = true;
      blueSphere.rotation.y += 0.001;
      
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

    // Clean up on component unmount
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

export default MusicPreview;