import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const MailPreview = ({ containerRef }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // Make sure mount exists before proceeding
    const mount = mountRef.current;
    if (!mount) return;
    const container = containerRef?.current || mount;

    // Scene setup - match PlinkoPreview's transparent background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Make background transparent like PlinkoPreview
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 0.3;
    camera.position.y = +0.1;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true  // Match PlinkoPreview's alpha setting
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);
    
    // Load the 3D model
    let mailModel;
    const loader = new GLTFLoader();
    
    loader.load(
      '/assets/Mail.glb', // Check if this path is correct
      (gltf) => {
        mailModel = gltf.scene;
        mailModel.scale.set(1, 1, 1);
        scene.add(mailModel);
        console.log('Mail model loaded successfully');
        // Center the model
        const box = new THREE.Box3().setFromObject(mailModel);
        const center = box.getCenter(new THREE.Vector3());
        mailModel.position.sub(center);
        // Store the initial rotation for the notification bell shake
        mailModel.initialRotation = mailModel.rotation.z;
        console.log('Mail model loaded successfully');
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (mailModel) {
        const t = performance.now() / 1000; // seconds
        const cycleDuration = 2; // total cycle period: shake then pause
        const shakeDuration = 1; // shake for first 1 second, then pause
        const cycleTime = t % cycleDuration;
        let shakeAngle = 0;
        if (cycleTime < shakeDuration) {
          const fastFrequency = 5; // fast shake frequency
          const u = cycleTime / shakeDuration; // normalized time [0, 1]
          const envelope = Math.sin(Math.PI * u); // easing: 0 at start/end, 1 mid-shake
          shakeAngle = 0.1 * envelope * Math.sin(2 * Math.PI * fastFrequency * cycleTime);
        }
        mailModel.rotation.z = mailModel.initialRotation + shakeAngle;
      }
      
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
    
    // Clean up
    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', handleWindowResize);
      if (containerRef?.current) {
        containerRef.current.removeEventListener('container-resize', handleContainerResize);
      }
      if (mount && rendererRef.current?.domElement) {
        mount.removeChild(rendererRef.current.domElement);
      }
      scene.clear();
    };
  }, [containerRef]);
  
  // Match container dimensions
  return <div ref={mountRef} style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }} />;
};

export default MailPreview;