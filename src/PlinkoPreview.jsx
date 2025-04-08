import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { isLowPerformanceDevice } from './utils/performanceUtils';

const PlinkoPreview = ({ containerRef, onLoad = () => {} }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const instancedMeshRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isLowPerformance = isLowPerformanceDevice();
  
  // Handle resize events with throttling
  const handleWindowResize = useCallback(() => {
    // Skip if refs aren't ready
    if (!cameraRef.current || !rendererRef.current) return;
    
    const container = containerRef?.current || mountRef.current;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, [containerRef]);

  // Initialize the scene - called only once
  useEffect(() => {
    if (isInitialized) return;
    
    const mount = mountRef.current;
    if (!mount) return;
    
    const container = containerRef?.current || mount;
    
    // For low-performance devices, show a static image instead
    if (isLowPerformance) {
      const placeholderImage = document.createElement('img');
      placeholderImage.src = '/assets/plinko-preview.jpg'; // Add a static preview image
      placeholderImage.alt = 'Plinko Game Preview';
      placeholderImage.style.width = '100%';
      placeholderImage.style.height = '100%';
      placeholderImage.style.objectFit = 'cover';
      mount.appendChild(placeholderImage);
      
      // Signal that loading is complete
      setIsInitialized(true);
      onLoad();
      
      return;
    }

    // Scene setup - reduced complexity for better performance
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent background
    
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 100);
    cameraRef.current = camera;
    camera.position.z = 10;
    
    // Limit pixel ratio to improve performance
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable antialiasing for performance
      alpha: true,
      powerPreference: 'default' // Don't force high-performance mode
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(pixelRatio);
    mount.appendChild(renderer.domElement);

    // Create pegs using instanced mesh for better performance
    const pegGeometry = new THREE.CircleGeometry(0.2, 8); // Reduced segments
    const pegMaterial = new THREE.MeshBasicMaterial({ color: 0x284af7 });
    
    // Arrange pegs in triangular formation
    const rows = 10; // Reduced number of rows
    const spacing = 1.4;
    
    // Calculate total number of pegs
    let pegCount = 0;
    for (let row = 0; row < rows; row++) {
      pegCount += (row + 2);
    }
    
    // Create instanced mesh for all pegs
    const instancedPegs = new THREE.InstancedMesh(pegGeometry, pegMaterial, pegCount);
    instancedMeshRef.current = instancedPegs;
    scene.add(instancedPegs);
    
    // Position pegs
    let index = 0;
    const matrix = new THREE.Matrix4();
    const pegs = [];
    
    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 2;
      for (let col = 0; col < pegsInRow; col++) {
        const x = (col * spacing) - ((pegsInRow - 1) * spacing / 2);
        const y = -(row * spacing * 0.866) + 4;
        
        matrix.setPosition(x, y, 0);
        instancedPegs.setMatrixAt(index, matrix);
        
        pegs.push({
          position: new THREE.Vector3(x, y, 0),
          radius: 0.2
        });
        
        index++;
      }
    }
    
    instancedPegs.instanceMatrix.needsUpdate = true;
    
    // Simple animation loop - only update what's necessary
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Schedule the next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Add resize listener
    window.addEventListener('resize', handleWindowResize);
    
    // Signal that component is loaded
    setIsInitialized(true);
    onLoad();
    
    // Clean up resources
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      renderer.dispose();
      pegGeometry.dispose();
      pegMaterial.dispose();
      instancedMeshRef.current?.dispose();
    };
  }, [containerRef, handleWindowResize, isInitialized, isLowPerformance, onLoad]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        background: 'transparent'
      }}
    />
  );
};

export default PlinkoPreview;