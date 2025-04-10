import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// Helper function to throttle function calls
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const MailPreview = ({ containerRef }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const outlineEffectRef = useRef(null);
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const fpsInterval = useRef(1000 / 30); // Target 30 FPS
  const lastFrameTime = useRef(0);

  const setupScene = useCallback((mount, container) => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent background
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 0.4; // Increased to ensure visibility
    camera.position.y = 0.05; // Slight adjustment to improve viewing angle
    
    // Initialize renderer with balanced settings for visibility and performance
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, // Re-enable antialiasing for visibility
      alpha: true,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    // Adjust pixel ratio for balanced performance/quality
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Optimize renderer settings
    renderer.physicallyCorrectLights = true; // Re-enable for better visual quality
    renderer.shadowMap.enabled = false;
    renderer.toneMappingExposure = 1.0; // Adjust exposure for visibility
    
    mount.appendChild(renderer.domElement);
    
    // Initialize OutlineEffect with settings that ensure visibility
    const outlineEffect = new OutlineEffect(renderer, {
      defaultThickness: 0.004, // Slightly thicker outline for visibility
      defaultColor: [0, 0, 0],
      defaultAlpha: 0.8
    });
    outlineEffectRef.current = outlineEffect;
    
    // Enhanced lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 4); // Increased intensity
    scene.add(ambientLight);
    
    // Add key light for better model definition
    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(1, 2, 1);
    scene.add(keyLight);
    
    // Add fill light from opposite side
    const fillLight = new THREE.DirectionalLight(0xffffff, 1);
    fillLight.position.set(-1, 0, -1);
    scene.add(fillLight);

    return { scene, camera, renderer };
  }, []);

  const loadModel = useCallback((scene) => {
    const loader = new GLTFLoader();
    
    // Add DRACO loader for compressed models if available
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/'); // Adjust path as needed
    loader.setDRACOLoader(dracoLoader);
    
    // Use cached resources when possible
    THREE.Cache.enabled = true;
    
    return new Promise((resolve, reject) => {
      // First try to load a lower-poly version if available
      loader.load(
        '/assets/Mail.gltf',
        (gltf) => {
          const model = gltf.scene;
          
          // Scale up slightly for better visibility
          model.scale.set(1.1, 1.1, 1.1);
          
          // Apply optimizations while ensuring visibility
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              // Keep necessary geometry features
              if (child.geometry) {
                // Remove unnecessary attributes but keep those needed for visibility
                if (child.geometry.attributes.uv2 && !child.material.lightMap) {
                  child.geometry.attributes.uv2 = undefined;
                }
              }
              
              if (child.material) {
                // Balance performance and visibility
                child.material.needsUpdate = true;
                child.material.fog = false;
                child.material.flatShading = false; // Keep smooth shading for better look
                
                // Enhance material visibility
                child.material.roughness = 0.7; // More defined surface
                child.material.metalness = 0.3; // Slight metallic look
                
                if (child.material.map) {
                  child.material.map.encoding = THREE.sRGBEncoding;
                  child.material.map.anisotropy = 2; // Balance between quality and performance
                  child.material.map.minFilter = THREE.LinearMipmapLinearFilter; // Better filtering for visibility
                  child.material.map.generateMipmaps = true; // Enable for distant viewing
                }
              }
              
              // Add to model reference
              child.frustumCulled = true; // Enable culling for performance
            }
          });
          
          scene.add(model);
          
          // Center the model - pre-calculate this once
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Position for optimal visibility
          model.position.y = 0.03; // Slight vertical adjustment
          
          // Optimal initial rotation
          model.rotation.x = 0.2;
          model.rotation.y = 0.5; // Start at angle for better visibility
          
          modelRef.current = model;
          resolve(model);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  }, []);

  // Throttle resize events to prevent excessive calculations
  const handleContainerResize = useCallback(throttle((e) => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    const { width, height } = e.detail;
    
    // Update camera
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    
    // Update renderer with constrained pixel ratio
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, 100), []); // Throttle to max once per 100ms

  const handleWindowResize = useCallback(throttle(() => {
    const container = containerRef?.current || mountRef.current;
    if (!cameraRef.current || !rendererRef.current || !container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, 100), [containerRef]); // Throttle to max once per 100ms

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    
    const container = containerRef?.current || mount;
    const { scene } = setupScene(mount, container);
    
    // Start the rendering clock
    clockRef.current.start();
    
    // Load model with error recovery
    loadModel(scene)
      .catch(error => {
        console.error('Failed to load model:', error);
        
        // Add fallback cube if model fails to load
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.02);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x4285f4, 
          roughness: 0.5, 
          metalness: 0.5 
        });
        const fallbackModel = new THREE.Mesh(geometry, material);
        scene.add(fallbackModel);
        modelRef.current = fallbackModel;
      });
    
    // Use adaptive FPS based on device performance
    const detectPerformance = () => {
      const fps = 1 / clockRef.current.getDelta();
      if (fps < 20) { // Low performance device
        fpsInterval.current = 1000/24; // Lower target FPS
      } else if (fps > 50) { // High performance device
        fpsInterval.current = 1000/40; // Higher target FPS
      }
    };
    
    // Check performance after a short delay
    setTimeout(detectPerformance, 1000);
    
    // More efficient animation loop
    let lastRotationTime = 0;
    const rotationSpeed = 0.5; // Degrees per second
    
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Throttle rendering to target FPS
      const currentTime = clockRef.current.getElapsedTime() * 1000;
      const elapsed = currentTime - lastFrameTime.current;
      
      if (elapsed > fpsInterval.current) {
        // Update time tracking with higher precision
        lastFrameTime.current = currentTime - (elapsed % fpsInterval.current);
        
        // Use time-based animation instead of frame-based
        const rotationDelta = (currentTime - lastRotationTime) / 1000;
        lastRotationTime = currentTime;
        
        // Only update model rotation on render frames with time-based animation
        if (modelRef.current) {
          modelRef.current.rotation.y += rotationSpeed * rotationDelta;
        }
        
        // Use OutlineEffect for rendering if available
        if (outlineEffectRef.current && cameraRef.current && sceneRef.current) {
          outlineEffectRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
    };
    
    animationIdRef.current = requestAnimationFrame(animate);
    
    // Set up event listeners
    if (containerRef?.current) {
      containerRef.current.addEventListener('container-resize', handleContainerResize);
    }
    
    window.addEventListener('resize', handleWindowResize);
    
    // Clean up
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      window.removeEventListener('resize', handleWindowResize);
      
      if (containerRef?.current) {
        containerRef.current.removeEventListener('container-resize', handleContainerResize);
      }
      
      if (mount && rendererRef.current?.domElement) {
        mount.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [containerRef, setupScene, loadModel, handleContainerResize, handleWindowResize]);
  
  return <div 
    ref={mountRef} 
    style={{ 
      width: '100%', 
      height: '100%', 
      borderRadius: '8px', 
      overflow: 'hidden',
      backgroundColor: 'rgba(0,0,0,0.01)' // Very slight background to help with model contrast
    }} 
  />;
};

export default React.memo(MailPreview);