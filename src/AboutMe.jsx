import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import './index.css';
import DanielImage from './daniel2.png';
import { FaChevronDown, FaChevronUp,  FaSearch, FaBullhorn, FaReact, FaCode, FaCube, FaMusic, FaUser, FaGithub, FaToolbox, FaJs, FaVrCardboard, FaMobile, FaLinkedin } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import './App.css';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 1,
    title: 'Weather API Project',
    description: 'I built a Three.js scene that grabs weather data from OpenWeather API and displays the current temperature in Vancouver.',
    buttonText: 'Check it out!',
    color: '#284af7',
  },
  {
    id: 2,
    title: 'Matter.js Plinko',
    description: 'Using a physics engine, I made a fun and interesting Plinko game, and balanced it as much as possible using y-axis forces and testing peg layouts.',
    buttonText: 'Check it out!',
    color: '#284af7',
  },
  {
    id: 3,
    title: '3D Bedroom Scene',
    description: 'As I have a desire for learning 3D design, I created a Three.js scene that resembles a bedroom.',
    buttonText: 'Check it out!',
    color: '#284af7',
  },
  {
    id: 4,
    title: 'Music Visualizer',
    description: 'I created a music visualizer using Three.js and Web Audio API. The visualizer reacts to the music and creates a unique visual experience.',
    buttonText: 'Check it out!',
    color: '#284af7',
  }
];

