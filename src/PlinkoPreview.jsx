// src/PlinkoPreview.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PlinkoPreview = () => {
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

    // Create pegs
    const pegGeometry = new THREE.CircleGeometry(0.2, 32);
    const pegMaterial = new THREE.MeshBasicMaterial({ color: 0x284af7 });
    const pegs = [];

    // Arrange pegs in triangular formation
    const rows = 12; // Increased number of rows
    const spacing = 1.4; // Adjusted spacing
    
    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 2;  // Start with 2 pegs, increase by 1 each row
      for (let col = 0; col < pegsInRow; col++) {
        const peg = new THREE.Mesh(pegGeometry, pegMaterial);
        peg.position.set(
          (col * spacing) - ((pegsInRow - 1) * spacing / 2),
          -(row * spacing * 0.866) + 4, // Build downward from top, adjusted starting position
          0
        );
        pegs.push(peg);
        scene.add(peg);
      }
    }

    // Create ball with adjusted initial position
    const ballGeometry = new THREE.CircleGeometry(0.4, 32);
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

    // Particle system setup
    const particleGeometry = new THREE.CircleGeometry(0.05, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x284af7 });
    const particles = [];

    function createParticles(position) {
      for (let i = 0; i < 5; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);
        particle.velocity = new THREE.Vector2(
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 1
        );
        particles.push(particle);
        scene.add(particle);
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update ball physics
      ballVelocity.y += gravity * deltaTime;
      ball.position.x += ballVelocity.x * deltaTime;
      ball.position.y += ballVelocity.y * deltaTime;

      // Check collisions with pegs
      pegs.forEach(peg => {
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
        }
      });

      // Update particles
      particles.forEach((particle, index) => {
        particle.position.x += particle.velocity.x * deltaTime;
        particle.position.y += particle.velocity.y * deltaTime;
        particle.velocity.y += gravity * deltaTime * 0.1; // Apply gravity to particles

        // Remove particles if they go off screen
        if (particle.position.y < -10) {
          scene.remove(particle);
          particles.splice(index, 1);
        }
      });

      // Reset ball if it goes off screen
      if (ball.position.y < -10) { // Adjusted reset position
        resetBall();
      }

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