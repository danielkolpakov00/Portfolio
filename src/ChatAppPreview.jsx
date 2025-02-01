import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const ChatAppPreview = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group>
        <mesh position={[-0.6, 0, 0]}>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <boxGeometry args={[2, 0.3, 0.1]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
      </group>
    </Canvas>
  );
};

export default ChatAppPreview;
