// Matter.js module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Events = Matter.Events,
      Composite = Matter.Composite;

// Global variables
let engine, render, world;
let multipliers = [];
let statistics = [];
let totalHits = 0;
let totalBets = 0;
let showPath = false;
let autoPlayInterval = null;

// Game dimensions
const canvasWidth = 800;
const canvasHeight = 800;
const pegRadius = 6;
const ballRadius = 12;
const pegSpacingX = 60;
const pegSpacingY = 60;
const pegRows = 10;
const pegColumns = 11; // Must be odd for proper alignment
const pegOffsetX = (canvasWidth - (pegColumns - 1) * pegSpacingX) / 2;
const pegOffsetY = 120;
const zoneWidth = pegSpacingX;
const zoneHeight = 40;

// Create multipliers evenly distributed
const multiplierValues = [1, 2, 0.5, 4, 0.2, 8, 0.2, 4, 0.5, 2, 1];
const numberOfZones = multiplierValues.length;

// Set up Matter.js engine
function setupGame() {
    // Create engine and world
    engine = Engine.create({
        enableSleeping: true // Enable sleeping for better performance
    });
    world = engine.world;
    engine.gravity.y = 0.5; // Adjust gravity for better ball movement

    // Create renderer with black background
    render = Render.create({
        element: document.getElementById('game-container'),
        engine: engine,
        options: {
            width: canvasWidth,
            height: canvasHeight,
            wireframes: false,
            background: '#000000',
            showSleeping: false,
            showDebug: false,
        }
    });

    // Create pegs in a triangular pattern
    createPegs();
    
    // Create walls
    createWalls();
    
    // Create multiplier zones
    createMultiplierZones();

    // Start the engine and renderer
    Render.run(render);
    
    // Run the engine at fixed timestep for better physics simulation
    let lastTime = performance.now();
    const fixedTimeStep = 1000 / 60; // 60 FPS
    
    function gameLoop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime > fixedTimeStep) {
            Engine.update(engine, fixedTimeStep);
            lastTime = currentTime;
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();

    // Initialize statistics tracking
    initializeStatistics();
    
    // Setup event listeners
    setupEventListeners();
}

// Create pegs in an offset grid pattern
function createPegs() {
    for (let row = 0; row < pegRows; row++) {
        // Offset every other row
        const offset = row % 2 === 0 ? 0 : pegSpacingX / 2;
        const cols = row % 2 === 0 ? pegColumns : pegColumns - 1;
        
        for (let col = 0; col < cols; col++) {
            const x = pegOffsetX + col * pegSpacingX + offset;
            const y = pegOffsetY + row * pegSpacingY;
            
            const peg = Bodies.circle(x, y, pegRadius, {
                isStatic: true,
                restitution: 0.5,
                friction: 0.05,
                render: {
                    fillStyle: '#FFFFFF'
                },
                collisionFilter: {
                    category: 0x0002,
                    mask: 0x0001 // Only collide with balls
                }
            });
            
            World.add(world, peg);
        }
    }
}

// Create walls to contain the balls
function createWalls() {
    // Left wall
    const leftWall = Bodies.rectangle(0, canvasHeight / 2, 2, canvasHeight, {
        isStatic: true,
        render: { fillStyle: '#333333' }
    });
    
    // Right wall
    const rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2, 2, canvasHeight, {
        isStatic: true,
        render: { fillStyle: '#333333' }
    });
    
    // Top wall (invisible, just to bounce balls back if they go too high)
    const topWall = Bodies.rectangle(canvasWidth / 2, -50, canvasWidth, 100, {
        isStatic: true,
        render: { fillStyle: '#000000' }
    });
    
    World.add(world, [leftWall, rightWall, topWall]);
}

