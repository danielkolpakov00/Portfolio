import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SVGLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/SVGLoader.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.11.0/index.js';


// Console logging to help troubleshoot loading
console.log("Weather module initialization starting");

// Add module load error handling
let moduleLoadError = false;

// Define loading variables
let totalResources = 4;
let loadedResources = 0;
let loadingComplete = false;

// Move loadingStages before DOMContentLoaded
// Add more granular loading stages
const loadingStages = [
  { progress: 0, message: "Starting engine..." },
  { progress: 5, message: "Creating renderer..." },
  { progress: 10, message: "Setting up scene..." },
  { progress: 15, message: "Initializing camera..." },
  { progress: 20, message: "Loading textures..." },
  { progress: 30, message: "Creating sun..." },
  { progress: 35, message: "Creating moon..." },
  { progress: 40, message: "Setting up lighting..." },
  { progress: 50, message: "Preparing weather systems..." },
  { progress: 60, message: "Loading cloud textures..." },
  { progress: 70, message: "Configuring effects..." },
  { progress: 80, message: "Setting up controls..." },
  { progress: 90, message: "Final optimizations..." }
];

// Move function declarations to the top to avoid "not defined" errors
// Separate UI update function for cleaner code
function updateProgressUI(stage) {
  if (progressBar) {
    progressBar.style.width = `${stage.progress}%`;
    progressBar.style.transition = 'width 0.3s ease-out';
  }
  if (loadingProgress) {
    loadingProgress.textContent = `${stage.progress}%`;
  }
  if (loadingStatus) {
    loadingStatus.textContent = stage.message;
    // Smooth fade transition for status changes
    loadingStatus.style.opacity = '0';
    requestAnimationFrame(() => {
      loadingStatus.style.opacity = '1';
    });
  }
}

// Update loading progress function
function updateLoadingProgress(message = '') {
  // Ensure we don't exceed our resource count
  loadedResources = Math.min(loadedResources + 1, totalResources);
  const progressPercentage = Math.min(Math.floor((loadedResources / totalResources) * 100), 100);
  
  // Safely update DOM elements with null checks
  if (message && loadingStatus) {
    loadingStatus.textContent = message;
  }
  
  // Update percentage text and progress bar with null checks
  if (loadingProgress) loadingProgress.textContent = `${progressPercentage}%`;
  if (progressBar) progressBar.style.width = `${progressPercentage}%`;
  
  // Force check for completion - make sure we always finish
  if (progressPercentage >= 100 && !loadingComplete) {
    completeLoading();
  }
}

// Function to hide loading screen and start animation
function completeLoading() {
  if (loadingComplete) return;
  
  loadingComplete = true;
  
  // Update UI elements
  if (loadingStatus) loadingStatus.textContent = "Starting visualization...";
  if (progressBar) progressBar.style.width = "100%";
  if (loadingProgress) loadingProgress.textContent = "100%";
  
  // Create Vancouver time sync indicator
  createSyncIndicator();
  
  // Ensure we're synced to Vancouver time immediately
  const vancouverHours = getVancouverTime();
  currentTime = vancouverHours * 60;
  
  // Update scene based on current time
  updateTime(currentTime);
  updateBackgroundColor(currentTime); 
  
  // Start animation
  animate();
  
  // Hide loading screen
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }, 600);
  
  // Add regular time sync (every minute) to maintain accuracy
  setInterval(() => {
    if (!isPlaying && timeSlider.style.display === 'none') {
      const vancouverHours = getVancouverTime();
      currentTime = vancouverHours * 60;
      updateTime(currentTime);
      showSyncIndicator(); // Show sync indicator when time updates
    }
  }, 60000); // Every minute
}

// Create a sync indicator to show when time syncs with Vancouver
function createSyncIndicator() {
  const syncIndicator = document.createElement('div');
  syncIndicator.className = 'sync-indicator';
  syncIndicator.id = 'syncIndicator';
  syncIndicator.innerHTML = '<span class="sync-dot"></span>Vancouver Time';
  document.body.appendChild(syncIndicator);
}

// Show the sync indicator briefly when time syncs
function showSyncIndicator() {
  const syncIndicator = document.getElementById('syncIndicator');
  if (!syncIndicator) return;
  
  syncIndicator.classList.add('active');
  
  // Hide after 2 seconds
  setTimeout(() => {
    syncIndicator.classList.remove('active');
  }, 2000);
}

// Error handling for module loading
window.addEventListener('error', (e) => {
  console.error('Error caught:', e.message);
  if (e.message.includes('Failed to load module')) {
    moduleLoadError = true;
    console.warn('Module loading failed:', e.message);
    handleModuleLoadError();
  }
});

function handleModuleLoadError() {
  if (loadingStatus) {
    loadingStatus.textContent = "Error loading required modules. Please refresh the page.";
  }
  // Force completion after a short timeout to prevent getting stuck
  setTimeout(() => {
    if (!loadingComplete) {
      completeLoading();
    }
  }, 2000);
}

// Performance monitoring (keep at module level)
const perfMonitor = {
  frameTime: [],
  logPerformance: () => {
    const avg = perfMonitor.frameTime.reduce((a, b) => a + b, 0) / perfMonitor.frameTime.length;
    console.log(`Average frame time: ${avg.toFixed(2)}ms`);
    perfMonitor.frameTime = [];
  }
};

// Enhanced responsive radius calculation
function getResponsiveRadius() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const smallestDimension = Math.min(screenWidth, screenHeight);
    
    // Use the smallest screen dimension to ensure proper fitting in any orientation
    const baseRadius = Math.min(Math.max(smallestDimension / 200, 4), 8.5);
    
    // Adjust aspect ratio based on screen proportions
    const aspectRatio = screenHeight < screenWidth * 0.8 ? 0.35 : 0.47;
    
    return {
        radius: baseRadius,
        maxY: baseRadius * aspectRatio, // Maintain aspect ratio
        minX: -baseRadius,
        maxX: baseRadius
    };
}

// 2. DOM Elements & Constants
const timeSlider = document.getElementById('timeSlider');
const debugButton = document.getElementById('debugButton');
const playButton = document.getElementById('playButton');
// Add loading screen elements
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgress = document.querySelector('.loading-progress');
const progressBar = document.querySelector('.progress-bar');
const loadingStatus = document.querySelector('.loading-status');

// Defer cloud creation until after initial load
let clouds = [];
const CLOUD_COUNT = 6;

// Lazy load weather particle systems
let rain = null;
let snow = null;

// Cache frequently accessed values
const dims = getResponsiveRadius();
const margin = 2;

// Optimize animation frame handling
let animationFrameId = null;
let lastFrameTime = 0;

// Add state tracking at the top with other constants
let isPlaying = false;
let currentTime = 0;

// Enhanced sky colors for more pleasing visuals
const dayColor = new THREE.Color(0xb8e0ff);    // Softer sky blue
const nightColor = new THREE.Color(0x0c1a2e);   // Richer night blue
const sunsetColor = new THREE.Color(0xffb88c);  // Warm sunset color
const sunriseColor = new THREE.Color(0xffd4b8);  // Soft sunrise color

// Add to DOM Elements section
const precipButton = document.getElementById('precipButton');
const precipControls = document.getElementById('precipControls');
const precipType = document.getElementById('precipType');
const precipIntensity = document.getElementById('precipIntensity');
const weatherDisplay = document.getElementById('weatherDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const gradientOverlay = document.getElementById('gradientOverlay');
const sunriseOverlay = document.getElementById('sunriseOverlay');

// 3. Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ 
    antialias: window.devicePixelRatio < 2, // Only use antialias for higher-end devices
    powerPreference: "high-performance",
    precision: "highp",
    alpha: true // Enable transparency for smoother blending
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.4; // Reduced from 0.5 for less overall brightness
document.body.appendChild(renderer.domElement);

// Register renderer creation as a loading step
setTimeout(() => updateLoadingProgress("Three.js renderer initialized"), 200);

// Setup postprocessing with responsive quality
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Adjust bloom quality based on device capability
const isLowPowerDevice = window.devicePixelRatio < 2 || window.innerWidth < 768;
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    isLowPowerDevice ? 0.3 : 0.4,    // strength
    isLowPowerDevice ? 0.4 : 0.5,    // radius
    isLowPowerDevice ? 0.2 : 0.1     // threshold
);
composer.addPass(bloomPass);

