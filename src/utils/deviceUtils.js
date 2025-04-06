/**
 * Device detection and capability utils for performance optimization
 */

/**
 * Detects if the current device is likely a mobile device
 * @returns {boolean} true if the device is likely mobile
 */
export const isMobileDevice = () => {
  // Check for touch capability as primary indicator
  const hasTouchScreen = !!(
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
  );
  
  // Check user agent as fallback (less reliable)
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // Check screen size
  const hasSmallScreen = window.innerWidth < 768;
  
  return hasTouchScreen && (isMobileUA || hasSmallScreen);
};

/**
 * Estimate device performance tier based on available indicators
 * @returns {'low'|'medium'|'high'} performance tier estimation
 */
export const getDevicePerformanceTier = () => {
  // Hardware concurrency (CPU cores) is a good indicator of device capability
  const cpuCores = navigator.hardwareConcurrency || 2;
  
  // Memory is another good indicator (if available)
  const deviceMemory = navigator.deviceMemory || 4; // Default to mid-range if not available
  
  // Mobile devices generally have lower performance
  const isMobile = isMobileDevice();
  
  // Use user agent to detect low-end devices
  const userAgent = navigator.userAgent.toLowerCase();
  const isLowEndDevice = /low|lite|go/i.test(userAgent);
  
  if (isLowEndDevice || (isMobile && cpuCores <= 4 && deviceMemory <= 2)) {
    return 'low';
  } else if (cpuCores >= 8 && deviceMemory >= 8 && !isMobile) {
    return 'high';
  } else {
    return 'medium';
  }
};

/**
 * Get recommended settings for WebGL/Three.js based on device performance
 * @returns {Object} Configuration object with recommended WebGL settings
 */
export const getOptimalWebGLSettings = () => {
  const performanceTier = getDevicePerformanceTier();
  
  // Base settings
  const settings = {
    pixelRatio: window.devicePixelRatio || 1,
    antialias: true,
    shadows: true,
    particleCount: 1000,
    maxTextureSize: 2048,
    meshDetail: 1, // Multiplier for geometry detail (segments, etc.)
  };
  
  // Adjust settings based on performance tier
  switch (performanceTier) {
    case 'low':
      settings.pixelRatio = Math.min(1, settings.pixelRatio);
      settings.antialias = false;
      settings.shadows = false;
      settings.particleCount = 100;
      settings.maxTextureSize = 512;
      settings.meshDetail = 0.5;
      break;
      
    case 'medium':
      settings.pixelRatio = Math.min(1.5, settings.pixelRatio);
      settings.particleCount = 500;
      settings.maxTextureSize = 1024;
      settings.meshDetail = 0.75;
      break;
      
    case 'high':
    default:
      settings.pixelRatio = Math.min(2, settings.pixelRatio);
      break;
  }
  
  return settings;
};