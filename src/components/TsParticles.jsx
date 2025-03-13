import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const TsParticles = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const initParticles = async () => {
      try {
        await initParticlesEngine(async (engine) => {
          await loadSlim(engine);
        });
        console.log("TsParticles engine initialized successfully");
        setInitialized(true);
      } catch (error) {
        console.error("Failed to initialize particles:", error);
      }
    };
    
    initParticles();
  }, []);

  const options = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
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
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "bounce"
        },
      },
      number: {
        value: 5,
        density: {
          enable: true,
          area: 200,
        },
      },
      opacity: {
        value: 0.3,
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
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
      {initialized && (
        <Particles
          id="tsparticles"
          options={options}
        />
      )}
    </div>
  );
};

export default TsParticles;