// Create multiplier zones at the bottom
function createMultiplierZones() {
    const zoneY = canvasHeight - zoneHeight / 2 - 20; // Position zones at the bottom
    const zoneWidth = canvasWidth / numberOfZones;
    
    // Create multiplier labels in the DOM
    const multiplierLabelsContainer = document.getElementById('multiplier-labels');
    multiplierLabelsContainer.innerHTML = ''; // Clear any existing labels
    
    for (let i = 0; i < numberOfZones; i++) {
        const x = i * zoneWidth + zoneWidth / 2;
        const multiplier = multiplierValues[i];
        
        // Create a physics body for the zone
        const zone = Bodies.rectangle(x, zoneY, zoneWidth - 2, zoneHeight, {
            isStatic: true,
            label: `Zone-${i}`,
            render: {
                fillStyle: 'transparent', // Make zones invisible
                lineWidth: 0
            },
            collisionFilter: {
                category: 0x0004,
                mask: 0x0001 // Only collide with balls
            }
        });
        
        // Store zone information for later use
        const zoneInfo = {
            id: i,
            x: x,
            multiplier: multiplier,
            probability: 1 / numberOfZones, // Equal probability for each zone by default
            body: zone
        };
        
        multipliers.push(zoneInfo);
        World.add(world, zone);
        
        // Create label in the DOM
        const labelElement = document.createElement('div');
        labelElement.className = 'multiplier-label';
        labelElement.id = `zone-label-${i}`;
        labelElement.textContent = `${multiplier}x`;
        
        // Store reference to the label element
        zone.labelElement = labelElement;
        
        multiplierLabelsContainer.appendChild(labelElement);
    }
}

// Initialize statistics tracking
function initializeStatistics() {
    statistics = multipliers.map(zone => ({
        id: zone.id,
        multiplier: zone.multiplier,
        hits: 0,
        percentage: 0
    }));
}

// Setup event listeners for UI controls
function setupEventListeners() {
    // Tab switcher for manual/auto modes
    document.getElementById('manual-tab').addEventListener('click', () => switchTab('manual'));
    document.getElementById('auto-tab').addEventListener('click', () => switchTab('auto'));
    
    // Manual betting
    document.getElementById('manual-bet-button').addEventListener('click', () => {
        const betAmount = parseInt(document.getElementById('bet').value) || 10;
        // Deduct the bet amount from the balance
        updateBalance(-betAmount);
        // Drop a ball with the bet amount
        dropBall(betAmount);
    });
    
    // Half/Double buttons for manual mode
    document.getElementById('half-button').addEventListener('click', () => adjustBet(0.5, 'manual'));
    document.getElementById('double-button').addEventListener('click', () => adjustBet(2, 'manual'));
    
    // Half/Double buttons for auto mode
    document.getElementById('auto-half-button').addEventListener('click', () => adjustBet(0.5, 'auto'));
    document.getElementById('auto-double-button').addEventListener('click', () => adjustBet(2, 'auto'));
    
    // Drop multiple balls button
    document.getElementById('drop-balls-btn').addEventListener('click', () => {
        const betAmount = parseInt(document.getElementById('bet').value) || 10;
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                updateBalance(-betAmount);
                dropBall(betAmount);
            }, i * 200);
        }
    });
    
    // Auto betting
    document.getElementById('autobet-btn').addEventListener('click', toggleAutoBet);
    
    // Show path toggle
    document.getElementById('show-paths').addEventListener('change', (e) => {
        showPath = e.target.checked;
    });
    
    // Reset statistics button
    document.getElementById('reset-stats').addEventListener('click', () => {
        statistics.forEach(stat => {
            stat.hits = 0;
            stat.percentage = 0;
        });
        totalHits = 0;
        totalBets = 0;
        document.getElementById('bet-counter').textContent = `Total Balls: ${totalBets}`;
        updateStatisticsPanel();
    });
    
    // Update bet display when input changes
    document.getElementById('bet').addEventListener('input', updateBetDisplay);
    document.getElementById('auto-bet').addEventListener('input', updateAutoBetDisplay);
    
    // Update range input background as it slides
    document.getElementById('auto-speed').addEventListener('input', updateRangeBackground);
}

// Toggle auto bet on/off
function toggleAutoBet() {
    const button = document.getElementById('autobet-btn');
    
    if (autoPlayInterval) {
        // Stop auto betting
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        button.textContent = 'Start Auto Drop';
        button.classList.remove('bg-light');
        button.classList.add('bg-accent');
    } else {
        // Start auto betting
        const betAmount = parseInt(document.getElementById('auto-bet').value) || 10;
        const speed = parseInt(document.getElementById('auto-speed').value);
        const ballCount = parseInt(document.getElementById('ball-count').value);
        const interval = 1100 - (speed * 100); // Convert 1-10 scale to milliseconds
        
        let droppedCount = 0;
        
        button.textContent = 'Stop Auto Drop';
        button.classList.remove('bg-accent');
        button.classList.add('bg-light');
        
        autoPlayInterval = setInterval(() => {
            if (droppedCount >= ballCount) {
                toggleAutoBet(); // Stop after reaching the desired count
                return;
            }
            
            const balance = parseFloat(document.getElementById('bal').textContent);
            if (balance >= betAmount) {
                updateBalance(-betAmount);
                dropBall(betAmount);
                droppedCount++;
            } else {
                toggleAutoBet(); // Stop if insufficient balance
                alert('Insufficient balance to continue auto drop');
            }
        }, interval);
    }
}

