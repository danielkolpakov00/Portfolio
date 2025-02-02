import { useMemo, useCallback, memo } from 'react';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const TsParticles = () => {
  const particlesLoaded = (container) => {
    console.log(container);
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(
    () => ({
      // ...existing options...
      background: {
        color: { value: "#f5fdff" },
      },
      fpsLimit: 30,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 12 },
          repulse: { distance: 100, duration: 0.2 },
        },
      },
      particles: {
        color: { value: "#1B69FA" },
        links: {
          color: "#0000FF", // blue links
          distance: 100,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: true,
          speed: 1,
          straight: false,
        },
        number: { density: { enable: true, area: 800 }, value: 50 },
        opacity: {
          value: { min: 0.2, max: 0.8 },
          animation: { enable: true, speed: 1, sync: false },
        },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: true, speed: 2, sync: false },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      particlesLoaded={particlesLoaded}
      options={options}
      style={{
        position: 'fixed', // Changed from 'absolute' to 'fixed'
        top: 0,
        left: 0,
        width: '100vw',    // Use viewport width and height
        height: '100vh',
        zIndex: -1,        // Ensure it stays in the background
        pointerEvents: 'none',
      }}
    />
  );
};

export default memo(TsParticles);
