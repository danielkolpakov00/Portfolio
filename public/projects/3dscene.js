import * as THREE from 'three';
import { GLTFLoader } from '../GLTFLoader.js';
import { PointerLockControls } from "../../examples/jsm/controls/PointerLockControls.js";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow map in the renderer
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optionally use soft shadows
document.getElementById('scene-container').appendChild(renderer.domElement);

// Add PointerLockControls for a first-person POV
const controls = new PointerLockControls(camera, renderer.domElement);
// We'll set up the click event listener after all other code to avoid duplication

// Define colors for materials
const colors = {
    wood: 0x8B4513,        // Brown
    blanket: 0x4169E1,     // Royal Blue
    floor: 0xDEB887,       // Burlywood
    carpet: 0x800020,      // Burgundy
    wall: 0xF5F5DC,        // Beige
    ceiling: 0xFFFFFF,     // White
    tvFrame: 0x2F4F4F,     // Dark Slate Gray
    fridge: 0x8B0000,      // Dark Red
    lampShade: 0xFFF8DC,   // Lamp shade color
    lampMetal: 0xC0C0C0    // Lamp metal parts
};

// Track interactive objects
const interactiveObjects = [];

// Movement and collision detection variables - consolidated in one place
const moveSpeed = 0.02; // Reduced for slower movement
const playerHeight = 1.6; // Camera height (eye level)
const playerRadius = 0.3; // Collision radius
const gravity = 0.01;
const jumpForce = 0.15;
const moveVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
const worldDirection = new THREE.Vector3();
const collisionObjects = []; // List of objects to check for collisions
let playerOnGround = true;

// Add keyboard control tracking - ensure this is not duplicated
const keyboard = {};

// Use key value instead of code for better cross-browser compatibility
document.addEventListener('keydown', (event) => { 
    keyboard[event.key] = true;
    console.log("Key down:", event.key); // Debug logging
});
document.addEventListener('keyup', (event) => { 
    keyboard[event.key] = false;
});

// Create a ceiling lamp function
function createCeilingLamp() {
    const lampGroup = new THREE.Group();
    
    // Create lamp shade
    const shadeGeometry = new THREE.CylinderGeometry(0.5, 0.8, 0.6, 16);
    const shadeMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.lampShade, 
        transparent: true, 
        opacity: 0.7 
    });
    const lampShade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    lampShade.position.y = -0.3;
    lampShade.castShadow = true;
    
    // Create metal rod
    const rodGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
    const rodMaterial = new THREE.MeshStandardMaterial({ color: colors.lampMetal });
    const rod = new THREE.Mesh(rodGeometry, rodMaterial);
    rod.position.y = 0.4;
    
    // Create ceiling attachment point
    const attachmentGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const attachment = new THREE.Mesh(attachmentGeometry, rodMaterial);
    attachment.position.y = 0.8;
    
    // Replace point light with spotlight to prevent ceiling rays
    const lampLight = new THREE.SpotLight(0xFFFFCC, 2, 20, Math.PI/2, 0.5, 1);
    lampLight.position.y = -0.3;
    lampLight.target.position.set(0, -10, 0); // Target points downward
    lampLight.castShadow = true;
    lampLight.shadow.mapSize.width = 1024;
    lampLight.shadow.mapSize.height = 1024;
    
    // Add light target to group so it moves with the lamp
    lampGroup.add(lampLight.target);
    
    // Add all components to lamp group
    lampGroup.add(lampShade);
    lampGroup.add(rod);
    lampGroup.add(attachment);
    lampGroup.add(lampLight);
    
    // Position lamp in the center of the ceiling
    lampGroup.position.set(0, 3, 0);
    
    // Create a reference to the ambient light to control it
    // (we'll set this after ambient light is created)
    let ambientLightRef = null;
    
    // Make lamp interactive (toggleable)
    lampShade.userData = {
        clickable: true,
        type: 'lamp',
        isOn: true,
        toggle: function() {
            this.isOn = !this.isOn;
            lampLight.intensity = this.isOn ? 2 : 0;
            
            // Control ambient light too
            if (ambientLightRef) {
                ambientLightRef.intensity = this.isOn ? 0.1 : 0.01;
            }
            
            // Change shade color based on light state
            shadeMaterial.emissive.set(this.isOn ? 0xFFFF99 : 0x000000);
            shadeMaterial.emissiveIntensity = this.isOn ? 0.4 : 0;
        }
    };
    
    interactiveObjects.push(lampShade);
    scene.add(lampGroup);
    
    // Return both the lamp light and a function to connect it to ambient light
    return {
        light: lampLight,
        connectAmbientLight: function(ambLight) {
            ambientLightRef = ambLight;
        }
    };
}

// BEGIN SCENE BUILDING

// Create a group to hold the bed parts
const bedGroup = new THREE.Group();

