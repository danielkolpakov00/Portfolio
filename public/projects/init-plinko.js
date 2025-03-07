// This script initializes the Plinko game and adds it to the portfolio

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create a reference to the main script
  const mainScript = document.createElement('script');
  mainScript.src = 'mplinko.js';
  mainScript.onload = function() {
    // Once the script is loaded, we can initialize the game
    if (typeof setupGame === 'function') {
      // Call the setup function defined in mplinko.js
      setupGame();
      
      // After setup, do any additional initialization
      console.log('Plinko game initialized successfully');
      
      // You could trigger an initial animation or display a welcome message here
      const gameContainer = document.getElementById('game-container');
      
      // Create a welcome overlay if needed
      const welcomeOverlay = document.createElement('div');
      welcomeOverlay.className = 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10';
      welcomeOverlay.innerHTML = `
        <div class="text-center p-6">
          <h2 class="text-2xl font-bold text-light mb-4">Plinko Game</h2>
          <p class="mb-4 text-light">Click anywhere to start</p>
        </div>
      `;
      
      gameContainer.appendChild(welcomeOverlay);
      
      // Remove overlay on click
      welcomeOverlay.addEventListener('click', function() {
        welcomeOverlay.classList.add('fade-out');
        setTimeout(() => {
          welcomeOverlay.remove();
        }, 500);
      });
    } else {
      console.error('Game setup function not found');
    }
  };
  
  // Add script to document
  document.body.appendChild(mainScript);
  
  // Add a class to handle responsive design
  document.body.classList.add('plinko-game-active');
});

// Helper function to handle responsive calculations
function getResponsiveSize(baseSize) {
  // Get viewport width
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  // Scale based on viewport width
  if (vw < 640) {  // Small screens
    return baseSize * 0.7;
  } else if (vw < 1024) {  // Medium screens
    return baseSize * 0.85;
  } else {  // Large screens
    return baseSize;
  }
}

// Add this to window for access from the main script
window.getResponsiveSize = getResponsiveSize;
