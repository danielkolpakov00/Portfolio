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

/**
 * Enables animated cursor support for iframes by relaying mouse events
 * from the iframe to the parent document
 * @param {HTMLIFrameElement} iframe - The iframe element to enable cursor for
 */
export const enableCursorInIframe = (iframe) => {
  if (!iframe || !iframe.contentWindow) return;
  
  try {
    // Wait for iframe to load
    iframe.addEventListener('load', () => {
      try {
        // Access the iframe's document
        const iframeDoc = iframe.contentWindow.document;
        
        // Add event listener to relay mouse events from iframe to parent
        iframeDoc.addEventListener('mousemove', (e) => {
          // Calculate mouse position relative to the main document
          const rect = iframe.getBoundingClientRect();
          const event = new MouseEvent('mousemove', {
            clientX: e.clientX + rect.left,
            clientY: e.clientY + rect.top,
            bubbles: true,
          });
          
          // Dispatch event on the parent document to update cursor position
          document.dispatchEvent(event);
        });
        
        // Handle transitions between parent and iframe
        iframeDoc.addEventListener('mouseenter', () => {
          // Make system cursor invisible when entering iframe
          if (iframeDoc.body) {
            iframeDoc.body.style.cursor = 'none';
          }
        });
        
        // Allow cursor styles to cascade from parent to iframe
        const style = iframeDoc.createElement('style');
        style.textContent = `
          * {
            cursor: none !important;
          }
        `;
        iframeDoc.head.appendChild(style);
        
      } catch (error) {
        console.warn('Failed to enable cursor in iframe', error);
      }
    });
  } catch (error) {
    console.warn('Error setting up iframe cursor relay', error);
  }
};