// Function to create a bed
function createBed() {
    // Create bed frame (without base)
    const frameGeometry = new THREE.BoxGeometry(3, 0.2, 2);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: colors.wood });
    const bedFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    bedFrame.position.y = 0.35;
    bedFrame.castShadow = true;
    bedFrame.receiveShadow = true;

    // Create headboard
    const headboardGeometry = new THREE.BoxGeometry(3, 1.5, 0.2);
    const headboardMaterial = new THREE.MeshStandardMaterial({ color: colors.wood });
    const headboard = new THREE.Mesh(headboardGeometry, headboardMaterial);
    headboard.position.set(0, 1, -1.1); // Adjusted to be above the bed frame and behind the pillows
    headboard.castShadow = true;
    headboard.receiveShadow = true;

    // Create mattress
    const mattressGeometry = new THREE.BoxGeometry(3, 0.5, 2);
    const mattressMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.y = 0.75;
    mattress.castShadow = true;
    mattress.receiveShadow = true;

    // Create blanket
    const blanketGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const blanketMaterial = new THREE.MeshStandardMaterial({ color: colors.blanket });
    const blanket = new THREE.Mesh(blanketGeometry, blanketMaterial);
    blanket.position.y = 1.05;
    blanket.castShadow = true;
    blanket.receiveShadow = true;

    // Create pillows
    const pillowGeometry = new THREE.BoxGeometry(1, 0.2, 0.5);
    const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const pillow1 = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow1.position.set(1, 1.15, -0.75);
    pillow1.castShadow = true;
    pillow1.receiveShadow = true;

    const pillow2 = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow2.position.set(-1, 1.15, -0.75);
    pillow2.castShadow = true;
    pillow2.receiveShadow = true;

    // Create legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
    const legMaterial = new THREE.MeshStandardMaterial({ color: colors.wood });

    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(1.4, 0.25, 0.9);
    leg1.castShadow = true;
    leg1.receiveShadow = true;

    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(-1.4, 0.25, 0.9);
    leg2.castShadow = true;
    leg2.receiveShadow = true;

    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.position.set(1.4, 0.25, -0.9);
    leg3.castShadow = true;
    leg3.receiveShadow = true;

    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.position.set(-1.4, 0.25, -0.9);
    leg4.castShadow = true;
    leg4.receiveShadow = true;

    // Add all parts to the bed group
    bedGroup.add(bedFrame);
    bedGroup.add(mattress);
    bedGroup.add(blanket);
    bedGroup.add(pillow1);
    bedGroup.add(pillow2);
    bedGroup.add(leg1);
    bedGroup.add(leg2);
    bedGroup.add(leg3);
    bedGroup.add(leg4);
    bedGroup.add(headboard);

    // Rotate the bed by 90 degrees around the y-axis to align with the left wall
    bedGroup.rotation.y = Math.PI / 2;

    // Position the bed along the left wall and in the far corner
    bedGroup.position.set(-2, 0, 0);
    bedGroup.scale.set(0.8, 0.8, 0.8);
}

// Function to create the room
function createRoom() {
    const wallMaterial = new THREE.MeshStandardMaterial({ color: colors.wall });
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: colors.ceiling });
    const floorMaterial = new THREE.MeshStandardMaterial({ color: colors.floor });
    const carpetMaterial = new THREE.MeshStandardMaterial({ color: colors.carpet });

    // Back wall
    const backWallGeometry = new THREE.BoxGeometry(6, 3, 0.1);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 1.5, -3);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(0.1, 3, 6);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-3, 1.5, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(0.1, 3, 6);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(3, 1.5, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    
    // Front wall (complete wall without doorway)
    const frontWallGeometry = new THREE.BoxGeometry(6, 3, 0.1);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(0, 1.5, 3);
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    // Ceiling
    const ceilingGeometry = new THREE.BoxGeometry(6, 0.1, 6);
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.set(0, 3, 0);
    ceiling.castShadow = true;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Floor
    const floorGeometry = new THREE.BoxGeometry(6, 0.1, 6);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, 0, 0);
    floor.castShadow = true;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create carpet
    const carpetGeometry = new THREE.BoxGeometry(2, 0.01, 3);
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
    carpet.position.set(0, 0.05, 0);
    carpet.castShadow = true;
    carpet.receiveShadow = true;
    scene.add(carpet);
}

// Function to create a long table with drawers
function createTable() {
    const tableGroup = new THREE.Group();

    // Create table top
    const tableTopGeometry = new THREE.BoxGeometry(5, 0.2, 1);
    const tableTopMaterial = new THREE.MeshStandardMaterial({ color: colors.wood });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.position.y = 1;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;

    // Create drawers
    const drawerGeometry = new THREE.BoxGeometry(1, 0.5, 0.8);
    const drawerMaterial = new THREE.MeshStandardMaterial({ color: colors.wood });

    const drawer1 = new THREE.Mesh(drawerGeometry, drawerMaterial);
    drawer1.position.set(-2, 0.75, 0);
    drawer1.castShadow = true;
    drawer1.receiveShadow = true;

    const drawer2 = new THREE.Mesh(drawerGeometry, drawerMaterial);
    drawer2.position.set(0, 0.75, 0);
    drawer2.castShadow = true;
    drawer2.receiveShadow = true;

    const drawer3 = new THREE.Mesh(drawerGeometry, drawerMaterial);
    drawer3.position.set(2, 0.75, 0);
    drawer3.castShadow = true;
    drawer3.receiveShadow = true;

    // Add all parts to the table group
    tableGroup.add(tableTop);
    tableGroup.add(drawer1);
    tableGroup.add(drawer2);
    tableGroup.add(drawer3);

    // Position the table across the room
    tableGroup.position.set(2.5, -0.44, 0);
    tableGroup.rotation.y = Math.PI / 2;

    // Add table group to the scene
    scene.add(tableGroup);

    // Add the table to collision objects
    collisionObjects.push(tableGroup);

    // this was an attempt to make a button in the scene that zooms into the tv screen when clicked
    const buttonGeometry = new THREE.PlaneGeometry(1, 0.3);
    const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
    const callToActionButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    callToActionButton.position.set(0, 1, 0.07); // Slightly in front of the clickable plane

    tableGroup.add(callToActionButton);

    // Make the button appear and disappear
    function toggleButtonVisibility() {
        callToActionButton.visible = !callToActionButton.visible;
        setTimeout(toggleButtonVisibility, Math.random() * 2000 + 1000); // Toggle visibility randomly between 1-3 seconds
    }
    toggleButtonVisibility();
}

