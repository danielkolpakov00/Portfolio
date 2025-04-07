import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { grid } from 'ldrs';
import { useLoadingState, shouldHideLoading } from '../hooks/useLoadingState';

// Collection of fun facts to display randomly
const funFacts = [
  "Windows XP's iconic \"Bliss\" wallpaper is a real photograph taken in Napa Valley, California — no digital enhancements or editing were involved.",
  "The Windows XP startup sound was composed by Bill Brown, known for scoring popular video games such as Rainbow Six and Command & Conquer.",
  "Windows XP was originally developed under the codename \"Neptune\", before Microsoft rebranded it during development.",
  "The system's bright, bubbly visual theme — Luna — was introduced to reflect a more user-friendly and modern look.",
  "Official support for Windows XP ended in 2014, but many ATMs and systems in critical industries continued using it well into the 2020s.",
  "DVD-Video technology, first released in 1996, marked a significant improvement over VHS tapes with better video quality and interactive menus.",
  "Many DVDs featured animated menus, hidden easter eggs, and behind-the-scenes content, creating a more engaging home movie experience.",
  "Region codes were used to restrict DVD playback by geographic area, requiring region-free players or firmware hacks to bypass.",
  "A single-layer DVD could store 4.7GB, while dual-layer versions held up to 8.5GB — enough for a full movie plus bonus content.",
  "Early DVD players included screen saver alerts to prevent image burn-in on CRT televisions, a common concern at the time.",
  "Mac OS X 10.0, released in 2001, introduced the sleek Aqua interface, known for its reflective icons, drop shadows, and \"liquid\" aesthetic.",
  "The popular genie effect used when minimizing windows in early versions of macOS was inspired by physical simulations of elasticity.",
  "Dock magnification was introduced as a subtle way to improve usability and make launching applications more interactive.",
  "macOS was built on Unix foundations and evolved from NeXTSTEP, the operating system created by Steve Jobs during his time away from Apple.",
  "Before the release of Safari, Apple's default browser on macOS was Microsoft Internet Explorer, as part of a unique partnership with Microsoft.",
  "The PlayStation 2 became one of the most affordable and widely used DVD players of its time, driving adoption beyond gaming.",
  "The iPod click wheel used capacitive touch combined with mechanical components, offering precise control over large music libraries.",
  "The well-known anti-piracy message, \"You wouldn't download a car,\" became infamous for its dramatic tone and over-the-top comparisons.",
  "Clippy, the Microsoft Word assistant, was designed to help users with document creation but became widely mocked for its intrusive behavior.",
  "MSN Messenger's \"nudge\" feature would shake the recipient's chat window — a bold way to get someone's attention before \"seen\" was a thing."
];

const LoadingScreen = ({ isLoading: propIsLoading, message = "Loading..." }) => {
  // Get global loading state
  const globalLoadingState = useLoadingState();
  const [localLoading, setLocalLoading] = useState(true);
  const [randomFact, setRandomFact] = useState('');
  
  useEffect(() => {
    grid.register();
    
    // Select a random fun fact
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setRandomFact(funFacts[randomIndex]);
    
    // Initial check if we should already be hiding the loading screen
    const shouldHide = shouldHideLoading();
    if (shouldHide) {
      console.log('LoadingScreen: Global loading state says we should hide immediately');
      setLocalLoading(false);
    }
  }, []);
  
  // Update local loading state when props or global state changes
  useEffect(() => {
    const shouldBeLoading = propIsLoading && !shouldHideLoading();
    
    if (!shouldBeLoading && localLoading) {
      console.log('LoadingScreen: Setting loading to false based on global state');
      setLocalLoading(false);
    } else if (shouldBeLoading !== localLoading) {
      setLocalLoading(shouldBeLoading);
    }
  }, [propIsLoading, globalLoadingState, localLoading]);

  // Debug log when dither is rendered
  useEffect(() => {
    if (globalLoadingState.ditherIsRendered) {
      console.log('LoadingScreen: Dither is fully rendered, can hide loading screen now');
    }
  }, [globalLoadingState.ditherIsRendered]);

  return (
    <AnimatePresence>
      {localLoading && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue2 to-blue1 bg-opacity-10 z-[1000]"
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
                color="#f5fdff" 
              ></l-grid>
              
              {/* Loading text with animation */}
              <motion.div 
                className="text-xl font-georama text-blue-400 mt-4 font-bold"
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
              
              {/* Fun fact display */}
              <motion.div 
                className="text-sm font-georama text-blue-300 mt-6 max-w-md text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                <div className="mb-1 text-blue-200 font-bold">Did you know?</div>
                {randomFact}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
