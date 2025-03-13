import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import confetti from 'canvas-confetti';
import "../index.css";
import "../App.css";

// Import AboutMe components
import AboutMeHero from "../components/AboutMe/AboutMeHero";
import AboutMeIntroSection from "../components/AboutMe/AboutMeIntroSection";
import AboutMeGenericSection from "../components/AboutMe/AboutMeGenericSection";
import AboutMePortfolioSection from "../components/AboutMe/AboutMePortfolioSection";
import AboutMeContactSection from "../components/AboutMe/AboutMeContactSection";
import SectionNavigation from "../components/AboutMe/SectionNavigation";
import ScrollToTop from "../components/AboutMe/ScrollToTop";

// Import data and other components
import DanielImage from "../assets/images/daniel2.png";
import projectsData from '../data/projects.json';

// Import visual components directly
import WeatherPreview from "../WeatherPreview";
import PlinkoPreview from "../PlinkoPreview";
import BedroomPreview from "../BedroomScenePreview";
import MusicPreview from "../MusicPreview";

// Import ProjectWidget (update this import)
import ProjectWidget from "../components/ProjectWidget";

// Keep the content structure
const aboutContent = {
  // Landing section
  landing: {
    title: "I'm Daniel",
    subtitle: "I make cool things on the web. Let's create something extraordinary together.",
    image: DanielImage
  },
  
  // Main sections organized by narrative progression
  sections: [
    {
      id: "introduction",
      title: "My Journey",
      description: "Discover how I became a web developer and what drives my passion",
      boxes: [
        {
          heading: "A bit about me",
          icon: "user",
          description: "I'm a web developer passionate about creating interactive experiences. In my off time, I enjoy playing video games, browsing the web, and coming up with new ideas for projects.",
          className: "bg-gradient-to-br from-white to-offwhite"
        },
        {
          heading: "My path",
          icon: "graduation-cap",
          description: "My learning adventure began at BCIT, where I studied New Media Design and Web Development. I've always been really interested in the creative side of web dev. ",
          className: "bg-gradient-to-br from-white to-offwhite"
        },
        {
          heading: "My philosophy",
          icon: "lightbulb",
          description: "I believe that the best design is made with the user in mind. I enjoy making interactive experiences that everyone can enjoy. Building for the web allows me to reach a wider audience.",
          className: "bg-gradient-to-br from-white to-offwhite"
        },
        {
          heading: "My approach",
          icon: "cogs",
          description: "I love creating and I love design. Learning to code has empowered me to bring my creative ideas to life through interactive web experiences.",
          className: "bg-gradient-to-br from-white to-offwhite"
        }
      ]
    },
    {
      id: "education",
      title: "Learning & Growth",
      description: "The skills and knowledge I've gained along the way",
      boxes: [
        {
          heading: "What I've learned so far",
          icon: "graduation-cap",
          description: "During 2024 and a bit of 2025, I attended BCIT's New Media Design and Web Development program. My main areas of focus were web development and design.",
          className: "bg-none"
        },
        {
          heading: "Continuous learning",
          icon: "book",
          description: "I always want to learn more, so I like reading articles, taking quizzes, and watching tutorials to keep my skills sharp.",
          className: "bg-gradient-to-br from-white to-offwhite"
        },
        {
          heading: "Hands-on Experience",
          icon: "null",
          description: "Building my portfolio and working on projects has been a great way to learn new things and apply my skills in a real-world setting. I'm really into designing web interactions.",
          className: "bg-gradient-to-br from-white to-offwhite"
        }
      ]
    },
    {
      id: "experience",
      title: "Professional Experience",
      description: "Where I've worked and what I've accomplished",
      boxes: [
        {
          heading: "Building Cool Stuff",
          icon: "briefcase",
          description: "From sleek websites to interactive apps, I've worked on projects that push creativity and functionality. Always experimenting, always leveling up!",
         className: "bg-gradient-to-br from-white to-offwhite"
        },
        {
          heading: "Milestones & Wins",
          icon: "trophy",
          description: "I always take pride in achievements and milestones, whether it's launching a new project or learning a new skill.",
         className: "bg-gradient-to-br from-white to-offwhite"
        },
        {
          heading: "What I've Worked on",
          icon: "star",
          description: "I've tackled projects of a bunch of different types, but I really enjoy being able to work on projects that involve a lot of creativity and design.",
          className: "bg-gradient-to-br from-white to-offwhite"
        },
        {
          heading: "Project management",
          icon: "star",
          description: "I've gained valuable experience during my time at BCIT, working with agile scrum methodologies on group projects and constantly working on improving my skills in time management, communication, and collaboration.",
         className: "bg-gradient-to-br from-white to-offwhite"
        }
      ]
    },
    {
      id: "portfolio",
      title: "Selected Works",
      description: "Highlights from my creative portfolio",
      boxes: []
    },
    {
      id: "contact",
      title: "Let's Connect",
      description: "Ready to discuss your project? Get in touch directly via email.",
      boxes: []
    }
  ]
};