// Create the bed, room, and table
createRoom();
createBed();
createTable();
const ceilingLampControl = createCeilingLamp();

// Call createMiniFridge() once here and remove the duplicate call
createMiniFridge();

// Add the bed group to the scene
scene.add(bedGroup);

// Position the camera in the middle of the room (eye level)
camera.position.set(0, 1.6, 0);

// Add ambient light (increased for better room lighting)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Connect ambient light to ceiling lamp
ceilingLampControl.connectAmbientLight(ambientLight);

// Raycaster and mouse vector for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Enhanced click handler for all interactive objects - updated for PointerLockControls
function onMouseClick(event) {
    // For PointerLockControls, we use the center of the screen for raycasting
    mouse.x = 0;
    mouse.y = 0;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.clickable) {
            object.userData.toggle();
            
            // Add visual feedback on click - but skip for fridge door to prevent white flashing
            if (object.userData.type !== 'fridgeDoor') {
                const originalColor = object.material.color.clone();
                object.material.color.set(0xFFFFFF);
                setTimeout(() => {
                    object.material.color.copy(originalColor);
                }, 200);
            }
        }
    }
}

// Enhanced hover handler 
function onMouseMove(event) {
    // For normal mouse movement, update the standard mouse position
    if (!controls.isLocked) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    } else {
        // When controls are locked, use center of screen
        mouse.x = 0;
        mouse.y = 0;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);

    // Reset all objects to normal state
    interactiveObjects.forEach(obj => {
        if (obj.userData.hovered) {
            obj.userData.hovered = false;
            obj.material.emissiveIntensity = obj.userData.originalEmissive || 0;
        }
    });

    // Set hover state for intersected object
    if (intersects.length > 0) {
        const object = intersects[0].object;
        object.userData.hovered = true;
        if (!object.userData.originalEmissive) {
            object.userData.originalEmissive = object.material.emissiveIntensity || 0;
        }
        object.material.emissiveIntensity = 0.3;
        
        if (controls.isLocked) {
            // Fill the custom cursor
            customCursor.fill.style.opacity = '0.7';
            customCursor.fill.style.width = '20px';
            customCursor.fill.style.height = '20px';
            customCursor.ring.style.opacity = '1';
        } else {
            renderer.domElement.style.cursor = 'pointer';
        }
    } else {
        if (controls.isLocked) {
            // Return to hollow cursor
            customCursor.fill.style.opacity = '0';
            customCursor.fill.style.width = '10px';
            customCursor.fill.style.height = '10px';
            customCursor.ring.style.opacity = '0.7';
        } else {
            renderer.domElement.style.cursor = 'auto';
        }
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('keydown', (event) => {
    // Add keyboard controls for light toggling
    if (event.key === 'l') {
        interactiveObjects.forEach(obj => {
            if (obj.userData.type === 'lamp') {
                obj.userData.toggle();
            }
        });
    }
});

// After creating all scene elements, collect objects for collision detection
function setupCollisionObjects() {
    // Clear existing collision objects first to avoid duplicates
    collisionObjects.length = 0;
    
    // Add all collidable objects from the scene
    scene.children.forEach(child => {
        // Include walls, furniture, and other large objects
        if (child.type === 'Mesh' && 
            (child.geometry.type.includes('BoxGeometry') || 
             child.geometry.type.includes('CylinderGeometry'))) {
            // Exclude floor, ceiling, carpet (anything flat that you should walk on)
            if (child.position.y > 0.1 || 
               (child.geometry.parameters.height > 0.1 && child.rotation.x === 0)) {
                collisionObjects.push(child);
            }
        }
        // Add complex object groups like the bed and table
        if (child === bedGroup) {
            collisionObjects.push(child);
        }
    });
    
    // Add explicit collision for the fridge
    const fridgePosition = new THREE.Vector3(-2.3, 0.9, 2.3);
    const fridgeCollider = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.6, 1.2),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    fridgeCollider.position.copy(fridgePosition);
    scene.add(fridgeCollider);
    collisionObjects.push(fridgeCollider);
    
    // Add explicit collision for the desk area as a failsafe
    const deskFailsafeCollider = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 1.5, 2),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    deskFailsafeCollider.position.set(2.2, 0.5, -2.5);
    scene.add(deskFailsafeCollider);
    collisionObjects.push(deskFailsafeCollider);
    
    console.log("Collision objects setup complete with", collisionObjects.length, "objects");

    // Signal that collision objects have been updated
    document.dispatchEvent(new CustomEvent('collisionObjectsUpdated'));
}

