import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func The function to debounce
 * @param {number} wait The number of milliseconds to delay
 * @return {Function} The debounced function
 */
export function debounce(func, wait = 100) {
  let timeout;
  
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
