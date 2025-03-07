import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import DKModelComponent from './DKModelComponent';

const ModelSlide = ({ title, description }) => {
  return (
    <div className="relative z-10 flex flex-col justify-center items-center py-8 px-4 md:px-8 min-h-screen">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-blue2 mb-3 text-center">
          {title}
        </h2>
        <p className="text-lg text-blue2/80 max-w-3xl mx-auto text-center mb-10">
          {description}
        </p>
        
        <div className="h-[400px] w-full relative">
          <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, 2, 5], fov: 90 }}
            shadows={false}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.3} />
              <DKModelComponent position={[0, -1, 0]} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default ModelSlide;