// Function to check collision between player and objects
function checkCollision(nextPosition) {
    // Check room boundaries first (keep player inside the room)
    if (nextPosition.x < -2.7 || nextPosition.x > 2.7 || 
        nextPosition.z < -2.7 || nextPosition.z > 2.7) {
        return true; // Collision with room boundaries detected
    }
    
    // Special case for fridge - hardcoded bounds for reliable collision
    const fridgeBounds = {
        minX: -2.9, maxX: -1.7,
        minZ: 1.7, maxZ: 2.9
    };
    
    if (nextPosition.x > fridgeBounds.minX && nextPosition.x < fridgeBounds.maxX &&
        nextPosition.z > fridgeBounds.minZ && nextPosition.z < fridgeBounds.maxZ) {
        return true; // Collision with fridge detected
    }
    
    // Special case for desk area - more precise bounds matching the collider size
    const deskBounds = {
        minX: 1.25, maxX: 3.35, // More precise X-axis coverage
        minZ: -3.25, maxZ: -1.75 // More precise Z-axis coverage
    };
    
    if (nextPosition.x > deskBounds.minX && nextPosition.x < deskBounds.maxX &&
        nextPosition.z > deskBounds.minZ && nextPosition.z < deskBounds.maxZ) {
        return true; // Collision with desk area detected
    }
    
    // Check collision with other objects
    for (const object of collisionObjects) {
        if (!object) continue; // Skip null objects
        
        if (object.geometry) { // Simple mesh objects
            // Get object dimensions (simplified bounding box)
            const boundingBox = new THREE.Box3().setFromObject(object);
            const objSize = boundingBox.getSize(new THREE.Vector3());
            const objPos = object.position.clone();
            
            // Calculate distance and check for collision (simple sphere-box collision)
            const dx = Math.abs(nextPosition.x - objPos.x) - (objSize.x/2 + playerRadius);
            const dy = Math.abs(nextPosition.y - objPos.y) - (objSize.y/2);
            const dz = Math.abs(nextPosition.z - objPos.z) - (objSize.z/2 + playerRadius);
            
            if (dx < 0 && dy < 0 && dz < 0) {
                return true; // Collision detected
            }
        } else if (object === bedGroup) { // Special case for bed group
            // Use a simplified bounding box for the bed
            const bedBounds = {
                minX: -2.5, maxX: -1.1,
                minZ: -1.2, maxZ: 1.2
            };
            
            if (nextPosition.x > bedBounds.minX && nextPosition.x < bedBounds.maxX &&
                nextPosition.z > bedBounds.minZ && nextPosition.z < bedBounds.maxZ) {
                return true; // Collision with bed detected
            }
        } else if (object.isGroup || object.type === "Object3D") {
            // For imported models or complex groups, use a simplified approach
            const boundingBox = new THREE.Box3().setFromObject(object);
            
            // Expand bounding box by player radius for collision testing
            const expandedBox = boundingBox.clone();
            expandedBox.min.x -= playerRadius;
            expandedBox.min.z -= playerRadius;
            expandedBox.max.x += playerRadius;
            expandedBox.max.z += playerRadius;
            
            // Check if next position collides with the expanded box
            if (expandedBox.containsPoint(new THREE.Vector3(nextPosition.x, playerHeight, nextPosition.z))) {
                return true; // Collision detected
            }
        }
    }
    
    return false; // No collision
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    
    // Handle player movement with WASD and arrow keys
    if (controls.isLocked) {
        const oldPosition = camera.position.clone();
        let moved = false;
        
        // Calculate forward direction from camera
        camera.getWorldDirection(worldDirection);
        playerDirection.copy(worldDirection);
        playerDirection.y = 0; // Keep movement on the horizontal plane
        playerDirection.normalize();
        
        // Initialize movement delta for this frame
        const moveDelta = new THREE.Vector3(0, 0, 0);
        
        // Forward/backward movement - use key instead of code
        if (keyboard['w'] || keyboard['W'] || keyboard['ArrowUp']) {
            moveDelta.add(playerDirection.clone().multiplyScalar(moveSpeed));
            moved = true;
        }
        if (keyboard['s'] || keyboard['S'] || keyboard['ArrowDown']) {
            moveDelta.add(playerDirection.clone().multiplyScalar(-moveSpeed));
            moved = true;
        }
        
        // Left/right strafing
        if (keyboard['a'] || keyboard['A'] || keyboard['ArrowLeft']) {
            const strafeDir = new THREE.Vector3().crossVectors(playerDirection, new THREE.Vector3(0, 1, 0));
            moveDelta.add(strafeDir.multiplyScalar(-moveSpeed));
            moved = true;
        }
        if (keyboard['d'] || keyboard['D'] || keyboard['ArrowRight']) {
            const strafeDir = new THREE.Vector3().crossVectors(playerDirection, new THREE.Vector3(0, 1, 0));
            moveDelta.add(strafeDir.multiplyScalar(moveSpeed));
            moved = true;
        }
        
        // Apply movement if any keys were pressed
        if (moved) {
            // Add movement delta to velocity (for smoother acceleration)
            moveVelocity.add(moveDelta);
            
            // Cap maximum horizontal speed
            const horizontalSpeed = Math.sqrt(moveVelocity.x * moveVelocity.x + moveVelocity.z * moveVelocity.z);
            if (horizontalSpeed > moveSpeed * 2) {
                moveVelocity.x = (moveVelocity.x / horizontalSpeed) * moveSpeed * 2;
                moveVelocity.z = (moveVelocity.z / horizontalSpeed) * moveSpeed * 2;
            }
        } else {
            // Apply friction to slow down when not moving
            moveVelocity.x *= 0.8;
            moveVelocity.z *= 0.8;
            if (Math.abs(moveVelocity.x) < 0.001) moveVelocity.x = 0;
            if (Math.abs(moveVelocity.z) < 0.001) moveVelocity.z = 0;
        }
        
        // Calculate next position
        const nextPosition = oldPosition.clone().add(moveVelocity);
        
        // Check for collisions with both walls and objects
        if (!checkCollision(nextPosition)) {
            // Update camera position if no collision
            camera.position.copy(nextPosition);
        } else {
            // Try sliding along walls/objects by moving on individual axes
            const nextPositionX = oldPosition.clone();
            nextPositionX.x += moveVelocity.x;
            
            if (!checkCollision(nextPositionX)) {
                camera.position.x = nextPositionX.x;
            } else {
                moveVelocity.x *= 0.2; // Dampen X velocity on collision
            }
            
            const nextPositionZ = oldPosition.clone();
            nextPositionZ.z += moveVelocity.z;
            
            if (!checkCollision(nextPositionZ)) {
                camera.position.z = nextPositionZ.z;
            } else {
                moveVelocity.z *= 0.2; // Dampen Z velocity on collision
            }
        }
        
        // Ensure the camera stays at the correct height (eye level)
        camera.position.y = playerHeight;
    }
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to create a mini fridge next to the table
function createMiniFridge() {
    const fridgeGroup = new THREE.Group();

    // Create fridge exterior panels (thicker and hollow)
    const exteriorMaterial = new THREE.MeshStandardMaterial({ color: colors.fridge }); // Dark red color
    const interiorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White interior color

    const exteriorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 1), exteriorMaterial);
    exteriorLeft.position.set(-0.53, 0, 0);
    exteriorLeft.castShadow = true;
    exteriorLeft.receiveShadow = true;

    const interiorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.4, 0.9), interiorMaterial);
    interiorLeft.position.set(-0.51, 0, 0);
    interiorLeft.castShadow = true;
    interiorLeft.receiveShadow = true;

    const exteriorRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 1), exteriorMaterial);
    exteriorRight.position.set(0.55, 0, 0);
    exteriorRight.castShadow = true;
    exteriorRight.receiveShadow = true;
    
    const interiorRight = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.4, 0.9), interiorMaterial);
    interiorRight.position.set(0.52, 0, 0);
    interiorRight.castShadow = true;
    interiorRight.receiveShadow = true;

    const exteriorTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 1), exteriorMaterial);
    exteriorTop.position.set(0, 0.75, 0);
    exteriorTop.castShadow = true;
    exteriorTop.receiveShadow = true;
    
    const interiorTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.9), interiorMaterial);
    interiorTop.position.set(0, 0.72, 0);
    interiorTop.castShadow = true;
    interiorTop.receiveShadow = true;

    const exteriorBottom = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 1), exteriorMaterial);
    exteriorBottom.position.set(0, -0.8, 0);
    exteriorBottom.castShadow = true;
    exteriorBottom.receiveShadow = true;
    
    const interiorBottom = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.9), interiorMaterial);
    interiorBottom.position.set(0, -0.77, 0);
    interiorBottom.castShadow = true;
    interiorBottom.receiveShadow = true;

    const exteriorBack = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.07), exteriorMaterial);
    exteriorBack.position.set(0, 0, -0.51);
    exteriorBack.castShadow = true;
    exteriorBack.receiveShadow = true;

    
    const interiorBack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.03), interiorMaterial);
    interiorBack.position.set(0, 0, -0.45);
    interiorBack.castShadow = true;
    interiorBack.receiveShadow = true;

    // Create fridge door (thicker and interactive)
    const fridgeDoorGeometry = new THREE.BoxGeometry(1, 1.5, 0.2); // Thicker door
    const fridgeDoorMaterial = new THREE.MeshStandardMaterial({ color: colors.fridge });
    const fridgeDoor = new THREE.Mesh(fridgeDoorGeometry, fridgeDoorMaterial);
    fridgeDoor.castShadow = true;
    fridgeDoor.receiveShadow = true;

    // Adjust pivot point for the fridge door
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-0.5, 0, 0.45); // Pivot at the left edge of the door
    doorPivot.add(fridgeDoor);
    fridgeDoor.position.set(0.5, 0, 0); // Adjust door position within the pivot

    // Add fridge body, door pivot, and exterior panels to the fridge group
    fridgeGroup.add(exteriorLeft);
    fridgeGroup.add(exteriorRight);
    fridgeGroup.add(exteriorTop);
    fridgeGroup.add(exteriorBottom);
    fridgeGroup.add(exteriorBack);
    fridgeGroup.add(interiorLeft);
    fridgeGroup.add(interiorRight);
    fridgeGroup.add(interiorTop);
    fridgeGroup.add(interiorBottom);
    fridgeGroup.add(interiorBack);
    fridgeGroup.add(doorPivot);

    // Create an intense light inside the fridge
    const fridgeLight = new THREE.SpotLight(0xffffff, 1, 2, Math.PI / 4, 1, 2);
    fridgeLight.position.set(0, 0.80, -0.3); // Adjust position to fit within the fridge
    fridgeLight.target.position.set(0, -0.5, 0); // Adjust target position
    fridgeLight.castShadow = true;
    fridgeLight.visible = false; // Initially turned off
    fridgeLight.intensity = 12;
    fridgeLight.spread = 12;
    fridgeGroup.add(fridgeLight);
    fridgeGroup.add(fridgeLight.target);

    const fridgeLightB = new THREE.SpotLight(0xffffff, 1, 2, Math.PI / 4, 1, 2);
    fridgeLightB.position.set(0.6, 0.80, -0.3); // Adjust position to fit within the fridge
    fridgeLightB.target.position.set(0, -0.5, 0); // Adjust target position
    fridgeLightB.castShadow = true;
    fridgeLightB.visible = false; // Initially turned off
    fridgeLightB.intensity = 12;
    fridgeLightB.spread = 12;
    fridgeGroup.add(fridgeLightB);
    fridgeGroup.add(fridgeLightB.target);

    // Create and position the edge cylinders for curved edges
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: colors.fridge });
    const edgeRadius = 0.05;
    const edgeHeight = 1;

    // Create edge cylinders for the fridge body
    const edgeGeometry = new THREE.CylinderGeometry(edgeRadius, edgeRadius, edgeHeight, 32);
    const edge1 = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge1.position.set(0, 0.75, 0.5);
    edge1.rotation.z = Math.PI / 2;
    edge1.castShadow = true;
    edge1.receiveShadow = true;

    const edge2 = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge2.position.set(0, 0.75, -0.5);
    edge2.rotation.z = Math.PI / 2;
    edge2.castShadow = true;
    edge2.receiveShadow = true;

    const edge3 = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge3.position.set(-0.53, 0.752, 0);
    edge3.rotation.x = Math.PI / 2;
    edge3.castShadow = true;
    edge3.receiveShadow = true;

    const edge4 = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge4.position.set(0.55, 0.75, 0);
    edge4.rotation.x = Math.PI / 2;
    edge4.castShadow = true;
    edge4.receiveShadow = true;

    // Add edge cylinders to the fridge group
    fridgeGroup.add(edge1);
    fridgeGroup.add(edge2);
    fridgeGroup.add(edge3);
    fridgeGroup.add(edge4);

    // Position the fridge next to the table
    fridgeGroup.position.set(-2.3, 0.9, 2.3);

    // Add the fridge group to the scene
    scene.add(fridgeGroup);
    fridgeGroup.rotation.y = -Math.PI / -2;
    
    // Add fridge to collision objects with a bounding box collider
    const fridgeCollider = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.6, 1.2),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    fridgeCollider.position.copy(fridgeGroup.position);
    fridgeCollider.rotation.y = fridgeGroup.rotation.y;
    scene.add(fridgeCollider);
    collisionObjects.push(fridgeCollider);

    // Clean up doorPivot rotation animation
    let doorAnimating = false;

    // Make fridge door interactive with smooth animation
    fridgeDoor.userData = {
        clickable: true,
        type: 'fridgeDoor',
        isOpen: false,
        toggle: function() {
            // Only toggle if not already animating
            if (doorAnimating) return;
            
            this.isOpen = !this.isOpen;
            doorAnimating = true;
            
            // Target rotation
            const targetRotation = this.isOpen ? -Math.PI / 2 : 0;
            
            // Starting rotation
            const startRotation = doorPivot.rotation.y;
            
            // Animate door movement
            const animationDuration = 500; // ms
            const startTime = Date.now();
            
            // Add subtle feedback by slightly changing emissive property
            const originalEmissive = fridgeDoor.material.emissive ? 
                fridgeDoor.material.emissive.clone() : 
                new THREE.Color(0x000000);
            fridgeDoor.material.emissive = new THREE.Color(0x222222);
            
            function animateDoor() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                // Smooth easing function
                const easedProgress = progress < 0.5 ? 
                    2 * progress * progress : 
                    1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                // Update door rotation
                doorPivot.rotation.y = startRotation + (targetRotation - startRotation) * easedProgress;
                
                // Continue animation until complete
                if (progress < 1) {
                    requestAnimationFrame(animateDoor);
                } else {
                    doorPivot.rotation.y = targetRotation; // Ensure final position is exact
                    doorAnimating = false;
                    
                    // Reset emissive value after animation
                    fridgeDoor.material.emissive = originalEmissive;
                    
                    // Update lights after animation completes
                    if (fridgeDoor.userData.isOpen) {
                        fridgeLight.visible = true;
                        fridgeLightB.visible = true;
                        fridgeLight.intensity = 5;
                        fridgeLightB.intensity = 5;
                    } else {
                        fridgeLight.visible = false;
                        fridgeLightB.visible = false;
                    }
                }
            }
            
            // Start animation
            animateDoor();
        }
    };
    
    interactiveObjects.push(fridgeDoor);
}

