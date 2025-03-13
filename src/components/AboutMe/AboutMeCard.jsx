import React, { Suspense, lazy, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const PixelCard = lazy(() => import('../../components/ReactBits/PixelCard'));

const AboutMeCard = ({ heading, description }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for smooth animations
  const rotateX = useSpring(0, { stiffness: 100, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 30 });
  const scale = useSpring(1, { stiffness: 120, damping: 20 });
  
  // Handle mouse movement over card for 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position relative to card center
    const rotationY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
    const rotationX = ((e.clientY - centerY) / (rect.height / 2)) * -5;
    
    rotateX.set(rotationX);
    rotateY.set(rotationY);
  };

  return (
    <Suspense
      fallback={
        <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] bg-blue2/10 rounded-lg animate-pulse"></div>
      }
    >
      <motion.div 
        ref={cardRef}
        className="relative h-full w-full [perspective:1000px]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsHovered(true);
          scale.set(1.02);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          rotateX.set(0);
          rotateY.set(0);
          scale.set(1);
        }}
        style={{
          scale,
        }}
      >
        <motion.div
          className="h-full w-full [transform-style:preserve-3d]"
          style={{
            rotateX,
            rotateY,
          }}
        >
          <PixelCard
            variant="blue"
            speed="12"
            gap="8"
            className="h-full w-full rounded-lg overflow-visible border-2 border-blue2/60 bg-white opacity-80 shadow-lg"
          >
            <div className="absolute inset-0 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col overflow-hidden">
              {/* Large background title - adjusted for better medium screen display */}
              <motion.h2 
                className="absolute w-full font-black tracking-tighter text-blue2/30 overflow-visible text-center pointer-events-none leading-[0.8] select-none"
                style={{ 
                  textShadow: isHovered ? "0 0 20px rgba(27,68,250,0.3)" : "none",
                  opacity: isHovered ? 0.35 : 0.25,
                  zIndex: 0,
                  fontSize: 'clamp(3rem, 12vw, 7rem)', // Reduced size for better fit
                  left: '50%', // Explicitly set for better centering
                  top: '50%',  // Explicitly set for better centering
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{ 
                  y: isHovered ? -10 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {heading.toUpperCase()}
              </motion.h2>
              
              {/* Regular heading - improved responsive sizing */}
              <motion.h3 
                className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-blue2 mb-2 sm:mb-3 md:mb-4 lg:mb-6 z-10 relative"
                style={{ textShadow: isHovered ? "0 0 8px rgba(27,68,250,0.3)" : "none" }}
              >
                {heading}
              </motion.h3>
              <motion.p 
                className="text-sm sm:text-base md:text-base lg:text-lg flex-grow z-10 relative text-blue2 overflow-y-auto max-h-full"
              >
                {description}
              </motion.p>
              
              {/* Enhanced animated corner effects */}
              <motion.div 
                className="absolute top-0 left-0 border-t-2 border-l-2 border-blue2/60"
                initial={{ width: 8, height: 8, opacity: 0.6 }}
                animate={{ 
                  width: isHovered ? "100%" : 8, 
                  height: isHovered ? "100%" : 8,
                  opacity: isHovered ? 1 : 0.6
                }}
                transition={{ 
                  duration: isHovered ? 1.2 : 0.3,
                  times: isHovered ? [0, 0.2, 1] : [0, 1],
                  ease: isHovered ? ["easeOut", "easeInOut"] : "easeOut",
                }}
              />
              <motion.div 
                className="absolute bottom-0 right-0 border-b-2 border-r-2 border-blue2/60"
                initial={{ width: 8, height: 8, opacity: 0.6 }}
                animate={{ 
                  width: isHovered ? "100%" : 8, 
                  height: isHovered ? "100%" : 8,
                  opacity: isHovered ? 1 : 0.6
                }}
                transition={{ 
                  duration: isHovered ? 1.2 : 0.3,
                  times: isHovered ? [0, 0.2, 1] : [0, 1],
                  ease: isHovered ? ["easeOut", "easeInOut"] : "easeOut",
                }}
              />
              
              {/* Reveal a subtle glow on hover */}
              <motion.div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isHovered ? 0.1 : 0,
                  background: "radial-gradient(circle at center, rgba(27,68,250,0.4) 0%, rgba(27,68,250,0) 70%)" 
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </PixelCard>
        </motion.div>
      </motion.div>
    </Suspense>
  );
};

export default AboutMeCard;
