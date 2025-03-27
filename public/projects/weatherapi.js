// 1. Imports
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// 2. DOM Elements & Constants
const timeSlider = document.getElementById('timeSlider');
const debugButton = document.getElementById('debugButton');
const playButton = document.getElementById('playButton');
// Enhanced sky colors for more pleasing visuals
const dayColor = new THREE.Color(0xb8e0ff);    // Softer sky blue
const nightColor = new THREE.Color(0x0c1a2e);   // Richer night blue
const sunsetColor = new THREE.Color(0xffb88c);  // Warm sunset color
const sunriseColor = new THREE.Color(0xffd4b8);  // Soft sunrise color

// Add state tracking at the top with other constants
let isPlaying = false;
let currentTime = 0;

// Enhanced responsive radius calculation
const getResponsiveRadius = () => {
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
};

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

// Load the moon texture
const moonTextureLoader = new THREE.TextureLoader();
const moonTexture = moonTextureLoader.load('./moontexture.jpeg'); // Replace with your moon texture path

// Create moon light with more natural properties
const moonLight = new THREE.PointLight(0x8fc0ff, 1.2, 150); // Slightly bluer for night ambiance
moonLight.position.set(-5, 0, 0);
scene.add(moonLight);

// Create the moon material with enhanced visual features
const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 0.8,
    metalness: 0.1,
    emissive: 0xCCDDFF, // Slightly bluer glow
    emissiveIntensity: 0.35
});

// Create the moon
const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = -5;
scene.add(moon);

// Create sun light with pure gold/yellow color
const sunLight = new THREE.PointLight(0xFFD700, 0.8, 15); // Pure gold color (RGB 255,215,0)
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Create ambient light for better overall illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Update cloud creation function with more attractive clouds
function createCloud(size, x, y, direction) {
  const loader = new SVGLoader();
  const cloud = new THREE.Group();
  cloud.meshes = []; // Store references to cloud meshes
  
  // Scale cloud size based on screen dimensions
  const responsiveFactor = Math.min(window.innerWidth, window.innerHeight) / 1000;
  const adjustedSize = size * Math.max(0.8, responsiveFactor);
  
  loader.load('./assets/cloud.svg', function(data) {
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
      adjustedSize * 0.001 * randomWidthScale, 
      adjustedSize * 0.001 * randomHeightScale, 
      1
    );
    cloud.position.set(x, -3, 1);
  });
  
  cloud.direction = direction;
  
  // Add enhanced glow effect
  const glowGeometry = new THREE.CircleGeometry(adjustedSize/1.8, 32);
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
  return cloud;
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
  const baseSpeed = 0.01; // 3x faster than previous value
  const variability = 0.005;
  const speed = baseSpeed + Math.random() * variability;
  
  return Math.random() > 0.5 ? speed : -speed;
}

// Update cloud creation array
const clouds = Array(6).fill(null).map(() => {
  const pos = getRandomCloudPosition();
  const size = Math.random() * 1.5 + 2; // Random size between 2 and 3.5
  const direction = getRandomDirection();
  const cloud = createCloud(size, pos.x, pos.y, direction);
  
  // Store initial position for reference
  cloud.initialY = pos.y;
  cloud.verticalRange = { min: -2, max: 2 }; // Add vertical bounds
  cloud.originalSize = size; // Store original size for responsive scaling
  cloud.loaded = false; // Mark as not loaded initially
  cloud.lastTime = null; // For delta time calculation
  
  return cloud;
});