// Create lights first before objects
// Create ambient light for better overall illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Create sun light with pure gold/yellow color
const sunLight = new THREE.PointLight(0xFFD700, 0.8, 15); // Pure gold color (RGB 255,215,0)
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Create moon light with more natural properties
const moonLight = new THREE.PointLight(0x8fc0ff, 1.2, 150); // Slightly bluer for night ambiance
moonLight.position.set(-5, 0, 0);
scene.add(moonLight);

// 4. Object Creation
// Create Sun with much more vibrant and saturated golden yellow color
function createSunGradient() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  // Create radial gradient with pure golden-yellow tones (no orange/white)
  const gradient = context.createRadialGradient(128, 128, 25, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255, 200, 0, 1.0)');     // Pure gold center - fully opaque
  gradient.addColorStop(0.4, 'rgba(255, 200, 0, 1.0)');   // Vibrant yellow - fully opaque
  gradient.addColorStop(0.7, 'rgba(255, 200, 0, 1.0)');   // Golden yellow transition - mostly opaque
  gradient.addColorStop(1, 'rgb(255, 200, 0)');     // Gold edge - slightly transparent

  // Fill with gradient
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
}

// Update sun material with solid yellow color and no transparency in the center
const sunMaterial = new THREE.MeshBasicMaterial({ 
  map: createSunGradient(),
  transparent: true,
  opacity: 1.0,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create the moon material with solid color instead of texture
const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xCCDDFF,           // Light blue-grey color
    roughness: 0.8,
    metalness: 0.1,
    emissive: 0xCCDDFF,        // Slightly bluer glow
    emissiveIntensity: 0.35
});

// Create the moon
const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = -5;
scene.add(moon);

// Register celestial object creation as a loading step
setTimeout(() => updateLoadingProgress("Celestial objects created"), 400);

// Define setupRenderer function that was missing
function setupRenderer() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.4;
  document.body.appendChild(renderer.domElement);
  updateProgressUI(loadingStages[1]);
}

// Update getVancouverTime function to ensure it correctly gets PST/PDT time
function getVancouverTime() {
  // Create a date object for the current time
  const now = new Date();
  
  // Define Vancouver time zone offset (fixed to Pacific Time)
  const vancouverOffsetHours = -7; // Set to PDT (UTC-7) for April 2025
  
  // Get Vancouver time by adjusting for offset from local time
  const localTime = now.getTime();
  const localOffset = now.getTimezoneOffset() * 60000;
  const utc = localTime + localOffset;
  const vancouverTime = new Date(utc + (3600000 * vancouverOffsetHours));
  
  // Extract hours and decimal portion for simulation
  const hours = vancouverTime.getHours();
  const minutes = vancouverTime.getMinutes();
  const decimalHours = hours + (minutes / 60);
  
  return decimalHours;
}

// Update cloud creation function with more attractive clouds and fallback for missing SVGs
function createCloud(size, x, y, direction) {
  const loader = new SVGLoader();
  const cloud = new THREE.Group();
  cloud.meshes = []; // Store references to cloud meshes
  
  // Scale cloud size based on screen dimensions
  const responsiveFactor = Math.min(window.innerWidth, window.innerHeight) / 1000;
  const adjustedSize = size * Math.max(0.8, responsiveFactor);
  
  totalResources++; // Track SVG loading
  
  // Check for src/assets/cloud.svg first
  const cloudSvgPaths = [
    '../../src/assets/cloud.svg',  // Try to load from src directory
    '../src/assets/cloud.svg',     // Alternative path
    './assets/cloud.svg'           // Original path
  ];
  
  // Load timeout to prevent getting stuck
  let loadTimeout = setTimeout(() => {
    console.warn("Cloud SVG loading timed out, using fallback cloud");
    createFallbackCloud(cloud, adjustedSize, x, y, direction);
    updateLoadingProgress("Created fallback cloud");
  }, 1000);
  
  // Try to load from the first path
  tryLoadCloudSVG(cloudSvgPaths, 0, cloud, adjustedSize, x, y, direction, loadTimeout);
  
  return cloud;
}

// Helper function to try loading SVG from different paths
function tryLoadCloudSVG(paths, index, cloud, size, x, y, direction, timeout) {
  if (index >= paths.length) {
    // If all paths failed, create a fallback cloud
    console.warn("All cloud SVG paths failed, using fallback cloud");
    clearTimeout(timeout);
    createFallbackCloud(cloud, size, x, y, direction);
    updateLoadingProgress("Created fallback cloud");
    return;
  }
  
  const loader = new SVGLoader();
  loader.load(
    paths[index],
    function(data) {
      clearTimeout(timeout);
      const paths = data.paths;
      
      paths.forEach((path) => {
        const shapes = path.toShapes(true);
        
        shapes.forEach((shape) => {
          const geometry = new THREE.ShapeGeometry(shape);
          const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide,
            depthTest: false
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          // Apply slight random rotation for natural appearance
          mesh.rotation.z = (Math.random() - 0.5) * 0.3;
          cloud.add(mesh);
          cloud.meshes.push(mesh); // Store reference to mesh
        });
      });
      
      // Use non-uniform scaling for natural cloud shapes
      const randomWidthScale = 0.85 + Math.random() * 0.3;
      const randomHeightScale = 0.9 + Math.random() * 0.2;
      cloud.scale.set(
        size * 0.001 * randomWidthScale, 
        size * 0.001 * randomHeightScale, 
        1
      );
      cloud.position.set(x, -3, 1);
      
      updateLoadingProgress("Cloud SVG loaded"); // Mark cloud load complete
    },
    // Progress callback
    (xhr) => {
      if (xhr.lengthComputable) {
        const cloudLoadProgress = Math.round((xhr.loaded / xhr.total) * 100);
        if (loadingStatus) {
          loadingStatus.textContent = `Loading cloud SVG: ${cloudLoadProgress}%`;
        }
      }
    },
    // Error callback - try the next path
    (error) => {
      console.warn(`Error loading cloud SVG from ${paths[index]}:`, error);
      tryLoadCloudSVG(paths, index + 1, cloud, size, x, y, direction, timeout);
    }
  );
  
  cloud.direction = direction;
  
  // Add enhanced glow effect
  const glowGeometry = new THREE.CircleGeometry(size/1.8, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthTest: false
  });
  
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.scale.y = 0.6; // Flatten for more natural cloud shape
  cloud.add(glow);
  
  scene.add(cloud);
}

// Create a simple fallback cloud if SVG loading fails
function createFallbackCloud(cloud, size, x, y, direction) {
  // Create a simple cloud shape using circles
  const circleCounts = 3 + Math.floor(Math.random() * 3); // 3-5 circles
  
  for (let i = 0; i < circleCounts; i++) {
    const circleSize = 0.6 + Math.random() * 0.4; // Random size
    const geometry = new THREE.CircleGeometry(size * circleSize, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthTest: false
    });
    
    const circleMesh = new THREE.Mesh(geometry, material);
    
    // Position circles to form a cloud-like shape
    circleMesh.position.x = (i - circleCounts / 2) * size * 0.5;
    circleMesh.position.y = Math.sin(i * Math.PI / circleCounts) * size * 0.2;
    
    cloud.add(circleMesh);
    cloud.meshes.push(circleMesh);
  }
  
  cloud.scale.set(0.05, 0.03, 1);
  cloud.position.set(x, -3, 1);
  
  scene.add(cloud);
  
  // Set direction for animation
  cloud.direction = direction;
}

// Update getRandomCloudPosition function
function getRandomCloudPosition() {
  const dims = getResponsiveRadius();
  const margin = 2; // Extra space beyond visible bounds
  return {
    x: (Math.random() * (dims.maxX * 2 + margin * 2)) - (dims.maxX + margin),
    y: (Math.random() * (dims.maxY * 2 + margin * 2)) - (dims.maxY + margin)
  };
}

// Override getRandomDirection to ensure clouds move at a visible speed
function getRandomDirection() {
  // Increase base speed for more noticeable movement
  const baseSpeed = 0.0005; // 3x faster than previous value
  const variability = 0.005;
  const speed = baseSpeed + Math.random() * variability;
  
  return Math.random() > 0.5 ? speed : -speed;
}

// Register clouds creation as a loading step
setTimeout(() => updateLoadingProgress("Weather systems prepared"), 600);

