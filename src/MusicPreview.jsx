import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MusicPreview = () => {
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

    // Create blue sphere
    const blueSphere = new THREE.Points(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.PointsMaterial({
        vertexColors: true,  // Add this line
        size: 0.05,
      })
    );
    scene.add(blueSphere);

    // Modify vertex colors for red particles
    const positions = blueSphere.geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i += 3) {
      if ((i / 3) % 3 === 0) {
        colors[i] = 1;     // FF - Red
        colors[i + 1] = 0; // 00 - Green
        colors[i + 2] = 0; // 00 - Blue
      } else {
        colors[i] = 0.156;     // Blue (existing values)
        colors[i + 1] = 0.290;
        colors[i + 2] = 0.969;
      }
    }
    blueSphere.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    blueSphere.material.vertexColors = true;

    // Store original vertex positions
    const originalPositions = positions.slice();
    
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update vertices positions for warping effect
      const time = Date.now() * 0.001;
      
      for(let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];
        
        // Create warping effect using sine waves
        const intensity = 0.3;
        const frequency = 2;
        
        positions[i] = x + Math.sin(time + y) * intensity;
        positions[i + 1] = y + Math.cos(time + x) * intensity;
        positions[i + 2] = z + Math.sin(time + x + y) * intensity;
      }
      
      blueSphere.geometry.attributes.position.needsUpdate = true;
      blueSphere.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };
    
    animate();

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