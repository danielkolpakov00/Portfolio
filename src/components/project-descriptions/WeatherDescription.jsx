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
    
    // Remove the mouse enter/leave event listeners since these elements aren't clickable
    
    return () => {
      // Clean up code
    };
  }, []);

  return (
    <section className="space-y-8 w-full">
      <h4 ref={descriptionRef} className="text-xl text-white md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
        A 3D weather app that brings forecasts to life with dynamic visuals
      </h4>
      
      <div ref={el => sectionsRef.current[0] = el} className="bg-blue2/40 backdrop-blur-lg rounded-xl p-8">
        <h4 className="text-xl font-medium mb-4 text-white">Why I Built This</h4>
        <p className="text-lg md:text-xl leading-relaxed mb-6 text-white">
          I was tired of boring weather apps that show you the same static icons day after day. So I thought, "What if I could actually see the rain falling or clouds moving when I check the weather?" That's when I decided to build this 3D weather visualization that makes checking the forecast actually fun.
        </p>
        
        <p className="text-lg leading-relaxed mb-6 text-white">
          Most weather apps present data in a static and uninspiring manner, which makes it difficult for users to truly understand what's happening outside. I wanted to create something that not only provides accurate information but presents it in a way that feels alive and intuitive.
        </p>
        
        <p className="text-lg leading-relaxed text-white">
          The challenge was to make a visually engaging scene that reflects real world time and weather conditions, as if you're looking out a window!
        </p>
      </div>
      
     
    </section>
  );
};

export default WeatherDescription;