// Create enhanced Rain Particle System
function createRain() {
  loadingStatus.textContent = "Creating rain system...";
  const rainGeometry = new THREE.BufferGeometry();
  const maxRainCount = 15000;
  const rainPositions = new Float32Array(maxRainCount * 3);
  
  // More varied distribution
  for (let i = 0; i < maxRainCount; i++) {
    rainPositions[i * 3] = (Math.random() - 0.5) * 40;
    rainPositions[i * 3 + 1] = Math.random() * 20 - 5; // Start higher
    rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }

  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  
  // More realistic raindrops
  const rainMaterial = new THREE.PointsMaterial({
    color: 0xccddff,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const rain = new THREE.Points(rainGeometry, rainMaterial);
  rain.visible = false; // Initially hidden
  rain.geometry.setDrawRange(0, 0); // Start with zero particles
  scene.add(rain);

  return rain;
}

// Create enhanced Snow Particle System
function createSnow() {
  loadingStatus.textContent = "Creating snow system...";
  const snowGeometry = new THREE.BufferGeometry();
  const maxSnowCount = 5000;
  const snowPositions = new Float32Array(maxSnowCount * 3);
  const snowSizes = new Float32Array(maxSnowCount);

  // More varied distribution and sizes
  for (let i = 0; i < maxSnowCount; i++) {
    snowPositions[i * 3] = (Math.random() - 0.5) * 40;
    snowPositions[i * 3 + 1] = Math.random() * 20 - 5; // Start higher
    snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    snowSizes[i] = Math.random() * 0.2 + 0.1; // Varied snowflake sizes
  }

  snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
  snowGeometry.setAttribute('size', new THREE.BufferAttribute(snowSizes, 1));
  
  // More realistic snowflakes
  const snowMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    opacity: 0.9,
    vertexColors: false,
    sizeAttenuation: true,
    map: createSnowflakeTexture()
  });

  const snow = new THREE.Points(snowGeometry, snowMaterial);
  snow.visible = false; // Initially hidden
  snow.geometry.setDrawRange(0, 0); // Start with zero particles
  scene.add(snow);

  return snow;
}

// Create a snowflake texture
function createSnowflakeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 32, 32);
  
  // Draw snowflake
  ctx.beginPath();
  ctx.arc(16, 16, 12, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  
  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Initialize Rain and Snow Particle Systems
totalResources++;
setTimeout(() => updateLoadingProgress("Weather particle systems created"), 400);

// 5. Animation Functions
// Modify the animate function to handle time progression
function animate(timestamp) {
  const start = performance.now();
  
  animationFrameId = requestAnimationFrame(animate);
    
  // Throttle updates on low-end devices
  if (isLowPowerDevice && timestamp - lastFrameTime < 32) return;
  lastFrameTime = timestamp;

  // Update time based on play state
  if (isPlaying) {
    if (timeSlider.style.display !== 'none') {
      // Update slider time
      let newTime = parseFloat(timeSlider.value) + (100/60); // 100x speed
      if (newTime >= 1440) newTime = 0; // Reset at midnight
      timeSlider.value = newTime.toString();
      updateTime(newTime);
    } else {
      // Update real time
      currentTime += 100/60;
      if (currentTime >= 1440) currentTime = 0;
      updateTime(currentTime);
    }
  } else {
    // Always sync with Vancouver time when not playing and in real-time mode
    if (timeSlider.style.display === 'none') {
      // Get current Vancouver time in minutes since midnight
      const vancouverHours = getVancouverTime();
      currentTime = vancouverHours * 60;
      updateTime(currentTime);
    } else {
      // In debug mode with slider visible, use slider value
      updateTime(parseFloat(timeSlider.value));
    }
  }

  // Rotate sun and moon with gentle wobble
  sun.rotation.y += 0.005;
  sun.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
  
  moon.rotation.y += 0.002;
  moon.rotation.x = Math.sin(Date.now() * 0.0003) * 0.03;

  // Move clouds
  animateClouds();

  // Animate weather particles
  animateWeatherParticles();

  // Update light positions
  sunLight.position.copy(sun.position);
  moonLight.position.copy(moon.position);

  composer.render(); // Replace renderer.render() with composer.render()
  
  const end = performance.now();
  perfMonitor.frameTime.push(end - start);
  if (perfMonitor.frameTime.length > 100) {
    perfMonitor.logPerformance();
  }
}

// Completely rewrite the cloud animation function to ensure proper movement
function animateClouds() {
  if (!clouds.length) return;
    
  const now = Date.now();
  const frameTime = Math.min(now - (window.lastFrameTime || now), 100);
  const speedFactor = frameTime / 16.67;
  
  clouds.forEach((cloud, index) => {
    // Skip clouds that don't have meshes yet
    if (!cloud.meshes || cloud.meshes.length === 0) {
      return;
    }
    
    // Add slight vertical bobbing for more natural movement
    const verticalBob = Math.sin(now * 0.0003 + index * 200) * 0.02;
    
    // If initialY isn't set yet, store current position
    if (cloud.initialY === undefined) {
      cloud.initialY = cloud.position.y;
    }
    
    // Apply vertical bobbing
    cloud.position.y = cloud.initialY + verticalBob;
    
    // Move cloud horizontally at constant speed
    const moveDistance = cloud.direction * speedFactor;
    cloud.position.x += moveDistance;
    
    // Reset position when cloud goes out of bounds
    if (cloud.direction > 0 && cloud.position.x > dims.maxX + margin) {
      cloud.position.x = -dims.maxX - margin;
      
      // Randomize vertical position slightly
      cloud.initialY = -3 + (Math.random() - 0.5) * 1; 
    } 
    else if (cloud.direction < 0 && cloud.position.x < -dims.maxX - margin) {
      cloud.position.x = dims.maxX + margin;
      
      // Randomize vertical position slightly
      cloud.initialY = -3 + (Math.random() - 0.5) * 1;
    }
    
    // Animate cloud glow
    const glow = cloud.children[cloud.children.length - 1];
    if (glow && glow.material) {
      glow.material.opacity = 0.3 + Math.sin(now * 0.0007) * 0.1;
    }
    
    // Apply slight rotation for natural movement
    cloud.rotation.z = Math.sin(now * 0.0002 + index) * 0.01;
  });
}

// Enhance weather particle animation
function animateWeatherParticles() {
  if (!rain?.visible && !snow?.visible) return;
    
  const time = Date.now() * 0.001;
  
  if (rain?.visible) updateRainParticles(rain, time);
  if (snow?.visible) updateSnowParticles(snow, time);
}

// Update the window.onload handler to use the new positioning
window.onload = () => {
  // Initialize core systems
  initializeCriticalSystems();
  
  // Defer non-critical initializations
  setTimeout(() => {
    displayWeatherData();
    setupTouchEvents();
    setupInteractiveEffects();
  }, 200);
  
  // Load weather systems on demand
  precipButton.addEventListener('click', () => {
    if (!rain || !snow) initializeWeatherSystems();
  });
  
  // Simulate default data (no API call)
  displayWeatherData(); // This will show N/A for temperature and precipitation
  updateLoadingProgress("Weather data initialized");

  // Initialize UI components
  timeSlider.style.display = 'none';
  debugButton.style.backgroundColor = 'white';
  
  const bugIcon = debugButton.querySelector('i');
  bugIcon.style.color = 'black';

  // Initialize play button state and icon
  playButton.style.backgroundColor = 'white';
  const playIcon = playButton.querySelector('i');
  playIcon.style.color = 'black';
  
  // Initialize precip button icon
  const precipIcon = precipButton.querySelector('i');
  precipIcon.style.color = 'black';
  
  updateLoadingProgress("User interface initialized");
  
  // Add subtle entrance animation for UI elements with new positioning
  gsap.from(weatherDisplay, {
    y: 20,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power2.out"
  });
  
  gsap.from(timeDisplay, {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    delay: 0.7,
    ease: "power2.out"
  });
  
  gsap.from("#controlGroup", {
    y: 20,
    opacity: 0,
    duration: 1,
    delay: 0.9,
    ease: "power2.out"
  });
  
  // Setup responsive event handlers
  setupTouchEvents();
  setupInteractiveEffects();
  
  isPlaying = false;
  currentTime = getVancouverTime() * 60;
  
  // Store original cloud sizes for responsive scaling
  clouds.forEach(cloud => {
    const originalSize = Math.random() * 1.5 + 2;
    cloud.originalSize = originalSize;
  });
  
  // Initialize clouds with better distribution to avoid bunching
  const dims = getResponsiveRadius();
  const margin = 2;
  const spacing = (dims.maxX * 2 + margin * 2) / clouds.length;
  
  clouds.forEach((cloud, index) => {
    // Evenly distribute clouds along x-axis
    const baseX = -dims.maxX - margin + (spacing * index);
    cloud.position.x = baseX + (Math.random() - 0.5) * spacing * 0.5; // Add small random offset
    
    // Store initial position
    cloud.initialX = cloud.position.x;
    
    // Avoid immediate animation until meshes are loaded
    cloud.loaded = false;
  });

  // Reset cloud positions with faster speed
  clouds.forEach((cloud, index) => {
    // Give clouds faster movement speed
    cloud.direction = getRandomDirection();
    
    // Spread clouds around the scene
    const dims = getResponsiveRadius();
    const maxX = dims.maxX + 2;
    
    // Distribute clouds evenly across screen
    cloud.position.x = -maxX + (index / (clouds.length - 1)) * (maxX * 2);
    cloud.initialY = -3 + (Math.random() - 0.5) * 1.5;
    
    // Force position update
    if (cloud.meshes && cloud.meshes.length > 0) {
      cloud.position.y = cloud.initialY;
    }
  });
  
  // Initialize last frame time for animation
  window.lastFrameTime = Date.now();

  // Add additional resources to track (UI setup)
  totalResources += 2;
  setTimeout(() => updateLoadingProgress("User interface components ready"), 300);
  setTimeout(() => updateLoadingProgress("Final setup complete"), 600);
  
  // Ensure we always complete loading
  setTimeout(() => {
    updateLoadingProgress("Final setup complete");
    
    // Force completion after a timeout to ensure we don't get stuck
    setTimeout(() => {
      if (!loadingComplete) {
        completeLoading();
      }
    }, 1000);
  }, 1000);
  
  // Check if running in iframe and apply fix
  const inIframe = window.location !== window.parent.location;
  if (inIframe) {
    // Apply iframe-specific adjustments
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.position = 'relative';
    document.body.style.overflow = 'hidden';
    
    // Ensure canvas is properly sized
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    
    // Force element centering
    if (weatherDisplay) {
      weatherDisplay.style.left = '50%';
      weatherDisplay.style.transform = 'translateX(-50%)';
      weatherDisplay.style.width = 'calc(100% - 20px)';
      weatherDisplay.style.maxWidth = '600px';
    }
    
    if (timeDisplay) {
      timeDisplay.style.left = '50%';
      timeDisplay.style.transform = 'translate(-50%, -50%)';
      timeDisplay.style.width = '100%';
      timeDisplay.style.textAlign = 'center';
    }
    
    if (controlGroup) {
      controlGroup.style.left = '50%';
      controlGroup.style.transform = 'translateX(-50%)';
      controlGroup.style.width = 'calc(100% - 20px)';
      controlGroup.style.maxWidth = '600px';
    }
  }
};

// Force completion after a maximum time to prevent infinite loading
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!loadingComplete) {
      console.log("Forcing loading completion after timeout");
      completeLoading();
    }
  }, 8000); // 8 seconds maximum loading time
});

