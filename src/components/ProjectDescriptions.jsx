import React from 'react';

const WeatherDescription = () => (
  <div className="space-y-16 max-w-6xl px-4 md:px-8 w-full py-8">
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        Development Architecture
      </h3>
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
        A dynamic weather visualization system that combines real-time API data with Three.js environmental effects:
      </p>
      <ul className="list-disc pl-8 space-y-8 text-base md:text-lg lg:text-xl w-full">
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Time-Based Celestial System:</span>
          <p className="text-gray-700 w-full">Accurate sun and moon positioning with dynamic day/night cycle synchronized to local time</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Weather Particle Engine:</span>
          <p className="text-gray-700 w-full">Advanced particle systems for rain and snow with intensity based on real-time weather data</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Atmospheric Rendering:</span>
          <p className="text-gray-700 w-full">Dynamic color interpolation for sky transitions and cloud system with realistic movement patterns</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">API Integration:</span>
          <p className="text-gray-700 w-full">Real-time weather data fetching and parsing with automatic scene updates based on conditions</p>
        </li>
      </ul>
    </section>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        Technical Implementation
      </h3>
      <ul className="list-disc pl-8 space-y-8 text-base md:text-lg lg:text-xl w-full">
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Environmental Effects:</span>
          <p className="text-gray-700 w-full">Point light system for sun and moon with dynamic intensity and color adjustments</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Particle Management:</span>
          <p className="text-gray-700 w-full">Optimized buffer geometry for up to 15,000 simultaneous weather particles</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Time Simulation:</span>
          <p className="text-gray-700 w-full">Precise celestial body movement with interpolated position calculations</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Debug Interface:</span>
          <p className="text-gray-700 w-full">Time control slider and weather condition testing tools for development</p>
        </li>
      </ul>
    </section>
  </div>
);

const PlinkoDescription = () => (
  <div className="space-y-16 max-w-6xl px-4 md:px-8 w-full py-8">
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        Development Architecture
      </h3>
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
        A physics-based plinko simulation utilizing Matter.js for precise collision detection and probability management:
      </p>
      <ul className="list-disc pl-8 space-y-8 text-base md:text-lg lg:text-xl w-full">
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Physics Engine Integration:</span>
          <p className="text-gray-700 w-full">Custom Matter.js implementation with optimized collision handling and body dynamics</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Path Prediction System:</span>
          <p className="text-gray-700 w-full">Advanced ball trajectory calculation with subtle steering mechanics</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Statistical Analysis:</span>
          <p className="text-gray-700 w-full">Real-time win probability tracking</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Animation Framework:</span>
          <p className="text-gray-700 w-full">Smooth visual feedback system for multipliers and winning zones</p>
        </li>
      </ul>
    </section>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        Technical Implementation
      </h3>
      <ul className="list-disc pl-8 space-y-8 text-base md:text-lg lg:text-xl w-full">
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Ball Physics:</span>
          <p className="text-gray-700 w-full">Carefully tuned restitution, friction, and density parameters for realistic behavior</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Zone Management:</span>
          <p className="text-gray-700 w-full">Dynamic multiplier system with collision detection and bounce animations</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Statistics Tracking:</span>
          <p className="text-gray-700 w-full">Comprehensive hit tracking and percentage calculation for each zone</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Performance Optimization:</span>
          <p className="text-gray-700 w-full">Efficient body removal and event handling for smooth multi-ball operation</p>
        </li>
      </ul>
    </section>
  </div>
);

const BedroomDescription = () => (
  <div className="space-y-16 max-w-6xl px-4 md:px-8 w-full py-8">
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        Development Architecture
      </h3>
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
        A fully programmatic 3D bedroom environment created using Three.js, featuring custom modeling and interactive elements:
      </p>
      <ul className="list-disc pl-8 space-y-8 text-base md:text-lg lg:text-xl w-full">
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Custom 3D Modeling:</span>
          <p className="text-gray-700 w-full">Programmatically generated furniture using primitive geometries and custom materials</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Lighting System:</span>
          <p className="text-gray-700 w-full">Multi-source lighting setup with ambient, point, and spot lights for realistic illumination</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Interactive Elements:</span>
          <p className="text-gray-700 w-full">Clickable objects with animations, including a functional mini-fridge with interior lighting</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Scene Management:</span>
          <p className="text-gray-700 w-full">Organized object grouping and scene hierarchy for efficient manipulation</p>
        </li>
      </ul>
    </section>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        Technical Implementation
      </h3>
      <ul className="list-disc pl-8 space-y-8 text-base md:text-lg lg:text-xl w-full">
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Material Systems:</span>
          <p className="text-gray-700 w-full">Custom MeshStandardMaterial configurations with detailed texturing and reflectivity</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Shadow Implementation:</span>
          <p className="text-gray-700 w-full">PCFSoftShadowMap with optimized shadow casting and receiving for all objects</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Animation Engine:</span>
          <p className="text-gray-700 w-full">GSAP integration for smooth object transitions and interactive animations</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Model Integration:</span>
          <p className="text-gray-700 w-full">GLTFLoader implementation for external model importing and scene enhancement</p>
        </li>
      </ul>
    </section>
  </div>
);

const MusicDescription = () => (
  <div className="space-y-16 max-w-6xl px-4 md:px-8 w-full py-8">
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        Development Architecture
      </h3>
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
        An advanced audio visualization system that transforms music into dynamic 3D representations through real-time frequency analysis:
      </p>
      <ul className="list-disc pl-8 space-y-8 text-base md:text-lg lg:text-xl w-full">
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Frequency Analysis Pipeline:</span>
          <p className="text-gray-700 w-full">Sophisticated multi-band processing system analyzing frequencies from 20Hz to 20kHz</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Vertex Manipulation System:</span>
          <p className="text-gray-700 w-full">Custom GLSL shader implementation for precise geometric deformation based on audio input</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Visual Enhancement Suite:</span>
          <p className="text-gray-700 w-full">Advanced post-processing pipeline featuring UnrealBloomPass for professional lighting effects</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Dynamic Color Management:</span>
          <p className="text-gray-700 w-full">Integrated color system with real-time cycling and user-customizable color profiles</p>
        </li>
      </ul>
    </section>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        Technical Implementation
      </h3>
      <ul className="list-disc pl-8 space-y-8 text-base md:text-lg lg:text-xl w-full">
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Audio-Visual Synchronization:</span>
          <p className="text-gray-700 w-full">Precision-tuned BPM detection system for synchronized vertex displacement patterns</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">State Management:</span>
          <p className="text-gray-700 w-full">Seamless transition system between active playback and idle visualization states</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Rendering Pipeline:</span>
          <p className="text-gray-700 w-full">Custom Fresnel shader implementation for enhanced edge highlighting and depth perception</p>
        </li>
        <li className="w-full py-2">
          <span className="font-medium block mb-3">Genre Adaptation:</span>
          <p className="text-gray-700 w-full">Dynamic frequency response system that automatically calibrates to different music styles</p>
        </li>
      </ul>
    </section>
  </div>
);

export const getProjectDescription = (id) => {
  const descriptions = {
    1: WeatherDescription,
    2: PlinkoDescription,
    3: BedroomDescription,
    4: MusicDescription
  };
  return descriptions[id] || (() => <p>Description not available</p>);
};
