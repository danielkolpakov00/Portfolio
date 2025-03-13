import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { grid } from 'ldrs';

const LoadingScreen = ({ isLoading, message = "Loading..." }) => {
  useEffect(() => {
    grid.register();
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center p-6 rounded-lg">
            <div className="flex flex-col items-center">
              {/* Grid loader from ldrs */}
              <l-grid
                size="120"
                speed="1.5" 
                color="#3b82f6" 
              ></l-grid>
              
              {/* Loading text with animation */}
              <motion.div 
                className="text-xl font-georama text-white mt-4 font-bold"
                animate={{ 
                  opacity: [1, 1, 1], 
                  scale: [0.98, 1.02, 0.98] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                {message}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
