import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

window.addEventListener('DOMContentLoaded', () => {
  // here's all the dom elements we need
  const settingsModal = document.getElementById('settings-modal');
  const settingsBtn = document.getElementById('settings-btn');
  const colorPicker = document.getElementById('color-picker');
  const bgColorPicker = document.getElementById('bg-color-picker');
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
  const cycleBtn = document.querySelector('.cycle-btn');
  const nowPlaying = document.querySelector('.now-playing');


  const uiElements = [
    settingsBtn, uploadBtn, playBtn, volumeBtn, playlistBtn, cycleBtn, songTitle, nowPlaying, currentTime, totalTime
  ];

  // variables for three.js stuff and audio
  let scene, camera, renderer, sphere, particlesMaterial, audioContext, analyser, dataArray, audioSource, audio;
  const ORIGINAL_COLOR = new THREE.Color(0x0000FF); // blue
  let ORIGINAL_BG_COLOR = new THREE.Color(0xFFFFFF); // white
  let composer;
  let bloomPass;

  let userSelectedColor = new THREE.Color(0x0000FF); // Default blue
  let isUsingCustomColor = false;

  let isColorCycling = false; // initially, the colours will not cycle, maybe I should change this so that it cycles by default?
  let baseHue = 0.5;
  let bgHueOffset = 0.5;
  let isAudioConnected = false; 
  let isAudioSourceConnected = false;

  // Add these variables with other state variables
  let currentColor = new THREE.Color(0x0000FF);
  let targetColor = new THREE.Color(0x0000FF);
  let colorLerpFactor = 0.1; // Adjust for smoother/faster transitions
  let bassThreshold = 200; // Adjust based on your audio analysis

  // Add these near other state variables at the top of the file
  let previousPositions = null;
  let transitionProgress = 0;
  const TRANSITION_SPEED = 0.02;

  // initialize the scene and audio
  initScene();
  initAudio();
  animateVisualizer(); // start the rendering loop immediately
  setupAudio(null); // set default audio

  settingsBtn.addEventListener('click', () => {
    if (settingsModal.classList.contains('opacity-0')) {
      // show modal
      settingsModal.classList.remove('opacity-0', 'pointer-events-none');
      settingsModal.classList.add('opacity-100');
    } else {
      // hide modal
      settingsModal.classList.remove('opacity-100');
      settingsModal.classList.add('opacity-0', 'pointer-events-none');
    }
  });
  cycleBtn.addEventListener('click', () => {
    isColorCycling = !isColorCycling;
    cycleBtn.classList.toggle('text-green-400');
    
    // resetting to the original colours when the user stops the color cycling
    if (!isColorCycling) {
      baseHue = 0.5; 
      sphere.material.uniforms.baseColor.value.copy(ORIGINAL_COLOR);
      scene.background = ORIGINAL_BG_COLOR;
    }
  });

  uploadBtn.addEventListener('click', () => {
    musicUpload.click();
  });



  // users can upload their own files! very cool!
  musicUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      setupAudio(file);
    }
  });



  playBtn.addEventListener('click', async () => {
    // resuming the audio stuff if it's suspended
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


  // update colors when the user changes the color picker
  colorPicker.addEventListener('input', () => {
    updateParticleColors();
    updateBackgroundFromSphere();
  });

  // user can adjust the progress of the song
  progressSlider.addEventListener('input', () => {
    if (audio.duration) {
      const seekTime = (progressSlider.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    }
  });

  // user can adjust the volume
  volumeBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volumeIcon.classList.toggle('fa-volume-up');
    volumeIcon.classList.toggle('fa-volume-mute');
  });

  // user can toggle the playlist
  playlistBtn.addEventListener('click', () => {
    if (playlistPanel.classList.contains('opacity-0')) {
 
      playlistPanel.classList.remove('opacity-0', 'pointer-events-none');
      playlistPanel.classList.add('opacity-100');
    } else {
   
      playlistPanel.classList.remove('opacity-100');
      playlistPanel.classList.add('opacity-0', 'pointer-events-none');
    }
  });



  // the fun stuff 
  function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;
  
    // Add camera constraints
    camera.minDistance = 400;
    camera.maxDistance = 400;
  
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('visualizer').appendChild(renderer.domElement);
  
    // creating a sphere. Not too bad so far.
    const sphereGeometry = new THREE.SphereGeometry(100, 128, 128);
    



    // ok so we have to map out the positions of the vertices of the sphere
    const originalPositions = new Float32Array(sphereGeometry.attributes.position.array);
    sphereGeometry.setAttribute(
      'originalPosition',
      new THREE.BufferAttribute(originalPositions, 3)
    );
  
    // custom shader material, very cool
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0x0000FF) }, // blue
        intensity: { value: 4.0 },
        glowColor: { value: new THREE.Color(1.0, 1.0, 1.0) }, // making it glow
        fresnelPower: { value: 1.2 }, // Adjustable fresnel power
        glowIntensity: { value: 0.15 } // Adjustable glow intensity
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
        uniform vec3 glowColor;
        uniform float time;
        uniform float intensity;
        uniform float fresnelPower;
        uniform float glowIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Smoother fresnel calculation
          float fresnel = pow(1.0 - dot(vNormal, normalize(cameraPosition)), fresnelPower);
          
          // Smooth color mixing
          vec3 finalColor = mix(
            baseColor * (1.0 + intensity * 0.5),
            glowColor,
            fresnel * glowIntensity * (1.0 + intensity * 0.3)
          );
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });
  // the fresnel effect is basically how shiny/reflective the sphere is depending on the angle of the camera, which gives the sphere its shadows and highlights
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere); // adding the sphere to the scene
  
    // Setup post-processing
    composer = new EffectComposer(renderer); // my favourite part, the post-processing
    const renderPass = new RenderPass(scene, camera); 
    composer.addPass(renderPass); 


