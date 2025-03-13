import React from "react";
import { motion } from "framer-motion";
import ProjectWidget from "../ProjectWidget"; // Adjust path if needed

const AboutMePortfolioSection = ({ section, projects, sectionRef }) => {
  return (
    <motion.section
      ref={sectionRef}
      className="mb-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2 text-blue2">{section.title}</h2>
        <p className="text-xl text-gray-600">{section.description}</p>
      </div>

      {/* Boxes content - non-projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {section.boxes.map((box, i) => (
          <div
            key={i}
            className={`p-8 rounded-xl shadow-lg ${box.className || ""}`}
          >
            <h3 className="text-2xl font-bold mb-3">{box.heading}</h3>
            <p>{box.description}</p>
          </div>
        ))}
      </div>

      {/* Projects grid with consistent sizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.slice(0, 4).map((project) => (
          <div key={project.id} className="relative h-[500px]">
            <ProjectWidget 
              {...project} 
              showCategory={true}
              category={project.category || "web"}
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default AboutMePortfolioSection;