debugButton.addEventListener('click', () => {
  if (timeSlider.style.display === 'none') {
    // Show time slider with animation
    timeSlider.style.display = 'block';
    timeSlider.style.opacity = 0;
    gsap.to(timeSlider, {
      opacity: 1,
      duration: 0.3
    });
    
    gsap.to(debugButton, {
      backgroundColor: 'black',
      duration: 0.3
    });
    
    // Update the icon color with animation
    const bugIcon = debugButton.querySelector('i');
    gsap.to(bugIcon, {
      color: 'white',
      duration: 0.3
    });
  } else {
    // Hide time slider with animation
    gsap.to(timeSlider, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        timeSlider.style.display = 'none';
      }
    });
    
    gsap.to(debugButton, {
      backgroundColor: 'white',
      duration: 0.3
    });
    
    // Update the icon color with animation
    const bugIcon = debugButton.querySelector('i');
    gsap.to(bugIcon, {
      color: 'black',
      duration: 0.3
    });
  }
});

// Enhance play button interaction
playButton.addEventListener('click', () => {
  isPlaying = !isPlaying;
  
  // Use GSAP for smoother color transition
  gsap.to(playButton, {
    backgroundColor: isPlaying ? 'black' : 'white',
    duration: 0.3
  });
  
  // Update the icon color and content with animation
  const playIcon = playButton.querySelector('i');
  gsap.to(playIcon, {
    color: isPlaying ? 'white' : 'black',
    duration: 0.3
  });
  
  // Change icon from play to pause and vice versa with animation
  if (isPlaying) {
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    
    // Add subtle pulse animation while playing
    gsap.to(playButton, {
      scale: 1.05,
      duration: 0.2,
      repeat: 1,
      yoyo: true
    });
  } else {
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
  }
});

timeSlider.addEventListener('input', () => {
  updateTime(parseFloat(timeSlider.value));
});

// Add precipitation button click handler
precipButton.addEventListener('click', () => {
    const isVisible = precipControls.style.display === 'flex';
    
    if (isVisible) {
      // Animate hiding
      gsap.to(precipControls, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          precipControls.style.display = 'none';
        }
      });
      
      gsap.to(precipButton, {
        backgroundColor: 'white',
        duration: 0.3
      });
      
      // Update the icon color
      const precipIcon = precipButton.querySelector('i');
      gsap.to(precipIcon, {
        color: 'black',
        duration: 0.3
      });
    } else {
      // Set initial state
      precipControls.style.opacity = 0;
      precipControls.style.display = 'flex';
      precipControls.style.transform = 'translateY(-10px)';
      
      // Animate showing
      gsap.to(precipControls, {
        opacity: 1,
        y: 0,
        duration: 0.3
      });
      
      gsap.to(precipButton, {
        backgroundColor: 'black',
        duration: 0.3
      });
      
      // Update the icon color
      const precipIcon = precipButton.querySelector('i');
      gsap.to(precipIcon, {
        color: 'white',
        duration: 0.3
      });
    }
});

// Add precipitation control handlers
precipType.addEventListener('change', updatePrecipitation);
precipIntensity.addEventListener('input', updatePrecipitation);

function updatePrecipitation() {
    const type = precipType.value;
    const intensity = parseInt(precipIntensity.value);
    
    rain.visible = false;
    snow.visible = false;
    rain.geometry.setDrawRange(0, 0);
    snow.geometry.setDrawRange(0, 0);
    
    if (type === 'rain') {
        rain.visible = true;
        rain.geometry.setDrawRange(0, Math.floor(intensity * 150)); // 0-15000 particles
    } else if (type === 'snow') {
        snow.visible = true;
        snow.geometry.setDrawRange(0, Math.floor(intensity * 50)); // 0-5000 particles
    }
}

// 7. Utility Functions
// Better color interpolation for sky transitions
function interpolateColor(color1, color2, factor) {
  const r = color1.r + (color2.r - color1.r) * factor;
  const g = color1.g + (color2.g - color1.g) * factor;
  const b = color1.b + (color2.b - color1.b) * factor;
  return new THREE.Color(r, g, b);
}

