import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const BlogPreview = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[2, 0.3, 0.1]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.3, 0.1]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[2, 0.3, 0.1]} />
          <meshStandardMaterial color="#7dd3fc" />
        </mesh>
      </group>
    </Canvas>
  );
};

export default BlogPreview;