const AboutMe = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const accordionRefs = useRef([]);
  const containerRef = useRef(null);
  const borderRef = useRef(null);

  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      gsap.to(accordionRefs.current[index], {
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.out',
      });
      setOpenAccordion(null);
    } else {
      if (openAccordion !== null) {
        gsap.to(accordionRefs.current[openAccordion], {
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power3.out',
        });
      }
      setOpenAccordion(index);
      gsap.to(accordionRefs.current[index], {
        height: '140',
        paddingBottom: '1rem',
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
      accordionRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    gsap.from('.about-section', { y: 50, duration: 1, ease: 'power3.out', delay: 0.5 });

    gsap.to(borderRef.current, {
      attr: { 'stroke-dashoffset': -1000 },
      duration: 35,
      ease: 'linear',
      repeat: -1,
    });
  }, []);

  return (
    <section className="about-section py-20 bg-offwhite text-center">
      <Helmet>
        <title>About Me | Daniel Kolpakov</title>
        <meta
          name="description"
          content="Learn more about Daniel Kolpakov, a web developer based in North Vancouver specializing in React.js and front-end development."
        />
        <meta
          name="keywords"
          content="about daniel kolpakov, web developer, front-end development, React.js, North Vancouver, British Columbia, UI/UX designer, portfolio"
        />
      </Helmet>
      <h2
        className="text-4xl text-blue2 font-georama italic mb-12"
        style={{ textShadow: '2px 2px 0px lightgray' }}
      >
        About me
      </h2>

      <div className="container mx-auto px-4">
        <div
          ref={containerRef}
          className="relative p-8 bg-offwhite rounded-lg overflow-visible"
        >
          <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-8">
            <div className="relative w-full flex-1 bg-blue1 text-white p-8 rounded-lg shadow-lg flex flex-col items-center z-10">
              <img
                src={DanielImage}
                alt="Daniel"
                className="w-60 h-50 object-contain rounded-t-lg shadow-lg mb-4"
              />
              <div className="relative z-10 p-4 flex-1 text-center">
                <h3
                  className="text-5xl font-georama italic font-semibold mb-4 -mt-14"
                  style={{ textShadow: '5px 0px 0px #1B69FA' }}
                >
                  About
                </h3>
                <p className="text-base leading-relaxed">
                  I'm deeply passionate about blending design and development, turning digital interfaces into experiences. I enjoy pushing boundaries and learning how to create amazing web development projects that catch the eye.
                </p>
              </div>
              <div className="flex justify-center items-center space-x-8 mt-8">
                <div className="relative group">
                  <FaReact
                    className="text-4xl text-offwhite mx-auto hover:text-blue-400 transition-colors"
                    title="Built with React"
                  />
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    React for UI
                  </div>
                </div>
                <div className="relative group">
                  <FaCube
                    className="text-4xl text-offwhite mx-auto hover:text-blue-400 transition-colors"
                    title="3D and Interactive Media"
                  />
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    3D Interactive Media
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full flex-1 bg-white text-blue2 p-8 rounded-lg shadow-lg text-left flex flex-col z-10 animated-border">
            <div className="relative z-10 p-4 flex-1">


 
            <div className="grid grid-cols-2 gap-8">
    <div className="flex flex-col items-center">
      <Link to="https://github.com/danielkolpakov00" target="_blank" rel="noopener noreferrer">
        <div 
          className="text-8xl hover:text-blue-700 transition-colors cursor-pointer p-4 rounded-lg"
        >
          <FaGithub />
        </div>
      </Link>
    </div>

    <div className="flex flex-col items-center">
      <Link to="https://www.linkedin.com/in/daniel-kolpakov-829901221" target="_blank" rel="noopener noreferrer">
        <div 
          className="text-8xl hover:text-blue-700 transition-colors cursor-pointer p-4 rounded-lg"
        >
          <FaLinkedin />
        </div>
      </Link>
 
  </div>

   


  </div>
</div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect
                  ref={borderRef}
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  rx="8"
                  ry="8"
                  fill="none"
                  stroke="blue"
                  strokeWidth="4"
                  strokeDasharray="20"
                  strokeDashoffset="0"
                />
              </svg>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Box 1: My Journey */}
          <div className="relative p-8 bg-blue1 text-white rounded-lg shadow-lg flex flex-col items-center">
            <div className="relative z-10 p-4 flex-1 text-center">
              <div className="flex justify-center mb-4">
              <FaCode className="text-8xl" />
              </div>
              <h3
                className="text-3xl font-semibold mb-4"
                style={{ textShadow: '2px 2px 0px #1B69FA' }}
              >
                My Journey
              </h3>
              <p className="text-base leading-relaxed pt-8 pb-8">
                I started my path in web development driven by a passion for creating interactive and engaging digital experiences. During my time at BCIT's New Media Design and Web Development program, I have been honing my skills in React.js, Three.js, and modern web technologies.
              </p>
            </div>
          </div>

          {/* Box 2: Additional Skills */}
          <div className="relative p-8 bg-white text-white rounded-lg shadow-lg flex flex-col items-center">
            <div className="relative z-10 p-4 flex-1 w-full">
              <div className="flex justify-center mb-4">
                <FaToolbox className="text-6xl text-blue-600" />
              </div>
              <h3 className="text-3xl font-semibold mb-6 text-center text-blue2 p-9">Technical Toolbox</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaJs className="text-xl text-blue-600" />
                  <span className="text-blue2">Vanilla JS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaReact className="text-xl text-blue-600" />
                  <span className="text-blue2">React for Web Development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCode className="text-xl text-blue-600" />
                  <span className="text-blue2">HTML + CSS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMobile className="text-xl text-blue-600" />
                  <span className="text-blue2">Mobile-First Development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaGithub className="text-xl text-blue-600" />
                  <span className="text-blue2">Git & GitHub</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaVrCardboard className="text-xl text-blue-600" />
                  <span className="text-blue2">Three.js for 3D Web Graphics</span>
                </div>
              </div>
            </div>
          </div>
  {/* Box 3: Hobbies */}
  <div className="relative p-8 bg-blue1 text-white rounded-lg shadow-lg flex flex-col items-center">
    <div className="relative z-10 p-4 flex-1 text-center">
      <div className="flex justify-center mb-4">
        <FaUser className="text-8xl" />
      </div>
      <h3 className="text-3xl font-semibold mb-4 p-4" style={{ textShadow: '2px 2px 0px #1B69FA' }}>
        Beyond Code
      </h3>
      <div className="space-y-6">
        <div className="border-b border-blue-400 pb-9">
          <h4 className="text-xl font-semibold mb-2">Music Enthusiast</h4>
          <p className="text-base leading-relaxed">
            I enjoy listening to a wide range of music genres, from house music to classical. Listening to music and discovering new songs is a big part of my life and inspires me in my creative work.
          </p>
        </div>
        
        <div className="border-b border-blue-400 pb-4">
          <h4 className="text-xl font-semibold mb-2">Gaming & Interactive Storytelling</h4>
          <p className="text-base leading-relaxed">
            Passionate about narrative-driven and competitive games. I enjoy playing games that challenge my creativity and strategic thinking. 
          </p>
        </div>
        
        <div className="pb-4">
          <h4 className="text-xl font-semibold mb-2">Digital Art & Design</h4>
          <p className="text-base leading-relaxed">
            Creating digital illustrations and UI concepts using Figma. I love experimenting with different styles and techniques, from minimalist designs to detailed illustrations.
          </p>
        </div>
      </div>
    </div>
  </div>
  {/* Box 4: Projects */}
          <div className="relative p-8 bg-white text-white rounded-lg shadow-lg flex flex-col items-center">
            <div className="relative z-10 p-4 flex-1 text-center">
              <h3 className="text-3xl font-semibold mb-4 text-blue2">A few of my projects..</h3>
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project, index) => {
                  const gradientClasses = [
                    "bg-gradient-to-r from-blue-600 to-purple-600",  // Project 1
                    "bg-gradient-to-r from-green-500 to-blue-500",   // Project 2
                    "bg-gradient-to-r from-purple-500 to-pink-500",  // Project 3
                    "bg-gradient-to-r from-yellow-500 to-red-500"    // Project 4
                  ];

                  return (
                    <div 
                      key={project.id} 
                      className={`${gradientClasses[index]} p-4 rounded-lg shadow-md transition-all duration-300`}
                      style={{
                        backgroundSize: '200% 200%',
                        animation: 'gradient 15s ease infinite'
                      }}
                    >
                      <h4 className="p-3 text-2xl text-white font-semibold mb-2">
                        {project.title}
                      </h4>
                      <p className="p-3 text-base text-white leading-relaxed mb-2">
                        {project.description}
                      </p>
                      <Link 
              to={`/projects/${project.id}`}
              className="mt-4 px-4 py-2 bg-white text-blue2 rounded inline-block hover:bg-blue-600 transition-colors"
            >
                        View Project
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        
        
        </div>
      </div>
        </div>
        
      </div>
      {/* New Content Boxes */}
     
    </section>
  );
};

export default AboutMe;