// Initialize the GLTFLoaders
const deskLoader = new GLTFLoader();
const tvLoader = new GLTFLoader();

// Path to the models (make sure the paths are correct)
const deskModelPath = 'models/Desk.glb'; // or .gltf
const tvModelPath = 'models/TV.glb'; // or .gltf

// Load the desk model
deskLoader.load(
    deskModelPath,
    function (gltf) {
        // Add the loaded model to the scene
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // Adjust the scale if necessary
        model.position.set(6, 0, -3.1); // Keep the position as is
        model.rotation.y = Math.PI / 2;
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        
        // Calculate the actual bounding box of the model
        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());
        
        console.log("Desk model bounds:", bbox.min, bbox.max);
        console.log("Desk model center:", center);
        
        // Create a collider that matches the actual model bounds
        const deskCollider = new THREE.Mesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ 
                color: 0xff0000, 
                wireframe: true, 
                opacity: 0.0, 
                transparent: true 
            })
        );
        
        // Position the collider to match the model's actual position
        deskCollider.position.copy(center);
        scene.add(deskCollider);
        collisionObjects.push(deskCollider);
        
        console.log("Precise desk collision box created at:", center);
        
        // Also create an extended collision zone to prevent walking through the desk from the room
        const roomEntryCollider = new THREE.Mesh(
            new THREE.BoxGeometry(3, 2, 2),
            new THREE.MeshBasicMaterial({ 
                color: 0xff00ff, 
                wireframe: true, 
                opacity: 0.0, 
                transparent: true 
            })
        );
        
        // Position this collider between the desk and the room interior
        roomEntryCollider.position.set(3, 1, -2.5);
        scene.add(roomEntryCollider);
        collisionObjects.push(roomEntryCollider);
        
        // Override the desk bounds in the checkCollision function
        const originalCheckCollision = checkCollision;
        checkCollision = function(nextPosition) {
            // Check if position would be inside the desk model bounds
            const deskBounds = {
                minX: center.x - (size.x/2) - playerRadius,
                maxX: center.x + (size.x/2) + playerRadius,
                minZ: center.z - (size.z/2) - playerRadius,
                maxZ: center.z + (size.z/2) + playerRadius
            };
            
            // If entering desk area, block movement
            if (nextPosition.x > deskBounds.minX && nextPosition.x < deskBounds.maxX &&
                nextPosition.z > deskBounds.minZ && nextPosition.z < deskBounds.maxZ) {
                return true; // Collision with desk detected
            }
            
            // Call the original collision function for other checks
            return originalCheckCollision(nextPosition);
        };
        
        // Also define a custom property that links these colliders to the model
        deskCollider.userData.parentModel = model;
        deskCollider.name = "desk-main-collider";
        roomEntryCollider.userData.name = "desk-entry-collider";
    },
    function (xhr) {
        // Called while loading is progressing
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // Called when loading has errors
        console.error('An error happened', error);
    }
);

