import React from "react";
import { motion } from "framer-motion";
import { FaReact, FaJs, FaHtml5, FaCss3Alt, FaGitAlt } from "react-icons/fa";

const AboutMeHero = ({ landingContent, scrollToSection, sectionRef }) => {
  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-24 lg:py-32 max-w-6xl mx-auto px-4"
    >
      <div className="w-full h-[300px] sm:h-[400px] md:h-[600px] absolute overflow-visible my-12 z-99999">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none"></div>
      </div>
      
      {/* Improved flex layout for better centering */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-16">
        <div className="w-full md:w-2/5 flex justify-center mb-8 md:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Enhanced decorative elements - hide on smallest screens */}
            <div className="hidden sm:block absolute -top-3 sm:-top-5 -left-3 sm:-left-5 w-10 sm:w-16 h-10 sm:h-16 border-t-3 border-l-3 border-blue2 rounded-tl-xl opacity-70"></div>
            <div className="hidden sm:block absolute -bottom-3 sm:-bottom-5 -right-3 sm:-right-5 w-10 sm:w-16 h-10 sm:h-16 border-b-3 border-r-3 border-blue2 rounded-br-xl opacity-70"></div>
            
            <img 
              src={landingContent.image} 
              alt="Daniel Kolpakov" 
              className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover rounded-2xl shadow-xl border-4 border-blue2 relative z-10"
            />
          </motion.div>
        </div>
        
        <div className="w-full md:w-3/5 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue2 mb-4 sm:mb-6 leading-tight">
              {landingContent.title}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              {landingContent.subtitle}
            </p>
            
            {/* Role highlights with better centering on mobile */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-10 justify-center md:justify-start">
              {["Front-end Web Designer", "Interaction Designer", "Creative Problem Solver"].map((tag, idx) => (
                <span key={idx} className="px-3 sm:px-4 py-1 sm:py-2 bg-blue2/10 text-blue2 rounded-full text-xs sm:text-sm font-medium border border-blue2/20">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Technical skills display with improved centering */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center md:justify-start">
              <div className="flex flex-col items-center p-1 sm:p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <FaReact className="text-2xl sm:text-3xl text-blue-500 animate-spin-slow" />
                <span className="text-xs sm:text-sm mt-1 font-medium">React</span>
              </div>
              <div className="flex flex-col items-center p-1 sm:p-2 hover:bg-yellow-100 rounded-lg transition-colors">
                <FaJs className="text-2xl sm:text-3xl text-yellow-500" />
                <span className="text-xs sm:text-sm mt-1 font-medium">JavaScript</span>
              </div>
              <div className="flex flex-col items-center p-1 sm:p-2 hover:bg-orange-100 rounded-lg transition-colors">
                <FaHtml5 className="text-2xl sm:text-3xl text-orange-600" />
                <span className="text-xs sm:text-sm mt-1 font-medium">HTML5</span>
              </div>
              <div className="flex flex-col items-center p-1 sm:p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <FaCss3Alt className="text-2xl sm:text-3xl text-blue-600" />
                <span className="text-xs sm:text-sm mt-1 font-medium">CSS3</span>
              </div>
              <div className="flex flex-col items-center p-1 sm:p-2 hover:bg-red-100 rounded-lg transition-colors">
                <FaGitAlt className="text-2xl sm:text-3xl text-red-500" />
                <span className="text-xs sm:text-sm mt-1 font-medium">Git</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
              <button 
                onClick={() => scrollToSection("contact")}
                className="bg-blue2 hover:bg-blue-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                Get in Touch
              </button>
              <button 
                onClick={() => scrollToSection("portfolio")}
                className="bg-white hover:bg-gray-100 text-blue2 border-2 border-blue2 px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                View My Work
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeHero;
