import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import dk9Url from '../assets/models/GradDude.glb';

// DKModel component with forwardRef to expose animation methods
const DKModelComponent = forwardRef((props, ref) => {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(dk9Url);
  const [isAnimating, setIsAnimating] = useState(false);
  const { actions } = useAnimations(animations, groupRef);
  const backflipTimeoutRef = useRef(null);
  
  // Animation player function
  const playAnimation = (animationName, duration) => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (actions[animationName]) {
      actions['Idle']?.fadeOut(0.5);
      actions[animationName]?.reset().fadeIn(0.5).play();
      setTimeout(() => {
        actions[animationName]?.fadeOut(0.5);
        actions['Idle']?.reset().fadeIn(0.5).play();
        setIsAnimating(false);
      }, duration);
    }
  };

  // Expose animation methods via ref
  useImperativeHandle(ref, () => ({
    playTalking: () => playAnimation('Talking', 3000),
    playBackflip: () => playAnimation('Backflip', 1900)
  }));

  const resetIdleTimer = () => {
    if (backflipTimeoutRef.current) {
      clearTimeout(backflipTimeoutRef.current);
    }
    // Optional: Add random idle animations here
  };

  // Initialize animations and set up event listeners
  useEffect(() => {
    // console.log('Animation Names:', animations.map(clip => clip.name));
    // console.log('Action Names:', Object.keys(actions));
    
    if (actions['Idle']) {
      actions['Idle'].play();
    }
    
    const handleInteraction = () => resetIdleTimer();
    
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('keypress', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    
    resetIdleTimer();
    
    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keypress', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      if (backflipTimeoutRef.current) clearTimeout(backflipTimeoutRef.current);
    };
  }, [actions]);

  // Set material properties for the model
  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.material.color.set('#1B44FA');
        node.material.emissive.set('#1B44FA');
        node.material.emissiveIntensity = 0.5;
        node.material.metalness = 0;
        node.material.roughness = 1;
        node.material.envMapIntensity = 0;
        node.castShadow = false;
        node.receiveShadow = false;
        node.material.needsUpdate = true;
      }
    });
  }, [scene]);

  // Spread any additional props to customize positioning, scale, etc.
  const { position = [0, -2, 0], scale = 3, onClick, ...otherProps } = props;

  return (
    <group 
      ref={groupRef} 
      position={position} 
      onClick={onClick || (() => playAnimation('Backflip', 1800))}
      {...otherProps}
    >
      <primitive object={scene} scale={scale} />
    </group>
  );
});

export default DKModelComponent;