const bloomPass = new UnrealBloomPass( // bloom just makes it look infinitely times better
  new THREE.Vector2(window.innerWidth, window.innerHeight), 
  0.35,  // strength, this is the intensity of the bloom
  0.8,  // radius, this is the size of the bloom
  0  // threshold, this is the minimum brightness needed for bloom to happen
);
composer.addPass(bloomPass); // adding the bloom pass to the composer
 

    window.addEventListener('resize', onWindowResize); 

    // Add this to initScene after creating sphere
    scene.background = new THREE.Color(0xFFFFFF); // white background
  }

  window.addEventListener('wheel', (event) => {
    event.preventDefault();
  }, { passive: false });

  function onWindowResize() {
    // adjust camera and renderer on resize, for smaller screens
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  }
  function initAudio() { // the audio stuff, snore 
    audio = new Audio();
    audio.src = 'assets/1 Hop This Time V2.mp3';
    audio.crossOrigin = 'anonymous';
  
    audio.addEventListener('canplaythrough', async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
  
      const response = await fetch(audio.src); // fetching the audio file
      const arrayBuffer = await response.arrayBuffer(); // converting the audio file to an array buffer, which is a binary data type
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer); // decoding the audio data into a format that the audio context can understand
  
      // used to have BPM analysis here, but it was too complicated and it ended up doing more harm than good
    });
  
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)(); // compatibility between browsers. I'm pretty sure it's still bugged on safari. :(
    }
  
    analyser = audioContext.createAnalyser(); //the next 5 lines or so are basically how responsive the visualizer is to the audio. 
    analyser.fftSize = 2048; // fftSize is the number of samples used to determine the frequency of the audio
    analyser.smoothingTimeConstant = 0.9; // smoothingTimeConstant is how smooth the audio is, 0.9 is a good balance between smoothness and responsiveness
    analyser.minDecibels = -60;  
    analyser.maxDecibels = -30; 
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  
    // the settings above i can probably change to make the visualizer a little smoother, but i like the way it is now.


  
    if (audioSource) {
      audioSource.disconnect(); // if audio source exist, disconnect it. this is to prevent multiple audio sources from being connected at the same time
    }
  
    audioSource = audioContext.createMediaElementSource(audio); // create a new audio source
    audioSource.connect(analyser); // connect the audio source to the analyser
    analyser.connect(audioContext.destination); // connect the analyser to the audio context destination
  }

  function animateVisualizer() { // alrightttttt here we go
    requestAnimationFrame(animateVisualizer); // this is the main loop that runs the visualizer, without this, all hell would break loose.
  
 
    sphere.rotation.y += 0.001; // rotating the sphere on the y-axis
    sphere.rotation.x += 0.001; // rotating the sphere on the x-axis
  
    // Get positions
    const positions = sphere.geometry.attributes.position.array;
    const originalPositions = sphere.geometry.attributes.originalPosition.array;

    // Initialize previousPositions if needed
    if (!previousPositions) {
      previousPositions = new Float32Array(positions.length);
      previousPositions.set(positions);
    }

    if (audio && !audio.paused) {
      transitionProgress = Math.min(1, transitionProgress + TRANSITION_SPEED);
      // Analyze audio frequency data
      analyser.getByteFrequencyData(dataArray); // getting the frequency data from the audio
      const positions = sphere.geometry.attributes.position.array; // getting the positions of the vertices of the sphere
      const originalPositions = sphere.geometry.attributes.originalPosition.array; // getting the original positions of the vertices of the sphere
      // We're comparing the original positions to the positions of the vertices of the sphere to get the distortion effect
  
      // Process audio frequencies for sphere deformation
      const subBass = getAverageFrequency(dataArray, 0, 3) * 1.8;     // 20-50Hz
      const bass = getAverageFrequency(dataArray, 3, 8) * 1.6;        // 50-120Hz
      const lowMid = getAverageFrequency(dataArray, 8, 20) * 1.4;     // 120-400Hz
      const mid = getAverageFrequency(dataArray, 20, 50);             // 400-2kHz
      const highMid = getAverageFrequency(dataArray, 50, 100) * 0.8;  // 2k-8kHz
      const high = getAverageFrequency(dataArray, 100, 200) * 0.6;    // 8k-20kHz
  
      for (let i = 0; i < positions.length; i += 3) { // iterating through the positions of the vertices of the sphere to get the distortion effect
        const originalX = originalPositions[i]; // getting the original x position of the vertex
        const originalY = originalPositions[i + 1]; // getting the original y position of the vertex
        const originalZ = originalPositions[i + 2]; // getting the original z position of the vertex
  
        // Normalize vertex direction
        const normal = new THREE.Vector3(originalX, originalY, originalZ).normalize(); // normalizing the vertex direction
  
        // Calculate distortion
        const time = Date.now() * 0.001; // getting the current time. At the time this comment was written, it was 10:22PM.
        const bpmSync = time * (125 / 60) * Math.PI; // syncing the distortion to the BPM of the song. 125 BPM is a good balance between speed and distortion. Especially for house songs.
  
        const subBassScale = (subBass / 255.0) * 45; // scaling the sub bass
        const bassScale = (bass / 255.0) * 35; // scaling the bass
        const lowMidScale = (lowMid / 255.0) * 20; // scaling the low mid
        const midScale = (mid / 255.0) * 15; // scaling the mid
        const highMidScale = (highMid / 255.0) * 10; // scaling the high mid
        const highScale = (high / 255.0) * 5;    // scaling the high

        // The reason we scale the frequencies is to make the distortion effect more pronounced.
  
        const wave1 = Math.sin(normal.x * 4 + bpmSync) * Math.cos(normal.y * 4 + bpmSync * 0.5); // creating a wave effect
        const wave2 = Math.sin(normal.z * 3 + bpmSync * 0.75) * Math.cos(normal.x * 3 + bpmSync * 0.25); // creating another wave effect
        const wave3 = Math.sin(normal.y * 2 + bpmSync * 0.125); // creating yet another wave effect
  
        const distortion =
          subBassScale * wave1 + // combining the waves to create the distortion effect
          bassScale * wave2 + 
          lowMidScale * wave3 +  
          midScale * Math.sin(bpmSync) +
          highMidScale * Math.cos(bpmSync * 2) +
          highScale * Math.sin(bpmSync * 4);
  
        
        positions[i] = originalX + normal.x * distortion; // applying the distortion to the x position of the vertex
        positions[i + 1] = originalY + normal.y * distortion; // applying the distortion to the y position of the vertex
        positions[i + 2] = originalZ + normal.z * distortion; // applying the distortion to the z position of the vertex
      }
  
      sphere.geometry.attributes.position.needsUpdate = true; // updating the positions of the vertices of the sphere
  
   
      const totalIntensity = (subBass + bass + lowMid + mid + highMid + high) / (255 * 6); // calculating the total intensity of the audio
      sphere.material.uniforms.time.value = Date.now() * 0.001; // updating the time uniform of the shader
      sphere.material.uniforms.intensity.value = totalIntensity; // updating the intensity uniform of the shader
  
      updateProgress(); 

      // Get bass average
      const bassAverage = getAverageFrequency(dataArray, 0, 8);
      
      // Adjust color transition speed based on bass intensity
      colorLerpFactor = THREE.MathUtils.lerp(
        0.1, // minimum smoothing
        0.01, // maximum smoothing (slower transitions)
        Math.min(bassAverage / bassThreshold, 1.0)
      );

      // Store current positions for transition
      previousPositions.set(positions);
    } else {
      // Transition to idle state
      transitionProgress = Math.max(0, transitionProgress - TRANSITION_SPEED);
      
      const time = Date.now() * 0.001;
      
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = originalPositions[i];
        const originalY = originalPositions[i + 1];
        const originalZ = originalPositions[i + 2];

        // Create gentle wave motion
        const normal = new THREE.Vector3(originalX, originalY, originalZ).normalize();
        const amplitude = 2; // Adjust this for more/less movement
        
        const idleDistortion = 
          Math.sin(normal.x * 2 + time) * 
          Math.cos(normal.y * 2 + time * 0.5) * 
          amplitude;

        // Interpolate between previous active state and new idle state
        positions[i] = THREE.MathUtils.lerp(
          previousPositions[i],
          originalX + normal.x * idleDistortion,
          1 - transitionProgress
        );
        positions[i + 1] = THREE.MathUtils.lerp(
          previousPositions[i + 1],
          originalY + normal.y * idleDistortion,
          1 - transitionProgress
        );
        positions[i + 2] = THREE.MathUtils.lerp(
          previousPositions[i + 2],
          originalZ + normal.z * idleDistortion,
          1 - transitionProgress
        );
      }

      sphere.geometry.attributes.position.needsUpdate = true;
      sphere.material.uniforms.intensity.value = THREE.MathUtils.lerp(
        sphere.material.uniforms.intensity.value,
        0,
        0.1
      );
    }
  
    // Render the scene
    composer.render(); 
  }
  

  // get average frequency from dataArray
  function getAverageFrequency(dataArray, start, end) {
    let sum = 0; 
    for (let i = start; i < end; i++) {
      sum += dataArray[i];
    }
    return sum / (end - start);
  } // this function is used to get the average frequency of the audio. It's used to scale the distortion effect.
  // So for genres with lower bass, the distortion effect will be less pronounced, and for genres with higher bass, the distortion effect will be more pronounced.
  // this is the coolest part of the code, in my opinion. I've tested the visualizer with house songs, country songs, etc. and it works really well with all of them.
  

  function animate() {  
  requestAnimationFrame(animate); 

  // update visualizer effects here
  composer.render();
}



  // update color picker handling
  function updateParticleColors() { 
    if (!sphere) { 
      console.error('Sphere not initialized'); // this is a fail-safe in case the sphere isn't initialized
      return; 
    }
  
    try {
      const color = new THREE.Color(colorPicker.value); // getting the color from the color picker
      const hsl = {}; 
      color.getHSL(hsl); // getting the hue, saturation, and lightness of the color
      baseHue = hsl.h; // setting the base hue to the hue of the color
      sphere.material.uniforms.baseColor.value.copy(color); // copying the color to the base color uniform of the shader
      userSelectedColor = color;
      isUsingCustomColor = true;
      
      // Create a lighter version of the color for UI elements
      const uiColor = new THREE.Color(colorPicker.value);
      const uiHSL = {};
      uiColor.getHSL(uiHSL);
      uiColor.setHSL(uiHSL.h, uiHSL.s, Math.min(0.8, uiHSL.l + 0.3)); // Make it lighter by increasing lightness
      
      // Update UI icons color with the lighter version
      uiElements.forEach(element => {
        element.style.color = '#' + uiColor.getHexString();
      });
    } catch (error) {
      console.error('Error updating particle colors:', error); // incase there's an error updating the particle colors, god forbid.
    }
  }

  function updateProgress() {  // this function is used to update the progress of the song
    if (audio) {  // if the audio exists
      const current = audio.currentTime;  // get the current time of the audio
      const duration = audio.duration; // get the duration of the audio

      if (!isNaN(duration)) { // if the duration is not a number
        progressSlider.value = (current / duration) * 100; // set the value of the progress slider to the current time divided by the duration of the audio
        currentTime.textContent = formatTime(current); // set the current time text content to the current time of the audio
        totalTime.textContent = formatTime(duration); // set the total time text content to the duration of the audio
      }
    }
  }

  function disconnectExistingAudio() {
    if (audioSource) {
      audioSource.disconnect();
      audioSource = null;
    }
    isAudioSourceConnected = false;
  }

  function setupAudio(file) { // this function is used to set up the audio
    if (file) { 
      console.log('File selected:', file.name); // Debugging statement

      disconnectExistingAudio();
      
      const reader = new FileReader(); // create a new file reader
      reader.onload = (e) => { // when the file is loaded
        console.log('File loaded:', e.target.result); // Debugging statement

        audio = new Audio();
        audio.src = e.target.result; // set the audio source to the result of the file reader
        audio.load(); // load the audio

        // Only create new source if not already connected
        if (!isAudioSourceConnected) {
          audioSource = audioContext.createMediaElementSource(audio); // create a new audio source
          audioSource.connect(analyser); // connect the audio source to the analyser
          analyser.connect(audioContext.destination); // connect the analyser to the audio context destination
          isAudioSourceConnected = true;
        }

        audio.onloadedmetadata = () => { // when the metadata of the audio is loaded
          console.log('Audio metadata loaded:', audio.duration); // Debugging statement
          totalTime.textContent = formatTime(audio.duration); 
          songTitle.textContent = file.name; // set the song title to the name of the file
        };

        audio.onplay = () => {
          console.log('Audio is playing'); // Debugging statement
        };

        audio.onpause = () => {
          console.log('Audio is paused'); // Debugging statement
        };

        audio.onerror = (e) => {
          console.error('Audio error:', e); // Debugging statement
        };
      };

      reader.readAsDataURL(file); // read the data of the file
    }
  }

  function formatTime(seconds) { // this function is used to format the time of the audio
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  }