// Switch between manual and auto tabs
function switchTab(tabName) {
    const manualTab = document.getElementById('manual-tab');
    const autoTab = document.getElementById('auto-tab');
    const manualContent = document.getElementById('manual-content');
    const autoContent = document.getElementById('auto-content');
    
    if (tabName === 'manual') {
        manualTab.className = 'tab-button w-1/2 bg-accent text-black py-2 px-4 rounded-full transition-colors font-medium';
        autoTab.className = 'tab-button w-1/2 text-accent py-2 px-4 rounded-full transition-colors font-medium';
        manualContent.classList.remove('hidden');
        autoContent.classList.add('hidden');
    } else {
        autoTab.className = 'tab-button w-1/2 bg-accent text-black py-2 px-4 rounded-full transition-colors font-medium';
        manualTab.className = 'tab-button w-1/2 text-accent py-2 px-4 rounded-full transition-colors font-medium';
        autoContent.classList.remove('hidden');
        manualContent.classList.add('hidden');
    }
}

// Adjust bet amount (half or double)
function adjustBet(factor, mode) {
    const inputId = mode === 'manual' ? 'bet' : 'auto-bet';
    const input = document.getElementById(inputId);
    let value = parseInt(input.value) || 10;
    value = Math.min(Math.max(Math.round(value * factor), 1), 1000);
    input.value = value;
    
    if (mode === 'manual') {
        updateBetDisplay();
    } else {
        updateAutoBetDisplay();
    }
}

// Update the manual bet display
function updateBetDisplay() {
    const betInput = document.getElementById('bet');
    const betDisplay = document.getElementById('manual-bet-display');
    let bet = parseInt(betInput.value) || 0;
    bet = Math.min(Math.max(bet, 1), 1000);
    betInput.value = bet;
    betDisplay.textContent = `${bet} credits`;
}

// Update the auto bet display
function updateAutoBetDisplay() {
    const betInput = document.getElementById('auto-bet');
    const betDisplay = document.getElementById('auto-bet-display');
    let bet = parseInt(betInput.value) || 0;
    bet = Math.min(Math.max(bet, 1), 1000);
    betInput.value = bet;
    betDisplay.textContent = `${bet} credits`;
}

// Function to update balance
function updateBalance(amount) {
    let balance = parseFloat(document.getElementById('bal').textContent) || 0;
    balance += amount;
    document.getElementById('bal').textContent = Math.max(0, balance).toFixed(0);
}

// Function to drop multiple balls
function dropBalls() {
    for (let i = 0; i < 1000; i++) {
        dropBall();
    }
}

// Function to select target zone based on probabilities
function selectTargetZone() {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (let i = 0; i < multipliers.length; i++) {
        cumulativeProbability += multipliers[i].probability;
        if (rand < cumulativeProbability) {
            return multipliers[i];
        }
    }
    // In case of rounding errors, return the last zone
    return multipliers[multipliers.length - 1];
}

// Steering mechanism to guide the ball towards the target zone
Events.on(engine, 'beforeUpdate', function () {
    Composite.allBodies(world).forEach(body => {
        if (body.label === 'Ball' && body.targetX !== undefined) {
            // Apply steering force to guide the ball
            const steeringForce = 0.00005; // Adjust this value to control steering strength
            const maxSteeringDistance = 300; // Start steering when within this distance from the target

            const distanceToTarget = body.position.y;
            if (distanceToTarget > pegSpacingY && distanceToTarget < canvasHeight) {
                const distanceX = body.targetX - body.position.x;
                const distanceY = canvasHeight - body.position.y;

                const steeringX = (distanceX / distanceY) * steeringForce;
                Body.applyForce(body, body.position, { x: steeringX, y: 0 });
            }

            // Record the ball's position for path drawing
            if (showPath) {
                body.pathPoints = body.pathPoints || [];
                body.pathPoints.push({ x: body.position.x, y: body.position.y });
            }
        }
    });
});

