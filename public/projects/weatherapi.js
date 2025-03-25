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
const dayColor = new THREE.Color(0xb1d8ff);    // Soft sky blue
const nightColor = new THREE.Color(0x0a1428);   // Darker night blue

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

// 3. Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ 
    antialias: window.devicePixelRatio < 2, // Only use antialias for higher-end devices
    powerPreference: "high-performance",
    precision: "highp"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.3;
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
// Create Sun with Gradient
function createSunGradient() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  // Create radial gradient
  const gradient = context.createRadialGradient(128, 128, 50, 128, 128, 128);
  gradient.addColorStop(0, '#FFFF00'); // Bright yellow in the center
  gradient.addColorStop(1, '#FFA500'); // Orange around the edges
  // Fill with gradient
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
}

// Create the sun
const sunMaterial = new THREE.MeshBasicMaterial({ map: createSunGradient() });
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Load the moon texture
const moonTextureLoader = new THREE.TextureLoader();
const moonTexture = moonTextureLoader.load('./moontexture.jpeg'); // Replace with your moon texture path

// Create moon light with adjusted properties
const moonLight = new THREE.PointLight(0x8888FF, 2, 150);
moonLight.position.set(-5, 0, 0);
scene.add(moonLight);

// Create the moon material
const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 0.7,
    metalness: 0.1,
    emissive: 0xCCCCFF,
    emissiveIntensity: 0.4
});

// Create the moon
const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = -5;
scene.add(moon);

// Create sun light
const sunLight = new THREE.PointLight(0xFFFF00, 2, 10);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Create ambient light for better overall illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Update cloud creation function with more responsive scaling
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
          opacity: 0.8,
          side: THREE.DoubleSide,
          depthTest: false
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        // Apply slight random rotation to avoid squared appearance
        mesh.rotation.z = (Math.random() - 0.5) * 0.2;
        cloud.add(mesh);
        cloud.meshes.push(mesh); // Store reference to mesh
      });
    });
    
    // Use non-uniform scaling to avoid squared appearance
    const randomWidthScale = 0.9 + Math.random() * 0.2;
    cloud.scale.set(adjustedSize * 0.001 * randomWidthScale, adjustedSize * 0.001, 1);
    cloud.position.set(x, -3, 1);
  });
  
  cloud.direction = direction;
  
  // Add rounded glow effect
  const glowGeometry = new THREE.CircleGeometry(adjustedSize/2, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthTest: false
  });
  
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
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

// Update getRandomDirection function for horizontal movement only
function getRandomDirection() {
  const speed = Math.random() * 0.001 + 0.003; // Random speed between 0.02 and 0.12
  return Math.random() > 0.5 ? speed : -speed; // Only horizontal movement
}

// Update cloud creation array
const clouds = Array(6).fill(null).map(() => {
  const pos = getRandomCloudPosition();
  const size = Math.random() * 1.5 + 2; // Random size between 2 and 3.5
  const direction = getRandomDirection();
  const cloud = createCloud(size, pos.x, pos.y, direction);
  cloud.verticalRange = { min: -2, max: 2 }; // Add vertical bounds
  return cloud;
});

// Create Rain Particle System
function createRain() {
  const rainGeometry = new THREE.BufferGeometry();
  const maxRainCount = 15000;
  const rainPositions = new Float32Array(maxRainCount * 3);

  for (let i = 0; i < maxRainCount; i++) {
    rainPositions[i * 3] = Math.random() * 40 - 20;
    rainPositions[i * 3 + 1] = Math.random() * 20 - 10;
    rainPositions[i * 3 + 2] = Math.random() * 40 - 20;
  }

  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.1,
    transparent: true,
  });

  const rain = new THREE.Points(rainGeometry, rainMaterial);
  rain.visible = false; // Initially hidden
  rain.geometry.setDrawRange(0, 0); // Start with zero particles
  scene.add(rain);

  return rain;
}

