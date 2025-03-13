import React from 'react';

const BedroomDescription = () => (
  <section className="space-y-8 w-full max-w-7xl mx-auto">
    <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
      A cozy 3D bedroom environment built with Three.js
    </h3>
    
    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
      For my first ever three.js project, I challenged myself to create a bedroom and turn it into an interactive experience.
    </p>
    
    <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">What Makes This Cool</h3>
    
    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
      This project really pushed my limits. What I really liked about this project was that I had fine control over every minute detail of the scene.
    </p>
    
    <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">Building Blocks</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
        <h4 className="text-xl font-medium mb-4 text-blue2">3D Modeling with Code</h4>
        <p className="text-lg leading-relaxed mb-4">Instead of importing 3D models, I built everything using Three.js primitives: <span className="text-xs">(with the exception of a few free 3D models that I imported)</span></p>
        <ul className="list-disc pl-8 space-y-2 text-lg">
          <li>Setting up collisions by overlaying objects in the scene with invisible meshes</li>
          <li>Created basic shapes and grouped them to create a low-poly scene</li>
          <li>Controllable camera and interactivity with raycaster</li>
          <li>Other basic lighting effects (ambient and point lights)</li>
        </ul>
      </div>
      
      <div className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
      <h4 className="text-xl font-medium mb-4 text-blue2">Interactive Elements</h4>
      <p className="text-lg leading-relaxed mb-4">What's a 3D scene without interaction? I added several interactive features:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ul className="list-disc pl-8 space-y-2 text-lg">
          <li>Click to open the mini-fridge with smooth animation</li>
          <li>Turn on/off the ceiling lamp by pressing "L"</li>
          <li>Camera controls to explore the room from any angle</li>
        </ul>
        <ul className="list-disc pl-8 space-y-2 text-lg">
          <li>GSAP animations for smooth object movements</li>
          <li>Raycasting for precise object selection</li>
          <li>WASD Arrow keys for smooth movement</li>
        </ul>
      </div>
    </div>
    </div>
    
   
  </section>
);

export default BedroomDescription;