// Load the TV model
tvLoader.load(
    tvModelPath,
    function (gltf) {
        const tvModel = gltf.scene;
        tvModel.position.set(2.5, 0.85, 0);
        tvModel.castShadow = true;
        tvModel.receiveShadow = true;
        tvModel.scale.set(1, 1, 1);
        scene.add(tvModel);
        
        // Calculate the actual bounding box of the model
        const bbox = new THREE.Box3().setFromObject(tvModel);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());
        
        console.log("TV model bounds:", bbox.min, bbox.max);
        console.log("TV model center:", center);
        
        // Add TV to collision objects
        collisionObjects.push(tvModel);
        
        // Add a simplified collision box for the TV - keep existing dimensions
        const tvCollider = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.5, 7),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        tvCollider.position.set(2.5, 0.85, 0);
        scene.add(tvCollider);
        collisionObjects.push(tvCollider);
        
        // Override the collision check function to ensure TV collision works
        const previousCheckCollision = checkCollision;
        checkCollision = function(nextPosition) {
            // Check if position would be inside the TV model bounds
            const tvBounds = {
                minX: center.x - (0.8/2) - playerRadius,
                maxX: center.x + (0.8/2) + playerRadius,
                minZ: center.z - (7/2) - playerRadius,
                maxZ: center.z + (7/2) + playerRadius
            };
            
            // If entering TV area, block movement
            if (nextPosition.x > tvBounds.minX && nextPosition.x < tvBounds.maxX &&
                nextPosition.z > tvBounds.minZ && nextPosition.z < tvBounds.maxZ) {
                return true; // Collision with TV detected
            }
            
            // Call the previous collision function for other checks
            return previousCheckCollision(nextPosition);
        };
        
        tvModel.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        
        // Add name to collider for debugging
        tvCollider.userData.name = "tv-collider";
    },
    undefined,
    function (error) {
        console.error('Error loading the TV model:', error);
    }
);