// Create Snow Particle System
function createSnow() {
  const snowGeometry = new THREE.BufferGeometry();
  const maxSnowCount = 5000;
  const snowPositions = new Float32Array(maxSnowCount * 3);

  for (let i = 0; i < maxSnowCount; i++) {
    snowPositions[i * 3] = Math.random() * 40 - 20;
    snowPositions[i * 3 + 1] = Math.random() * 20 - 10;
    snowPositions[i * 3 + 2] = Math.random() * 40 - 20;
  }

  snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
  const snowMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
  });

  const snow = new THREE.Points(snowGeometry, snowMaterial);
  snow.visible = false; // Initially hidden
  snow.geometry.setDrawRange(0, 0); // Start with zero particles
  scene.add(snow);

  return snow;
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

  // Rotate sun and moon
  sun.rotation.y += 0.005;
  moon.rotation.y += 0.005;

  // Move clouds
  animateClouds();

  // Animate weather particles
  animateWeatherParticles();

  // Update light positions
  sunLight.position.copy(sun.position);
  moonLight.position.copy(moon.position);

  composer.render(); // Replace renderer.render() with composer.render()
}

// Update animateClouds function for horizontal-only movement
function animateClouds() {
  const dims = getResponsiveRadius();
  const margin = 2;
  
  clouds.forEach((cloud) => {
    // Update horizontal position only
    cloud.position.x += cloud.direction;

    // Reset position when out of bounds
    if (cloud.position.x > dims.maxX + margin) {
      cloud.position.x = -dims.maxX - margin;
      cloud.direction = getRandomDirection();
    }
    if (cloud.position.x < -dims.maxX - margin) {
      cloud.position.x = dims.maxX + margin;
      cloud.direction = getRandomDirection();
    }
    
    // Animate cloud glow opacity only
    const glow = cloud.children[cloud.children.length - 1];
    if (glow && glow.material) {
      glow.material.opacity = 0.2 + Math.sin(Date.now() * 0.001) * 0.1;
    }
  });
}

