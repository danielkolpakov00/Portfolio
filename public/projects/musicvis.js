import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
  // so here's all the dom elements we need
  const settingsModal = document.getElementById('settings-modal');
  const settingsBtn = document.getElementById('settings-btn');
  const colorPicker = document.getElementById('color-picker');
  const songTitle = document.getElementById('song-title');
  const progressSlider = document.getElementById('progress-slider');
  const currentTime = document.getElementById('current-time');
  const totalTime = document.getElementById('total-time');
  const uploadBtn = document.getElementById('upload-btn');
  const musicUpload = document.getElementById('music-upload');
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const volumeBtn = document.getElementById('volume-btn');
  const volumeIcon = document.getElementById('volume-icon');
  const playlistBtn = document.getElementById('playlist-btn');
  const playlistPanel = document.getElementById('playlist-panel');
  const audiusBtn = document.getElementById('audius-btn');
  const audiusModal = document.getElementById('audius-modal');
  const audiusTracks = document.getElementById('audius-tracks');

  // variables for three.js stuff and audio
  let scene, camera, renderer, sphere, particlesMaterial, audioContext, analyser, dataArray, audioSource, audio;
  let baseHue = 100;

  // initialize the scene and audio
  initScene();
  initAudio();
  animateVisualizer(); // start the rendering loop immediately
  setupAudio(null); // set default audio

  settingsBtn.addEventListener('click', () => {
    if (settingsModal.classList.contains('opacity-0')) {
      // Show modal
      settingsModal.classList.remove('opacity-0', 'pointer-events-none');
      settingsModal.classList.add('opacity-100');
    } else {
      // Hide modal
      settingsModal.classList.remove('opacity-100');
      settingsModal.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  uploadBtn.addEventListener('click', () => {
    musicUpload.click();
  });

  musicUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      setupAudio(file);
    }
  });

  playBtn.addEventListener('click', async () => {
    // Resume AudioContext on user interaction
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    if (audio.paused) {
      audio.play();
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');
    } else {
      audio.pause();
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
    }
  });

  colorPicker.addEventListener('input', () => {
    updateParticleColors();
  });

  progressSlider.addEventListener('input', () => {
    if (audio.duration) {
      const seekTime = (progressSlider.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    }
  });

  volumeBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volumeIcon.classList.toggle('fa-volume-up');
    volumeIcon.classList.toggle('fa-volume-mute');
  });

  playlistBtn.addEventListener('click', () => {
    if (playlistPanel.classList.contains('opacity-0')) {
      // Show playlist
      playlistPanel.classList.remove('opacity-0', 'pointer-events-none');
      playlistPanel.classList.add('opacity-100');
    } else {
      // Hide playlist
      playlistPanel.classList.remove('opacity-100');
      playlistPanel.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  audiusBtn.addEventListener('click', () => {
    if (audiusModal.classList.contains('opacity-0')) {
      // Show modal
      audiusModal.classList.remove('opacity-0', 'pointer-events-none');
      audiusModal.classList.add('opacity-100');
      loadAudiusTracks();
    } else {
      // Hide modal
      audiusModal.classList.remove('opacity-100');
      audiusModal.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  async function loadAudiusTracks() {
    try {
      audiusTracks.innerHTML = '<div class="text-gray-400 text-center">Loading...</div>';

      const response = await fetch('https://discoveryprovider.audius.co/v1/tracks/trending?app_name=YOUR_APP_NAME&limit=50');
      const data = await response.json();

      const tracksHtml = data.data.map(track => `
        <div class="p-3 rounded bg-white bg-opacity-5 hover:bg-opacity-10 cursor-pointer transition-colors flex items-center"
             data-track-url="${track.stream_url}?app_name=YOUR_APP_NAME">
          <img src="${track.artwork['150x150'] || ''}" class="w-12 h-12 rounded mr-3" 
               onerror="this.parentElement.querySelector('.default-icon').style.display='block';this.style.display='none'">
          <div class="default-icon" style="display:none">
            <div class="w-12 h-12 rounded mr-3 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <i class="fas fa-music text-gray-400"></i>
            </div>
          </div>
          <div>          // Add this function to handle playlist item clicks
          function setupPlaylist() {
            const playlistItems = document.querySelectorAll('.playlist-item');
            playlistItems.forEach(item => {
              item.addEventListener('click', () => {
                const fileUrl = item.getAttribute('data-file-url');
                if (fileUrl) {
                  switchToSong(fileUrl, item.textContent);
                }
              });
            });
          }
          
          // Function to switch to the selected song
          function switchToSong(fileUrl, songName) {
            // Disconnect old audio source if it exists
            if (audioSource) {
           // Function to switch to the selected song
            }
          
            // Load the new song into the audio element
            audio.src = fileUrl;
            audio.crossOrigin = 'anonymous';
            audio.load();
            audio.play();
          
            // Reconnect the audio nodes
            audioSource = audioContext.createMediaElementSource(audio);
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
          
            // Update UI
            songTitle.textContent = songName;
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
          }
          
          // Call setupPlaylist after the DOM is loaded
          window.addEventListener('DOMContentLoaded', () => {
           // Call  after the DOM is loaded
          window.addEventListener('DOMContentLoaded', () => {
            // Existing code...
          
            setupPlaylist(); // Add this line to initialize the playlist event listeners
          });
            <div class="font-medium text-white">${track.title}</div>
            <div class="text-sm text-gray-400">${track.user.name}</div>
          </div>
        </div>
      `).join('');

      audiusTracks.innerHTML = tracksHtml || '<div class="text-gray-400 text-center">No tracks found</div>';

    } catch (error) {
      console.error('Error loading tracks:', error);
      audiusTracks.innerHTML = `
        <div class="text-red-400 text-center p-4">
          <p>Error loading tracks</p>
          <p class="text-sm mt-2">${error.message}</p>
        </div>`;
    }
  }

  audiusTracks.addEventListener('click', async (e) => {
    const trackElement = e.target.closest('[data-track-url]');
    if (trackElement) {
      await playAudiusTrack(trackElement);
    }
  });

  async function playAudiusTrack(trackElement) {
    try {
      const trackUrl = trackElement.dataset.trackUrl;
      if (!trackUrl) return;

      // Disconnect old audio source if it exists
      if (audioSource) {
        audioSource.disconnect();
      }

      // Load the track into the audio element
      audio.src = trackUrl;
      audio.crossOrigin = "anonymous";
      audio.load();
      audio.play();

      // Reconnect the audio nodes
      audioSource = audioContext.createMediaElementSource(audio);
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);

      // Update UI
      const trackTitle = trackElement.querySelector('.font-medium').textContent;
      const trackArtist = trackElement.querySelector('.text-sm').textContent;
      songTitle.textContent = `${trackTitle} - ${trackArtist}`;
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');

      // Close modal
      audiusModal.classList.remove('opacity-100');
      audiusModal.classList.add('opacity-0', 'pointer-events-none');

    } catch (error) {
      console.error('Error playing track:', error);
      alert('Error playing track: ' + error.message);
    }
  }

  // Update token handling to work with file protocol
  const hashParams = window.location.hash
    .substring(1)
    .split('&')
    .reduce((acc, item) => {
      const [key, value] = item.split('=');
      acc[key] = value;
      return acc;
    }, {});

  if (hashParams.access_token) {
    // Remove hash from URL
    window.history.replaceState(null, null, window.location.pathname);
  }

  // Check for token in URL after login
  if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substring(1));
  }

  function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;
  
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('visualizer').appendChild(renderer.domElement);
  
    // Create high-detail sphere
    const sphereGeometry = new THREE.SphereGeometry(100, 128, 128);
    



    // Store original positions
    const originalPositions = new Float32Array(sphereGeometry.attributes.position.array);
    sphereGeometry.setAttribute(
      'originalPosition',
      new THREE.BufferAttribute(originalPositions, 3)
    );
  
    // Custom shader material
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(colorPicker.value) },
        intensity: { value: 4.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor;
        uniform float time;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float fresnel = pow(1.0 + dot(vNormal, normalize(cameraPosition)), 1.2);
          vec3 color = mix(baseColor * 1.5, vec3(1.0), fresnel * 0.4); 
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
  
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    // adjust camera and renderer on resize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  function initAudio() {
    audio = new Audio();
    audio.src = 'assets/scruz x t.o - HARLEM SHAKE BOOTLEG.wav';
    audio.crossOrigin = 'anonymous';
  
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096; 
    analyser.smoothingTimeConstant = 0.9; 
    analyser.minDecibels = -70; 
    analyser.maxDecibels = -30; 
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  
    // Disconnect any existing connections
    if (audioSource) {
      audioSource.disconnect();
    }
  
    audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
  }

  function animateVisualizer() {
    requestAnimationFrame(animateVisualizer);
  
    sphere.rotation.y += 0.000;
    sphere.rotation.x += 0.000;
  
    baseHue += 2;
    baseHue %= 4;
    const bgColor = new THREE.Color().setHSL(baseHue, 0.5, 0.1);
    scene.background = bgColor;
  
    if (audio && !audio.paused) {
      analyser.getByteFrequencyData(dataArray);
      const positions = sphere.geometry.attributes.position.array;
      const originalPositions = sphere.geometry.attributes.originalPosition.array;
  
      // Frequency ranges optimized for house music
      const subBass = getAverageFrequency(dataArray, 0, 3) * 1.8;     // 20-50Hz
      const bass = getAverageFrequency(dataArray, 3, 8) * 1.6;        // 50-120Hz
      const lowMid = getAverageFrequency(dataArray, 8, 20) * 1.4;     // 120-400Hz
      const mid = getAverageFrequency(dataArray, 20, 50);             // 400-2kHz
      const highMid = getAverageFrequency(dataArray, 50, 100) * 0.8;  // 2k-8kHz
      const high = getAverageFrequency(dataArray, 100, 200) * 0.6;    // 8k-20kHz
  
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = originalPositions[i];
        const originalY = originalPositions[i + 1];
        const originalZ = originalPositions[i + 2];
  
        // Get normalized direction
        const normal = new THREE.Vector3(originalX, originalY, originalZ).normalize();
        
        // Create multi-layered distortion
        const time = Date.now() * 0.001;
        // Timing adjusted for typical house music tempo (125 BPM)
        const bpmSync = time * (125/60) * Math.PI;
        
        // Enhanced scales for house music frequencies
        const subBassScale = (subBass / 255.0) * 45;  // Increased sub-bass impact
        const bassScale = (bass / 255.0) * 35;        // Strong bass presence
        const lowMidScale = (lowMid / 255.0) * 20;    // Punchy mids
        const midScale = (mid / 255.0) * 15;
        const highMidScale = (highMid / 255.0) * 10;
        const highScale = (high / 255.0) * 5;
        
        // optimizing something
        const wave1 = Math.sin(normal.x * 4 + bpmSync) * Math.cos(normal.y * 4 + bpmSync * 0.5);
        const wave2 = Math.sin(normal.z * 3 + bpmSync * 0.75) * Math.cos(normal.x * 3 + bpmSync * 0.25);
        const wave3 = Math.sin(normal.y * 2 + bpmSync * 0.125);
        
        const distortion = 
          subBassScale * wave1 +
          bassScale * wave2 +
          lowMidScale * wave3 +
          midScale * Math.sin(bpmSync) +
          highMidScale * Math.cos(bpmSync * 2) +
          highScale * Math.sin(bpmSync * 4);
  
        positions[i] = originalX + normal.x * distortion;
        positions[i + 1] = originalY + normal.y * distortion;
        positions[i + 2] = originalZ + normal.z * distortion;
      }
  
      sphere.geometry.attributes.position.needsUpdate = true;
  
      // Update shader uniforms
      const totalIntensity = (subBass + bass + lowMid + mid + highMid + high) / (255 * 6);
      sphere.material.uniforms.time.value = Date.now() * 0.001;
      sphere.material.uniforms.intensity.value = totalIntensity;
      sphere.material.uniforms.baseColor.value.setHSL(baseHue, 0.8, 0.5);
  
      updateProgress();
    } else {
      // Reset sphere to original shape when audio is not playing
      const positions = sphere.geometry.attributes.position.array;
      const originalPositions = sphere.geometry.attributes.originalPosition.array;
      positions.set(originalPositions);
      sphere.geometry.attributes.position.needsUpdate = true;
      sphere.material.uniforms.intensity.value = 0;
    }
  
    renderer.render(scene, camera);
  }
  
  // Helper function to get average frequency in a range
  function getAverageFrequency(dataArray, start, end) {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += dataArray[i];
    }
    return sum / (end - start);
  }
  
  // Update color picker handling
  function updateParticleColors() {
    if (!sphere) return;
    const baseColor = new THREE.Color(colorPicker.value);
    const hsl = {};
    baseColor.getHSL(hsl);
    baseHue = hsl.h;
    sphere.material.uniforms.baseColor.value.copy(baseColor);
  }

  function updateProgress() {
    if (audio) {
      const current = audio.currentTime;
      const duration = audio.duration;

      if (!isNaN(duration)) {
        progressSlider.value = (current / duration) * 100;
        currentTime.textContent = formatTime(current);
        totalTime.textContent = formatTime(duration);
      }
    }
  }

  function setupAudio(file) {
    if (file) {
      // load new audio file
      const reader = new FileReader();
      reader.onload = (e) => {
        // Disconnect old audio source if it exists
        if (audioSource) {
          audioSource.disconnect();
        }
        
        audio.src = e.target.result;
        audio.load();
        
        // Reconnect the audio nodes
        audioSource = audioContext.createMediaElementSource(audio);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);

        audio.onloadedmetadata = () => {
          totalTime.textContent = formatTime(audio.duration);
          songTitle.textContent = file.name;
        };
      };

      reader.readAsDataURL(file);
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  }
});


