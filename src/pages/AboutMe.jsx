import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {  
  FaUser, FaBook, FaGraduationCap, FaBriefcase, 
  FaTrophy, FaCogs, FaLightbulb, FaImages, 
  FaSmile, FaHandsHelping, FaEnvelope, FaStar,
  FaChevronUp, FaExternalLinkAlt, FaCopy, FaReact, FaJs, FaCss3Alt, FaGitAlt
} from "react-icons/fa";
import DanielImage from "../assets/images/daniel2.png";
import "../index.css";
import "../App.css";
// Import needed shadcn components below
// You'll need to install shadcn UI first: https://ui.shadcn.com/docs/installation

// Keep the text animation utils
import { splitTextIntoLetters } from "../utils";
import ProjectWidget from "../components/ProjectWidget";
import YellowSphere from "../YellowSphere";
import PlinkoPreview from "../PlinkoPreview";
import BedroomPreview from "../BedroomScenePreview";
import MusicPreview from "../MusicPreview";
import confetti from 'canvas-confetti';
import { FaHtml5 } from "react-icons/fa";

// Animated Text component - keep as is
const AnimatedText = ({ text, className = "", delay = 0, staggerTime = 0.05, animationType = "fade" }) => {
  const textRef = useRef(null);
  const letters = splitTextIntoLetters(text);

  
  return (
    <div ref={textRef} className={`overflow-hidden perspective-text ${className}`}>
      {letters}
    </div>
  );
};

// Keep your content structure
const aboutContent = {
  // Landing section
  landing: {
    title: "Hey, I'm Daniel",
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
          description: "I'm a web developer passionate about creating interactive experiences. When I'm not coding, I enjoy video games, cooking, and DJing in my bedroom.",
          className: "bg-gradient-to-br from-white to-blue-50"
        },
        {
          heading: "My background",
          icon: "book",
          description: "I love creating and I love design. Learning code is something that I've always wanted to do as it allows me to bring my ideas to life.",
          className: "bg-gradient-to-br from-white to-blue-50"
        },
        {
          heading: "My philosophy",
          icon: "star",
          description: "I believe that the best design is made with the user in mind. I enjoy making interactive experiences that everyone can enjoy. I think building for the web is really good because you can reach a wider audience than you could for programs or applications.",
          className: "bg-gradient-to-br from-white to-blue-50"
        },
        {
          heading: "Personal journey",
          icon: "star",
          description: "I started learning a bit of code in high school and took a few bootcamp courses here and there, but I really tied those skills together when I started my web development program at BCIT.",
          className: "bg-gradient-to-br from-white to-blue-50"
        }
      ]
    },
    {
      id: "education",
      title: "Learning & Growth",
      description: "The skills and knowledge I've gained along the way",
      boxes: [
        {
          heading: "Education",
          icon: "graduation-cap",
          description: "During 2024 and a bit of 2025, I attended BCIT's New Media Design and Web Development program. My main areas of focus were web development and design.",
          className: "bg-gradient-to-br from-white to-blue-50"
        },
        {
          heading: "Continuous learning",
          icon: "book",
          description: "I always want to learn more, so I like reading articles, taking quizzes, and watching tutorials to keep my skills sharp.",
          className: "bg-gradient-to-br from-white to-blue-50"
        },
        {
          heading: "Professional development",
          icon: "star",
          description: "Building my portfolio and working on projects has been a great way to learn new things and apply my skills in a real-world setting. I'm really into designing web interactions, like interfaces that people can do stuff with, and I hope to continue doing that in the future.",
          className: "bg-gradient-to-br from-white to-blue-50"
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
          description: "From sleek websites to interactive apps, I’ve worked on projects that push creativity and functionality. Always experimenting, always leveling up!",
         className: "bg-gradient-to-br from-white to-blue-50"
        },
        {
          heading: "Milestones & Wins",
          icon: "trophy",
          description: "Whether it’s nailing a complex animation, optimizing performance, or launching a big project, I take pride in the little (and big) victories.",
         className: "bg-gradient-to-br from-white to-blue-50"
        },
        {
          heading: "What I've Worked on",
          icon: "star",
          description: "I've tackled projects of a bunch of different types, but I really enjoy being able to work on projects that involve a lot of creativity and design.",
          className: "bg-gradient-to-br from-white to-blue-50"
        },
        ,
        {
          heading: "Project management",
          icon: "star",
          description: "I've gained valuable experience during my time at BCIT, working with agile scrum methodologies on group projects and constantly working on improving my skills in time management, communication, and collaboration.",
         className: "bg-gradient-to-br from-white to-blue-50"
        }
      ]
    },
    {
      id: "skills",
      title: "Technical Toolkit",
      description: "The technologies and methodologies I use to create",
      boxes: [
        {
          heading: "Core skills",
          icon: "cogs",
          description: [
            "I specialize in modern web technologies to build powerful, responsive applications.",
            <div className="flex flex-wrap justify-center gap-4 mt-4 py-3">
              <div className="flex flex-col items-center p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <FaReact className="text-3xl text-blue-500 animate-spin-slow" />
                <span className="text-sm mt-1 font-medium">React</span>
              </div>
              <div className="flex flex-col items-center p-2 hover:bg-yellow-100 rounded-lg transition-colors">
                <FaJs className="text-3xl text-yellow-500" />
                <span className="text-sm mt-1 font-medium">JavaScript</span>
              </div>
              <div className="flex flex-col items-center p-2 hover:bg-orange-100 rounded-lg transition-colors">
                <FaHtml5 className="text-3xl text-orange-600" />
                <span className="text-sm mt-1 font-medium">HTML5</span>
              </div>
              <div className="flex flex-col items-center p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <FaCss3Alt className="text-3xl text-blue-600" />
                <span className="text-sm mt-1 font-medium">CSS3</span>
              </div>
              <div className="flex flex-col items-center p-2 hover:bg-red-100 rounded-lg transition-colors">
                <FaGitAlt className="text-3xl text-red-500" />
                <span className="text-sm mt-1 font-medium">Git</span>
              </div>
            </div>
          ],
          className: "bg-gradient-to-br from-white to-blue-50"
        },
    
      ]
    },
    {
      id: "portfolio",
      title: "Selected Works",
      description: "Highlights from my creative portfolio",
      boxes: [
        {
          heading: "Project highlights",
          icon: "images",
          description: "My portfolio showcases immersive 3D projects, modern web applications, and interactive digital experiences.",
          className: "backdrop-blur-sm bg-white/80"
        },
        {
          heading: "Client impact",
          icon: "smile",
          description: "Clients appreciate my attention to detail, reliability, and commitment to exceeding expectations on every project.",
          className: "border-l-2 border-r-2 border-blue2/40"
        },
        {
          heading: "Featured project: Interactive Gallery",
          icon: "star",
          description: "A WebGL-powered art showcase featuring custom shaders, interactive camera controls, and optimized asset loading for a smooth browsing experience across all devices.",
          className: "bg-gradient-to-br from-blue-50 via-white to-blue-50"
        },
        {
          heading: "Featured project: E-commerce Platform",
          icon: "star",
          description: "A full-stack online shopping experience with real-time inventory management, secure payment processing, and a responsive design that increased mobile conversions by 45%.",
          className: "border-b-4 border-blue2/40"
        }
      ]
    },
    {
      id: "contact",
      title: "Let's Connect",
      description: "Ready to discuss your project? Get in touch directly via email.",
      boxes: []
    }
  ]
};

