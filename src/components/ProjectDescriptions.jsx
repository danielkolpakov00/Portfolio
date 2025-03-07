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

  return (
    <div className="space-y-16 max-w-6xl px-6 md:px-2 w-full py-8">
      <h2 ref={descriptionRef} className="text-4xl font-medium text-blue2 w-full py-2">
        A 3D weather app that brings forecasts to life with dynamic visuals
      </h2>
      
      <section className="space-y-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
          Why I Built This
        </h3>
        
        <div ref={el => sectionsRef.current[0] = el} className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <p className="text-lg md:text-xl leading-relaxed mb-6">
            I was tired of boring weather apps that show you the same static icons day after day. So I thought, "What if I could actually see the rain falling or clouds moving when I check the weather?" That's when I decided to build this 3D weather visualization that makes checking the forecast actually fun.
          </p>
          
          <p className="text-lg leading-relaxed mb-6">
            Most weather apps present data in a static and uninspiring manner, which makes it difficult for users to truly understand what's happening outside. I wanted to create something that not only provides accurate information but presents it in a way that feels alive and intuitive.
          </p>
          
          <p className="text-lg leading-relaxed">
            The challenge was to transform raw meteorological data into a dynamic experience that anyone could enjoy and understand at a glance - making weather forecasts something you look forward to checking.
          </p>
        </div>
      </section>

      <section ref={el => sectionsRef.current[1] = el} className="space-y-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
          How It Works
        </h3>
        
        <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <p className="text-lg leading-relaxed mb-6">
            I built a 3D environment that connects to real weather APIs and transforms that data into visual elements. When it's raining in your city, you'll see actual raindrops falling in the scene. If it's sunny, you'll see a brilliant sun with realistic lighting effects. It's weather forecasting that you can actually experience, not just read.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-medium mb-4 text-blue1">Data Flow</h4>
              <ol className="list-decimal pl-8 space-y-2">
                <li>App fetches real-time weather data for your location</li>
                <li>Data is processed and categorized (temperature, conditions, time)</li>
                <li>Three.js scene updates to reflect current conditions</li>
                <li>Dynamic elements animate based on weather intensity</li>
              </ol>
            </div>
            
            <div>
              <h4 className="text-xl font-medium mb-4 text-blue1">User Experience</h4>
              <ul className="list-disc pl-8 space-y-2">
                <li>Search for any location worldwide</li>
                <li>Get current conditions and 5-day forecast</li>
                <li>Toggle between metric and imperial units</li>
                <li>Interactive 3D scene you can rotate and explore</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section ref={el => sectionsRef.current[2] = el} className="space-y-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
          The Cool Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div ref={el => featuresRef.current[0] = el} className="feature-card p-6 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 cursor-pointer">
            <FontAwesomeIcon icon={faSun} className="text-3xl text-blue2 mb-4" />
            <h4 className="text-lg font-medium mb-2">Day/Night Cycle</h4>
            <p className="text-gray-600">The scene's lighting changes based on the actual time at your location. Morning has a soft golden glow, noon is bright and clear, and night brings a serene moonlit atmosphere with stars.</p>
          </div>
          
          <div ref={el => featuresRef.current[1] = el} className="feature-card p-6 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 cursor-pointer">
            <FontAwesomeIcon icon={faCloud} className="text-3xl text-blue2 mb-4" />
            <h4 className="text-lg font-medium mb-2">Dynamic Weather Effects</h4>
            <p className="text-gray-600">When it rains, thousands of realistic raindrops fall. Snow creates a gentle flurry of unique snowflakes. Clouds form and move based on wind direction and coverage percentage.</p>
          </div>
          
          <div ref={el => featuresRef.current[2] = el} className="feature-card p-6 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 cursor-pointer">
            <FontAwesomeIcon icon={faWind} className="text-3xl text-blue2 mb-4" />
            <h4 className="text-lg font-medium mb-2">Environmental Details</h4>
            <p className="text-gray-600">Wind speed affects how trees sway and clouds move. Humidity changes the atmospheric haze. Temperature influences the color temperature of the scene.</p>
          </div>
          
          <div ref={el => featuresRef.current[3] = el} className="feature-card p-6 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 cursor-pointer">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl text-blue2 mb-4" />
            <h4 className="text-lg font-medium mb-2">Forecast Visualization</h4>
            <p className="text-gray-600">Quickly see how weather will change over the next few days with an animated timeline that shows temperature trends and condition changes in a 3D graph.</p>
          </div>
        </div>
      </section>

      <section ref={el => sectionsRef.current[3] = el} className="space-y-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
          Technical Challenges I Overcame
        </h3>
        
        <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-medium mb-4 text-blue1">Particle Systems</h4>
              <p className="mb-4">Creating realistic rain and snow was harder than I expected:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Had to optimize thousands of particles without killing performance</li>
                <li>Created custom shaders for more realistic water and snow effects</li>
                <li>Implemented collision detection for raindrops hitting surfaces</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-medium mb-4 text-blue1">Celestial Mechanics</h4>
              <p className="mb-4">Getting the sun and moon to move accurately was a mini astronomy project:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Calculated sun position based on latitude, longitude, and date</li>
                <li>Implemented realistic sunrise/sunset color transitions</li>
                <li>Created proper moon phases that match the real lunar cycle</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-xl font-medium mb-4 text-blue1">What I Learned</h4>
            <p className="mb-4">This project taught me a ton about:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Working with Three.js for environmental effects and physics</li>
              <li>Optimizing GPU-intensive applications for smooth performance</li>
              <li>Connecting to and handling real-time API data efficiently</li>
              <li>Creating intuitive UI that complements 3D visualization</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

const PlinkoDescription = () => (
  <div className="space-y-16 max-w-6xl px-4 md:px-8 w-full py-8">
    <h2 className="text-4xl font-medium text-blue2 w-full py-2">
      An interactive physics-based Plinko game with realistic ball physics and probability mechanics
    </h2>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
        What's This All About?
      </h3>
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
        I built this Plinko game from scratch using Matter.js to handle all the physics. It's not just any Plinko game - it actually tracks real probabilities and gives you that satisfying "bounce" feeling when balls drop through the pegs.
      </p>
      
      <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
        <h4 className="text-xl font-medium mb-4 text-blue1">The Cool Parts</h4>
        <ul className="list-disc pl-8 space-y-4 text-base md:text-lg">
          <li>Realistic physics with just the right amount of bounce and friction</li>
          <li>Dynamic multipliers that light up when hit</li>
          <li>Probability tracking that shows where balls are most likely to land</li>
          <li>Drop multiple balls at once without the physics engine breaking a sweat</li>
        </ul>
      </div>
    </section>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
        How I Built It
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <h4 className="text-xl font-medium mb-4 text-blue1">Physics Engine</h4>
          <p className="mb-4">Matter.js does the heavy lifting here. I had to experiment a ton with different physics properties to get that "just right" feeling:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Carefully tuned restitution (bounciness) for realistic ball behavior</li>
            <li>Custom friction coefficients for each surface type</li>
            <li>Gravity settings that feel natural but still fun</li>
          </ul>
        </div>
        
        <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <h4 className="text-xl font-medium mb-4 text-blue1">Multiplier System</h4>
          <p className="mb-4">Each landing zone has different point values with custom animations:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Collision detection for precise hit registration</li>
            <li>Animations that react to ball impact</li>
            <li>Score calculation based on where balls land</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
        <h4 className="text-xl font-medium mb-4 text-blue1">Stats & Performance</h4>
        <p className="mb-4">I built a real-time statistics system that:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-disc pl-8 space-y-2">
            <li>Tracks hit percentages for each landing zone</li>
            <li>Updates visually as more balls drop</li>
            <li>Provides actual probability data (not rigged!)</li>
          </ul>
          <ul className="list-disc pl-8 space-y-2">
            <li>Optimized for 60+ FPS even with multiple balls</li>
            <li>Efficient clean-up of objects that leave the screen</li>
            <li>Throttled event handling to prevent performance issues</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
);

const BedroomDescription = () => (
  <div className="space-y-16 max-w-6xl px-4 md:px-8 w-full py-8">
    <h2 className="text-4xl font-medium text-blue2 w-full py-2">
      A cozy 3D bedroom environment built entirely with Three.js code (no 3D modeling software!)
    </h2>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
        The Project
      </h3>
      <p className="text-lg md:text-xl leading-relaxed max-w-full py-2">
        I challenged myself to create a detailed 3D bedroom using only JavaScript and Three.js - no Blender, no Maya, just pure code. Every piece of furniture, light fixture, and interactive element was built programmatically.
      </p>
      
      <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
        <h4 className="text-xl font-medium mb-4 text-blue1">What Makes This Cool</h4>
        <ul className="list-disc pl-8 space-y-4 text-base md:text-lg">
          <li>Everything is built with code - from the bed to the mini-fridge</li>
          <li>You can interact with objects: open the fridge, turn on lights, etc.</li>
          <li>The lighting system creates a realistic cozy atmosphere</li>
          <li>It's all running in your browser in real-time</li>
        </ul>
      </div>
    </section>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
        Building Blocks
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <h4 className="text-xl font-medium mb-4 text-blue1">3D Modeling with Code</h4>
          <p className="mb-4">Instead of importing 3D models, I built everything using Three.js primitives:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Combined BoxGeometry, CylinderGeometry, etc. to create furniture</li>
            <li>Used Boolean operations to cut out complex shapes</li>
            <li>Created custom materials for wood, metal, fabric textures</li>
            <li>Grouped objects hierarchically for easy manipulation</li>
          </ul>
        </div>
        
        <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <h4 className="text-xl font-medium mb-4 text-blue1">Lighting Magic</h4>
          <p className="mb-4">The right lighting makes all the difference:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Ambient light for overall illumination</li>
            <li>Point lights for lamps and fixtures</li>
            <li>Spot lights to highlight specific areas</li>
            <li>Real-time shadows that respond to light positions</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
        <h4 className="text-xl font-medium mb-4 text-blue1">Interactive Elements</h4>
        <p className="mb-4">What's a 3D scene without interaction? I added several interactive features:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-disc pl-8 space-y-2">
            <li>Click to open the mini-fridge with smooth animation</li>
            <li>Turn on/off the desk lamp and see lighting change</li>
            <li>Camera controls to explore the room from any angle</li>
          </ul>
          <ul className="list-disc pl-8 space-y-2">
            <li>GSAP animations for smooth object movements</li>
            <li>Raycasting for precise object selection</li>
            <li>Event system that handles all interactions</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
);

const MusicDescription = () => (
  <div className="space-y-16 max-w-6xl px-4 md:px-8 w-full py-8">
    <h2 className="text-4xl font-medium text-blue2 w-full py-2">
      A music visualizer that transforms your favorite songs into mesmerizing 3D animations
    </h2>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
        About This Project
      </h3>
      <p className="text-lg md:text-xl leading-relaxed max-w-full py-2">
        I've always been fascinated by how music can be represented visually. So I built this audio visualizer that analyzes your music in real-time and creates stunning 3D animations that pulse, flow, and evolve with every beat and note.
      </p>
      
      <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
        <h4 className="text-xl font-medium mb-4 text-blue1">The Experience</h4>
        <ul className="list-disc pl-8 space-y-4 text-base md:text-lg">
          <li>Upload any song and watch it transform into beautiful 3D patterns</li>
          <li>See bass, mids, and highs affect different visual elements</li>
          <li>Customize colors to match the mood of your music</li>
          <li>Visualizer continues with ambient animation when no music is playing</li>
        </ul>
      </div>
    </section>
    
    <section className="space-y-8">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-blue2 border-opacity-40 w-full">
        Under the Hood
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <h4 className="text-xl font-medium mb-4 text-blue1">Audio Analysis</h4>
          <p className="mb-4">I'm doing some pretty cool stuff with the Web Audio API:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Frequency analysis across the entire audio spectrum (20Hz-20kHz)</li>
            <li>Beat detection that actually works with different music genres</li>
            <li>Separate processing for bass, mid-range, and high frequencies</li>
            <li>Normalization to ensure consistent visual response regardless of volume</li>
          </ul>
        </div>
        
        <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
          <h4 className="text-xl font-medium mb-4 text-blue1">Visual Effects</h4>
          <p className="mb-4">The visuals are powered by:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Custom GLSL shaders that deform geometry based on audio input</li>
            <li>Bloom effects that make everything glow beautifully</li>
            <li>Dynamic color systems that pulse with the music</li>
            <li>Camera movements that respond to audio intensity</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl">
        <h4 className="text-xl font-medium mb-4 text-blue1">Technical Challenges</h4>
        <p className="mb-4">Building this wasn't easy. Here are some hurdles I had to overcome:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-disc pl-8 space-y-2">
            <li>Synchronizing audio data with visual updates without lag</li>
            <li>Optimizing shader performance for smooth 60fps animation</li>
            <li>Creating transitions between different visualization states</li>
          </ul>
          <ul className="list-disc pl-8 space-y-2">
            <li>Handling audio files of different formats and quality levels</li>
            <li>Creating a fallback animation system for idle states</li>
            <li>Making everything work across different browsers and devices</li>
          </ul>
        </div>
      </div>
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