// Create enhanced Rain Particle System
function createRain() {
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
const rain = createRain();
const snow = createSnow();

// 5. Animation Functions
// Modify the animate function to handle time progression
function animate() {
  requestAnimationFrame(animate);

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
    // Normal time update
    if (timeSlider.style.display === 'none') {
      currentTime = getVancouverTime() * 60;
      updateTime(currentTime);
    } else {
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
}

// Completely rewrite the cloud animation function to ensure proper movement
function animateClouds() {
  const dims = getResponsiveRadius();
  const margin = 2;
  const now = Date.now();
  
  // Use a constant movement speed independent of frame rate
  const frameTime = now - (window.lastFrameTime || now);
  window.lastFrameTime = now;
  
  // Cap the frame time delta to prevent huge jumps after tab switches
  const normalizedFrameTime = Math.min(frameTime, 100);
  const speedFactor = normalizedFrameTime / 16.67; // Target 60fps
  
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
  // Rain Animation with improved realism
  if (rain.visible) {
    const rainPositions = rain.geometry.attributes.position.array;
    const drawCount = rain.geometry.drawRange.count;

    for (let i = 0; i < drawCount; i++) {
      const index = i * 3;
      
      // Add slight wind effect
      const windFactor = Math.sin(Date.now() * 0.001) * 0.03;
      rainPositions[index] += windFactor;
      
      // Variable falling speed for more natural look
      const speed = 0.15 + Math.random() * 0.1;
      rainPositions[index + 1] -= speed;

      // Reset particles that go below the view
      if (rainPositions[index + 1] < -10) {
        rainPositions[index] = (Math.random() - 0.5) * 40; // Random x
        rainPositions[index + 1] = 10; // Reset to the top
        rainPositions[index + 2] = (Math.random() - 0.5) * 40; // Random z
      }
    }
    rain.geometry.attributes.position.needsUpdate = true;
  }

  // Snow Animation with improved realism
  if (snow.visible) {
    const snowPositions = snow.geometry.attributes.position.array;
    const drawCount = snow.geometry.drawRange.count;
    const time = Date.now() * 0.001;

    for (let i = 0; i < drawCount; i++) {
      const index = i * 3;
      
      // Add swirling wind effect
      const uniqueOffset = i * 0.01;
      const swirl = Math.sin(time + uniqueOffset) * 0.03;
      snowPositions[index] += swirl;
      snowPositions[index + 2] += Math.cos(time + uniqueOffset) * 0.02;
      
      // Variable falling speed based on implied size
      const fallSpeed = 0.03 + Math.random() * 0.03;
      snowPositions[index + 1] -= fallSpeed;

      // Reset particles that go below the view
      if (snowPositions[index + 1] < -10) {
        snowPositions[index] = (Math.random() - 0.5) * 40; // Random x
        snowPositions[index + 1] = 10; // Reset to the top
        snowPositions[index + 2] = (Math.random() - 0.5) * 40; // Random z
      }
    }
    snow.geometry.attributes.position.needsUpdate = true;
    
    // Add subtle rotation to the entire snow system
    snow.rotation.y = Math.sin(time * 0.1) * 0.05;
  }
}

// 6. Event Listeners
// Enhanced resize handler for responsive adjustments
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    composer.setSize(width, height);
    
    // Adjust bloom quality based on screen size
    const isSmallScreen = width < 768;
    bloomPass.strength = isSmallScreen ? 0.3 : 0.4;
    bloomPass.radius = isSmallScreen ? 0.4 : 0.5;
    
    // Update cloud positions and sizes
    clouds.forEach(cloud => {
      if (cloud.meshes && cloud.meshes.length > 0) {
        const responsiveFactor = Math.min(width, height) / 1000;
        const adjustedScale = Math.max(0.8, responsiveFactor) * 0.001;
        
        // Adjust scale based on new dimensions
        const randomWidthScale = 0.9 + Math.random() * 0.2;
        cloud.scale.x = adjustedScale * randomWidthScale * (cloud.originalSize || 2);
        cloud.scale.y = adjustedScale * (cloud.originalSize || 2);
      }
    });

    // Update celestial positions when screen size changes
    updateTime(currentTime);
});

