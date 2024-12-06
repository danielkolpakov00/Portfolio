import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import './index.css';
import DanielImage from './daniel.webp';
import { FaChevronDown, FaChevronUp, FaReact } from 'react-icons/fa';
import { FaCube } from 'react-icons/fa6'; // Import the light cube from FA6

const AboutMe = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const accordionRefs = useRef([]);
  const containerRef = useRef(null);

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
        height: 'auto',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
      accordionRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    gsap.from('.about-section', { y: 50, duration: 1, ease: 'power3.out', delay: 0.5 });
  }, []);

  return (
    <section className="about-section py-20 bg-offwhite text-center">
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
          {/* Content */}
          <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-8">
            <div className="relative w-full flex-1 bg-blue1 text-white p-8 rounded-lg shadow-lg text-left flex flex-col z-10">
              <img
                src={DanielImage}
                alt="Daniel"
                className="w-full h-80 object-cover rounded-t-lg shadow-lg mb-4"
              />
              <div className="relative z-10 p-4 flex-1">
                <h3
                  className="text-5xl font-georama italic font-semibold mb-4 -mt-14"
                  style={{ textShadow: '5px 0px 0px #1B69FA' }}
                >
                  About <meta http-equiv="X-UA-Compatible" content="IE=7" />
                </h3>
                <p className="text-base leading-relaxed">
                  I'm deeply passionate about blending design and development, by turning digital interfaces into digital experiences. I enjoy pushing boundaries, and learning how to create amazing web development projects that catch the eye.
                </p>
              </div>
              <div className="flex justify-center items-center space-x-8 mt-8">
                {/* React Icon with Tooltip */}
                <div className="relative group">
                  <FaReact
                    className="text-4xl text-offwhite mx-auto hover:text-blue-400 transition-colors"
                    title="Built with React"
                  />
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    React for UI
                  </div>
                </div>
                {/* Light Cube Icon with Tooltip */}
                <div className="relative group">
                  <FaCube
                    className="text-4xl text-offwhite mx-auto hover:text-blue-400 transition-colors"
                    title="3D and Interactive Media"
                  />
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    3D & Animations
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full flex-1 bg-white text-blue2 p-8 rounded-lg shadow-lg text-left flex flex-col z-10">
              <div className="relative z-10 p-4 flex-1">
                <h3 className="text-3xl font-georama italic mb-6">Areas of Expertise</h3>

                {/* Professionalism Accordion */}
                <div>
                  <button
                    className="w-full text-left text-xl font-semibold italic focus:outline-none mb-2 flex justify-between items-center hover:text-blue-700 transition-colors"
                    onClick={() => toggleAccordion(0)}
                    aria-expanded={openAccordion === 0}
                    aria-controls="accordion-content-0"
                  >
                    Front End Web Development {openAccordion === 0 ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <div
                    id="accordion-content-0"
                    ref={(el) => (accordionRefs.current[0] = el)}
                    className="overflow-hidden opacity-0"
                    style={{ height: 0 }}
                  >
                    <p className="mt-2 text-base leading-relaxed bg-blue-50 p-4 rounded-lg">
                      I have experience in building responsive websites using HTML, CSS, and JavaScript. I am also familiar with React and Tailwind CSS. I am always learning new technologies to improve my skills.
                    </p>
                  </div>
                </div>

                {/* Inclusivity Accordion */}
                <div>
                  <button
                    className="w-full text-left text-xl font-semibold italic focus:outline-none mb-2 flex justify-between items-center hover:text-blue-700 transition-colors"
                    onClick={() => toggleAccordion(1)}
                    aria-expanded={openAccordion === 1}
                    aria-controls="accordion-content-1"
                  >
                    3D and Interactive Media {openAccordion === 1 ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <div
                    id="accordion-content-1"
                    ref={(el) => (accordionRefs.current[1] = el)}
                    className="overflow-hidden opacity-0"
                    style={{ height: 0 }}
                  >
                    <p className="mt-2 text-base leading-relaxed bg-blue-50 p-4 rounded-lg">
                      Using 3D software such as Adobe Dimension, I enjoy working on projects that involve 3D models, animations, and environments. A future goal of mine is to be more familiar with Blender.
                    </p>
                  </div>
                </div>

                {/* Innovation Accordion */}
                <div>
                  <button
                    className="w-full text-left text-xl font-semibold italic focus:outline-none mb-2 flex justify-between items-center hover:text-blue-700 transition-colors"
                    onClick={() => toggleAccordion(2)}
                    aria-expanded={openAccordion === 2}
                    aria-controls="accordion-content-2"
                  >
                    SEO and Marketing {openAccordion === 2 ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <div
                    id="accordion-content-2"
                    ref={(el) => (accordionRefs.current[2] = el)}
                    className="overflow-hidden opacity-0"
                    style={{ height: 0 }}
                  >
                    <p className="mt-2 text-base leading-relaxed bg-blue-50 p-4 rounded-lg">
                      I have knowledge in On-Page SEO best practices for web development, including keyword research and creating optimized content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;