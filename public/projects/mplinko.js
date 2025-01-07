const manualTab = document.getElementById('manual-tab');
const autoTab = document.getElementById('auto-tab');
const manualContent = document.getElementById('manual-content');
const autoContent = document.getElementById('auto-content');
const betButton = document.getElementById('manual-bet-button');
const dropThousand = document.getElementById('drop-balls-btn');
const autoBetButton = document.getElementById('autobet-btn');
let autobetInterval = null;

manualTab.addEventListener('click', () => {
    manualTab.classList.add('bg-blue1', 'text-offwhite');
    autoTab.classList.remove('bg-blue1', 'text-offwhite');
    manualContent.classList.remove('hidden');
    autoContent.classList.add('hidden');
});

autoTab.addEventListener('click', () => {
    autoTab.classList.add('bg-blue1', 'text-offwhite');
    manualTab.classList.remove('bg-blue1', 'text-offwhite');
    autoContent.classList.remove('hidden');
    manualContent.classList.add('hidden');
});

betButton.addEventListener('click', () => {
    const bet = parseFloat(document.getElementById('bet').value) || 0;
    updateBalance(-bet);
    dropBall(bet); // Drop ball with bet amount
    totalHits++;
});

dropThousand.addEventListener('click', () => {
    dropBalls(); // Call the function to drop multiple balls
});

// Autobet functionality
autoBetButton.addEventListener('click', () => {
    if (autobetInterval === null) {
        startAutobet();
    } else {
        stopAutobet();
    }
});

function startAutobet() {
    autobetInterval = setInterval(() => {
        const bet = parseFloat(document.getElementById('auto-bet').value) || 0;
        updateBalance(-bet);
        dropBall(bet);
    }, 1000);
    autoBetButton.textContent = "Stop Auto Drop";
    autoBetButton.classList.add('bg-red-500', 'hover:bg-red-600');
    autoBetButton.classList.remove('bg-green-500', 'hover:bg-green-600');
}

function stopAutobet() {
    clearInterval(autobetInterval);
    autobetInterval = null;
    autoBetButton.textContent = "Start Autobet";
    autoBetButton.classList.add('bg-green-500', 'hover:bg-green-600');
    autoBetButton.classList.remove('bg-red-500', 'hover:bg-red-600');
}

// Function to update balance
function updateBalance(amount) {
    let balance = parseFloat(document.getElementById('bal').textContent) || 0;
    balance += amount;
    document.getElementById('bal').textContent = balance.toFixed(2);
}

// Setup Matter.js engine and world
const { Engine, Render, Runner, Bodies, Composite, Events, Body, Common } = Matter;

const engine = Engine.create();
const { world } = engine;
engine.world.gravity.y = 1; // Increased gravity for more realistic fall

// Update render creation to be responsive
const render = Render.create({
    element: document.getElementById('game-container'),
    engine: engine,
    options: {
        width: document.getElementById('game-container').clientWidth,
        height: document.getElementById('game-container').clientHeight,
        wireframes: false,
        background: '#f5fdff',
        pixelRatio: window.devicePixelRatio,
    },
});

// Add resize handler
window.addEventListener('resize', () => {
    const container = document.getElementById('game-container');
    render.canvas.width = container.clientWidth;
    render.canvas.height = container.clientHeight;
    // Update canvas bounds
    render.bounds.max.x = render.canvas.width;
    render.bounds.max.y = render.canvas.height;
    // Adjust peg positions and other game elements if needed
    // You might want to call a function to reposition game elements here
});

Engine.run(engine);
Render.run(render);

