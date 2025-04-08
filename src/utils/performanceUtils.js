/**
 * Performance utility functions for optimizing website performance
 */

/**
 * Determines if the device is likely a low-performance device
 * @returns {boolean} True if device is low-performance
 */
export const isLowPerformanceDevice = () => {
  // Check device memory (Chrome, Edge, etc.)
  if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
    return true;
  }
  
  // Check for battery savings mode
  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      if (battery.charging === false && battery.level < 0.2) {
        return true;
      }
    }).catch(() => false);
  }
  
  // Check for reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }
  
  // Check for mobile device with UA sniffing as fallback
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(ua);
  
  // Check CPU cores if available
  const cpuCores = navigator.hardwareConcurrency || 0;
  if (isMobile && cpuCores < 4) {
    return true;
  }
  
  return false;
}

/**
 * Schedules a task to run when the browser is idle
 * Falls back to setTimeout for browsers that don't support requestIdleCallback
 * @param {Function} callback - Function to execute when browser is idle
 * @param {number} timeout - Maximum time to wait before running anyway
 */
export const scheduleIdleTask = (callback, timeout = 1000) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout });
  }
  // Fallback to setTimeout
  return setTimeout(callback, timeout);
};

/**
 * Cancels a previously scheduled idle task
 * @param {number} id - Task ID to cancel
 */
export const cancelIdleTask = (id) => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

/**
 * Loads resources asynchronously with priority control
 * @param {Array} resources - Array of resources to load
 * @param {string} type - Type of resource ('script', 'style', 'image')
 * @param {boolean} highPriority - Whether to load with high priority
 */
export const loadResourcesAsync = (resources, type = 'script', highPriority = false) => {
  // Don't block initial page render for low-priority resources
  if (!highPriority) {
    scheduleIdleTask(() => {
      executeResourceLoading(resources, type);
    });
  } else {
    // Load high-priority resources immediately
    executeResourceLoading(resources, type);
  }
};

/**
 * Helper function to execute resource loading
 * @param {Array} resources - Array of resources to load
 * @param {string} type - Type of resource ('script', 'style', 'image')
 */
const executeResourceLoading = (resources, type) => {
  if (!resources || !Array.isArray(resources)) return;

  resources.forEach(resource => {
    if (type === 'script') {
      const script = document.createElement('script');
      script.src = resource.src;
      script.async = true;
      if (resource.defer) script.defer = true;
      document.body.appendChild(script);
    } else if (type === 'style') {
      const link = document.createElement('link');
      link.href = resource.href;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else if (type === 'image') {
      const img = new Image();
      img.src = resource.src;
    }
  });
};

/**
 * Optimized event handler - debounces frequent events like resize, scroll
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 */
export const debounce = (func, wait = 100, immediate = false) => {
  let timeout;
  
  return function() {
    const context = this;
    const args = arguments;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Throttle function for high-frequency events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  
  return function() {
    const args = arguments;
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Defers non-critical CSS loading
 * @param {string} href - URL of the CSS file
 */
export const loadDeferredCSS = (href) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  
  document.head.appendChild(link);
  
  // Switch to 'all' media once loaded
  scheduleIdleTask(() => {
    link.media = 'all';
  });
};

/**
 * Optimizes font loading with font display swap
 * @param {Object} font - Font object with name, url, and descriptors
 */
export const loadOptimizedFont = (font) => {
  if ('fonts' in document) {
    const fontFace = new FontFace(
      font.family, 
      `url(${font.url})`, 
      { 
        display: 'swap', 
        ...font.descriptors 
      }
    );

    // Race loading with a timeout
    Promise.race([
      fontFace.load(),
      new Promise(resolve => setTimeout(resolve, 3000))
    ]).then(() => {
      document.fonts.add(fontFace);
    }).catch(err => {
      console.warn('Font loading failed or timed out:', err);
    });
  }
};

/**
 * Loads critical path CSS inline to speed up render
 * @param {string} css - CSS string to inline
 */
export const inlineCriticalCSS = (css) => {
  if (!css) return;
  
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

/**
 * Cache DOM queries for better performance
 */
export class DOMCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get element by selector, from cache if available
   * @param {string} selector - CSS selector
   * @returns {Element} The found DOM element
   */
  get(selector) {
    if (!this.cache.has(selector)) {
      this.cache.set(selector, document.querySelector(selector));
    }
    
    return this.cache.get(selector);
  }

  /**
   * Get all elements by selector, from cache if available
   * @param {string} selector - CSS selector
   * @returns {NodeList} The found DOM elements
   */
  getAll(selector) {
    if (!this.cache.has(`all:${selector}`)) {
      this.cache.set(`all:${selector}`, document.querySelectorAll(selector));
    }
    
    return this.cache.get(`all:${selector}`);
  }

  /**
   * Clear the cache
   * @param {string} selector - Optional selector to clear, or all if not provided
   */
  clear(selector = null) {
    if (selector) {
      this.cache.delete(selector);
      this.cache.delete(`all:${selector}`);
    } else {
      this.cache.clear();
    }
  }
}

// Export a singleton instance of DOMCache
export const domCache = new DOMCache();

/**
 * Check if an element is in viewport
 * @param {Element} el - DOM element to check
 * @param {number} offset - Offset from viewport edges
 * @returns {boolean} Whether element is in viewport
 */
export const isInViewport = (el, offset = 0) => {
  if (!el) return false;
  
  const rect = el.getBoundingClientRect();
  
  return (
    rect.top - offset <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom + offset >= 0 &&
    rect.left - offset <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right + offset >= 0
  );
};