import React from 'react';

const BedroomDemoDescription = () => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold mb-2 text-white">Building Blocks</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue2/40 p-4 rounded-lg border border-white/20">
        <h5 className="text-base font-medium mb-2 text-white">3D Modeling with Code</h5>
        <p className="text-sm leading-relaxed mb-2 text-white">
          Instead of importing 3D models, I built everything using Three.js primitives: <span className="text-xs">(with the exception of a few free 3D models that I imported)</span>
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-white">
          <li>Setting up collisions by overlaying objects in the scene with invisible meshes</li>
          <li>Created basic shapes and grouped them to create a low-poly scene</li>
          <li>Controllable camera and interactivity with raycaster</li>
          <li>Other basic lighting effects (ambient and point lights)</li>
        </ul>
      </div>

      <div className="bg-blue2/40 p-4 rounded-lg border border-white/20">
        <h5 className="text-base font-medium mb-2 text-white">Interactive Elements</h5>
        <p className="text-sm leading-relaxed mb-2 text-white">What's a 3D scene without interaction? I added several interactive features:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ul className="list-disc pl-5 space-y-1 text-sm text-white">
            <li>Click to open the mini-fridge with smooth animation</li>
            <li>Turn on/off the ceiling lamp by pressing "L"</li>
            <li>Camera controls to explore the room from any angle</li>
          </ul>
          <ul className="list-disc pl-5 space-y-1 text-sm text-white">
            <li>GSAP animations for smooth object movements</li>
            <li>Raycasting for precise object selection</li>
            <li>WASD Arrow keys for smooth movement</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default BedroomDemoDescription;
