import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaCopy } from "react-icons/fa";
import AboutMeSectionHeader from "./AboutMeSectionHeader";
import AboutMeCard from "./AboutMeCard";
import confetti from 'canvas-confetti';
import axios from 'axios';

const AboutMeContactSection = ({ section, sectionRef, triggerConfetti }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('http://localhost:8080/api/send-mail', formData);
    console.log(`Response: ${response.data}`);
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log(`name: ${name}, value: ${value}`);
    setFormData({...formData, [name]: value});
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
    <section
      id={section.id}
      ref={sectionRef}
      className="py-24 border-t border-gray-200/70 max-w-7xl mx-auto px-4"
    >
      <AboutMeSectionHeader 
        title={section.title} 
        description={section.description}
        titleColor="text-blue2"
        descriptionColor="text-blue2/80"
        dividerColor="bg-gradient-to-r from-blue-300/40 via-blue2/60 to-blue-300/40"
        className="contact-header"
      />
      
      <motion.div
        className="mt-16 flex flex-col items-center max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Display the card first (if any) - centered with better width control */}
        {section.boxes.length > 0 && (
          <div className="mb-10 w-full max-w-3xl mx-auto h-[300px] sm:h-[350px] md:h-[400px]">
            <AboutMeCard 
              heading={section.boxes[0].heading}
              description={section.boxes[0].description}
              className="text-center"
            />
          </div>
        )}
        
        {/* Email with improved styling and responsive width */}
        <div className="mb-10 w-full max-w-md sm:max-w-lg mx-auto">
          <div 
            onClick={handleCopyEmail}
            className="relative bg-white p-4 sm:p-7 border-2 border-dashed border-blue2/40 rounded-xl cursor-pointer hover:border-blue2 hover:bg-blue-50/30 transition-colors text-center shadow-sm"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCopyEmail()}
            aria-label="Click to copy email address"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
              <FaEnvelope className="text-blue2 text-xl sm:text-2xl" />
              <span className="text-base sm:text-xl font-medium select-all text-gray-700">danielkolpakov00@gmail.com</span>
              <FaCopy className="text-gray-400 hover:text-blue2 text-lg" />
            </div>
            
            {/* Copy notification */}
            <AnimatePresence>
              {copied && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 -mt-10 bg-green-100 text-green-700 py-2 px-3 rounded-lg shadow-sm text-center font-medium"
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
          className="bg-blue2 hover:bg-blue-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all text-base sm:text-lg flex items-center gap-3 transform hover:-translate-y-1"
        >
          <FaEnvelope /> Send Email
        </a>

        {/* <form onSubmit={handleFormSubmit} className="mt-10 w-full max-w-md sm:max-w-lg mx-auto">
          <div>
            <label>Email:</label>
            <input name="email" type="email" value={formData.email} onChange={handleFormChange} />
          </div>
          <div>
            <label>Message:</label>
            <input name="message" type="text" value={formData.message} onChange={handleFormChange} />
          </div>
          <input type="submit" value="Submit" />
        </form> */}
      </motion.div>
    </section>
  );
};

export default AboutMeContactSection;
