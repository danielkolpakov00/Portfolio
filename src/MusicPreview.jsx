import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const MusicPreview = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#284af7'); // Set background color to blue
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Load the music note model
    const loader = new GLTFLoader();
    loader.load(process.env.PUBLIC_URL + '/assets/models/MusicNote.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(1000, 1000, 1000); // Scale the model up significantly

      // Change the model's material color to white
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        }
      });

      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      // Reset the model's anchor point to the center
      const pivot = new THREE.Group();
      pivot.add(model);
      scene.add(pivot);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        pivot.rotation.x += 0.01;
        pivot.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    });

    camera.position.z = 300; // Move the camera back to accommodate the larger model

    // Handle window resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '200px' }} />;
};

export default MusicPreview;