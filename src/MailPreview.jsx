import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const MailPreview = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Make sure mount exists before proceeding
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup - match PlinkoPreview's transparent background
    const scene = new THREE.Scene();
    scene.background = null; // Make background transparent like PlinkoPreview
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      mount.clientWidth / mount.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 0.3;
    camera.position.y = +0.1;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true  // Match PlinkoPreview's alpha setting
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);
    

    // Animation to shake the mail model every second
   

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
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mount) return;
      
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);
  
  // Match PlinkoPreview's container dimensions exactly
  return <div ref={mountRef} style={{ width: '100%', height: '200px' }} />;
};

export default MailPreview;