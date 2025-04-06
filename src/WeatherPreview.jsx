import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { debounce } from './lib/utils';

const WeatherPreview = ({ containerRef }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  
  // Use useCallback to prevent recreation of these functions on each render
  const handleContainerResize = useCallback((e) => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    const { width, height } = e.detail;
    
    // Update camera
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    
    // Update renderer
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
  }, []);
  
  const handleWindowResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;
    
    const container = containerRef?.current || mountRef.current;
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
    
    // Create a renderer with lower pixel ratio for mobile devices
    const pixelRatio = Math.min(window.devicePixelRatio, 2); // Limit max pixelRatio to 2
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance' // Prefer GPU performance
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(pixelRatio);
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Create sky backdrop - ensure same width as ground (10 units)
    const skyGeometry = new THREE.PlaneGeometry(10, 5);
    const skyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x87CEEB,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.position.z = -2;
    sky.position.y = 1;
    sky.position.x = 0; // Explicitly center the sky horizontally
    scene.add(sky);
    
    // Create sun - added first to render behind the ground
    const sunGeometry = new THREE.CircleGeometry(0.6, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFD700,
      transparent: true,
      opacity: 1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.z = -1.5;
    scene.add(sun);
    
    // Create moon - also added before ground
    const moonGeometry = new THREE.CircleGeometry(0.5, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xECF0F1,
      transparent: true,
      opacity: 0
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.z = -1.5;
    scene.add(moon);
    
    // Create horizon/ground - same width as sky (10 units)
    const groundGeometry = new THREE.PlaneGeometry(10, 2);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -2;
    ground.position.z = -1;
    ground.position.x = 0; // Explicitly center the ground horizontally
    scene.add(ground);
    
    // Create clouds
    const clouds = [];
    const cloudCount = 5;
    
    for (let i = 0; i < cloudCount; i++) {
      const cloudGroup = new THREE.Group();
      
      // Create multiple circle segments for each cloud
      const segmentCount = Math.floor(Math.random() * 3) + 3;
      for (let j = 0; j < segmentCount; j++) {
        const size = Math.random() * 0.3 + 0.2;
        const cloudSegGeometry = new THREE.CircleGeometry(size, 16);
        const cloudSegMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xFFFFFF, 
          transparent: true, 
          opacity: 0.8 
        });
        const cloudSegment = new THREE.Mesh(cloudSegGeometry, cloudSegMaterial);
        cloudSegment.position.x = j * 0.2;
        cloudSegment.position.y = Math.random() * 0.1;
        cloudGroup.add(cloudSegment);
      }
      
      // Position the cloud
      cloudGroup.position.x = Math.random() * 8 - 4;
      cloudGroup.position.y = Math.random() * 1.5 - 0.5;
      cloudGroup.position.z = -0.5;
      cloudGroup.userData = {
        speed: Math.random() * 0.01 + 0.002,
        originalX: cloudGroup.position.x
      };
      
      scene.add(cloudGroup);
      clouds.push(cloudGroup);
    }

    // Add stars (visible at night)
    const stars = [];
    const starCount = 100;
    const starGeometry = new THREE.CircleGeometry(0.02, 8);
    const starMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFFFF, 
      transparent: true, 
      opacity: 0 
    });
    
    for (let i = 0; i < starCount; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.x = Math.random() * 10 - 5;
      star.position.y = Math.random() * 4 - 1;
      star.position.z = -1.5;
      scene.add(star);
      stars.push(star);
    }
    
    camera.position.z = 5;

    // Animation loop with day/night cycle
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.0005;
      const dayNightCycle = (Math.sin(time) + 1) / 2; // 0 to 1 value representing day (1) to night (0)
      
      // Update sky color
      const skyColor = new THREE.Color();
      if (dayNightCycle > 0.5) {
        // Day
        skyColor.setRGB(
          0.53 + (dayNightCycle - 0.5) * 0.44, // More blue during day
          0.81 + (dayNightCycle - 0.5) * 0.38,
          0.92 + (dayNightCycle - 0.5) * 0.16
        );
      } else {
        // Night
        skyColor.setRGB(
          0.05 + dayNightCycle * 0.96, // Darker blue at night
          0.05 + dayNightCycle * 1.52,
          0.2 + dayNightCycle * 1.44
        );
      }
      skyMaterial.color = skyColor;
      
      // Sun/Moon positioning - full continuous circle motion
      const fullCircle = time % (Math.PI * 2);
      
      // Sun position - moves in a continuous circle
      sun.position.x = Math.cos(fullCircle) * 4;
      sun.position.y = Math.sin(fullCircle) * 4 - 1.5; // Offset to make it rise/set below horizon
      
      // Sun opacity - visible only when above horizon (y > -1.5)
      sun.material.opacity = sun.position.y > -1.5 ? 
        Math.min(1, (sun.position.y + 1.5) * 2) : 0;
      
      // Moon position - opposite side of the circle from sun
      moon.position.x = Math.cos(fullCircle + Math.PI) * 4;
      moon.position.y = Math.sin(fullCircle + Math.PI) * 4 - 1.5; // Same offset as sun
      
      // Moon opacity - visible only when above horizon (y > -1.5)
      moon.material.opacity = moon.position.y > -1.5 ? 
        Math.min(1, (moon.position.y + 1.5) * 2) : 0;
      
      // Cloud movement and opacity update
      clouds.forEach(cloud => {
        cloud.position.x -= cloud.userData.speed;
        
        // Update opacity for each cloud segment
        cloud.children.forEach(segment => {
          if (segment.material) {
            segment.material.opacity = 0.8 * dayNightCycle + 0.2;
          }
        });
        
        // Reset cloud position when it goes off-screen
        if (cloud.position.x < -5) {
          cloud.position.x = 5;
        }
      });
      
      // Star visibility (only at night)
      stars.forEach(star => {
        star.material.opacity = Math.max(0, 0.7 - dayNightCycle * 1.5);
        // Twinkle effect
        if (star.material.opacity > 0) {
          star.material.opacity *= (0.85 + Math.sin(time * 10 + star.position.x * 10) * 0.15);
        }
      });

      // Ground color changes slightly with daylight
      // Calculate time of day factor based on sun position
      const dayFactor = Math.max(0, Math.min(1, (sun.position.y + 2) / 4));
      
      const groundColor = new THREE.Color();
      groundColor.setRGB(
        0.05 + dayFactor * 0.08,
        0.2 + dayFactor * 0.35,
        0.05 + dayFactor * 0.08
      );
      groundMaterial.color = groundColor;

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
      
      // Dispose meshes and materials
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

export default React.memo(WeatherPreview); // Memoize component to prevent unnecessary re-renders
