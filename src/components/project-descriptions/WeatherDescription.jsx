import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faWind, faChartLine } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';

const WeatherDescription = () => {
  const descriptionRef = useRef(null);
  const sectionsRef = useRef([]);
  const featuresRef = useRef([]);
  const [codeContent, setCodeContent] = useState({ html: '', css: '', js: '' });
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    const sections = sectionsRef.current;
    const features = featuresRef.current;

    gsap.set(sections, { 
      opacity: 0, 
      y: 50 
    });

    gsap.set(features, {
      opacity: 0,
      scale: 0.9
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: descriptionRef.current,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
      }
    });

    tl.to(descriptionRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(sections, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out"
    })
    .to(features, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.4");
    
    const handleMouseEnter = (card) => {
      gsap.to(card, {
        y: -5, // Reduced lift
        scale: 1.05, // Subtle scale
        backgroundColor: 'rgba(255, 255, 255, 0.45)', // Slightly brighter
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)', // Enhanced shadow
        duration: 0.3,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = (card) => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Return to original
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        duration: 0.2,
        ease: "power2.inOut"
      });
    };
    
    // Store event listener references for proper cleanup
    const enterListeners = [];
    const leaveListeners = [];
    
    features.forEach((card, index) => {
      if (card) {
        const enterListener = () => handleMouseEnter(card);
        const leaveListener = () => handleMouseLeave(card);
        
        card.addEventListener('mouseenter', enterListener);
        card.addEventListener('mouseleave', leaveListener);
        
        // Store listeners for cleanup
        enterListeners[index] = enterListener;
        leaveListeners[index] = leaveListener;
      }
    });
    
    return () => {
      // Safe cleanup that won't cause errors if elements are already gone
      features.forEach((card, index) => {
        if (card && enterListeners[index] && leaveListeners[index]) {
          card.removeEventListener('mouseenter', enterListeners[index]);
          card.removeEventListener('mouseleave', leaveListeners[index]);
        }
      });
    };
  }, []);

  return (
    <section className="space-y-8 w-full max-w-7xl mx-auto">
      <h3 ref={descriptionRef} className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        A 3D weather app that brings forecasts to life with dynamic visuals
      </h3>
      
      <div ref={el => sectionsRef.current[0] = el} className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
        <h4 className="text-xl font-medium mb-4 text-blue2">Why I Built This</h4>
        <p className="text-lg md:text-xl leading-relaxed mb-6">
          I was tired of boring weather apps that show you the same static icons day after day. So I thought, "What if I could actually see the rain falling or clouds moving when I check the weather?" That's when I decided to build this 3D weather visualization that makes checking the forecast actually fun.
        </p>
        
        <p className="text-lg leading-relaxed mb-6">
          Most weather apps present data in a static and uninspiring manner, which makes it difficult for users to truly understand what's happening outside. I wanted to create something that not only provides accurate information but presents it in a way that feels alive and intuitive.
        </p>
        
        <p className="text-lg leading-relaxed">
          The challenge was to make a visually engaging scene that reflects real world time and weather conditions, as if you're looking out a window!
        </p>
      </div>
      
      <div ref={el => sectionsRef.current[1] = el} className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
        <h4 className="text-xl font-medium mb-4 text-blue2">How It Works</h4>
        <p className="text-lg leading-relaxed mb-6">
          I built a 3D environment that connects to real weather APIs and transforms that data into visual elements. When it's raining in your city, you'll see actual raindrops falling in the scene. If it's sunny, you'll see a brilliant sun with realistic lighting effects. It's weather forecasting that you can actually experience, not just read.
        </p>
        
      
      </div>
      
      <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">The Cool Features</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div ref={el => featuresRef.current[0] = el} className="feature-card p-6 bg-white/80 bg-blur-lg rounded-xl shadow-lg border border-white/20 cursor-pointer">
          <FontAwesomeIcon icon={faSun} className="text-3xl text-blue2 mb-4" />
          <h4 className="text-lg font-medium mb-2">Day/Night Cycle</h4>
          <p className="text-lg text-gray-600">The scene's lighting changes based on the actual time in Vancouver. Morning has a soft golden glow, noon is bright and clear, and night brings a serene moonlit atmosphere.</p>
        </div>
        
        <div ref={el => featuresRef.current[1] = el} className="feature-card p-6 bg-white/80 bg-blur-lg rounded-xl shadow-lg border border-white/20 cursor-pointer">
          <FontAwesomeIcon icon={faCloud} className="text-3xl text-blue2 mb-4" />
          <h4 className="text-lg font-medium mb-2">Dynamic Weather Effects</h4>
          <p className="text-lg text-gray-600">When it rains, thousands of realistic raindrops fall. Snow creates a bunch of white particles representing snowflakes. (as a quick disclaimer, since there isn't really a way for me to get unlimited access to a weather API, I added debug options so you can explore what the weather effects look like.</p>
        </div>
        
      
       
      </div>
      
      
          
        
    </section>
  );
};

export default WeatherDescription;