// Update the window.onload handler to better initialize clouds
window.onload = () => {
  // Simulate default data (no API call)
  displayWeatherData(); // This will show N/A for temperature and precipitation

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
  
  // Add subtle entrance animation for UI elements
  gsap.from(weatherDisplay, {
    y: 20,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power2.out"
  });
  
  gsap.from(timeDisplay, {
    y: -20,
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
};

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
    }
    // Dawn transition (5-6:30h)
    else if (hours >= 5 && hours < 6.5) {
        color1 = new THREE.Color(0x1a2a44);
        color2 = sunriseColor;
        factor = (hours - 5) / 1.5;
        sunriseOverlay.style.opacity = (factor * 0.3).toString();
        gradientOverlay.style.opacity = "0";
    }
    // Sunrise to morning (6:30-8h)
    else if (hours >= 6.5 && hours < 8) {
        color1 = sunriseColor;
        color2 = dayColor;
        factor = (hours - 6.5) / 1.5;
        sunriseOverlay.style.opacity = (0.3 * (1 - factor)).toString();
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
        gradientOverlay.style.opacity = (factor * 0.3).toString();
    }
    // Sunset (18:30-19:30h)
    else if (hours >= 18.5 && hours < 19.5) {
        color1 = sunsetColor;
        color2 = new THREE.Color(0x1a2a44); // Dark blue
        factor = (hours - 18.5);
        gradientOverlay.style.opacity = (0.3 * (1 - factor)).toString();
    }
    // Evening to night (19:30-21h)
    else if (hours >= 19.5 && hours < 21) {
        color1 = new THREE.Color(0x1a2a44);
        color2 = nightColor;
        factor = (hours - 19.5) / 1.5;
    }
    // Night (21-24h)
    else {
        scene.background = nightColor;
        gradientOverlay.style.opacity = "0";
        return;
    }

    // Smoothly interpolate the background color
    scene.background = interpolateColor(color1, color2, factor);
}

function getVancouverTime() {
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', {
    timeZone: 'America/Vancouver',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const [hours, minutes, seconds] = currentTime.split(':').map(Number);
  return hours + minutes / 60 + seconds / 3600;
}

