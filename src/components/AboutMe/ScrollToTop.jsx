import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";

const ScrollToTop = ({ showScrollTop }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue2 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl transform hover:-translate-y-1 z-50"
          aria-label="Scroll to top"
        >
          <FaChevronUp className="text-lg" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
