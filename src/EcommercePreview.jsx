import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const EcommercePreview = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 0.5, 0.1]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>
        <mesh position={[-0.7, -0.5, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#818cf8" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#818cf8" />
        </mesh>
        <mesh position={[0.7, -0.5, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#818cf8" />
        </mesh>
      </group>
    </Canvas>
  );
};

export default EcommercePreview;
