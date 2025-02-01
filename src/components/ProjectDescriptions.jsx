import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import hljs from 'highlight.js';
import '../dk-blue.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlay, faSun, faCloud, faWind, faChartLine, faBrain, faChartSimple, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const CodeSkeleton = () => (
  <div className="animate-pulse space-y-2">
    {[...Array(20)].map((_, i) => (
      <div 
        key={i} 
        className="h-4 bg-gray-700 rounded"
        style={{
          width: `${Math.floor(Math.random() * 40 + 60)}%`,
          opacity: 1 - (i * 0.03)
        }}
      />
    ))}
  </div>
);

const ProblemStatementCard = ({ icon, text, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const flipTimeout = useRef(null);

  useEffect(() => {
    // Add entrance animation
    gsap.from(cardRef.current, {
      rotateY: -180,
      duration: 0.6,
      delay: index * 0.2,
      ease: "power2.out"
    });

    // Cleanup function
    return () => {
      if (flipTimeout.current) {
        clearTimeout(flipTimeout.current);
      }
    };
  }, []);

  const handleFlip = () => {
    if (flipTimeout.current) {
      clearTimeout(flipTimeout.current);
    }

    const card = cardRef.current;
    gsap.to(card, {
      rotateY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: "power2.inOut"
    });
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      ref={cardRef}
      className="relative h-[300px] transform-gpu cursor-pointer"
      style={{ perspective: "1000px" }}
      onMouseEnter={handleFlip}
      onMouseLeave={handleFlip}
    >
      <div className={`absolute w-full h-full transition-all duration-600 transform-gpu backface-hidden
                      ${isFlipped ? 'opacity-0' : 'opacity-100'}
                      bg-white/30 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center justify-center p-6`}
           style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <FontAwesomeIcon icon={icon} className="text-5xl text-blue2 mb-4" />
      </div>
      
      <div className={`absolute w-full h-full transition-all duration-600 transform-gpu backface-hidden
                      ${isFlipped ? 'opacity-100' : 'opacity-0'}
                      bg-white/30 backdrop-blur-sm rounded-xl shadow-lg p-6`}
           style={{ transform: `rotateY(${isFlipped ? '0deg' : '-180deg'})` }}>
        <p className="text-base md:text-lg lg:text-xl leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

const WeatherDescription = () => {
  const descriptionRef = useRef(null);
  const sectionsRef = useRef([]);
  const featuresRef = useRef([]);
  const [codeContent, setCodeContent] = useState({ html: '', css: '', js: '' });
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    const sections = sectionsRef.current;
    const features = featuresRef.current;

    gsap.set(sections, { 
      opacity: 0, 
      y: 50 
    });

    gsap.set(features, {
      opacity: 0,
      scale: 0.9
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: descriptionRef.current,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
      }
    });

    tl.to(descriptionRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(sections, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out"
    })
    .to(features, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.4");
// Replace the existing card animation code with:
features.forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      y: -5, // Reduced lift
      scale: 1.05, // Subtle scale
      backgroundColor: 'rgba(255, 255, 255, 0.45)', // Slightly brighter
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)', // Enhanced shadow
      duration: 0.3,
      ease: "power2.out"
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      y: 0,
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)', // Return to original
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      duration: 0.2,
      ease: "power2.inOut"
    });
  });
});
    



    return () => {
      features.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  const problemStatementCards = [
    {
      icon: faBrain,
      text: "Weather apps are boring. That's the truth. I wanted to make something that not only displays weather data, but displays it in an engaging way."
    },
    {
      icon: faChartSimple,
      text: "Traditional weather applications often present data in a static and uninspiring manner, which can make it difficult for users to fully grasp the current and forecasted weather conditions."
    },
    {
      icon: faLightbulb,
      text: "The challenge was to create an application that not only provides accurate weather data but also presents it in a visually appealing and interactive way."
    }
  ];

  return (
    <div className="space-y-16 max-w-6xl px-6 md:px-2 w-full py-8">
      <h2 ref={descriptionRef} className="text-4xl font-medium text-blue2 w-full py-2">
        A dynamic weather visualization system that combines real-time API data with Three.js environmental effects
      </h2>
      <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-blue1 pb-3 border-b border-blue2 border-opacity-40 w-full">
        Problem Statement
      </h3>

      <section ref={el => sectionsRef.current[0] = el} className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {problemStatementCards.map((card, index) => (
          <ProblemStatementCard
            key={index}
            icon={card.icon}
            text={card.text}
            index={index}
          />
        ))}
      </section>

      <section ref={el => sectionsRef.current[1] = el} className="space-y-8">
        <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-blue1 pb-3 border-b border-blue2 border-opacity-40 w-full">
          Solution
        </h3>
        <p className="text-base md:text-lg lg:text-xl leading-relaxed max-w-full py-2">
          Created an immersive 3D weather visualization that transforms raw meteorological data into an interactive, visually engaging experience, allowing users to intuitively understand weather patterns through dynamic environmental effects.
        </p>
      </section>

      <section ref={el => sectionsRef.current[2] = el} className="space-y-8">
        <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-blue1 pb-3 border-b border-blue2 border-opacity-40 w-full">
          Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: faSun, title: "Dynamic Day/Night Cycle", desc: "Real-time sun and moon positioning based on location data" },
            { icon: faCloud, title: "Weather Effects", desc: "Procedurally generated clouds, rain, and snow particles" },
            { icon: faWind, title: "Atmospheric Conditions", desc: "Visual representation of wind, humidity, and pressure" },
            { icon: faChartLine, title: "Real-time Updates", desc: "Live data integration with weather API services" }
          ].map((feature, index) => (
            <div
              key={index}
              ref={el => featuresRef.current[index] = el}
              className="feature-card p-6 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg 
                         border border-white/20 cursor-pointer"
            >
              <FontAwesomeIcon icon={feature.icon} className="text-3xl text-blue2 mb-4" />
              <h4 className="text-lg font-medium mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={el => sectionsRef.current[3] = el} className="space-y-8">
        <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-black pb-3 border-b border-blue2 border-opacity-40 w-full">
          Challenges & Learnings
        </h3>
        <ul className="list-disc pl-8 space-y-4 text-base md:text-lg">
          {[
            "Optimizing particle systems for weather effects while maintaining performance",
            "Implementing accurate celestial body movements based on geographical coordinates",
            "Managing state transitions between different weather conditions smoothly",
            "Handling real-time data updates without disrupting the visual experience"
          ].map((challenge, index) => (
            <li key={index}>{challenge}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

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
