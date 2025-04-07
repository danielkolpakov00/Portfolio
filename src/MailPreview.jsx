import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';

const MailPreview = ({ containerRef }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const outlineEffectRef = useRef(null);

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
    camera.position.y = 0;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,  // Match PlinkoPreview's alpha setting
      preserveDrawingBuffer: true
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding; // Add this to preserve colors
    renderer.physicallyCorrectLights = true; // Better lighting for PBR materials
    mount.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);
    
    // Add directional light to make outlines more visible
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Load the 3D model
    let mailModel;
    const loader = new GLTFLoader();
    
    loader.load(
      '/assets/Mail.gltf', // Check if this path is correct
      (gltf) => {
        mailModel = gltf.scene;
        mailModel.scale.set(1, 1, 1);
        
        // Ensure materials are properly applied
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            // Ensure the material is properly configured
            if (child.material) {
              child.material.needsUpdate = true;
              // If the material has a map/texture
              if (child.material.map) {
                child.material.map.encoding = THREE.sRGBEncoding;
              }
            }
          }
        });
        
        scene.add(mailModel);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(mailModel);
        const center = box.getCenter(new THREE.Vector3());
        mailModel.position.sub(center);
        
        // Add a slight tilt for better visibility
        mailModel.rotation.x = 0.2;
        
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
        // Continuous rotation - only rotate around Y axis
        mailModel.rotation.y += 0.01;
        
        // Removed shake effect code
      }
      
      // Use OutlineEffect for rendering instead of regular renderer
      if (outlineEffectRef.current) {
        outlineEffectRef.current.render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }
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