// Enhanced background color updates with smoother transitions
function updateBackgroundColor(simulatedTime) {
    const hours = simulatedTime / 60;
    let color1, color2, factor;

    // Deep night (0-4h): pure night color
    if (hours >= 0 && hours < 4) {
        scene.background = nightColor;
        gradientOverlay.style.opacity = "0";
        sunriseOverlay.style.opacity = "0";
        return;
    }
    // Pre-dawn transition (4-5h)
    else if (hours >= 4 && hours < 5) {
        color1 = nightColor;
        color2 = new THREE.Color(0x1a2a44); // Dark blue
        factor = (hours - 4);
        sunriseOverlay.style.opacity = "0";
        gradientOverlay.style.opacity = "0";
    }
    // Dawn transition (5-6:30h)
    else if (hours >= 5 && hours < 6.5) {
        color1 = new THREE.Color(0x1a2a44);
        color2 = sunriseColor;
        factor = (hours - 5) / 1.5;
        // Add gradual sunrise overlay
        sunriseOverlay.style.opacity = (factor * 0.3).toString();
        gradientOverlay.style.opacity = "0";
    }
    // Sunrise to morning (6:30-8h)
    else if (hours >= 6.5 && hours < 8) {
        color1 = sunriseColor;
        color2 = dayColor;
        factor = (hours - 6.5) / 1.5;
        // Fade sunrise overlay
        sunriseOverlay.style.opacity = (0.3 * (1 - factor)).toString();
        gradientOverlay.style.opacity = "0";
    }
    // Full daylight (8-17h)
    else if (hours >= 8 && hours < 17) {
        scene.background = dayColor;
        gradientOverlay.style.opacity = "0";
        sunriseOverlay.style.opacity = "0";
        return;
    }
    // Late afternoon (17-18:30h)
    else if (hours >= 17 && hours < 18.5) {
        color1 = dayColor;
        color2 = sunsetColor;
        factor = (hours - 17) / 1.5;
        // Add gradual sunset overlay
        gradientOverlay.style.opacity = (factor * 0.4).toString();
        sunriseOverlay.style.opacity = "0";
    }
    // Sunset (18:30-20h)
    else if (hours >= 18.5 && hours < 20) {
        color1 = sunsetColor;
        color2 = new THREE.Color(0x2c4073); // Deep blue sunset
        factor = (hours - 18.5) / 1.5;
        // Fade sunset overlay
        gradientOverlay.style.opacity = (0.4 * (1 - factor)).toString();
        sunriseOverlay.style.opacity = "0";
    }
    // Evening to night (20-22h)
    else if (hours >= 20 && hours < 22) {
        color1 = new THREE.Color(0x2c4073); // Deep blue sunset
        color2 = nightColor;
        factor = (hours - 20) / 2;
        gradientOverlay.style.opacity = "0";
        sunriseOverlay.style.opacity = "0";
    }
    // Night (22-24h)
    else {
        scene.background = nightColor;
        gradientOverlay.style.opacity = "0";
        sunriseOverlay.style.opacity = "0";
        return;
    }

    // Smoothly interpolate the background color
    scene.background = interpolateColor(color1, color2, factor);
}

function interpolatePosition(object, targetX, targetY, speed) {
    // Always store previous positions in object to ensure continuity
    if (!object.lastTargetX) {
        // Initialize position tracking on first call
        object.lastTargetX = targetX;
        object.lastTargetY = targetY;
    }

    // Track position even when object is invisible
    object.lastTargetX = targetX;
    object.lastTargetY = targetY;
    
    // Get responsive dimensions based on screen size for consistent speed
    const screenFactor = Math.min(window.innerWidth, window.innerHeight) / 800;
    const responsiveSpeed = Math.min(speed * 0.4, 0.015) * Math.max(0.7, Math.min(1.3, screenFactor));
    
    // Use smooth, continuous movement regardless of visibility
    const currentPosition = object.position;
    const targetPosition = new THREE.Vector3(targetX, targetY, currentPosition.z);
    
    // Use very smooth interpolation with consistent speed across screen sizes
    currentPosition.lerp(targetPosition, responsiveSpeed);
}

function updateTime(simulatedTime) {
    const timeDisplay = document.getElementById('timeDisplay');
    let hours = Math.floor(simulatedTime / 60);
    let minutes = Math.floor(simulatedTime % 60).toString().padStart(2, '0');

    if (hours >= 24) {
        hours = 0;
    }

    const formattedTime = `${hours}:${minutes}`;
    timeDisplay.innerText = formattedTime;

    // Convert time to normalized progress through the day (0 to 1)
    const dayProgress = (simulatedTime / 60) / 24;

    // Get responsive dimensions - updated to ensure visibility on all screens
    const dims = getResponsiveRadius();
    
    // Constants for celestial movement - adjusted for better visibility
    const transitionSpeed = 0.05;
    
    // Ensure celestial bodies are always visible by constraining their maximum distance
    // Use smaller values for small screens
    const screenSizeRatio = Math.min(window.innerWidth, window.innerHeight) / 1000;
    // Increased minimum visibility adjustment to prevent bodies from moving off screen
    const visibilityAdjustment = Math.max(0.85, screenSizeRatio);
    
    const maxX = dims.maxX * visibilityAdjustment;
    const minX = dims.minX * visibilityAdjustment;
    const maxY = dims.maxY * visibilityAdjustment;
    const radius = dims.radius * visibilityAdjustment;
    const centerX = (maxX + minX) / 4;

    // Calculate positions using circular motion
    const angle = dayProgress * Math.PI * 2;
    
    // Add a vertical offset to keep celestial bodies more visible during transitions
    // This reduces how far below the horizon they go
    const verticalOffset = maxY * 0.3; // Prevents bodies from going too far below view
    
    const xPosition = centerX + radius * Math.cos(angle - Math.PI / 2);
    // Apply vertical offset to keep sun/moon higher in view
    const yPosition = (maxY * Math.sin(angle - Math.PI / 2)) + verticalOffset;

    // Calculate sun height factor (-1 to 1), but adjusted to account for the offset
    const rawSunHeight = Math.sin(angle - Math.PI / 2);
    // Adjust sun height calculation to account for the vertical offset
    const sunHeight = rawSunHeight + (verticalOffset / maxY);
    
    // Determine exact time (in 24-hour format)
    const exactHour = hours + (minutes / 60);
    
    // Special condition: At exactly 6pm (18:00), only moon is visible
    const isExactly6PM = (hours === 18 && minutes === 0);
    
    // Determine if it's day or night based on adjusted sun position and the 6pm rule
    // For normal times, use threshold for smoother transitions
    // But at 6pm, force night mode regardless of sun position
    const isDaytime = isExactly6PM ? false : rawSunHeight > -0.2;

    // Calculate the position for both sun and moon at all times
    // This ensures they're always in the right position even when invisible
    const sunTargetX = xPosition;
    const sunTargetY = yPosition;
    const moonTargetX = -xPosition;
    const moonTargetY = -yPosition + verticalOffset;
    
    // Calculate light factor based on sun/moon position
    let lightFactor;
    
    // Always update position of both celestial bodies regardless of visibility
    // This ensures they're in the correct position when they become visible
    interpolatePosition(sun, sunTargetX, sunTargetY, transitionSpeed);
    interpolatePosition(moon, moonTargetX, moonTargetY, transitionSpeed);
    
    if (isDaytime) {
        // Reduced daylight intensity
        lightFactor = Math.pow(Math.max(0, sunHeight), 0.7) * 0.8; // Softer and dimmer
        
        // Smoothly transition visibility rather than abrupt changes
        // Make sun visible, except at 6pm
        if (!sun.visible && !isExactly6PM) sun.visible = true;
        
        // Handle special 6pm case - ensure sun is invisible
        if (isExactly6PM && sun.visible) {
            sun.visible = false;
        }
        
        // Normal behavior for other times
        if (!isExactly6PM) {
            // Only make moon invisible when sun is high enough
            if (rawSunHeight > 0.3 && moon.visible) {
                moon.visible = false;
            } else if (rawSunHeight <= 0.3 && !moon.visible) {
                // Show moon during dawn/dusk
                moon.visible = true;
            }
        } else {
            // At 6pm, ensure moon is visible
            if (!moon.visible) moon.visible = true;
        }
        
        // Handle stars during daytime - fade them out
        if (starField && starField.material) {
            gsap.to(starField.material, {
                opacity: 0,
                duration: 2,
                ease: "power1.out"
            });
        }
        
        // Adjust sun intensity based on height in sky - higher at noon
        const noonFactor = Math.sin(Math.PI * Math.max(0, rawSunHeight)); // Peaks at 1.0 when sun is directly overhead
        sunLight.intensity = 0.9 * noonFactor; // Slightly higher intensity
        
        // For the moon during transitions, use appropriate light intensity
        moonLight.intensity = moon.visible ? 0.4 * (1 - Math.max(0, rawSunHeight)) : 0;
        
        // Minimal bloom to preserve the yellow color
        bloomPass.strength = 0.1;
        bloomPass.radius = 0.25;
        bloomPass.threshold = 0.4; // Higher threshold preserves color better
        timeDisplay.style.color = 'black';
        updateCloudBloom(true);
        
        // Update weather message text color for day
        if (window.weatherMessages) {
            window.weatherMessages.forEach(msg => {
                msg.style.color = 'black';
                // Add subtle shadow for better visibility against light background
                msg.style.textShadow = '0px 0px 4px rgba(255, 255, 255, 0.7)';
            });
        }
    } else {
        // Enhanced night lighting
        const moonHeight = -rawSunHeight;
        lightFactor = Math.pow(moonHeight, 0.5) * 0.15; // Brighter moon nights
        
        // Smoothly transition visibility - ensure moon is visible
        if (!moon.visible) moon.visible = true;
        
        // Special condition for 6pm - ensure only moon is visible
        if (isExactly6PM) {
            // Force sun to be invisible at exactly 6pm
            if (sun.visible) sun.visible = false;
        } else {
            // Normal behavior for other times
            // Only make sun invisible when moon is high enough
            if (moonHeight > 0.3 && sun.visible) {
                sun.visible = false;
            } else if (moonHeight <= 0.3 && !sun.visible) {
                // Show sun during dusk/dawn
                sun.visible = true;
            }
        }
        
        // Handle stars during nighttime - fade them in
        if (starField && starField.material) {
            // Calculate star opacity based on how dark it is
            // Fuller night = more stars visible
            const starOpacity = Math.min(0.7, Math.max(0.1, moonHeight * 0.7));
            
            gsap.to(starField.material, {
                opacity: starOpacity,
                duration: 2,
                ease: "power1.out"
            });
        }
        
        // Set light intensities
        moonLight.intensity = 1.2;
        sunLight.intensity = sun.visible ? 0.3 * (1 - Math.max(0, moonHeight)) : 0;
        
        bloomPass.strength = 1; // Stronger bloom at night
        timeDisplay.style.color = 'white';
        updateCloudBloom(false);
        
        // Update weather message text color for night
        if (window.weatherMessages) {
            window.weatherMessages.forEach(msg => {
                msg.style.color = 'white';
                // Add subtle shadow for better visibility against dark background
                msg.style.textShadow = '0px 0px 4px rgba(0, 0, 0, 0.7)';
            });
        }
    }

    // Update background color using calculated light factor
    scene.background = interpolateColor(nightColor, dayColor, lightFactor);

    // Reduced ambient light
    ambientLight.intensity = 0.1 + (lightFactor * 0.2);
}

