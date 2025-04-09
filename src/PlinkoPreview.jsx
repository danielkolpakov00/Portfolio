import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const PlinkoPreview = ({ containerRef }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const ballsRef = useRef([]);

  useEffect(() => {
    const mount = mountRef.current;
    const container = containerRef?.current || mount;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent background
    
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
    const pegMaterial = new THREE.LineBasicMaterial({ color: 0x1B69FA }); // Blue pegs like in the BedroomPreview
    const ballMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red ball like furniture in BedroomPreview
    
    // Plinko board container
    const plinkoGroup = new THREE.Group();

    // Create pegs in a perfect triangular pattern
    const createPegs = () => {
      const rows = 8; // Number of rows in the triangular pattern
      const pegRadius = 0.08;
      const pegSpacingY = 0.4;
      const pegSpacingX = 0.45;
      const pegsArray = [];
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
          // Calculate position in the triangular grid
          // Center each row horizontally
          const x = (col - row/2) * pegSpacingX;
          const y = 1.5 - row * pegSpacingY;
          
          // Create peg outline (circle)
          const pegPoints = [];
          const segments = 16;
          
          for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            pegPoints.push(
              new THREE.Vector3(
                x + Math.cos(angle) * pegRadius,
                y + Math.sin(angle) * pegRadius,
                0
              )
            );
          }
          
          const pegGeometry = new THREE.BufferGeometry().setFromPoints(pegPoints);
          const peg = new THREE.Line(pegGeometry, pegMaterial);
          
          // Store the peg center and radius for collision detection
          peg.userData = {
            center: new THREE.Vector2(x, y),
            radius: pegRadius,
            id: `peg-${row}-${col}`
          };
          
          pegsArray.push(peg);
          plinkoGroup.add(peg);
        }
      }
      
      return pegsArray;
    };

    // Create balls that will bounce through the pegs
    const createBallSystem = () => {
      const maxBalls = 5;
      const spawnInterval = 800; // ms between ball spawns
      let lastSpawnTime = 0;
      
      const createBall = () => {
        const ballRadius = 0.08;
        const ballPoints = [];
        const segments = 16;
        
        // Create ball outline (circle)
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          ballPoints.push(
            new THREE.Vector3(
              Math.cos(angle) * ballRadius,
              Math.sin(angle) * ballRadius,
              0
            )
          );
        }
        
        const ballGeometry = new THREE.BufferGeometry().setFromPoints(ballPoints);
        const ball = new THREE.Line(ballGeometry, ballMaterial);
        
        // Random starting position at the top
        const startX = (Math.random() * 1.0) - 0.5; 
        ball.position.set(startX, 2, 0);
        
        // Physics properties
        ball.userData = {
          radius: ballRadius,
          velocity: new THREE.Vector2(0, 0),
          pegCollisions: new Map(), // Track collisions with pegs to prevent multiple bounces
          lastBounceTime: 0,
          bounceCooldown: 200, // ms between bounces
          passThrough: Math.random() > 0.4 // 60% chance to initially try passing through
        };
        
        plinkoGroup.add(ball);
        ballsRef.current.push(ball);
        
        return ball;
      };
      
      const updateBalls = (pegs, deltaTime) => {
        const now = performance.now();
        const gravity = new THREE.Vector2(0, -0.001); // Already optimized gravity
        
        // Throttle ball creation based on performance
        if (now - lastSpawnTime > spawnInterval && 
            ballsRef.current.length < maxBalls && 
            document.visibilityState === 'visible' &&
            !document.hidden) {
          createBall();
          lastSpawnTime = now;
        }
        
        // Use a spatial partitioning approach (simple grid)
        const spatialGrid = {}; // Simple spatial hash for pegs
        const cellSize = 0.5; // Size of each grid cell
        
        // Only build the spatial grid once per frame
        pegs.forEach(peg => {
          const gridX = Math.floor(peg.userData.center.x / cellSize);
          const gridY = Math.floor(peg.userData.center.y / cellSize);
          const key = `${gridX},${gridY}`;
          
          if (!spatialGrid[key]) spatialGrid[key] = [];
          spatialGrid[key].push(peg);
        });
        
        // Process all existing balls with spatial optimization
        for (let i = ballsRef.current.length - 1; i >= 0; i--) {
          const ball = ballsRef.current[i];
          
          // Apply gravity
          ball.userData.velocity.add(gravity);
          
          let forceVector = new THREE.Vector2(0, 0);
          let didBounce = false;
          
          // Only check pegs that are in nearby cells
          const ballGridX = Math.floor(ball.position.x / cellSize);
          const ballGridY = Math.floor(ball.position.y / cellSize);
          
          // Check the ball's cell and adjacent cells
          for (let gx = ballGridX - 1; gx <= ballGridX + 1; gx++) {
            for (let gy = ballGridY - 1; gy <= ballGridY + 1; gy++) {
              const key = `${gx},${gy}`;
              const cellPegs = spatialGrid[key];
              
              if (!cellPegs) continue;
              
              for (const peg of cellPegs) {
                const pegCenter = peg.userData.center;
                const dx = ball.position.x - pegCenter.x;
                const dy = ball.position.y - pegCenter.y;
                
                // Early culling with squared distance for performance
                const distanceSq = dx*dx + dy*dy;
                const pegId = peg.userData.id;
                const collisionDistanceSq = Math.pow(peg.userData.radius + ball.userData.radius, 2);
                
                // Skip distant pegs
                if (distanceSq > collisionDistanceSq * 4) continue;
                
                const distance = Math.sqrt(distanceSq);
                const collisionDistance = peg.userData.radius + ball.userData.radius;
                
                // The rest of collision detection remains the same
                if (ball.userData.passThrough) {
                  const influenceDistance = peg.userData.radius * 4;
                  if (distance < influenceDistance) {
                    const nx = dx / distance;
                    const ny = dy / distance;
                    
                    const strength = (1.0 - distance / influenceDistance) * 0.0003;
                    
                    forceVector.x += nx * strength;
                    forceVector.y += ny * strength;
                    
                    if (distance < collisionDistance * 1.1 && Math.random() < 0.3) {
                      ball.userData.passThrough = false;
                    }
                  }
                } else {
                  if (distance < collisionDistance && 
                      now - ball.userData.lastBounceTime > ball.userData.bounceCooldown &&
                      (!ball.userData.pegCollisions.has(pegId) || 
                       now - ball.userData.pegCollisions.get(pegId) > 1000)) {
                    
                    const nx = dx / distance;
                    const ny = dy / distance;
                    
                    const vn = ball.userData.velocity.x * nx + ball.userData.velocity.y * ny;
                    
                    if (vn < 0) {
                      const restitution = 0.4;
                      const impulse = (-(1 + restitution) * vn);
                      
                      ball.userData.velocity.x += impulse * nx;
                      ball.userData.velocity.y += impulse * ny;
                      
                      ball.userData.velocity.x += (Math.random() - 0.5) * 0.0001;
                      
                      const overlap = collisionDistance - distance;
                      ball.position.x += overlap * nx * 1.01;
                      ball.position.y += overlap * ny * 1.01;
                      
                      ball.userData.pegCollisions.set(pegId, now);
                      ball.userData.lastBounceTime = now;
                      
                      if (Math.random() < 0.7) {
                        ball.userData.passThrough = true;
                      }
                      
                      ball.userData.bounceCount = (ball.userData.bounceCount || 0) + 1;
                      
                      didBounce = true;
                      break;
                    }
                  }
                }
              }
              if (didBounce) break;
            }
            if (didBounce) break;
          }
          
          if (!didBounce) {
            ball.userData.velocity.add(forceVector);
          }
          
          ball.userData.velocity.x *= 0.97;
          
          ball.position.x += ball.userData.velocity.x;
          ball.position.y += ball.userData.velocity.y;
          
          if (ball.position.y < -2 || 
              (ball.userData.bounceCount > 4 && ball.position.y < -1)) {
            plinkoGroup.remove(ball);
            ballsRef.current.splice(i, 1);
          }
        }
      };

      return { updateBalls };
    };
    
    const pegs = createPegs();
    const ballSystem = createBallSystem();
    
    scene.add(plinkoGroup);

    // Set camera position
    camera.position.z = 5;

    // Animation loop with requestAnimationFrame throttling
    let lastTime = 0;
    let animationThrottle = false;
    const animate = (time) => {
      const deltaTime = lastTime ? time - lastTime : 0;
      
      if (!animationThrottle || time - lastTime > 16) { // Target ~60fps, skip frames if needed
        lastTime = time;
        
        if (!document.hidden) {
          plinkoGroup.position.y = Math.sin(time * 0.0005) * 0.02;
          
          ballSystem.updateBalls(pegs, deltaTime);
          
          renderer.render(scene, camera);
        }
        
        animationThrottle = false;
      } else {
        animationThrottle = true;
      }
      
      return requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Use passive event listeners for better performance
    const passiveEventOptions = { passive: true };

    // Handle container resize with the custom event
    const handleContainerResize = (e) => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      const { width, height } = e.detail;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
    };
    
    if (containerRef?.current) {
      containerRef.current.addEventListener('container-resize', handleContainerResize);
    }

    // Also handle standard window resize as a fallback with debouncing
    let resizeTimeout;
    const handleWindowResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      
      resizeTimeout = setTimeout(() => {
        if (!cameraRef.current || !rendererRef.current || !container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }, 100); // Debounce resize events
    };
    window.addEventListener('resize', handleWindowResize, passiveEventOptions);

    return () => {
      cancelAnimationFrame(animationId);
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

export default PlinkoPreview;