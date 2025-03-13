import { useEffect, useState } from 'react';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const TsParticles = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const initParticles = async () => {
      try {
        // Initialize the engine
        if (window.tsParticles) {
          await loadSlim(window.tsParticles);
          console.log("TsParticles engine initialized successfully");
          setInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize particles:", error);
      }
    };
    
    // Remove the stray 's' character that was causing the syntax error
    initParticles();
  }, []);

  // Simple configuration for better compatibility
  const options = {
    background: {
      color: {
        value: "transparent",
      },
    },
    particles: {
      color: {
        value: "#1B69FA",
      },
      links: {
        color: "#1B69FA",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
      },
      number: {
        value: 5,  // reduced from 10
        density: {
          enable: true,
          area: 200,  // increased from 100 to spread particles more
        },
      },
      opacity: {
        value: 0.3,
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
    },
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none'
    }}>
      {initialized ? (
        <Particles
          id="tsparticles"
          options={options}
        />
      ) : null}
    </div>
  );
};

export default TsParticles;
