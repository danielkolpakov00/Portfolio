import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { debounce } from './lib/utils';

const PlinkoPreview = ({ containerRef }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  
  // Memoize event handlers with useCallback
  const handleContainerResize = useCallback((e) => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    const { width, height } = e.detail;
    
    // Update camera
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    
    // Update renderer
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
  }, []);
  
  const handleWindowResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    const container = containerRef?.current || mountRef.current;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, [containerRef]);

  useEffect(() => {
    const mount = mountRef.current;
    const container = containerRef?.current || mount;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Make background transparent
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    cameraRef.current = camera;
    
    // Set limited pixel ratio for better performance
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance' // Prefer GPU performance
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(pixelRatio);
    mount.appendChild(renderer.domElement);

    // Create pegs - use instanced mesh for better performance
    const pegGeometry = new THREE.CircleGeometry(0.2, 16); // Reduced segments for performance
    const pegMaterial = new THREE.MeshBasicMaterial({ color: 0x284af7 });
    const pegs = [];

    // Arrange pegs in triangular formation
    const rows = 12; // Increased number of rows
    const spacing = 1.4; // Adjusted spacing
    
    // Calculate total number of pegs for instancing optimization (if many pegs)
    let pegCount = 0;
    for (let row = 0; row < rows; row++) {
      pegCount += (row + 2);
    }
    
    // Use instancedMesh for many pegs (optimization)
    if (pegCount > 100) {
      const instancedPegs = new THREE.InstancedMesh(pegGeometry, pegMaterial, pegCount);
      scene.add(instancedPegs);
      
      let index = 0;
      const matrix = new THREE.Matrix4();
      
      for (let row = 0; row < rows; row++) {
        const pegsInRow = row + 2;  // Start with 2 pegs, increase by 1 each row
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
    } else {
      // Standard approach for fewer pegs
      for (let row = 0; row < rows; row++) {
        const pegsInRow = row + 2;  // Start with 2 pegs, increase by 1 each row
        for (let col = 0; col < pegsInRow; col++) {
          const peg = new THREE.Mesh(pegGeometry, pegMaterial);
          const x = (col * spacing) - ((pegsInRow - 1) * spacing / 2);
          const y = -(row * spacing * 0.866) + 4;
          
          peg.position.set(x, y, 0);
          pegs.push({
            position: peg.position,
            radius: 0.2
          });
          scene.add(peg);
        }
      }
    }

    // Create ball with adjusted initial position
    const ballGeometry = new THREE.CircleGeometry(0.4, 24); // Reduced segments
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    // Ball physics with adjusted values
    let ballVelocity = new THREE.Vector2(0, 0);
    const gravity = -12; // Increased gravity
    let lastTime = Date.now();

    function resetBall() {
      ball.position.set(0, 4, 0); // Start higher above the first row
      ballVelocity.set((Math.random() - 0.5) * 0.5, 0); // Reduced initial horizontal velocity
    }
    
    resetBall();

    camera.position.z = 15; // Adjusted camera distance

    // More efficient particle system implementation
    const MAX_PARTICLES = 30; // Limit max particles
    const particlePool = [];
    const activeParticles = [];
    
    // Pre-create particle pool for reuse
    const particleGeometry = new THREE.CircleGeometry(0.05, 8); // Reduced segments
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x284af7,
      transparent: true 
    });
    
    // Create particle pool
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
      particle.visible = false;
      scene.add(particle);
      particlePool.push(particle);
    }

    function createParticles(position) {
      for (let i = 0; i < 5; i++) {
        if (activeParticles.length >= MAX_PARTICLES) return;
        
        // Get particle from pool
        const particle = particlePool.pop();
        if (!particle) return;
        
        // Reset particle
        particle.position.copy(position);
        particle.material.opacity = 1.0;
        particle.visible = true;
        particle.velocity = new THREE.Vector2(
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 1
        );
        particle.lifetime = 1.0; // Lifetime in seconds
        
        activeParticles.push(particle);
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap deltaTime
      lastTime = currentTime;

      // Update ball physics
      ballVelocity.y += gravity * deltaTime;
      ball.position.x += ballVelocity.x * deltaTime;
      ball.position.y += ballVelocity.y * deltaTime;

      // Check collisions with pegs
      for (let i = 0; i < pegs.length; i++) {
        const peg = pegs[i];
        const dx = ball.position.x - peg.position.x;
        const dy = ball.position.y - peg.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.3) {
          // Reduced bounce velocity and added energy loss
          const angle = Math.atan2(dy, dx);
          ballVelocity.x = Math.cos(angle) * 3; // Reduced from 5 to 3
          ballVelocity.y = Math.sin(angle) * 3;
          
          // Add damping
          ballVelocity.x *= 0.8;
          ballVelocity.y *= 0.8;

          // Create particles on collision
          createParticles(peg.position);
          break; // Only handle one collision per frame for performance
        }
      }

      // Update active particles
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const particle = activeParticles[i];
        
        // Update position
        particle.position.x += particle.velocity.x * deltaTime;
        particle.position.y += particle.velocity.y * deltaTime;
        particle.velocity.y += gravity * deltaTime * 0.1; // Apply gravity to particles
        
        // Update lifetime and opacity
        particle.lifetime -= deltaTime;
        particle.material.opacity = particle.lifetime;
        
        // Return to pool if expired
        if (particle.lifetime <= 0 || particle.position.y < -10) {
          particle.visible = false;
          activeParticles.splice(i, 1);
          particlePool.push(particle);
        }
      }

      // Reset ball if it goes off screen
      if (ball.position.y < -10) { // Adjusted reset position
        resetBall();
      }

      renderer.render(scene, camera);
    };
    
    const animateId = requestAnimationFrame(animate);
    
    // Apply debounce to resize handlers
    const debouncedWindowResize = debounce(handleWindowResize, 150);
    
    // Listen for the custom resize event dispatched by ProjectWidget
    if (containerRef?.current) {
      containerRef.current.addEventListener('container-resize', handleContainerResize);
    }

    // Use debounced window resize handler
    window.addEventListener('resize', debouncedWindowResize);

    // Cleanup on unmount - properly dispose THREE.js resources
    return () => {
      cancelAnimationFrame(animateId);
      
      // Remove event listeners
      window.removeEventListener('resize', debouncedWindowResize);
      if (containerRef?.current) {
        containerRef.current.removeEventListener('container-resize', handleContainerResize);
      }
      
      // Properly dispose THREE.js resources
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        
        if (object.material) {
          // Handle both array of materials and single material
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      // Dispose renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mount && rendererRef.current.domElement) {
          mount.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [containerRef, handleContainerResize, handleWindowResize]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }} />;
};

export default React.memo(PlinkoPreview); // Memoize component to prevent unnecessary re-renders