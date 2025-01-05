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