// Navigation item component
const NavItem = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md transition-all ${
      active ? "bg-blue2 text-white shadow-md" : "text-blue2 hover:bg-blue2/10"
    }`}
  >
    {children}
  </button>
);

// Section header component
const SectionHeader = ({ title, description }) => (
  <div className="mb-8 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-blue2 mb-2">{title}</h2>
    <p className="text-blue2/80 text-lg max-w-2xl mx-auto">{description}</p>
    <div className="w-20 h-1 bg-blue2/40 mx-auto mt-4 rounded-full"></div>
  </div>
);

// Card component with shadcn-inspired styling
const Card = ({ heading, description, icon, image, className = "" }) => {
  return (
    <div className={`bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 w-full h-full flex flex-col ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-blue2 text-2xl">
          {getIconForHeading(heading)}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{heading}</h3>
      </div>
      
      {image && (
        <div className="mb-4 rounded-md overflow-hidden">
          <img 
            src={image} 
            alt={heading}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      <div className="text-gray-700 space-y-2 text-center flex-grow">
        {Array.isArray(description) ? (
          description.map((para, i) => <p key={i}>{para}</p>)
        ) : (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
};

// Helper function for icons (simplified)
const getIconForHeading = (heading) => {
  switch (heading) {
    case "A bit about me": 
    case "My background": return <FaUser />;
    case "Education": 
    case "Continuous learning": return <FaGraduationCap />;
    case "Work history": return <FaBriefcase />;
    case "Achievements": return <FaTrophy />;
    case "Core skills": return <FaCogs />;
    case "Creative approach": return <FaLightbulb />;
    case "Project highlights": return <FaImages />;
    case "Client impact": return <FaSmile />;
    case "Collaboration opportunities": return <FaHandsHelping />;
    case "Get in touch": return <FaEnvelope />;
    default: return <FaStar />;
  }
};

// Add projects array from PortfolioPreview.jsx
const projects = [
  {
    id: 1,
    title: "Weather API Project",
    description:
      "I built a Three.js scene that grabs weather data from OpenWeather API and displays the current temperature in Vancouver.",
    buttonText: "Check it out!",
    color: "#284af7",
    visual: YellowSphere,
  },
  {
    id: 2,
    title: "Matter.js Plinko",
    description:
      "Using a physics engine, I made a Plinko game and balanced it as much as possible using y-axis forces and testing peg layouts.",
    buttonText: "Check it out!",
    color: "#284af7",
    visual: PlinkoPreview,
  },
  {
    id: 3,
    title: "3D Bedroom Scene",
    description:
      "As I have a desire for learning 3D design, I created a Three.js scene that resembles a bedroom.",
    buttonText: "Check it out!",
    color: "#284af7",
    visual: BedroomPreview,
  },
  {
    id: 4,
    title: "Music Visualizer",
    description:
      "I created a music visualizer using Three.js and Web Audio API. The visualizer reacts to the music and creates a unique visual experience.",
    buttonText: "Check it out!",
    color: "#284af7",
    visual: MusicPreview,
  },
];

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
  const [copied, setCopied] = useState(false);

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
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('danielkolpakov00@gmail.com')
      .then(() => {
        setCopied(true);
        // Trigger the confetti animation when copied successfully
        triggerConfetti();
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy email: ', err);
      });
  };

  return (
    <div className="relative min-h-screen z-10">
      
      <Helmet>
        <title>About Me | Daniel Kolpakov</title>
        <meta name="description" content="Discover Daniel Kolpakov, a web developer who blends creativity with technology to deliver remarkable digital experiences." />
      </Helmet>
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section 
          ref={(el) => (sectionRefs.current.hero = el)}
          className="py-16 md:py-24"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={aboutContent.landing.image} 
                  alt="Daniel Kolpakov" 
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-lg border-4 border-blue2"
                />
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-blue2 mb-4">
                  {aboutContent.landing.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8">
                  {aboutContent.landing.subtitle}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button 
                    onClick={() => scrollToSection("contact")}
                    className="bg-blue2 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Get in Touch
                  </button>
                  <button 
                    onClick={() => scrollToSection("portfolio")}
                    className="bg-white hover:bg-gray-100 text-blue2 border border-blue2 px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    View My Work
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Content Sections - one for each topic */}
        {aboutContent.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => (sectionRefs.current[section.id] = el)}
            className="py-16 border-t border-gray-200"
          >
            <SectionHeader title={section.title} description={section.description} />
            
            {/* Use projects data for portfolio section, regular content for others */}
            {section.id === "portfolio" ? (
              <div className="flex flex-wrap justify-center">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: project.id * 0.1 }}
                    className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] p-3"
                  >
                    <div className="relative min-h-[400px]">
                      <ProjectWidget {...project} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center">
                {section.boxes.map((box, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] p-3 flex"
                  >
                    <Card
                      heading={box.heading}
                      description={box.description}
                      image={box.image}
                      className={box.className || ""}
                    />
                  </motion.div>
                ))}
              </div>
            )}
            
            {section.id === "contact" && (
              <motion.div
                className="mt-8 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Display the card first (if any) */}
                {section.boxes.length > 0 && (
                  <div className="mb-8 w-full max-w-md mx-auto">
                    <Card 
                      heading={section.boxes[0].heading}
                      description={section.boxes[0].description}
                      className="text-center"
                    />
                  </div>
                )}
                
                {/* Email with copy functionality - cleaned up version */}
                <div className="mb-6 w-full max-w-md mx-auto">
                  <div 
                    onClick={handleCopyEmail}
                    className="relative bg-white p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue2 transition-colors text-center"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCopyEmail()}
                    aria-label="Click to copy email address"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <FaEnvelope className="text-blue2 text-xl" />
                      <span className="text-lg font-medium select-all text-gray-700">danielkolpakov00@gmail.com</span>
                      <FaCopy className="text-gray-400 hover:text-blue2" />
                    </div>
                    
                    {/* Copy notification */}
                    <AnimatePresence>
                      {copied && (
                        <motion.div 
                          className="absolute top-0 left-0 right-0 -mt-8 bg-green-100 text-green-700 text-sm py-1 px-2 rounded shadow-sm text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          Copied to clipboard!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <a 
                  href="mailto:danielkolpakov00@gmail.com" 
                  className="bg-blue2 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all text-lg flex items-center gap-2"
                >
                  <FaEnvelope /> Send Email
                </a>
              </motion.div>
            )}
          </section>
        ))}
      </main>
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue2 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
            aria-label="Scroll to top"
          >
            <FaChevronUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}