// Start the animation loop
function animation() {
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
}
animation();

// END SCENE BUILDING

// Add ambient light from the TV screen
const tvLight = new THREE.PointLight(0x00ffff, 0.5, 8);
tvLight.position.set(2.4, 1.6, 0.1); // Position near the TV screen
scene.add(tvLight);

// Display instructions with improved styling
const instructionElement = document.createElement('div');
instructionElement.style.position = 'absolute';
instructionElement.style.bottom = '30px';
instructionElement.style.left = '30px';
instructionElement.style.color = 'white';
instructionElement.style.padding = '20px';
instructionElement.style.backgroundColor = 'rgba(245, 253, 255, 0.6)';
instructionElement.style.borderRadius = '10px';
instructionElement.style.fontFamily = 'Arial, sans-serif';
instructionElement.style.boxShadow = '0 4px 8px rgba(245, 253, 255, 0.6)';
instructionElement.style.backdropFilter = 'blur(4px)';
instructionElement.style.maxWidth = '300px';
instructionElement.style.transition = 'opacity 0.5s ease';
instructionElement.innerHTML = `
    <h3 style="margin-top: 0; color: #1B69FA;">Room Controls</h3>
    <div style="margin: 10px 0; border-top: 1px solid #1b44fa;"></div>
    <div style="color:#1b69fa; display: grid; grid-template-columns: auto 1fr; grid-gap: 10px; align-items: center;">
        <div style="text-align: center; font-size: 20px; opacity: 100%">🖱️</div>
        <div style="opacity: 100%">Click to interact with objects</div>
        
        <div style="text-align: center; font-size: 20px;">❄️</div>
        <div style="opacity: 100%">Click on fridge to open/close</div>
        
        <div style="text-align: center; font-size: 20px;">💡</div>
        <div style="opacity: 100%">Press 'L' to toggle ceiling lamp</div>
        
        <div style="text-align: center; font-size: 20px;">👀</div>
        <div style="opacity: 100%">Use mouse to look around</div>
        
        <div style="text-align: center; font-size: 20px;">⌨️</div>
        <div style="opacity: 100%">WASD or Arrow Keys to move</div>
    </div>
    <div style="margin-top: 15px; font-size: 12px; opacity: 0.7; text-align: center;">
        Click anywhere to start exploring
    </div>
`;
document.body.appendChild(instructionElement);