// Map visual components to their imported references
const visualComponents = {
  "WeatherPreview": WeatherPreview,
  "PlinkoPreview": PlinkoPreview,
  "BedroomPreview": BedroomPreview,
  "MusicPreview": MusicPreview
};

// Replace hardcoded projects with data from JSON
const projects = projectsData.vanillaProjects.map(project => ({
  ...project,
  visual: visualComponents[project.visualComponent],
  // Ensure category is always set for consistent UI
  category: project.category || "web"
}));

// Trigger confetti effect
const triggerConfetti = () => {
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Create a confetti burst effect
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Shoot confetti from the left and right sides
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

export default function AboutMe() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionRefs = useRef({});

  // Handle scroll to observe which section is in view
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll-to-top button
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      // Determine which section is in view
      const sections = Object.keys(sectionRefs.current);
      for (const section of sections) {
        const element = sectionRefs.current[section];
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        // If section is in viewport
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="relative min-h-screen z-10 bg-gradient-to-b from-transparent to-blue-50/20">
      
      <Helmet>
        <title>About Me | Daniel Kolpakov</title>
        <meta name="description" content="Discover Daniel Kolpakov, a web developer who blends creativity with technology to deliver remarkable digital experiences." />
      </Helmet>
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <AboutMeHero 
          landingContent={aboutContent.landing}
          scrollToSection={scrollToSection}
          sectionRef={(el) => (sectionRefs.current.hero = el)}
        />
        
        {/* Content Sections */}
        {aboutContent.sections.map((section, sectionIdx) => {
          if (section.id === "introduction") {
            return (
              <AboutMeIntroSection 
                key={section.id}
                section={section}
                sectionRef={(el) => (sectionRefs.current[section.id] = el)}
              />
            );
          } else if (section.id === "portfolio") {
            return (
              <AboutMePortfolioSection 
                key={section.id}
                section={section}
                projects={projects}
                sectionRef={(el) => (sectionRefs.current[section.id] = el)}
              />
            );
          } else if (section.id === "contact") {
            return (
              <AboutMeContactSection 
                key={section.id}
                section={section}
                sectionRef={(el) => (sectionRefs.current[section.id] = el)}
                triggerConfetti={triggerConfetti}
              />
            );
          } else {
            return (
              <AboutMeGenericSection 
                key={section.id}
                section={section}
                sectionRef={(el) => (sectionRefs.current[section.id] = el)}
                sectionIdx={sectionIdx}
              />
            );
          }
        })}
      </main>
      
      {/* Section Navigation */}
      <SectionNavigation 
        activeSection={activeSection} 
        sections={aboutContent.sections}
      />
      
      {/* Scroll To Top Button */}
      <ScrollToTop showScrollTop={showScrollTop} />
    </div>
  );
}