function interpolatePosition(object, targetX, targetY, speed) {
    if (!object.visible) {
        // When object becomes visible, set it close to its target position
        object.position.x = targetX + (targetX > 0 ? -2 : 2);
        object.position.y = targetY;
        return;
    }
    
    const currentPosition = object.position;
    const targetPosition = new THREE.Vector3(targetX, targetY, currentPosition.z);
    
    // Use smoother interpolation with smaller speed for transitions
    currentPosition.lerp(targetPosition, Math.min(speed, 0.03));
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

    // Get responsive dimensions
    const dims = getResponsiveRadius();
    
    // Constants for celestial movement
    const transitionSpeed = 0.05;
    const maxX = dims.maxX;
    const minX = dims.minX;
    const maxY = dims.maxY;
    const radius = dims.radius;
    const centerX = (maxX + minX) / 4;

    // Calculate positions using circular motion
    const angle = dayProgress * Math.PI * 2;
    const xPosition = centerX + radius * Math.cos(angle - Math.PI / 2);
    const yPosition = maxY * Math.sin(angle - Math.PI / 2);

    // Calculate sun height factor (-1 to 1)
    const sunHeight = Math.sin(angle - Math.PI / 2);
    
    // Determine if it's day or night based on sun position
    const isDaytime = sunHeight > 0;

    // Calculate light factor based on sun/moon position
    let lightFactor;
    if (isDaytime) {
        // Reduced daylight intensity
        lightFactor = Math.pow(sunHeight, 0.7) * 0.8; // Softer and dimmer
        
        // Ensure moon is positioned for smooth entry before becoming visible
        if (!sun.visible) {
            sun.position.x = xPosition + (xPosition > 0 ? -0.5 : 2);
            sun.position.y = yPosition;
        }
        sun.visible = true;
        moon.visible = false;
        
        interpolatePosition(sun, xPosition, yPosition, transitionSpeed);
        // Adjust sun intensity based on height in sky - higher at noon
        const noonFactor = Math.sin(Math.PI * sunHeight); // Peaks at 1.0 when sun is directly overhead
        sunLight.intensity = 0.9 * noonFactor; // Slightly higher intensity
        
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
        const moonHeight = -sunHeight;
        lightFactor = Math.pow(moonHeight, 0.5) * 0.15; // Brighter moon nights
        
        // Ensure sun is positioned for smooth entry before becoming visible
        if (!moon.visible) {
            moon.position.x = -xPosition + (-xPosition > 0 ? -0.5 : 2);
            moon.position.y = -yPosition;
        }
        sun.visible = false;
        moon.visible = true;
        
        interpolatePosition(moon, -xPosition, -yPosition, transitionSpeed);
        moonLight.intensity = 1.2;
        sunLight.intensity = 0;
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

// Enhance weather messages with better formatting
function displayWeatherData(data = null) {
  // Use default values or fetch from API response
  let temperature = data && data.main ? data.main.temp : null;
  let precipitationValue = 0;
  let weatherDescription = data && data.weather && data.weather[0] ? data.weather[0].description : "clear skies";

  // Check for precipitation data (rain or snow)
  if (data) {
    const rainData = data.rain;
    const snowData = data.snow;

    if (rainData && rainData['1h']) {
      precipitationValue = rainData['1h'];
    } else if (snowData && snowData['1h']) {
      precipitationValue = snowData['1h'];
    }
  }

  // Validate weather data (return N/A if invalid)
  const validatedData = validateWeatherData(temperature, precipitationValue);
  temperature = validatedData.temperature;
  precipitationValue = validatedData.precipitationValue;

  // Determine time of day for greeting
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

  // Format the individual messages with emojis
  const messages = [
    `${greeting} ${emoji}`,
    `Temperature: ${temperature}°C 🌡️`,
    `Precipitation: ${precipitationValue} mm 💧`
  ];

  // Clear any previous content
  weatherDisplay.innerHTML = '';

  // Create message elements with enhanced styling
  const messageElements = messages.map((text) => {
    const div = document.createElement('div');
    div.className = 'weatherMessage';
    div.textContent = text;
    // Add text-shadow for better visibility in all conditions
    div.style.textShadow = '0px 1px 4px rgba(0, 0, 0, 0.3)';
    return div;
  });

  // Append message elements to the weatherDisplay
  messageElements.forEach((div) => {
    weatherDisplay.appendChild(div);
  });

  // Make global reference to access messages in updateTime
  window.weatherMessages = messageElements;

  // Use GSAP to create a smoother carousel effect
  gsap.set(messageElements, { 
    yPercent: 100, 
    opacity: 0,
    filter: "blur(3px)"
  });
  
  gsap.to(messageElements[0], { 
    yPercent: 0, 
    opacity: 1, 
    filter: "blur(0px)",
    duration: 0.8,
    ease: "power2.out"
  });

  let currentIndex = 0;
  function rotateMessages() {
    const nextIndex = (currentIndex + 1) % messageElements.length;

    // Smoother animation with slight scaling
    gsap.to(messageElements[currentIndex], { 
      yPercent: -100, 
      opacity: 0, 
      scale: 0.95,
      filter: "blur(3px)",
      duration: 0.8, 
      ease: "power2.inOut" 
    });
    
    gsap.fromTo(
      messageElements[nextIndex],
      { 
        yPercent: 100, 
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
  }

  // Adjust rotation interval based on screen size
  const rotationInterval = window.innerWidth < 768 ? 4500 : 3500;
  setInterval(rotateMessages, rotationInterval);
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

// Create touch event handling for mobile devices
function setupTouchEvents() {
  const canvas = renderer.domElement;
  
  // Add touch event for precipitation toggle on swipe down
  let touchStartY = 0;
  canvas.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  canvas.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe down to toggle precipitation
    if (deltaY > 100) {
      const isVisible = precipControls.style.display === 'flex';
      precipControls.style.display = isVisible ? 'none' : 'flex';
      precipButton.style.backgroundColor = isVisible ? 'white' : 'black';
      
      const precipIcon = precipButton.querySelector('i');
      precipIcon.style.color = isVisible ? 'black' : 'white';
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
  
  // Add shine effect to weather display on hover
  weatherDisplay.addEventListener('mouseenter', () => {
    gsap.to(weatherDisplay, {
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      duration: 0.3
    });
  });
  
  weatherDisplay.addEventListener('mouseleave', () => {
    gsap.to(weatherDisplay, {
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      duration: 0.3
    });
  });
}

// Start the animation
animate();