import React from "react";
import { motion } from "framer-motion";
import TiltedCard from '../../components/ReactBits/TiltedCard';
import AboutMeSectionHeader from "./AboutMeSectionHeader";
import LetterGlitch from '../../components/ReactBits/LetterGlitch';
import Hyperspeed from '../../components/ReactBits/Hyperspeed';
import Balatro from '../../components/ReactBits/Balatro';
import Iridescence from '../../components/ReactBits/Iridescence';

// Visibility wrapper component
const VisibilityWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      {isVisible && children}
    </div>
  );
};

// Animation variants with mobile-friendly adjustments
const cardVariants = {
  hidden: { 
    opacity: 0,
    x: -50, // Reduced x offset for mobile
    y: 20,
    rotateX: -5,
    scale: 0.95 
  },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      delay: i * 0.2, // Slightly faster delay for mobile
      duration: 0.8
    }
  })
};

const AboutMeIntroSection = ({ section, sectionRef }) => {
  return (
    <section 
      id={section.id}
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 border-t border-gray-200/70 max-w-7xl mx-auto"
    >
      <AboutMeSectionHeader 
        title={section.title} 
        description={section.description}
        titleColor="text-blue2"
        descriptionColor="text-blue2/80"
        dividerColor="bg-gradient-to-r from-transparent via-blue2/60 to-transparent"
      />

      <div className="mt-8 sm:mt-10 md:mt-12 px-4">
        {/* Improved grid with better centering - using grid instead of flex for more precise control */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
          {section.boxes.map((box, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ 
                once: true, 
                margin: "-10%", // Adjusted for better mobile experience
                amount: 0.2
              }}
              className="relative transparent overflow-visible w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl overflow-hidden"
            >
              <TiltedCard
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                border="1px solid #1B44FA"
                scaleOnHover={1.02}
                rotateAmplitude={8}
                showMobileWarning={false}
                captionText={box.heading}
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-[#1B69FA]/95 to-[#1B44FA]/95 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-[15px]">
                    <h3 className="absolute text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#F5FDFF]/20 top-2 sm:top-4 text-center pointer-events-none w-full px-2 sm:px-4">
                      {box.heading.toUpperCase()}
                    </h3>
                    <div className="text-center relative z-10 mt-10 sm:mt-12 md:mt-16 lg:mt-20">
                      <p className="text-[#F5FDFF]/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto px-2 sm:px-0">
                        {box.description}
                      </p>
                    </div>
                  </div>
                }
                imageSrc={
                  box.heading === "A bit about me" ? 
                    <VisibilityWrapper>
                      <LetterGlitch
                        glitchSpeed={50}
                        centerVignette={true}
                        outerVignette={false}
                        smooth={true}
                        glitchColors={['#F5FDFF', '#1B69FA', '#1B44FA']}
                      />
                    </VisibilityWrapper> : box.heading === "My path" ?
                    <VisibilityWrapper>
                      <Hyperspeed
                        effectOptions={{
                          distortion: 'turbulentDistortion',
                          length: 600,
                          roadWidth: 50,
                          islandWidth: 2,
                          lanesPerRoad: 2,
                          fov: 80,
                          fovSpeedUp: 150,
                          speedUp: 2,
                          carLightsFade: 0.4,
                          totalSideLightSticks: 20,
                          lightPairsPerRoadWay: 40,
                          shoulderLinesWidthPercentage: 0.05,
                          brokenLinesWidthPercentage: 0.1,
                          brokenLinesLengthPercentage: 0.5,
                          lightStickWidth: [0.12, 0.5],
                          lightStickHeight: [1.3, 1.7],
                          movingAwaySpeed: [60, 80],
                          movingCloserSpeed: [-120, -160],
                          carLightsLength: [400 * 0.03, 400 * 0.2],
                          carLightsRadius: [0.05, 0.14],
                          carWidthPercentage: [0.3, 0.5],
                          carShiftX: [-0.8, 0.8],
                          carFloorSeparation: [0, 5],
                          colors: {
                            roadColor: 0xF5FDFF,
                            islandColor: 0x1B69FA,
                            background: 0xF5FDFF,
                            shoulderLines: 0x1B44FA,
                            brokenLines: 0x1B59FA,
                            leftCars: [0x1B69FA, 0x1B44FA, 0x1B59FA],
                            rightCars: [0x1B69FA, 0x1B44FA, 0x1B59FA],
                            sticks: 0x03B3C3,
                          }
                        }}
                      />
                    </VisibilityWrapper> : box.heading === "My philosophy" ?
                    <VisibilityWrapper>
                      <Balatro
                        isRotate={false}
                        mouseInteraction={false}
                        pixelFilter={700}
                        color1={"#F5FDFF"}
                        color2={"#1B69FA"}
                        color3={"#1B44FA"}
                      />
                    </VisibilityWrapper> : box.heading === "My approach" ?
                    <VisibilityWrapper>
                      <Iridescence
                        color={[0.5, 0.5, 0.9]}
                        mouseReact={false}
                        amplitude={4}
                        speed={1.0}
                      />
                    </VisibilityWrapper> : null
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMeIntroSection;