// Add a way to minimize/restore controls
const minimizeButton = document.createElement('div');
minimizeButton.style.position = 'absolute';
minimizeButton.style.top = '10px';
minimizeButton.style.right = '10px';
minimizeButton.style.cursor = 'pointer';
minimizeButton.style.color = 'white';
minimizeButton.style.fontSize = '16px';
minimizeButton.innerHTML = '−';
minimizeButton.style.width = '20px';
minimizeButton.style.height = '20px';
minimizeButton.style.lineHeight = '16px';
minimizeButton.style.textAlign = 'center';
minimizeButton.style.borderRadius = '50%';
minimizeButton.style.backgroundColor = 'rgba(255,255,255,0.2)';

let controlsMinimized = false;
minimizeButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering pointer lock
    controlsMinimized = !controlsMinimized;
    
    if (controlsMinimized) {
        instructionElement.style.opacity = '0';
        setTimeout(() => {
            instructionElement.style.display = 'none';
            minimizeButton.innerHTML = '+';
        }, 500);
    } else {
        instructionElement.style.display = 'block';
        setTimeout(() => {
            instructionElement.style.opacity = '1';
            minimizeButton.innerHTML = '−';
        }, 10);
    }
});
instructionElement.appendChild(minimizeButton);

// Setup click events for pointer lock controls
document.addEventListener('click', () => { 
    if (!controls.isLocked) {
        controls.lock();
        // Show custom cursor when controls are locked
        customCursor.container.style.display = 'block';
        // Hide the default cursor
        document.body.style.cursor = 'none';
        // Hide instructions after a delay
        setTimeout(() => {
            if (controls.isLocked && !controlsMinimized) {
                instructionElement.style.opacity = '0';
                controlsMinimized = true;
                minimizeButton.innerHTML = '+';
                setTimeout(() => {
                    if (controlsMinimized) {
                        instructionElement.style.display = 'none';
                    }
                }, 500);
            }
        }, 3000);
    } else {
        // When locked, handle object interactions
        onMouseClick();
    }
}, false);


// After all objects are created and added to the scene, set up collisions
setupCollisionObjects();

// Position the camera in the middle of the room (eye level)
camera.position.set(0, playerHeight, 0);

// Create the custom cursor
function createCustomCursor() {
    // Create cursor elements (outer ring and inner fill)
    const cursorContainer = document.createElement('div');
    cursorContainer.id = 'custom-cursor';
    cursorContainer.style.position = 'absolute';
    cursorContainer.style.top = '50%';
    cursorContainer.style.left = '50%';
    cursorContainer.style.transform = 'translate(-50%, -50%)';
    cursorContainer.style.width = '30px';
    cursorContainer.style.height = '30px';
    cursorContainer.style.pointerEvents = 'none'; // Make it non-interactive
    cursorContainer.style.zIndex = '9999';
    
    // Create outer ring
    const outerRing = document.createElement('div');
    outerRing.id = 'cursor-outer-ring';
    outerRing.style.width = '100%';
    outerRing.style.height = '100%';
    outerRing.style.borderRadius = '50%';
    outerRing.style.border = '2px solid white';
    outerRing.style.boxSizing = 'border-box';
    outerRing.style.opacity = '0.7';
    outerRing.style.transition = 'opacity 0.2s ease';
    
    // Create inner fill
    const innerFill = document.createElement('div');
    innerFill.id = 'cursor-inner-fill';
    innerFill.style.position = 'absolute';
    innerFill.style.top = '50%';
    innerFill.style.left = '50%';
    innerFill.style.transform = 'translate(-50%, -50%)';
    innerFill.style.width = '10px';
    innerFill.style.height = '10px';
    innerFill.style.borderRadius = '50%';
    innerFill.style.backgroundColor = 'white';
    innerFill.style.opacity = '0';
    innerFill.style.transition = 'all 0.2s ease';
    
    // Assemble the cursor
    cursorContainer.appendChild(outerRing);
    cursorContainer.appendChild(innerFill);
    document.body.appendChild(cursorContainer);
    
    // Make cursor hidden initially
    cursorContainer.style.display = 'none';
    
    // Return references to cursor elements
    return {
        container: cursorContainer,
        ring: outerRing,
        fill: innerFill
    };
}

// Initialize the custom cursor
const customCursor = createCustomCursor();

// Handle pointer lock change events
document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === renderer.domElement) {
        // Pointer is locked - show custom cursor
        customCursor.container.style.display = 'block';
        document.body.style.cursor = 'none';
    } else {
        // Pointer is unlocked - hide custom cursor
        customCursor.container.style.display = 'none';
        document.body.style.cursor = 'auto';
        
        // When exiting pointer lock, show instructions again
        if (controlsMinimized) {
            instructionElement.style.display = 'block';
            setTimeout(() => {
                instructionElement.style.opacity = '1';
                controlsMinimized = false;
                minimizeButton.innerHTML = '−';
            }, 10);
        }
    }
});

