// // src/Scene.jsx
// import React, { useEffect, useRef, useState } from 'react'; // Import useState
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { gsap } from 'gsap';
// import tableUrl from  '@/assets/models/table3_compressed.glb'; // Import the GLTF model
// import { FaMousePointer } from 'react-icons/fa'; // Import the Font Awesome icon
// import './transitions.css';

// const Scene = ({ onComplete }) => {
//   const mountRef = useRef(null);
//   const modelRef = useRef(null);
//   const monitorPositionRef = useRef(new THREE.Vector3());
//   const isAnimating = useRef(false); // Ensure it persists across renders

//   // Add state for the click indicator visibility
//   const [showClickIndicator, setShowClickIndicator] = useState(true);
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Scene, Camera, and Renderer setup
//     const scene = new THREE.Scene();

//     // Create a canvas and draw a gradient on it
//     const canvas = document.createElement('canvas');
//     canvas.width = 512;
//     canvas.height = 512;
//     const context = canvas.getContext('2d');
//     const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
//     gradient.addColorStop(0, '#f5fdff');
//     gradient.addColorStop(1, '#a1c4fd');
//     context.fillStyle = gradient;
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     // Create a texture from the canvas
//     const texture = new THREE.CanvasTexture(canvas);

//     // Set the scene background to the texture
//     scene.background = texture;

//     const isMobile = window.innerWidth <= 768;
//     const cameraDistance = isMobile ? 12 : 9.46;
//     const camera = new THREE.PerspectiveCamera(
//       90,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(cameraDistance, 7.79, 0.03);
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current.appendChild(renderer.domElement);

//     // Load the GLTF model
//     const loader = new GLTFLoader();
//     loader.load(
//       tableUrl,
//       (gltf) => {
//         const model = gltf.scene;
//         const modelScale = 0.1;
//         model.scale.set(modelScale, modelScale, modelScale);
//         model.position.set(0, 0, 0);
//         scene.add(model);
//         modelRef.current = model;

//         // Get monitor position
//         const monitorMesh = model.getObjectByName('MonitorScreen');
//         if (monitorMesh) {
//           monitorMesh.getWorldPosition(monitorPositionRef.current);
//         } else {
//           const monitorPositionCm = new THREE.Vector3(-113.96, 569.77, -4.01);
//           const monitorPositionMeters = monitorPositionCm
//             .clone()
//             .multiplyScalar(0.01);
//           const monitorPositionScaled = monitorPositionMeters
//             .clone()
//             .multiplyScalar(modelScale);
//           monitorPositionRef.current.copy(monitorPositionScaled);
//         }
//       },
//       undefined,
//       (error) => {
//         console.error('An error occurred while loading the GLTF model:', error);
//       }
//     );

//     // Add lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 3);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(0, 0, 7.5);
//     scene.add(directionalLight);

//     // Add the interactive circle
//     const circleGeometry = new THREE.CircleGeometry(0.5, 32); // Radius: 0.5, 32 segments
//     const circleMaterial = new THREE.MeshBasicMaterial({
//       color: 0xaaff, // Bubble color
//       transparent: true,
//       opacity: 0.8,
//     });
//     const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
//     circleMesh.position.set(0, 0.2, 0.1); // Slightly above the model for visibility
//     scene.add(circleMesh);

//     // Bubble animation using GSAP
//     const bubbleAnimation = () => {
//       gsap.to(circleMesh.scale, {
//         x: 1.2,
//         y: 1.2,
//         duration: 1,
//         repeat: -1, // Infinite loop
//         yoyo: true, // Reverse animation
//         ease: 'power1.inOut',
//       });
//     };

//     bubbleAnimation();

//     // Highlight on interaction
//     const highlightCircle = () => {
//       gsap.to(circleMaterial, {
//         opacity: 1,
//         duration: 0.3,
//       });
//     };

//     const dimCircle = () => {
//       gsap.to(circleMaterial, {
//         opacity: 0.8,
//         duration: 0.3,
//       });
//     };

//     // Animation loop
//     let animationId;
//     const animate = () => {
//       animationId = requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Model movement based on input
//     const moveModel = (x, y) => {
//       if (isAnimating.current || !modelRef.current) return;
//       const normalizedX = (x / window.innerWidth) * 2 - 1;
//       const normalizedY = -(y / window.innerHeight) * 2 + 1;
//       modelRef.current.position.x = normalizedX * 0.1;
//       modelRef.current.position.y = normalizedY * 0.1;
//     };

//     const resetModelPosition = () => {
//       if (isAnimating.current || !modelRef.current) return;
//       gsap.to(modelRef.current.position, {
//         x: 0,
//         y: 0,
//         duration: 0.5,
//         ease: 'power2.out',
//       });
//     };