// Render event to draw the path line
Events.on(render, 'afterRender', function () {
    if (showPath) {
        const context = render.context;
        context.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Opaque red color
        context.lineWidth = 2;

        // Iterate over all balls to draw their paths
        Composite.allBodies(world).forEach(body => {
            if (body.label === 'Ball' && body.pathPoints && body.pathPoints.length > 0) {
                context.beginPath();
                context.moveTo(body.pathPoints[0].x, body.pathPoints[0].y);

                for (let i = 1; i < body.pathPoints.length; i++) {
                    context.lineTo(body.pathPoints[i].x, body.pathPoints[i].y);
                }

                context.stroke();
            }
        });
    }
});

// Handle collision and determine winnings
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
        const ball = bodyA.label === 'Ball' ? bodyA : bodyB.label === 'Ball' ? bodyB : null;
        const zone = bodyA.label && bodyA.label.startsWith('Zone-') ? bodyA : bodyB.label && bodyB.label.startsWith('Zone-') ? bodyB : null;

        if (ball && zone) {
            const zoneId = ball.targetZoneId; // Use the ball's predetermined target zone
            const matchedMultiplier = multipliers.find(z => z.id == zoneId).multiplier;
            const bet = ball.betAmount; // Use the bet amount stored in the ball
            const winnings = bet * matchedMultiplier;
            updateBalance(winnings); // Update the balance with the calculated winnings

            // Update statistics for the zone
            updateStatistics(zoneId);

            // Bounce animation for the zone and the corresponding label
            const targetZone = multipliers.find(z => z.id == zoneId);
            if (targetZone && !zone.bouncing) {
                zone.bouncing = true;
                const initialY = zone.position.y;
                const bounceDistance = 20;
                const bounceDuration = 300;

                let startTime = null;

                function animateBounce(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const elapsed = timestamp - startTime;
                    const progress = elapsed / bounceDuration;
                    const easedProgress = Math.sin(progress * Math.PI);

                    const newY = initialY + bounceDistance * easedProgress;
                    Body.setPosition(zone, { x: zone.position.x, y: newY });

                    // Bounce the corresponding label
                    const labelElement = zone.labelElement;
                    if (labelElement) {
                        labelElement.style.top = `${520 + bounceDistance * easedProgress}px`;
                    }

                    if (elapsed < bounceDuration) {
                        requestAnimationFrame(animateBounce);
                    } else {
                        Body.setPosition(zone, { x: zone.position.x, y: initialY });
                        if (labelElement) {
                            labelElement.style.top = '520px'; // Reset label position
                        }
                        zone.bouncing = false;
                    }
                }

                requestAnimationFrame(animateBounce);
            }

            // Remove the ball after processing
            setTimeout(() => {
                Composite.remove(world, ball);
            }, 1);
        }
    });
});

// Function to update statistics when a ball hits a zone
function updateStatistics(zoneId) {
    const zoneStat = statistics.find(stat => stat.id == zoneId);
    if (zoneStat) {
        zoneStat.hits += 1; // Increment the hit count for the specific zone
        totalHits += 1; // Increment total hits

        updateStatisticsPanel(); // Refresh the statistics panel
    }
}

