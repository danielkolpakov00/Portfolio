import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import '../index.css';
import DanielImage from '../daniel2.png';
import { FaChevronDown, FaChevronUp, FaSearch, FaBullhorn, FaReact, FaCode, FaCube, FaMusic, FaUser, FaGithub, FaToolbox, FaJs, FaVrCardboard, FaMobile, FaLinkedin } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import '../App.css';
import { Link } from 'react-router-dom';
import TsParticles from '../components/TsParticles';  // Fix import statement

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
  const borderRef = useRef(null);
  const shineRefs = useRef([]);

  useEffect(() => {
    gsap.from('.about-section', { y: 50, duration: 1, ease: 'power3.out', delay: 0.5 });

    gsap.to(borderRef.current, {
      attr: { 'stroke-dashoffset': -1000 },
      duration: 35,
      ease: 'linear',
      repeat: -1,
    });
  }, []);

  const handleMouseEnter = (index) => {
    const shine = shineRefs.current[index];
    // Reset the position before animating
    gsap.set(shine, { x: '-100%' });
    gsap.to(shine, { 
      x: '200%', 
      duration: 0.8,
      ease: 'power1.inOut',
    });
  };

  return (
    <section className="about-section py-20 text-center relative min-h-screen bg-offwhite">
      <TsParticles />
      <Helmet>
        <title>About Me | Daniel Kolpakov</title>
        <meta
          name="description"
          content="Learn more about Daniel Kolpakov,</div> a web developer based in North Vancouver specializing in React.js and front-end development."
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
          {/* Profile Box - Spans 2 columns and 2 rows */}
          <div className="md:col-span-2 md:row-span-2 bg-offwite opacity-80 backdrop-blur-sm text-white p-8 shadow-lg">
          
            <img
              src={DanielImage}
              alt="Daniel"
              className="w-30 h-96 object-cover mx-auto shadow-lg mb-4 "
            />
            <h3
                className="text-5xl font-georama italic font-semibold text-offwhite mb-4 -mt-14 text-shadow-blue-500"
               
              >About</h3>
            <div className="relative z-10 p-4 flex-1 text-center">
              
                
              <p className="text-base leading-relaxed text-blue2">
                I'm deeply passionate about blending design and development, turning digital interfaces into experiences. I enjoy pushing boundaries and learning how to create amazing web development projects that catch the eye.
              </p>
              <div className="flex justify-center items-center space-x-8 mt-8">
                <div className="relative group">
                  <FaReact
                    className="text-4xl text-offwhite mx-auto hover:text-blue-400 transition-colors"title="Built with React"
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
          </div>
          <div className="md:col-span-2 bg-offwhite opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-lg flex items-center justify-center rounded-tl-3xl rounded-br-3xl">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <Link to="https://github.com/danielkolpakov00" target="_blank" rel="noopener noreferrer">
                  <div 
                    className="text-8xl text-blue2 hover:text-blue-700 transition-colors cursor-pointer p-4 rounded-lg"
                  >
                    <FaGithub />
                  </div>
                </Link>
              </div>
              <div className="flex flex-col items-center">
                <Link to="https://www.linkedin.com/in/daniel-kolpakov-829901221" target="_blank" rel="noopener noreferrer">
                  <div 
                    className="text-8xl text-blue2 hover:text-blue-700 transition-colors cursor-pointer p-4 rounded-lg"
                  >
                    <FaLinkedin />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Journey Box - Spans 2 columns */}
          <div className="md:col-span-2 bg-offwhite backdrop-blur-sm opacity-80 backdrop-blur-sm text-white rounded-xl shadow-lg">
            <FaCode className="text-6xl mx-auto mb-4 mt-8"/>
            <div className="relative z-10 p-4 flex-1 text-center">
              <h3
                className="text-3xl font-semibold mb-4 text-blue2"
                style={{ textShadow: '2px 2px 0pxrgb(255, 255, 255)' }}
              >
                My Journey
              </h3>
              <p className="text-base leading-relaxed pt-8 pb-8 text-blue2">
                I started my path in web development driven by a passion for creating interactive and engaging digital experiences. During my time at BCIT's New Media Design and Web Development program, I have been honing my skills in React.js, Three.js, and modern web technologies.
              </p>
            </div>
          </div>

          {/* Technical Toolbox - Spans 2 columns */}
          <div className="md:col-span-2 bg-offwhite opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-lg order-1">
            <FaToolbox className="text-6xl text-blue2 mx-auto mb-4" />
            <div className="relative z-10 p-4 flex-1 w-full">
              <h3 className="text-3xl font-semibold mb-6 text-center text-blue2">Technical Toolbox</h3>
              <div className="grid grid-cols-2 gap-6 pt-4 pb-4 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-3">
                  <FaJs className="text-xl text-blue-600" />
                  <span className="text-blue2">Vanilla JS</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <FaReact className="text-xl text-blue-600" />
                  <span className="text-blue2">React</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <FaCode className="text-xl text-blue-600" />
                  <span className="text-blue2">HTML + CSS</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <FaMobile className="text-xl text-blue-600" />
                  <span className="text-blue2">Mobile-First</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <FaGithub className="text-xl text-blue-600" />
                  <span className="text-blue2">Git & GitHub</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <FaVrCardboard className="text-xl text-blue-600" />
                  <span className="text-blue2">Three.js</span>
                </div>
              </div>
            </div>
          </div>

          {/* Education Box - Spans 2 columns */}
          <div className="md:col-span-2 bg-offwhite opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-lg order-2">
            <FaUser className="text-6xl text-blue-600 mx-auto mb-4" />
            <div className="relative z-10 p-4 flex-1 w-full">
              <h3 className="text-3xl font-semibold mb-6 text-center text-blue2">Education</h3>
              <div className="space-y-4">
                <div className="border-b border-blue-200 pb-4">
                  <h4 className="text-xl font-semibold text-blue2">BCIT</h4>
                  <p className="text-blue2">New Media Design and Web Development</p>
                  <p className="text-gray-600">2024 - 2025</p>
                </div>
                <div className="pb-4">
                  <h4 className="text-xl font-semibold text-blue2">Continuous Learning</h4>
                  <p className="text-blue2">Online Courses & Self-Study</p>
                  <p className="text-gray-600">Three.js, React, JavaScript, Design Concepts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Beyond Code Box - Spans 2 columns */}
          <div className="md:col-span-4 bg-offwhite opacity-80 backdrop-blur-sm text-blue2 p-6 rounded-xl shadow-lg order-3">
            <FaUser className="text-6xl mx-auto mb-4 p-1" />
            <div className="relative z-10 p-4 flex-1 text-center">
              <h3 className="text-3xl font-semibold mb-4 p-4">
                Beyond Code
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-r border-blue-400 pr-4">
                  <h4 className="text-xl font-semibold mb-2">Music Enthusiast</h4>
                  <p className="text-base leading-relaxed">
                    I'm generally a huge fan of music. I enjoy a variety of genres, ranging from house music and classical. Listening to music and discovering new songs is a big part of my life and inspires me in my creative work.
                  </p>
                </div>
                <div className="border-r border-blue-400 pr-4">
                  <h4 className="text-xl font-semibold mb-2">Gaming & Interactive Storytelling</h4>
                  <p className="text-base leading-relaxed">
                    Passionate about narrative-driven and competitive games. I enjoy playing games that challenge my creativity and strategic thinking. 
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Digital Art & Design</h4>
                  <p className="text-base leading-relaxed">
                    Creating digital illustrations and UI concepts using Figma. I love experimenting with different styles and techniques, from minimalist designs to detailed illustrations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Box - Spans full width */}
          <div className="md:col-span-4 p-6 rounded-xl opacity-80">
            <h3 className="text-3xl font-semibold mb-6 text-blue2">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.map((project, index) => (
                <div key={project.id} 
                     className="group relative p-4 rounded-lg shadow-md bg-offwhite overflow-hidden flex flex-col h-full"
                     onMouseEnter={() => handleMouseEnter(index)}>
                  <div 
                    ref={el => shineRefs.current[index] = el}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue1/20 to-transparent pointer-events-none -translate-x-full backdrop-blur-sm"
                    style={{ transform: 'translateX(-100%)' }}
                  ></div>
                  <div className="flex-1">
                    <h4 className="relative z-10 p-3 text-2xl text-blue2 font-semibold mb-2">
                      {project.title}
                    </h4>
                    <p className="relative z-10 p-3 text-base text-blue2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-4">
                    <Link 
                      to={`/projects/${project.id}`}
                      className="relative z-10 px-6 py-3 text-blue2 rounded inline-block hover:bg-blue-600 hover:text-blue1 transition-colors border border-solid border-blue2 hover:border-dashed transition-colors transition-transform transition-all hover:bg-blur-lg"
                      style={{
                        background: 'linear-gradient(90deg, transparent 50%, rgba(40, 74, 247, 0.1) 100%)',
                        backgroundSize: '200% 100%',
                        
                      }}
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;