// Add after Matter.js initialization and before game logic
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = 0.6;          // Reduced initial opacity
        this.expandSpeed = 1.2;    // Faster expansion
        this.radius = 4;          // Larger starting radius
        this.maxRadius = 15;      // Larger maximum radius
        this.color = '#1B69FA';   // blue1
        this.lineWidth = 3;       // Thicker line
    }

    update() {
        this.radius += this.expandSpeed;
        this.alpha *= 0.94;  // Slower fade out
        // Add slight oscillation to line width
        this.lineWidth = 3 * (1 + Math.sin(this.radius * 0.3) * 0.2);
        return this.radius < this.maxRadius;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(27, 105, 250, ${this.alpha})`;
        context.lineWidth = this.lineWidth;
        context.stroke();

        // Add inner glow effect
        const gradient = context.createRadialGradient(
            this.x, this.y, this.radius * 0.4,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `rgba(27, 105, 250, ${this.alpha * 0.1})`);
        gradient.addColorStop(1, 'rgba(27, 105, 250, 0)');
        context.fillStyle = gradient;
        context.fill();
    }
}

let particles = [];

const pegRows = 12;
const canvasWidth = render.options.width;
const canvasHeight = render.options.height;
const pegRadius = 6;
const pegSpacingX = 45;
const pegSpacingY = 45;

function createPegs(rows) {
    for (let row = 1; row < rows; row++) {
        const numberOfPegs = row + 2;
        const startX = (canvasWidth - (numberOfPegs - 1) * pegSpacingX) / 2;

        for (let col = 0; col < numberOfPegs; col++) {
            const x = startX + col * pegSpacingX;
            const y = row * pegSpacingY;

            const peg = Bodies.circle(x, y, pegRadius, {
                isStatic: true,
                friction: 0.0,
                restitution: 0.5,
                render: { fillStyle: '#1B44FA' }, // Updated to blue2
                collisionFilter: {
                    category: 0x0004,
                    mask: 0x0001 // Collide with balls
                }
            });
            Composite.add(world, peg);
        }
    }
}

createPegs(pegRows);

// Define multiplier zones with probabilities
const zoneWidth = 40;
const zoneHeight = 25;
const chamferRadius = 5;

// Modify the multipliers array to adjust the probabilities
// Center zones have higher probabilities, edges have lower probabilities
const multipliers = [
    { id: 1, x: 190, multiplier: 76, color: '#FFFF00', probability: 0.02 },
    { id: 2, x: 235, multiplier: 10, color: '#00FF00', probability: 0.04 },
    { id: 3, x: 280, multiplier: 3, color: '#FFA500', probability: 0.08 },
    { id: 4, x: 325, multiplier: 0.9, color: '#FF0000', probability: 0.12 },
    { id: 5, x: 370, multiplier: 0.2, color: '#FF0000', probability: 0.14 },
    { id: 6, x: 415, multiplier: 0.3, color: '#FF0000', probability: 0.16 },
    { id: 7, x: 460, multiplier: 0.2, color: '#FF0000', probability: 0.16 },
    { id: 8, x: 505, multiplier: 0.3, color: '#FF0000', probability: 0.14 },
    { id: 9, x: 550, multiplier: 0.9, color: '#FF0000', probability: 0.12 },
    { id: 10, x: 595, multiplier: 3, color: '#FFA500', probability: 0.08 },
    { id: 11, x: 640, multiplier: 10, color: '#00FF00', probability: 0.04 },
    { id: 12, x: 685, multiplier: 76, color: '#FFFF00', probability: 0.02 }
];

const totalProbability = multipliers.reduce((sum, zone) => sum + zone.probability, 0);
if (Math.abs(totalProbability - 1) > 0.0001) {
    console.error('Total probability does not sum up to 1');
}

const multiplierContainer = document.createElement('div');
multiplierContainer.style.position = 'absolute';
multiplierContainer.style.top = '520px';
multiplierContainer.style.left = '0px';
multiplierContainer.style.width = '800px';
multiplierContainer.style.display = 'flex';
multiplierContainer.style.justifyContent = 'space-between';

// Update the bet-counter display
let totalBets = 0;
document.getElementById('bet-counter').textContent = `Total Bets: ${totalBets}`;

// Add the multipliers and labels to the container
multipliers.forEach(zone => {
    const square = Bodies.rectangle(zone.x, 530, zoneWidth, zoneHeight, {
        isStatic: true,
        chamfer: { radius: chamferRadius },
        label: `Zone-${zone.id}`,
        render: {
            fillStyle: zone.color
        },
        collisionFilter: {
            category: 0x0002,
            mask: 0x0001 // Collide with balls
        }
    });

    Body.setInertia(square, Infinity);
    Composite.add(world, square);

    // Create and position the label for the multiplier
    const multiplierLabel = document.createElement('div');
    multiplierLabel.textContent = `${zone.multiplier}x`;
    multiplierLabel.style.position = 'absolute';
    multiplierLabel.style.left = `${zone.x - (zoneWidth / 2)}px`;
    multiplierLabel.style.top = '520px';
    multiplierLabel.style.color = '#000';
    multiplierLabel.style.fontSize = '12px';
    multiplierLabel.style.fontWeight = 'bold';
    multiplierLabel.style.textAlign = 'center';
    multiplierLabel.style.width = `${zoneWidth}px`;

    document.getElementById('game-container').appendChild(multiplierLabel);
    square.labelElement = multiplierLabel; // Store reference to the label element
});

// Function to drop multiple balls
function dropBalls() {
    for (let i = 0; i < 1000; i++) {
        dropBall();
    }
}

// Create walls
const wallLeft = Bodies.rectangle(185, 300, 10, 600, {
    isStatic: true,
    angle: Math.PI / 8,
    render: { visible: false },
    collisionFilter: {
        category: 0x0002,
        mask: 0x0001 // Collide with balls
    }
});

const wallRight = Bodies.rectangle(615, 300, 10, 600, {
    isStatic: true,
    angle: -Math.PI / 8,
    render: { visible: false },
    collisionFilter: {
        category: 0x0002,
        mask: 0x0001 // Collide with balls
    }
});

Composite.add(world, [wallLeft, wallRight]);

// Ball drop functionality
const ballRadius = 12;
let betCount = 0;

// Boolean to toggle the path drawing
const showPath = false; // Set to false to disable path drawing

// Event listeners for Manual bet adjustment buttons
document.getElementById('half-button').addEventListener('click', () => {
    const betInput = document.getElementById('bet');
    const betDisplay = document.getElementById('manual-bet-display');
    let bet = parseFloat(betInput.value) || 0;
    bet = (bet / 2).toFixed(2);
    betInput.value = bet;
    betDisplay.textContent = `${bet} credits`;
});

document.getElementById('double-button').addEventListener('click', () => {
    const betInput = document.getElementById('bet');
    const betDisplay = document.getElementById('manual-bet-display');
    let bet = parseFloat(betInput.value) || 0;
    bet = (bet * 2).toFixed(2);
    betInput.value = bet;
    betDisplay.textContent = `${bet} credits`;
});

// Event listeners for Auto bet adjustment buttons
document.getElementById('auto-half-button').addEventListener('click', () => {
    const betInput = document.getElementById('auto-bet');
    const betDisplay = document.getElementById('auto-bet-display');
    let bet = parseFloat(betInput.value) || 0;
    bet = (bet / 2).toFixed(2);
    betInput.value = bet;
    betDisplay.textContent = `${bet} credits`;
});

document.getElementById('auto-double-button').addEventListener('click', () => {
    const betInput = document.getElementById('auto-bet');
    const betDisplay = document.getElementById('auto-bet-display');
    let bet = parseFloat(betInput.value) || 0;
    bet = (bet * 2).toFixed(2);
    betInput.value = bet;
    betDisplay.textContent = `${bet} credits`;
});

// Update bet display on input change (Manual)
document.getElementById('bet').addEventListener('input', () => {
    const betInput = document.getElementById('bet');
    const betDisplay = document.getElementById('manual-bet-display');
    let bet = parseFloat(betInput.value) || 0;
    betDisplay.textContent = `${bet.toFixed(2)} credits`;
});

// Update bet display on input change (Auto)
document.getElementById('auto-bet').addEventListener('input', () => {
    const betInput = document.getElementById('auto-bet');
    const betDisplay = document.getElementById('auto-bet-display');
    let bet = parseFloat(betInput.value) || 0;
    betDisplay.textContent = `${bet.toFixed(2)} credits`;
});

// Add these constants near the top of your script
const BALL_CLEANUP_TIMEOUT = 10000; // 10 seconds
const STUCK_VELOCITY_THRESHOLD = 0.1;
const STUCK_CHECK_INTERVAL = 1000; // Check every second

// Modified dropBall function to accept betAmount
function dropBall(betAmount) {
    // Increment total plays counter
    const totalPlaysElement = document.getElementById('total-plays');
    const currentPlays = parseInt(totalPlaysElement.textContent) || 0;
    totalPlaysElement.textContent = currentPlays + 1;

    // Rest of dropBall function remains the same
    totalBets++;
    const targetZone = selectTargetZone();

    const minX = 390;
    const maxX = 480;
    const randomXPosition = Math.random() * (maxX - minX) + minX;
    const initialYPosition = pegSpacingY / 3; // Higher initial position

    const ball = Bodies.circle(randomXPosition, initialYPosition, ballRadius, {
        restitution: 0.4,    // Slightly increased bounce
        friction: 0.002,     // Very low friction
        density: 0.6,        // Lighter ball
        slop: 0,            // Prevent sinking
        label: 'Ball',
        frictionAir: 0.001,  // Add minimal air friction
        render: {
            fillStyle: '#1B69FA',
            strokeStyle: '#1B44FA',
            lineWidth: 1
        },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 | 0x0004
        }
    });

    // Add initial downward velocity
    Body.setVelocity(ball, { x: 0, y: 2 });

    ball.targetX = targetZone.x;       // Store the target x-position
    ball.targetZoneId = targetZone.id; // Store the target zone id
    ball.betAmount = betAmount;        // Store the bet amount with the ball

    // Add timestamp to track ball age
    ball.createdAt = Date.now();
    
    // Add cleanup timeout
    setTimeout(() => {
        if (ball && ball.position) {
            Composite.remove(world, ball);
        }
    }, BALL_CLEANUP_TIMEOUT);

    document.getElementById('bet-counter').textContent = `Total Balls Dropped: ${totalBets}`;
    Composite.add(world, ball);
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
    const currentTime = Date.now();
    
    Composite.allBodies(world).forEach(body => {
        if (body.label === 'Ball') {
            // Check for stuck balls
            if (Math.abs(body.velocity.x) < STUCK_VELOCITY_THRESHOLD && 
                Math.abs(body.velocity.y) < STUCK_VELOCITY_THRESHOLD) {
                
                // If ball is stuck for more than 2 seconds, apply a small impulse
                if (!body.lastMoving || currentTime - body.lastMoving > 2000) {
                    Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * 0.001,
                        y: 0.001
                    });
                }
            } else {
                body.lastMoving = currentTime;
            }

            // Remove balls that have fallen below the canvas
            if (body.position.y > canvasHeight + 100) {
                Composite.remove(world, body);
            }
        }

        // Existing steering code
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
        }
    });
});

// Render event to draw the path line
Events.on(render, 'afterRender', function () {
    const context = render.context;

    // Only update and draw particles
    particles = particles.filter(particle => {
        const isAlive = particle.update();
        if (isAlive) {
            particle.draw(context);
        }
        return isAlive;
    });
});

// Handle collision and determine winnings
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
        const ball = bodyA.label === 'Ball' ? bodyA : bodyB.label === 'Ball' ? bodyB : null;
        const zone = bodyA.label && bodyA.label.startsWith('Zone-') ? bodyA : bodyB.label && bodyB.label.startsWith('Zone-') ? bodyB : null;

        if (ball && zone) {
            const zoneId = parseInt(zone.label.split('-')[1]); // Extract zone ID from label
            const matchedMultiplier = multipliers.find(z => z.id === zoneId).multiplier;
            const bet = ball.betAmount; // Use the bet amount stored in the ball
            const winnings = bet * matchedMultiplier;
            updateBalance(winnings); // Update the balance with the calculated winnings

            // Update statistics for the zone
            updateStatistics(zoneId);

            // Bounce animation for the zone and the corresponding label
            const targetZone = multipliers.find(z => z.id === zoneId);
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

const statistics = multipliers.map(multiplier => ({
    id: multiplier.id,
    multiplier: multiplier.multiplier,
    hits: 0,
    percentage: 0
}));
let totalHits = 0;

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

// Start the simulation
const runner = Runner.create();
Runner.run(runner, engine);

// Add to the collision handling section
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
        // Check for ball-peg collisions
        const ball = bodyA.label === 'Ball' ? bodyA : bodyB.label === 'Ball' ? bodyB : null;
        const isPeg = (body) => body.circleRadius === pegRadius;

        if (ball && (isPeg(bodyA) || isPeg(bodyB))) {
            const peg = isPeg(bodyA) ? bodyA : bodyB;
            
            // Add extra force on first impact
            if (!ball.hasHitPeg) {
                Body.setVelocity(ball, {
                    x: ball.velocity.x,
                    y: Math.max(2, ball.velocity.y)
                });
                ball.hasHitPeg = true;
            }
            
            // Create particle effect
            particles.push(new Particle(peg.position.x, peg.position.y));
        }

        // Existing collision handling code...
    });
});

// Modify the render event to include particle rendering
Events.on(render, 'afterRender', function () {
    const context = render.context;

    // Update and draw particles with improved filtering
    particles = particles.filter(particle => {
        const isAlive = particle.update();
        if (isAlive) {
            particle.draw(context);
        }
        return isAlive;
    });


});