// Function to update statistics panel
function updateStatisticsPanel() {
    const statsBody = document.getElementById('stats-body');
    statsBody.innerHTML = ''; // Clear current rows

    if (totalHits > 0) {
        statistics.forEach(stat => {
            stat.percentage = (stat.hits / totalHits) * 100; // Calculate actual percentage

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-left">${stat.multiplier}x</td>
                <td class="text-right">${stat.hits}</td>
                <td class="text-right">${stat.percentage.toFixed(2)}%</td>
            `;
            statsBody.appendChild(row);
        });
    }
}

// Modified dropBall function to accept betAmount
function dropBall(betAmount) {
    totalBets++;
    const targetZone = selectTargetZone();

    // Random X position between minX and maxX
    const minX = 350;
    const maxX = 450;
    const randomXPosition = Math.random() * (maxX - minX) + minX;
    const initialYPosition = pegSpacingY / 2; // Slightly above the first row of pegs

    const ball = Bodies.circle(randomXPosition, initialYPosition, ballRadius, {
        restitution: 0.5,
        friction: 0.005,
        density: 0.5,
        label: 'Ball',
        render: { fillStyle: '#ff5733' },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 | 0x0004 // Collide with walls, zones, and pegs
        }
    });
    ball.targetX = targetZone.x;       // Store the target x-position
    ball.targetZoneId = targetZone.id; // Store the target zone id
    ball.betAmount = betAmount;        // Store the bet amount with the ball

    // Initialize path points for this ball
    ball.pathPoints = [];

    document.getElementById('bet-counter').textContent = `Total Bets: ${totalBets}`;
    Composite.add(world, ball);
}

// Update bet display functions
document.getElementById('bet').addEventListener('input', () => {
    const betInput = document.getElementById('bet');
    const betDisplay = document.getElementById('manual-bet-display');
    let bet = parseFloat(betInput.value) || 0;
    // Clamp bet value between 1 and 100
    bet = Math.min(Math.max(bet, 1), 100);
    betInput.value = bet;
    betDisplay.textContent = `${bet} credits`;
});

// Update auto bet display
document.getElementById('auto-bet').addEventListener('input', () => {
    const betInput = document.getElementById('auto-bet');
    const betDisplay = document.getElementById('auto-bet-display');
    let bet = parseFloat(betInput.value) || 0;
    bet = Math.min(Math.max(bet, 1), 100);
    betInput.value = bet;
    betDisplay.textContent = `${bet} credits`;
});

// Update the range input background as it slides
function updateRangeBackground(e) {
  const value = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
  e.target.style.backgroundImage = `linear-gradient(to right, #aaaaaa 0%, #aaaaaa ${value}%, #333 ${value}%, #333 100%)`;
}

// Show winning notification
function showWinNotification(amount) {
  const notification = document.getElementById('win-notification');
  const winAmount = document.getElementById('win-amount');
  
  // Only show for significant wins (multiplier > 1)
  if (amount <= 0) return;
  
  winAmount.textContent = `+${amount} credits`;
  notification.classList.remove('hidden');
  
  // Use setTimeout to ensure the DOM has updated before adding the show class
  setTimeout(() => {
    notification.classList.add('win-show');
    
    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('win-show');
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 300);
    }, 3000);
  }, 10);
}

// Update the total plays counter
function updatePlaysCounter() {
  const plays = document.getElementById('total-plays');
  plays.textContent = (parseInt(plays.textContent) + 1).toString();
}

// Handle highlighting of multiplier zone when ball hits it
function highlightZone(zoneId) {
  // Remove highlight from all labels
  const labels = document.querySelectorAll('.multiplier-label');
  labels.forEach(label => label.classList.remove('multiplier-label-active'));
  
  // Add highlight to the hit zone
  const hitLabel = document.getElementById(`zone-label-${zoneId}`);
  if (hitLabel) {
    hitLabel.classList.add('multiplier-label-active');
    
    // Remove highlight after animation completes
    setTimeout(() => {
      hitLabel.classList.remove('multiplier-label-active');
    }, 800);
  }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
  setupGame();
  
  // Set initial range background
  const speedRange = document.getElementById('auto-speed');
  const value = (speedRange.value - speedRange.min) / (speedRange.max - speedRange.min) * 100;
  speedRange.style.backgroundImage = `linear-gradient(to right, #aaaaaa 0%, #aaaaaa ${value}%, #333 ${value}%, #333 100%)`;
  
  // Update bet counter text to be "Total Balls" instead of "Total Bets"
  document.getElementById('bet-counter').textContent = 'Total Balls: 0';
});