function updateCloudBloom(isDaytime) {
  clouds.forEach((cloud) => {
    if (cloud.meshes) {
      cloud.meshes.forEach(mesh => {
        if (mesh.material) {
          mesh.material.opacity = isDaytime ? 0.8 : 0.6;
        }
      });
    }
    
    // Update glow (assuming it's the last child)
    const glow = cloud.children[cloud.children.length - 1];
    if (glow && glow.material) {
      glow.material.opacity = isDaytime ? 0.3 : 0.2;
    }
  });
  
  // Adjust bloom settings
  bloomPass.strength = isDaytime ? 0.2 : 0.6; // Further reduced daytime bloom
  bloomPass.radius = isDaytime ? 0.35 : 0.7;
  bloomPass.threshold = isDaytime ? 0.2 : 0.05; // Higher threshold = less bloom on bright objects
}

// Enhance weather messages with better formatting and mobile responsiveness
function displayWeatherData(data = null) {
  // Use default values or fetch from API response
  let temperature = data && data.main ? data.main.temp : null;
  let precipitationValue = 0;
  let weatherDescription = data && data.weather && data.weather[0] ? data.weather[0].description : "clear skies";

  // Validate weather data
  const validatedData = validateWeatherData(temperature, precipitationValue);
  temperature = validatedData.temperature;
  precipitationValue = validatedData.precipitationValue;

  // Ensure weatherDisplay exists
  if (!weatherDisplay) return;
  
  // Clear existing content
  weatherDisplay.innerHTML = '';
  
  // Create message container for better animation control
  const container = document.createElement('div');
  container.className = 'weather-message-container';
  container.style.height = '1.5em';
  weatherDisplay.appendChild(container);

  // Determine greeting and emoji
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  let emoji = "✨";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
    emoji = "🌄";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
    emoji = "☀️";
  }

  // Format messages based on screen size
  const isMobileSmall = window.innerWidth < 380;
  const messages = [
    isMobileSmall ? `${greeting}` : `${greeting} ${emoji}`,
    isMobileSmall ? `Temp: ${temperature}°C` : `Temperature: ${temperature}°C 🌡️`,
    isMobileSmall ? `Precip: ${precipitationValue}` : `Precipitation: ${precipitationValue} mm 💧`,
    `Vancouver Local Time`
  ];

  // Create and append messages with proper positioning
  const messageElements = messages.map((text, index) => {
    const div = document.createElement('div');
    div.className = 'weatherMessage';
    div.textContent = text;
    div.style.textShadow = '0px 1px 4px rgba(0, 0, 0, 0.3)';
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    
    // Only first message is active initially
    if (index === 0) {
      div.classList.add('active');
    } else {
      div.classList.add('inactive');
    }
    
    container.appendChild(div);
    return div;
  });

  // Store reference for time updates
  window.weatherMessages = messageElements;

  // Start message rotation with improved animation
  startEnhancedMessageRotation(messageElements);

  // Setup resize handler
  window.addEventListener('resize', () => {
    const isMobileSmall = window.innerWidth < 380;
    if (messageElements.length >= 3) {
      if (isMobileSmall) {
        updateMessagesForMobile(messageElements, greeting, temperature, precipitationValue);
      } else {
        updateMessagesForDesktop(messageElements, greeting, emoji, temperature, precipitationValue);
      }
    }
  });
}

// Improved message rotation animation with smoother transitions
function startEnhancedMessageRotation(messageElements) {
  if (!messageElements || messageElements.length < 2) return;
  
  let currentIndex = 0;
  const rotationInterval = window.innerWidth < 768 ? 4500 : 3500;
  
  const rotateMessages = () => {
    const nextIndex = (currentIndex + 1) % messageElements.length;
    
    // Hide current message
    messageElements[currentIndex].classList.remove('active');
    messageElements[currentIndex].classList.add('inactive');
    
    // Show next message
    messageElements[nextIndex].classList.remove('inactive');
    messageElements[nextIndex].classList.add('active');
    
    currentIndex = nextIndex;
  };
  
  setInterval(rotateMessages, rotationInterval);
}

// Helper functions for displayWeatherData
function updateMessagesForMobile(elements, greeting, temp, precip) {
  if (elements[0].textContent.includes('✨') || 
      elements[0].textContent.includes('🌄') || 
      elements[0].textContent.includes('☀️')) {
    elements[0].textContent = greeting;
    elements[1].textContent = `Temp: ${temp}°C`;
    elements[2].textContent = `Precip: ${precip}`;
  }
}

function updateMessagesForDesktop(elements, greeting, emoji, temp, precip) {
  if (!elements[0].textContent.includes('✨') && 
      !elements[0].textContent.includes('🌄') && 
      !elements[0].textContent.includes('☀️')) {
    elements[0].textContent = `${greeting} ${emoji}`;
    elements[1].textContent = `Temperature: ${temp}°C 🌡️`;
    elements[2].textContent = `Precipitation: ${precip} mm 💧`;
  }
}

// Separate message rotation logic
function startMessageRotation(messageElements) {
  let currentIndex = 0;
  
  setInterval(() => {
    const nextIndex = (currentIndex + 1) % messageElements.length;
    
    gsap.to(messageElements[currentIndex], { 
      yPercent: -80, 
      opacity: 0, 
      scale: 0.95,
      filter: "blur(3px)",
      duration: 0.8, 
      ease: "power2.inOut" 
    });
    
    gsap.fromTo(
      messageElements[nextIndex],
      { 
        yPercent: 80, 
        opacity: 0, 
        scale: 0.95,
        filter: "blur(3px)"
      },
      { 
        yPercent: 0, 
        opacity: 1, 
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8, 
        ease: "power2.inOut" 
      }
    );
    
    currentIndex = nextIndex;
  }, window.innerWidth < 768 ? 4500 : 3500);
}

function validateWeatherData(temperature, precipitationValue) {
  // Check if temperature is a valid number
  if (typeof temperature !== 'number' || isNaN(temperature)) {
    temperature = "N/A";
  } else {
    temperature = temperature.toFixed(0); // Round to integer
  }

  // Check if precipitationValue is a valid number
  if (typeof precipitationValue !== 'number' || isNaN(precipitationValue)) {
    precipitationValue = "No data";
  }

  return { temperature, precipitationValue };
}