//     // Event handlers
//     const handleMouseMove = (event) => {
//       moveModel(event.clientX, event.clientY);
//       highlightCircle();
//     };
//     const handleMouseOut = () => {
//       resetModelPosition();
//       dimCircle();
//     };

//     const handleClick = () => {
//       if (isAnimating.current) return;
//       isAnimating.current = true;

//       // Hide the click indicator
//       setShowClickIndicator(false);

//       const monitorPosition =
//         monitorPositionRef.current.length() !== 0
//           ? monitorPositionRef.current
//           : new THREE.Vector3(100, 100, 100);

//       const cameraTargetPosition = monitorPosition
//         .clone()
//         .add(new THREE.Vector3(0, 5.5, 0));

//       gsap.to(camera.position, {
//         x: cameraTargetPosition.x - 1.3,
//         y: cameraTargetPosition.y + 1.3,
//         z: cameraTargetPosition.z + 0.3,
//         duration: 1.5,
//         ease: 'power2.inOut',
//         onUpdate: () => {
//           camera.lookAt(monitorPosition);
//         },
//         onComplete: () => {
//           if (onComplete) onComplete(); // Trigger the callback to hide the scene
//         },
//       });

//       gsap.to(camera.rotation, {
//         x: camera.rotation.x,
//         y: camera.rotation.y + 0.3,
//         z: camera.rotation.z,
//         duration: 1.5,
//         ease: 'power2.inOut',
//       });
//     };

//     const disposeScene = () => {
//       cancelAnimationFrame(animationId);
//       renderer.dispose();
//       scene.traverse((object) => {
//         if (object.geometry) object.geometry.dispose();
//         if (object.material) {
//           if (Array.isArray(object.material)) {
//             object.material.forEach((material) => material.dispose());
//           } else {
//             object.material.dispose();
//           }
//         }
//       });
//       if (mountRef.current && renderer.domElement) {
//         renderer.domElement.remove();
//       }
//     };

//     renderer.domElement.addEventListener('mousemove', handleMouseMove);
//     renderer.domElement.addEventListener('mouseout', handleMouseOut);
//     renderer.domElement.addEventListener('click', handleClick);

//     window.addEventListener('resize', () => {
//       const isMobile = window.innerWidth <= 768;
//       camera.position.set(isMobile ? 12 : 9.46, 7.79, 0.03);
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     });

//     // Animation function to update the gradient
//     let gradientOffset = 0;
//     const animateGradient = () => {
//       gradientOffset += 0.02; // Increase the speed of the gradient change
//       if (gradientOffset > canvas.height) gradientOffset = 0;

//       const gradient = context.createLinearGradient(0, gradientOffset, 0, canvas.height + gradientOffset);
//       gradient.addColorStop(0, '#f5fdff');
//       gradient.addColorStop(1, '#a1c4fd');
//       context.fillStyle = gradient;
//       context.fillRect(0, 0, canvas.width, canvas.height);

//       texture.needsUpdate = true;

//       requestAnimationFrame(animateGradient);
//     };

//     animateGradient();

//     return () => {
//       disposeScene();
//       renderer.domElement.removeEventListener('mousemove', handleMouseMove);
//       renderer.domElement.removeEventListener('mouseout', handleMouseOut);
//       renderer.domElement.removeEventListener('click', handleClick);
//       cancelAnimationFrame(animateGradient);
//     };
//   }, [onComplete]);

//   // CSS styles for the click animation
//   const styles = {
//     container: {
//       position: 'relative',
//       width: '100vw',
//       height: '100vh',
//     },
//     canvas: {
//       width: '100%',
//       height: '100%',
//       touchAction: 'none',
//     },
//     clickIndicator: {
//       position: 'absolute',
//       bottom: '50%',
//       left: '50%',
//       transform: 'translateX(-50%)',
//       animation: 'pulse 1s infinite',
//       pointerEvents: 'none', // Ensure it doesn't block interactions
//       color: '#1B69FA', // Icon color
//       fontSize: '50px', // Adjust size as needed
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <div ref={mountRef} style={styles.canvas} />
//       <style>
//         {`
//           @keyframes pulse {
//             0% {
//               transform: translateX(-50%) scale(1);
//               opacity: 1;
//             }
//             50% {
//               transform: translateX(-50%) scale(1.1);
//               opacity: 0.7;
//             }
//             100% {
//               transform: translateX(-50%) scale(1);
//               opacity: 1;
//             }
//           }
//         `}
//       </style>
//       {showClickIndicator && (
//         <div style={styles.clickIndicator}>
//           <FaMousePointer />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Scene;