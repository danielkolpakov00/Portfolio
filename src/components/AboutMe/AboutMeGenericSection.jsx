import React from "react";
import { motion } from "framer-motion";
import AboutMeSectionHeader from "./AboutMeSectionHeader";
import AboutMeCard from "./AboutMeCard";
import LiquidChrome from "../../components/ReactBits/LiquidChrome";

const AboutMeGenericSection = ({ section, sectionRef, sectionIdx }) => {
  // Custom styling based on section index
  const isEven = sectionIdx % 2 === 0;
  const headerStyles = {
    titleColor: isEven ? "text-blue2" : "text-white",
    descriptionColor: isEven ? "text-blue2/80" : "text-white/80",
    dividerColor: isEven 
      ? "bg-gradient-to-r from-transparent via-blue2/60 to-transparent"
      : "bg-gradient-to-r from-transparent via-white/60 to-transparent"
  };

  return (
    <section
      id={section.id}
      ref={sectionRef}
      className={`relative py-12 sm:py-16 md:py-20 lg:py-24 ${
        sectionIdx % 2 === 1 ? '' : ''
      } border-t border-gray-200/70 max-w-7xl mx-auto`}
    >
      {/* LiquidChrome background for odd-indexed sections (replacing gradient) */}
      {sectionIdx % 2 === 1 && (
        <div className="absolute left-[50%] -translate-x-[50%] right-0 top-0 bottom-0 w-screen -z-10 overflow-hidden opacity-50">
          <LiquidChrome
            baseColor={[0.0, 0.0, 1.0]} // Blue tint that matches the theme
            speed={0.1}
            amplitude={0.4}
            interactive={true}
          />
          {/* Overlay gradient to ensure content visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue2/80 to-blue1 pointer-events-none"></div>
        </div>
      )}

      <AboutMeSectionHeader 
        title={section.title} 
        description={section.description}
        {...headerStyles}
      />
      
      {/* Improved centering with proper responsive layout */}
      <div className="mt-8 sm:mt-10 md:mt-12 px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Take only the first 3 boxes */}
          {section.boxes.slice(0, 3).map((box, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.2 }}
              className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full" 
            >
              <AboutMeCard
                heading={box.heading}
                description={box.description}
                className={box.className || ""}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMeGenericSection;
