import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const TsParticles = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    loadSlim().then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#f5fdff",
        },
      },
      fpsLimit: 30, // Lower FPS limit for better performance
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 1,
          },
          repulse: {
            distance: 100, // Reduced distance for repulse effect
            duration: 0.2, // Shorter duration for repulse effect
          },
        },
      },
      particles: {
        color: {
          value: "#1B69FA",
        },
        links: {
          color: "#1B44FA",
          distance: 100, // Reduced distance for links
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1, // Reduced speed for particles
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 50, // Reduced number of particles
        },
        opacity: {
          value: { min: 0.2, max: 0.8 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 }, // Reduced size range for particles
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return init ? (
    <Particles
      id="tsparticles"
      init={particlesInit}
      particlesLoaded={particlesLoaded}
      options={options}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  ) : null;
};

export default memo(TsParticles);
