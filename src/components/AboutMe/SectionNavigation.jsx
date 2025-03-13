import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SectionNavigation = ({ activeSection, sections }) => {
  return (
    <div className="fixed bottom-28 right-8 z-40 flex flex-col gap-2">
      <AnimatePresence>
        {sections.map((section) => (
          activeSection === section.id && (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-blue2 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            >
              {section.title}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SectionNavigation;
