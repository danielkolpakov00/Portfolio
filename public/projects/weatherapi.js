  // Declare variables at the top
  const timeSlider = document.getElementById('timeSlider');
  const debugButton = document.getElementById('debugButton');
  const playButton = document.getElementById('playButton');

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  // Background colors for day and night
  const dayColor = new THREE.Color(0xadd1f6);
  const nightColor = new THREE.Color(0x082097);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

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

  // Create moon light
  const moonLight = new THREE.PointLight(0x8888FF, 0.6, 50);
  moonLight.position.set(-5, 0, 0);
  scene.add(moonLight);

  // Create the moon material
  const moonMaterial = new THREE.MeshPhongMaterial({
    map: moonTexture,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 1,
    emissive: 0xFFFFFF,
    emissiveIntensity: 1
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

  // Function to interpolate between two colors
  function interpolateColor(color1, color2, factor) {
    const r = color1.r + (color2.r - color1.r) * factor;
    const g = color1.g + (color2.g - color1.g) * factor;
    const b = color1.b + (color2.b - color1.b) * factor;
    return new THREE.Color(r, g, b);
  }

  // Update background color based on time
  function updateBackgroundColor(simulatedTime) {
    let hours = Math.floor(simulatedTime / 60);

    let factor;
    if (hours >= 6 && hours <= 18) {
      // Daytime
      factor = (simulatedTime / 60 - 6) / 12;
    } else {
      // Nighttime
      factor = 0;
    }

    // Interpolate background color
    scene.background = interpolateColor(nightColor, dayColor, factor);
  }

  // Get Vancouver time with seconds included
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

  // Cloud texture loader
  const cloudTextureLoader = new THREE.TextureLoader();
  const cloudTexture = cloudTextureLoader.load('./cloud.png'); // Replace with your cloud texture path

  // Create Cloud function using texture
  function createCloud(size, x, y, direction) {
    const cloudGeometry = new THREE.PlaneGeometry(size, size / 2);
    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.position.set(x, y, 2);
    cloud.direction = direction;
    scene.add(cloud);
    return cloud;
  }

  // Create multiple clouds with different directions
  const clouds = [
    createCloud(1, -12, 2, 1),
    createCloud(1.5, 8, 1, -1),
    createCloud(1, -9, 0, 1),
    createCloud(1.5, 11, -1, -1),
    createCloud(0.8, -6, 3, 1),
    createCloud(1.2, 5, -2, -1),
  ];

  // Animate the clouds
  function animateClouds() {
    clouds.forEach((cloud) => {
      cloud.position.x += 0.01 * cloud.direction;
      if (cloud.position.x > 15) {
        cloud.position.x = -15;
      }
      if (cloud.position.x < -15) {
        cloud.position.x = 15;
      }
    });
  }

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

  // Function to set rain intensity
  function setRainIntensity(intensity) {
    intensity = Math.max(0, Math.min(1, intensity));
    rain.visible = intensity > 0;

    if (rain.visible) {
      const maxRainCount = rain.geometry.attributes.position.count;
      const drawCount = Math.floor(maxRainCount * intensity);
      rain.geometry.setDrawRange(0, drawCount);
    }
  }

  // Function to set snow intensity
  function setSnowIntensity(intensity) {
    intensity = Math.max(0, Math.min(1, intensity));
    snow.visible = intensity > 0;

    if (snow.visible) {
      const maxSnowCount = snow.geometry.attributes.position.count;
      const drawCount = Math.floor(maxSnowCount * intensity);
      snow.geometry.setDrawRange(0, drawCount);
    }
  }

  // Animate Weather Particles
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

  // Main Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate sun and moon
    sun.rotation.y += 0.005;
    moon.rotation.y += 0.005;

    // Move clouds
    animateClouds();

    // Animate weather particles
    animateWeatherParticles();

    // Update time
    if (timeSlider.style.display === 'none') {
      updateTime(getVancouverTime() * 60);
    } else {
      updateTime(parseFloat(timeSlider.value));
    }

    // Update light positions
    sunLight.position.copy(sun.position);
    moonLight.position.copy(moon.position);

    renderer.render(scene, camera);
  }

  // Start the animation
  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Function to update the scene based on time
  function updateTime(simulatedTime) {
    const timeDisplay = document.getElementById('timeDisplay');
    let hours = Math.floor(simulatedTime / 60);
    let minutes = Math.floor(simulatedTime % 60).toString().padStart(2, '0');

    if (hours >= 24) {
      hours = 0;
    }

    const formattedTime = `${hours}:${minutes}`;
    timeDisplay.innerText = formattedTime;

    const transitionSpeed = 1;
    const maxX = 8.5;
    const minX = -8.5;
    const arcHeight = 2.5;

    let targetX;
    let targetY;

    // Update background color
    updateBackgroundColor(simulatedTime);

    if (hours >= 6 && hours <= 18) {
      // Daytime
      const dayFactor = (simulatedTime / 60 - 6) / 12;
      targetX = minX + (maxX - minX) * dayFactor;
      targetY = -Math.pow(dayFactor * 2 - 1, 2) * arcHeight + arcHeight;

      // Show the sun and hide the moon
      sun.visible = true;
      moon.visible = false;

      interpolatePosition(sun, targetX, targetY, transitionSpeed);
    } else {
      // Nighttime
      sun.visible = false;
      sun.position.set(minX, arcHeight, 0);

      let nightFactor;
      if (hours < 6) {
        nightFactor = (simulatedTime / 60 + 6) / 12;
      } else {
        nightFactor = (simulatedTime / 60 - 18) / 12;
      }

      targetX = minX + (maxX - minX) * nightFactor;
      targetY = -Math.pow(nightFactor * 2 - 1, 2) * arcHeight + arcHeight;

      // Show the moon and hide the sun
      moon.visible = true;
      interpolatePosition(moon, targetX, targetY, transitionSpeed);
    }

    if (hours >= 6 && hours <= 18) {
      moon.visible = false;
      moon.position.set(minX, arcHeight, 0);
    }
  }

  // Function to interpolate object position
  function interpolatePosition(object, targetX, targetY, speed) {
    if (!object.visible) return;
    const currentPosition = object.position;
    const targetPosition = new THREE.Vector3(targetX, targetY, currentPosition.z);
    currentPosition.lerp(targetPosition, speed);
  }

  // Function to display weather data with vertical carousel effect
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
      return div;
    });

    // Append message elements to the weatherDisplay
    messageElements.forEach((div) => {
      weatherDisplay.appendChild(div);
    });

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

    // Rotate messages every 3 seconds
    setInterval(rotateMessages, 3000);
  }

  // Function to validate weather data
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

  // Initialize the default state on page load
  window.onload = () => {
    // Simulate default data (no API call)
    displayWeatherData(); // This will show N/A for temperature and precipitation

    // Ensure slider is hidden and debug button styles are set
    timeSlider.style.display = 'none';
    debugButton.style.backgroundColor = 'white';
    debugButton.querySelector('svg').style.fill = 'black';
  };

  // Toggle slider visibility and change button colors
  debugButton.addEventListener('click', () => {
    if (timeSlider.style.display === 'none') {
      timeSlider.style.display = 'block';
      debugButton.style.backgroundColor = 'black';
      debugButton.querySelector('svg').style.fill = 'white';
    } else {
      timeSlider.style.display = 'none';
      debugButton.style.backgroundColor = 'white';
      debugButton.querySelector('svg').style.fill = 'black';
    }
  });

  // Event listener for timeSlider to update time in real-time
  timeSlider.addEventListener('input', () => {
    updateTime(parseFloat(timeSlider.value));
  });