// The Playlist function.

  const playlistItems = document.querySelectorAll('#playlist-items li'); // getting all the playlist items
  playlistItems.forEach(item => { // iterating through the playlist items
    item.addEventListener('click', async () => {
      const songSrc = item.getAttribute('data-song');
    
      if (audioSource && isAudioConnected) { // if the audio source exists and is connected
        audioSource.disconnect(); // disconnect the audio source
        isAudioConnected = false; // set isAudioConnected to false to prevent multiple audio sources from being connected at the same time
      }  
      audio.src = songSrc; // set the audio source to the song source
      songTitle.textContent = item.textContent.trim(); // set the song title to the text content of the playlist item
      try {

        if (audioContext.state === 'suspended') { // if the audio context is suspended
          await audioContext.resume(); // resume the audio context
        }
        if (!isAudioConnected) {   // if the audio is not connected
          audioSource = audioContext.createMediaElementSource(audio); // create a new audio source
          audioSource.connect(analyser); // connect the audio source to the analyser
          analyser.connect(audioContext.destination); // connect the analyser to the audio context destination
          isAudioConnected = true; // set isAudioConnected to true
        }   
        await audio.play(); // play the audio
        playIcon.classList.remove('fa-play'); // remove the play icon
        playIcon.classList.add('fa-pause'); // add the pause icon 
        
      } catch (error) {
        console.error('Error playing audio:', error);  // if there's an error playing the audio, log an error to the console
      }
    });
  });

  function updateBackgroundColor() {
    if (!scene) {
      console.error('Scene not initialized');
      return;
    }

    try {
      const color = new THREE.Color(bgColorPicker.value);
      scene.background = color;
      ORIGINAL_BG_COLOR = color; // Update original background color
    } catch (error) {
      console.error('Error updating background color:', error);
    }
  }

  bgColorPicker.addEventListener('input', updateBackgroundColor);

  // Set initial UI colors
  const initialColor = new THREE.Color(colorPicker.value);
  updateUIColors(initialColor);
});

// Add function to update UI colors
function updateUIColors(color) {
  const hexColor = '#' + color.getHexString();
  
  // Update text elements
  uiElements.text.forEach(element => {
    element.style.color = color.getHSL(hsl);
  });
  
  // Update icons
  uiElements.icons.forEach(icon => {
    icon.style.color = color.getHSL(hsl);
  });
}