// Enhanced touch event handling for mobile devices
function setupTouchEvents() {
  const canvas = renderer.domElement;
  
  // Add touch event for precipitation toggle on swipe down
  let touchStartY = 0;
  let touchStartX = 0;
  
  canvas.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  
  canvas.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchEndY - touchStartY;
    const deltaX = touchEndX - touchStartX;
    
    // Only process if it's a significant vertical swipe (not just a tap)
    if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
      // Swipe down to toggle precipitation
      if (deltaY > 0) {
        const isVisible = precipControls.style.display === 'flex';
        
        if (!isVisible) {
          // Show precipitation controls
          precipControls.style.opacity = 0;
          precipControls.style.display = 'flex';
          precipControls.style.transform = 'translateY(-10px)';
          
          // Animate showing
          gsap.to(precipControls, {
            opacity: 1,
            y: 0,
            duration: 0.3
          });
          
          gsap.to(precipButton, {
            backgroundColor: 'black',
            duration: 0.3
          });
          
          const precipIcon = precipButton.querySelector('i');
          gsap.to(precipIcon, {
            color: 'white',
            duration: 0.3
          });
        }
      } 
      // Swipe up to hide precipitation controls
      else if (deltaY < 0) {
        const isVisible = precipControls.style.display === 'flex';
        
        if (isVisible) {
          // Animate hiding
          gsap.to(precipControls, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
              precipControls.style.display = 'none';
            }
          });
          
          gsap.to(precipButton, {
            backgroundColor: 'white',
            duration: 0.3
          });
          
          const precipIcon = precipButton.querySelector('i');
          gsap.to(precipIcon, {
            color: 'black',
            duration: 0.3
          });
        }
      }
    }
  }, { passive: true });
  

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchTimer = setTimeout(() => {
        touchDuration += 100;
        
        // Long press for 500ms to toggle debug mode
        if (touchDuration >= 500) {
          if (timeSlider.style.display === 'none') {
            // Show time slider
            timeSlider.style.display = 'block';
            timeSlider.style.opacity = 0;
            gsap.to(timeSlider, {
              opacity: 1,
              duration: 0.3
            });
            
            gsap.to(debugButton, {
              backgroundColor: 'black',
              duration: 0.3
            });
            
            const bugIcon = debugButton.querySelector('i');
            gsap.to(bugIcon, {
              color: 'white',
              duration: 0.3
            });
          } else {
            // Hide time slider
            gsap.to(timeSlider, {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                timeSlider.style.display = 'none';
              }
            });
            
            gsap.to(debugButton, {
              backgroundColor: 'white',
              duration: 0.3
            });
            
            const bugIcon = debugButton.querySelector('i');
            gsap.to(bugIcon, {
              color: 'black',
              duration: 0.3
            });
          }
          clearTimeout(touchTimer);
        }
      }, 100);
    }
  }, { passive: true });
  
  canvas.addEventListener('touchend', () => {
    clearTimeout(touchTimer);
    touchDuration = 0;
  }, { passive: true });
  
  canvas.addEventListener('touchcancel', () => {
    clearTimeout(touchTimer);
    touchDuration = 0;
  }, { passive: true });
  
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touchMoveX = e.touches[0].clientX;
      const touchMoveY = e.touches[0].clientY;
      const deltaX = touchMoveX - touchStartX;
      const deltaY = touchMoveY - touchStartY;
      
      // Only process if it's a significant vertical swipe (not just a tap)
      if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
        // Swipe down to toggle precipitation
        if (deltaY > 0) {
          const isVisible = precipControls.style.display === 'flex';
          
          if (!isVisible) {
            // Show precipitation controls
            precipControls.style.opacity = 0;
            precipControls.style.display = 'flex';
            precipControls.style.transform = 'translateY(-10px)';
            
            // Animate showing
            gsap.to(precipControls, {
              opacity: 1,
              y: 0,
              duration: 0.3
            });
            
            gsap.to(precipButton, {
              backgroundColor: 'black',
              duration: 0.3
            });
            
            const precipIcon = precipButton.querySelector('i');
            gsap.to(precipIcon, {
              color: 'white',
              duration: 0.3
            });
          }
        } 
        // Swipe up to hide precipitation controls
        else if (deltaY < 0) {
          const isVisible = precipControls.style.display === 'flex';
          
          if (isVisible) {
            // Animate hiding
            gsap.to(precipControls, {
              opacity: 0,
              y: -10,
              duration: 0.2,
              onComplete: () => {
                precipControls.style.display = 'none';
              }
            });
            
            gsap.to(precipButton, {
              backgroundColor: 'white',
              duration: 0.3
            });
            
            const precipIcon = precipButton.querySelector('i');
            gsap.to(precipIcon, {
              color: 'black',
              duration: 0.3
            });
          }
        }
      }
    }
  }, { passive: true });
  
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchTimer = setTimeout(() => {
        touchDuration += 100;
        
        // Long press for 500ms to toggle debug mode
        if (touchDuration >= 500) {
          if (timeSlider.style.display === 'none') {
            // Show time slider
            timeSlider.style.display = 'block';
            timeSlider.style.opacity = 0;
            gsap.to(timeSlider, {
              opacity: 1,
              duration: 0.3
            });
            
            gsap.to(debugButton, {
              backgroundColor: 'black',
              duration: 3
            });
            
            const bugIcon = debugButton.querySelector('i');
            gsap.to(bugIcon, {
              color: 'white',
              duration: 0.3
            });
          } else {
            // Hide time slider
            gsap.to(timeSlider, {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                timeSlider.style.display = 'none';
              }
            });
            
            gsap.to(debugButton, {
              backgroundColor: 'white',
              duration: 0.3
            });
            
            const bugIcon = debugButton.querySelector('i');
            gsap.to(bugIcon, {
              color: 'black',
              duration: 0.3
            });
          }
          clearTimeout(touchTimer);
        }
      }, 100);
    }
  }, { passive: true });
  
  canvas.addEventListener('touchend', () => {
    clearTimeout(touchTimer);
    touchDuration = 0;
  }, { passive: true });
  
  canvas.addEventListener('touchcancel', () => {
    clearTimeout(touchTimer);
    touchDuration = 0;
  }, { passive: true });
  
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touchMoveX = e.touches[0].clientX;
      const touchMoveY = e.touches[0].clientY;
      const deltaX = touchMoveX - touchStartX;
      const deltaY = touchMoveY - touchStartY;
      
      // Only process if it's a significant vertical swipe (not just a tap)
      if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
        // Swipe down to toggle precipitation
        if (deltaY > 0) {
          const isVisible = precipControls.style.display === 'flex';
          
          if (!isVisible) {
            // Show precipitation controls
            precipControls.style.opacity = 0;
            precipControls.style.display = 'flex';
            precipControls.style.transform = 'translateY(-10px)';
            
            // Animate showing
            gsap.to(precipControls, {
              opacity: 1,
              y: 0,
              duration: 0.3
            });
            
            gsap.to(precipButton, {
              backgroundColor: 'black',
              duration: 0.3
            });
            
            const precipIcon = precipButton.querySelector('i');
            gsap.to(precipIcon, {
              color: 'white',
              duration: 0.3
            });
          }
        } 
        // Swipe up to hide precipitation controls
        else if (deltaY < 0) {
          const isVisible = precipControls.style.display === 'flex';
          
          if (isVisible) {
            // Animate hiding
            gsap.to(precipControls, {
              opacity: 0,
              y: -10,
              duration: 0.2,
              onComplete: () => {
                precipControls.style.display = 'none';
              }
            });
            
            gsap.to(precipButton, {
              backgroundColor: 'white',
              duration: 0.3
            });
            
            const precipIcon = precipButton.querySelector('i');
            gsap.to(precipIcon, {
              color: 'black',
              duration: 0.3
            });
          }
        }
      }
    }
  }, { passive: true });
}

// Add hover effects to interactive elements
function setupInteractiveEffects() {
  // Add pulse effect to buttons on hover
  const buttons = document.querySelectorAll('.control-button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: "power1.out"
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power1.in"
      });
    });
  });
  
  // Add shine effect to weather display on hover with new transform
  weatherDisplay.addEventListener('mouseenter', () => {
    gsap.to(weatherDisplay, {
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      y: -5, // Move up slightly on hover
      duration: 0.3
    });
  });
  
  weatherDisplay.addEventListener('mouseleave', () => {
    gsap.to(weatherDisplay, {
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      y: 0, // Return to original position
      duration: 0.3
    });
  });
}