function animateWeatherParticles() {
  // Rain Animation
  if (rain.visible) {
    const rainPositions = rain.geometry.attributes.position.array;
    const drawCount = rain.geometry.drawRange.count;

    for (let i = 0; i < drawCount; i++) {
      const index = i * 3;
      rainPositions[index + 1] -= 0.2; // Move down

      if (rainPositions[index + 1] < -10) {
        rainPositions[index + 1] = 10; // Reset to the top
      }
    }
    rain.geometry.attributes.position.needsUpdate = true;
  }

  // Snow Animation
  if (snow.visible) {
    const snowPositions = snow.geometry.attributes.position.array;
    const drawCount = snow.geometry.drawRange.count;

    for (let i = 0; i < drawCount; i++) {
      const index = i * 3;
      snowPositions[index + 1] -= 0.05; // Snow falls slower

      if (snowPositions[index + 1] < -10) {
        snowPositions[index + 1] = 10; // Reset to the top
      }
    }
    snow.geometry.attributes.position.needsUpdate = true;
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

// Update the window.onload handler to initialize play button state
window.onload = () => {
  // Simulate default data (no API call)
  displayWeatherData(); // This will show N/A for temperature and precipitation

  // Ensure slider is hidden and debug button styles are set
  timeSlider.style.display = 'none';
  debugButton.style.backgroundColor = 'white';
  
  // Initialize debug button icon
  const bugIcon = debugButton.querySelector('i');
  bugIcon.style.color = 'black';

  // Initialize play button state and icon
  playButton.style.backgroundColor = 'white';
  const playIcon = playButton.querySelector('i');
  playIcon.style.color = 'black';
  
  // Initialize precip button icon
  const precipIcon = precipButton.querySelector('i');
  precipIcon.style.color = 'black';
  
  // Setup responsive event handlers
  setupTouchEvents();
  
  isPlaying = false;
  currentTime = getVancouverTime() * 60;
  
  // Store original cloud sizes for responsive scaling
  clouds.forEach(cloud => {
    const originalSize = Math.random() * 1.5 + 2;
    cloud.originalSize = originalSize;
  });
};

debugButton.addEventListener('click', () => {
  if (timeSlider.style.display === 'none') {
    timeSlider.style.display = 'block';
    debugButton.style.backgroundColor = 'black';
    
    // Update the bug icon color
    const bugIcon = debugButton.querySelector('i');
    bugIcon.style.color = 'white';
  } else {
    timeSlider.style.display = 'none';
    debugButton.style.backgroundColor = 'white';
    
    // Update the bug icon color
    const bugIcon = debugButton.querySelector('i');
    bugIcon.style.color = 'black';
  }
});

// Add play button click handler
playButton.addEventListener('click', () => {
  isPlaying = !isPlaying;
  playButton.style.backgroundColor = isPlaying ? 'black' : 'white';
  
  // Update the icon color and content
  const playIcon = playButton.querySelector('i');
  playIcon.style.color = isPlaying ? 'white' : 'black';
  
  // Change icon from play to pause and vice versa
  if (isPlaying) {
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
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
    precipControls.style.display = isVisible ? 'none' : 'flex';
    precipButton.style.backgroundColor = isVisible ? 'white' : 'black';
    
    // Update the icon color
    const precipIcon = precipButton.querySelector('i');
    precipIcon.style.color = isVisible ? 'black' : 'white';
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
function interpolateColor(color1, color2, factor) {
  const r = color1.r + (color2.r - color1.r) * factor;
  const g = color1.g + (color2.g - color1.g) * factor;
  const b = color1.b + (color2.b - color1.b) * factor;
  return new THREE.Color(r, g, b);
}

function updateBackgroundColor(simulatedTime) {
    const hours = simulatedTime / 60;
    let factor;

    // Deep night (0-5h): stays dark
    if (hours >= 0 && hours < 5) {
        factor = 0;
    }
    // Sunrise transition (5-7h)
    else if (hours >= 5 && hours < 7) {
        factor = (hours - 5) / 2;
    }
    // Full daylight (7-17h)
    else if (hours >= 7 && hours < 17) {
        factor = 1;
    }
    // Sunset transition (17-19h)
    else if (hours >= 17 && hours < 19) {
        factor = 1 - ((hours - 17) / 2);
    }
    // Night (19-24h): stays dark
    else {
        factor = 0;
    }

    // Add slight ambient light during night hours
    const minLight = 0.1; // Minimum light factor
    factor = Math.max(minLight, factor);

    // Smoothly interpolate the background color
    scene.background = interpolateColor(nightColor, dayColor, factor);
    
    // Adjust ambient light for better visibility
    ambientLight.intensity = 0.2 + (factor * 0.4);
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
        sunLight.intensity = 1.5 * lightFactor;
        moonLight.intensity = 0;
        bloomPass.strength = 0.4;
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
  bloomPass.strength = isDaytime ? 0.4 : 0.6;
  bloomPass.radius = isDaytime ? 0.5 : 0.7;
  bloomPass.threshold = isDaytime ? 0.1 : 0.05;
}

// Update the displayWeatherData function for better responsiveness
function displayWeatherData(data = null) {
  const weatherDisplay = document.getElementById('weatherDisplay');

  // Use default values or fetch from API response
  let temperature = data && data.main ? data.main.temp : null;
  let precipitationValue = 0;

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
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  }

  // Format the individual messages
  const messages = [
    greeting,
    `The current temperature is ${temperature}°C`,
    `and the current precipitation is ${precipitationValue} mm.`
  ];

  // Clear any previous content
  weatherDisplay.innerHTML = '';

  // Create message elements
  const messageElements = messages.map((text) => {
    const div = document.createElement('div');
    div.className = 'weatherMessage';
    div.textContent = text;
    // Add text-shadow for better visibility in all conditions
    div.style.textShadow = '0px 0px 4px rgba(0, 0, 0, 0.5)';
    return div;
  });

  // Append message elements to the weatherDisplay
  messageElements.forEach((div) => {
    weatherDisplay.appendChild(div);
  });

  // Make global reference to access messages in updateTime
  window.weatherMessages = messageElements;

  // Use GSAP to create the vertical carousel effect
  gsap.set(messageElements, { yPercent: 100, opacity: 0 });
  gsap.set(messageElements[0], { yPercent: 0, opacity: 1 });

  let currentIndex = 0;
  function rotateMessages() {
    const nextIndex = (currentIndex + 1) % messageElements.length;

    gsap.to(messageElements[currentIndex], { yPercent: -100, opacity: 0, duration: 1 });
    gsap.fromTo(
      messageElements[nextIndex],
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1 }
    );

    currentIndex = nextIndex;
  }

  // Adjust rotation interval based on screen size
  const rotationInterval = window.innerWidth < 768 ? 4000 : 3000;
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

// Start the animation
animate();