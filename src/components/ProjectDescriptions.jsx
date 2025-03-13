import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import hljs from 'highlight.js';
import '../dk-blue.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlay, faSun, faCloud, faWind, faChartLine, faBrain, faChartSimple, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { getProjectDescription } from './project-descriptions';

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

// Export the getProjectDescription function to be used elsewhere
export { getProjectDescription };