// Initialize critical systems first
function initializeCriticalSystems() {
    updateProgressUI(loadingStages[1]);
    
    // Initialize core components immediately
    setupRenderer();
    updateProgressUI(loadingStages[2]);
    
    setupScene();
    updateProgressUI(loadingStages[3]);
    
    // Defer non-critical initializations
    requestAnimationFrame(() => {
        createCelestialObjects();
        updateProgressUI(loadingStages[4]);
        
        // Continue with remaining initialization
        requestAnimationFrame(initializeRemainingSystem);
    });
}

// Split initialization for better responsiveness
function initializeRemainingSystem() {
    setupLighting();
    updateProgressUI(loadingStages[5]);
    
    requestAnimationFrame(() => {
        initializeWeatherSystems();
        updateProgressUI(loadingStages[6]);
        
        // Complete initialization
        finalizeSetup();
    });
}

// Defer cloud creation
function initializeClouds() {
    clouds = Array(CLOUD_COUNT).fill(null).map(() => {
        const pos = getRandomCloudPosition();
        return createCloud(
            Math.random() * 1.5 + 2,
            pos.x, 
            pos.y,
            getRandomDirection()
        );
    });
    
    updateLoadingProgress("Clouds initialized");
}

// Lazy load weather systems
function initializeWeatherSystems() {
    updateLoadingProgress("Creating precipitation systems...");
    
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!rain) {
                updateLoadingProgress("Initializing rain system...");
                rain = createRain();
            }
            setTimeout(() => {
                if (!snow) {
                    updateLoadingProgress("Initializing snow system...");
                    snow = createSnow();
                }
                updateLoadingProgress("Weather systems ready");
                resolve();
            }, 100);
        }, 100);
    });
}

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
});

// Start the animation
// animate() will be called by completeLoading() function

// Add sequence control to initialization
function initRenderer() {
  return new Promise(resolve => {
    updateProgressUI(loadingStages[1]);
    // Initialize renderer settings
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.4;
    setTimeout(() => resolve(), 100);
  });
}

function setupScene() {
  return new Promise(resolve => {
    updateProgressUI(loadingStages[2]);
    // Initialize scene and camera
    scene.background = new THREE.Color(0xb8e0ff);
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    setTimeout(() => resolve(), 100);
  });
}

function createCelestialObjects() {
  return new Promise(resolve => {
    updateProgressUI(loadingStages[4]);
    // Create sun and moon
    sun.position.set(5, 0, 0);
    moon.position.set(-5, 0, 0);
    // Initialize states
    sun.visible = true;
    moon.visible = false;
    setTimeout(() => resolve(), 100);
  });
}

function setupLighting() {
  return new Promise(resolve => {
    updateProgressUI(loadingStages[5]);
    // Configure lighting
    ambientLight.intensity = 0.3;
    sunLight.intensity = 0.8;
    moonLight.intensity = 0.2;
    setTimeout(() => resolve(), 100);
  });
}

function finalizeSetup() {
  // Initialize clouds
  initializeClouds();
  
  // Set up responsive layouts
  handleResponsiveLayout();
  
  // Set initial sky color
  updateBackgroundColor(getVancouverTime() * 60);
  
  // Mark loading progress
  updateLoadingProgress("Setup complete");
}

// Function to update rain particles animation
function updateRainParticles(rain, time) {
  const positions = rain.geometry.attributes.position.array;
  const count = rain.geometry.drawRange.count;
  
  for (let i = 0; i < count; i++) {
    const yPos = positions[i * 3 + 1];
    // Move raindrops down
    positions[i * 3 + 1] -= 0.2; // Fall speed
    
    // Reset position when it goes below scene
    if (yPos < -10) {
      positions[i * 3 + 1] = Math.random() * 20 - 5;
      positions[i * 3] = (Math.random() - 0.5) * 40; // Randomize x
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40; // Randomize z
    }
  }
  
  // Update the geometry
  rain.geometry.attributes.position.needsUpdate = true;
}

// Function to update snow particles animation
function updateSnowParticles(snow, time) {
  const positions = snow.geometry.attributes.position.array;
  const count = snow.geometry.drawRange.count;
  
  for (let i = 0; i < count; i++) {
    const yPos = positions[i * 3 + 1];
    const xOffset = Math.sin(time + i * 0.1) * 0.02; // Gentle sideways motion
    
    // Move snowflakes down and sideways
    positions[i * 3 + 1] -= 0.03; // Fall speed (slower than rain)
    positions[i * 3] += xOffset; // Sideways drift
    
    // Reset position when it goes below scene
    if (yPos < -10) {
      positions[i * 3 + 1] = Math.random() * 20 - 5;
      positions[i * 3] = (Math.random() - 0.5) * 40; // Randomize x
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40; // Randomize z
    }
  }
  
  // Update the geometry
  snow.geometry.attributes.position.needsUpdate = true;
}

// Handle responsive layout for different screen sizes
function handleResponsiveLayout() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Adjust camera based on screen size
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  // Update renderer size
  renderer.setSize(width, height);
  composer.setSize(width, height);
  
  // Adjust UI element positions based on screen size
  if (width < 480) {
    // Mobile portrait layout
    timeDisplay.style.fontSize = `${Math.min(50, width * 0.15)}px`;
  } else if (height < 480) {
    // Mobile landscape layout
    timeDisplay.style.fontSize = `${Math.min(40, height * 0.15)}px`;
  } else {
    // Default layout
    timeDisplay.style.fontSize = '';
  }
}

// Add error boundaries around critical functions
function safeExecute(fn, fallback) {
  try {
    return fn();
  } catch (err) {
    console.error('Error in execution:', err);
    return fallback?.();
  }
}

// Add cleanup and resource management
function cleanup() {
  // Dispose of Three.js resources
  scene.traverse(object => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    if (object.material) {
      if (object.material.map) object.material.map.dispose();
      object.material.dispose();
    }
  });
  
  renderer.dispose();
  composer.dispose();
  
  // Clear any remaining timeouts/intervals
  if (window.loadingTimeouts) {
    window.loadingTimeouts.forEach(clearTimeout);
  }
}

// Add window resize optimization
let resizeTimeout;
window.addEventListener('resize', () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    composer.setSize(width, height);
    
    // Update responsive calculations
    const dims = getResponsiveRadius();
    // Update any size-dependent variables
  }, 100);
});

// Add proper cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Create star field for night time
function createStarField() {
    // Create a star field geometry
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);
    
    // Create stars with random positions and sizes
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Position stars in a dome shape around the camera
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const distance = 50 + Math.random() * 100; // Between 50 and 150 units away
        
        positions[i3] = distance * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = distance * Math.cos(phi);
        
        // Random sizes for stars - mostly small with some larger ones
        const starSize = Math.random();
        sizes[i] = starSize < 0.95 ? Math.random() * 0.4 + 0.1 : Math.random() * 0.8 + 0.5;
        
        // Varied colors - mostly white/blue with some yellow/red
        const colorType = Math.random();
        if (colorType < 0.7) {
            // White/blue stars (majority)
            colors[i3] = 0.8 + Math.random() * 0.2; // R
            colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
            colors[i3 + 2] = 1.0; // B (always full blue)
        } else if (colorType < 0.9) {
            // Yellow stars
            colors[i3] = 1.0; // Full red
            colors[i3 + 1] = 0.9 + Math.random() * 0.1; // Nearly full green
            colors[i3 + 2] = 0.6 + Math.random() * 0.2; // Medium blue
        } else {
            // Red stars (fewest)
            colors[i3] = 1.0; // Full red
            colors[i3 + 1] = 0.4 + Math.random() * 0.2; // Low green
            colors[i3 + 2] = 0.4 + Math.random() * 0.2; // Low blue
        }
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create point material with custom shader for better-looking stars
    const starMaterial = new THREE.PointsMaterial({
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.name = 'starField';
    scene.add(stars);
    
    return stars;
}

// Add starField variable near the top with other variables
let starField = null;

// Initialize star field when the page loads
window.addEventListener('DOMContentLoaded', () => {
    // Create star field (initially invisible)
    starField = createStarField();
    
    // Start with stars invisible
    if (starField && starField.material) {
        starField.material.opacity = 0;
    }
});

