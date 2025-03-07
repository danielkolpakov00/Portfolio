import React from "react";

/**
 * Splits text into individual letters wrapped in span tags for animation
 * @param {string} text - The text to split
 * @param {string} className - Optional CSS class to add to each span
 * @returns {Array} Array of span elements with individual letters
 */
export const splitTextIntoLetters = (text, className = '') => {
  if (!text) return [];
  
  return text.split('').map((letter, index) => {
    return (
      <span 
        key={`letter-${index}`}
        className={className}
        style={{ display: 'inline-block' }}
      >
        {letter === ' ' ? '\u00A0' : letter}
      </span>
    );
  });
};

/**
 * Splits text into words, then each word into letters
 * @param {string} text - The text to split
 * @param {string} wordClassName - Optional CSS class for word containers
 * @param {string} letterClassName - Optional CSS class for letter spans
 * @returns {Array} Array of word elements containing letter spans
 */
export const splitTextIntoWords = (text, wordClassName = '', letterClassName = '') => {
  if (!text) return [];
  
  return text.split(' ').map((word, wordIndex) => {
    const letters = word.split('').map((letter, letterIndex) => (
      <span
        key={`letter-${letterIndex}`}
        className={letterClassName}
        style={{ display: 'inline-block' }}
      >
        {letter}
      </span>
    ));
    
    return (
      <span 
        key={`word-${wordIndex}`} 
        className={wordClassName}
        style={{ display: 'inline-block', marginRight: '0.25em' }}
      >
        {letters}
      </span>
    );
  });
};

export default {
  splitTextIntoLetters,
  splitTextIntoWords
};