// Modify the existing collision handler to include the highlighting and notification
Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(({ bodyA, bodyB }) => {
    const ball = bodyA.label === 'Ball' ? bodyA : bodyB.label === 'Ball' ? bodyB : null;
    const zone = bodyA.label && bodyA.label.startsWith('Zone-') ? bodyA : bodyB.label && bodyB.label.startsWith('Zone-') ? bodyB : null;

    if (ball && zone) {
      const zoneId = parseInt(zone.label.split('-')[1]);
      const matchedMultiplier = multipliers.find(z => z.id == zoneId).multiplier;
      const bet = ball.betAmount || 10; // Use the bet amount stored in the ball or default to 10
      const winnings = bet * matchedMultiplier;
      
      // Update balance
      updateBalance(winnings);
      
      // Show win notification for significant wins
      if (matchedMultiplier > 1) {
        showWinNotification(winnings);
      }
      
      // Highlight the zone that was hit
      highlightZone(zoneId);
      
      // Update statistics
      updateStatistics(zoneId);
      
      // Update plays counter
      updatePlaysCounter();
      
      // Animate the zone
      const targetZone = multipliers.find(z => z.id == zoneId);
      if (targetZone && !zone.bouncing) {
        // ...existing bounce animation code...
      }

      // Remove the ball after a short delay
      setTimeout(() => {
        Composite.remove(world, ball);
      }, 300); // Longer delay to see the ball hit
    }
  });
});

// Modify dropBall to create white balls with better physics settings
function dropBall(betAmount = 10) {
  totalBets++;
  const targetZone = selectTargetZone();

  // Drop from a random position near the center top
  const dropWidth = 200;
  const centerX = canvasWidth / 2;
  const randomXPosition = centerX - (dropWidth / 2) + Math.random() * dropWidth;
  const initialYPosition = pegSpacingY / 2;

  const ball = Bodies.circle(randomXPosition, initialYPosition, ballRadius, {
    restitution: 0.7, // More bounce
    friction: 0.001, // Less friction for smoother movement
    density: 0.8, // Adjusted for better physics feel
    label: 'Ball',
    render: { 
      fillStyle: '#FFFFFF', // White ball
      strokeStyle: '#AAAAAA', // Light gray outline
      lineWidth: 1
    },
    collisionFilter: {
      category: 0x0001,
      mask: 0x0002 | 0x0004 // Collide with walls, zones, and pegs
    }
  });
  
  // Store data with the ball
  ball.targetX = targetZone.x; // For steering
  ball.targetZoneId = targetZone.id; // Track which zone we're targeting
  ball.betAmount = betAmount; // Store bet amount with the ball
  ball.pathPoints = []; // For path drawing
  
  // Update UI
  document.getElementById('bet-counter').textContent = `Total Balls: ${totalBets}`;
  
  // Add ball to world
  Composite.add(world, ball);
  
  return ball; // Return the ball object for potential further manipulation
}

// When the window resizes, adjust the canvas dimensions
window.addEventListener('resize', function() {
  // Only rebuild if the render exists
  if (render) {
    const gameContainer = document.getElementById('game-container');
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;
    
    // Update renderer dimensions
    render.options.width = containerWidth;
    render.options.height = containerHeight;
    render.canvas.width = containerWidth;
    render.canvas.height = containerHeight;
    
    // You may want to recalculate positions of elements if needed
  }
});

// Add a function to visualize the probability distribution
function visualizeProbability() {
  const context = render.context;
  context.save();
  
  // Clear a section at the top for the visualization
  context.fillStyle = 'rgba(0,0,0,0.7)';
  context.fillRect(0, 0, canvasWidth, 80);
  
  // Draw the probability curve
  if (totalHits > 10) { // Only show after some data is collected
    context.beginPath();
    context.strokeStyle = 'rgba(255,255,255,0.5)';
    context.lineWidth = 2;
    
    // Start from the left edge
    context.moveTo(0, 40);
    
    // Create a smooth curve based on hit percentages
    for (let i = 0; i < statistics.length; i++) {
      const x = (i / (statistics.length - 1)) * canvasWidth;
      const percentage = statistics[i].percentage || 0;
      const y = 60 - (percentage / 2);
      
      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    
    context.stroke();
    
    // Draw percentage labels
    context.fillStyle = '#FFFFFF';
    context.font = '10px Arial';
    context.textAlign = 'center';
    
    for (let i = 0; i < statistics.length; i++) {
      const x = (i / (statistics.length - 1)) * canvasWidth;
      const percentage = statistics[i].percentage || 0;
      if (percentage > 5) { // Only show significant percentages
        context.fillText(`${percentage.toFixed(1)}%`, x, 30);
      }
    }
  }
  
  context.restore();
}

// Add this to the render event to show probability visualization
Events.on(render, 'afterRender', function() {
  if (showPath) {
    // ...existing path drawing code...
  }
  
  // Add probability visualization
  if (totalHits > 10) {
    visualizeProbability();
  }
});