import { useEffect, useMemo, useState } from 'react';
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { memo } from 'react';

const TsParticles = ({ onLoaded }) => {
  const [init, setInit] = useState(false);
  
  // Initialize the tsParticles instance
  const particlesInit = async (engine) => {
    try {
      console.log("Initializing TsParticles engine...");
      await loadSlim(engine);
      console.log("TsParticles engine initialized successfully");
      setInit(true);
      
      // Notify parent component that particles are initialized
      if (onLoaded && typeof onLoaded === 'function') {
        onLoaded();
      }
    } catch (error) {
      console.error("Failed to initialize particles:", error);
    }
  };

  const particlesLoaded = (container) => {
    console.log("Particles container loaded:", container);
  };

  const options = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 30, // Reduced from 60 to improve performance
    particles: {
      color: {
        value: "#1B69FA",
      },
      links: {
        color: "#1B69FA",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out", // Changed from "bounce" to reduce calculations
        },
        random: false,
        speed: 1, // Reduced speed to decrease CPU usage
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 40, // Reduced from 80 to improve performance
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 }, // Reduced max size
      },
    },
    detectRetina: false, // Disabled to improve performance
    interactivity: {
      detectsOn: "canvas", // Use canvas instead of window for better performance
      events: {
        onClick: {
          enable: false, // Disabled to avoid conflicts with page clicks
        },
        onHover: {
          enable: true,
          mode: "light", // Changed to lighter interaction mode
          parallax: {
            enable: false, // Disabled parallax to improve performance
          },
        },
        resize: {
          delay: 500, // Add delay to handle resize events better
          enable: true,
        },
      },
      modes: {
        light: {
          area: {
            gradient: {
              start: "#1B69FA",
              stop: "transparent",
            },
          },
          shadow: {
            color: "#1B69FA",
          },
        },
        repulse: {
          distance: 100, // Reduced distance
          duration: 0.2, // Shorter duration
        },
      },
    },
    pauseOnBlur: true, // Pause when tab is not active
  }), []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none', // Ensures that mouse events pass through to elements below
      willChange: 'transform', // Optimization for fixed elements
    }}>
      {/* Simplified render condition to avoid unnecessary checks */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={options}
        className="particles-canvas"
      />
    </div>
  );
};

export default memo(TsParticles);
