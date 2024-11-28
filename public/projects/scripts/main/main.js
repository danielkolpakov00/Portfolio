import * as THREE from 'three';
import { GLTFLoader } from '../GLTFLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e3a8a); // Setting the background color of the screen

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0); // setting the position of the camera 
scene.position.set(0, 0, 0); // Setting the position of all of the object


const renderer = new THREE.WebGLRenderer({ antialias: true }); //code for the renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; //enabling rendering of shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('scene-container').appendChild(renderer.domElement); //VERY IMPORTANT! this is to place the document in the scene-container element
const container = document.getElementById('scene-container');
renderer.setSize(container.clientWidth, container.clientHeight);

// Create a parent group for the entire scene
const sceneGroup = new THREE.Group(); //putting all object in a group so i can manipulate the position of the entire scene
scene.add(sceneGroup); // adding the scene to the renderer


/**
 * The code is pretty repetitive (just placing objects and arranging them)
 *  so I added code to the first block of code where I am creating an object
 * but from there its pretty much the same
 */

/**
 * I added    
 * x.castShadow = true;
 * and 
 * x.receiveShadow = true;
 *  super early in development and it was meant to block light from passing through the objects, but I wasn't sure how to fix it and it seemed to do something that I liked so I kept it
 */

//BEGIN SCENE BUILDING
// Function to create a bed
function createBed() {
    const bedGroup = new THREE.Group(); // grouping all shapes together to build the bed

    const frameGeometry = new THREE.BoxGeometry(3, 0.2, 2); // creating a box for the frame
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Brown
    const bedFrame = new THREE.Mesh(frameGeometry, frameMaterial); 
    bedFrame.position.y = 0.35; // positioning the frame in the scene
    bedFrame.castShadow = true; // allowing the frame to cast shadows (was just experimenting with this)
    bedFrame.receiveShadow = true; // allowing the frame to cast shadows (was just experimenting with this)


    //creating a headboard for the bed
    const headboardGeometry = new THREE.BoxGeometry(3, 1.5, 0.2);
    const headboardMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); //applying the wood texture to the headboard
    const headboard = new THREE.Mesh(headboardGeometry, headboardMaterial);
    headboard.position.set(0, 1, -1.1);
    headboard.castShadow = true;
    headboard.receiveShadow = true;


    //creating a comfy white mattress
    const mattressGeometry = new THREE.BoxGeometry(3, 0.5, 2); //positioning the mattress
    const mattressMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); //plain white mattress
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.y = 0.75;
    mattress.castShadow = true;
    mattress.receiveShadow = true;


    //creating a blanket and applying the material that was previously defined to it
    const blanketGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const blanketMaterial = new THREE.MeshStandardMaterial({ color: 0x1e90ff }); // Blue
    const blanket = new THREE.Mesh(blanketGeometry, blanketMaterial);
    blanket.position.y = 1.05;
    blanket.castShadow = true;
    blanket.receiveShadow = true;


    //creating square pillows
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


    //creating letgs for the bed to stand on
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

//creating all 4 of the legs
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

    //adding all of the bed components to a group so that I can manipulate all of the objects to my liking
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

    bedGroup.rotation.y = Math.PI / 2;
    bedGroup.position.set(-1.8, 0, 0);
    bedGroup.scale.set(0.8, 0.8, 0.8);
// positioning the entire bed in the scene
    return bedGroup;
}

// Function to create the room
function createRoom() {
    const roomGroup = new THREE.Group();

    const backWallMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887 }); // Tan
    const leftWallMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887 });
    const rightWallMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887 });
  //  const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d }); // Saddle Brown
//applying walltexture to all 3 of the walls. I later removed the ceiling from the entire scene so that it is visible in the final website



    //back wall 
    const backWallGeometry = new THREE.BoxGeometry(6, 3, 0.1);
    const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
    backWall.position.set(0, 1.5, -3); //positioning the back wall
    backWall.castShadow = true;
    backWall.receiveShadow = true;


    //left wall
    const leftWallGeometry = new THREE.BoxGeometry(0.1, 3, 6);
    const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.position.set(-3, 1.5, 0); //positioning the left wall
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;


    //right wall
    const rightWallGeometry = new THREE.BoxGeometry(0.1, 3, 6);
    const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.position.set(3, 1.5, 0); //positioning the right wall
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;


    //floor
    const floorGeometry = new THREE.BoxGeometry(6, 0.1, 6);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, 0, 0); //positioning the floor wall
    floor.castShadow = true;
    floor.receiveShadow = true;


    // the carpet in front of the bed
    const carpetGeometry = new THREE.BoxGeometry(2, 0.01, 3);
    const carpetMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 }); // Orange Red
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
    carpet.position.set(0, 0.05, 0);
    carpet.castShadow = true;
    carpet.receiveShadow = true;

    roomGroup.add(backWall);
    roomGroup.add(leftWall);
    roomGroup.add(rightWall);
    roomGroup.add(floor);
    roomGroup.add(carpet);
// adding all of the walls and the floor to a group
    return roomGroup;
}

// Function to create a long table with drawers
function createTable() {
    const tableGroup = new THREE.Group();

    const tableTopGeometry = new THREE.BoxGeometry(5.1, 0.2, 1); //making a tabletop
    const tableTopMaterial = new THREE.MeshStandardMaterial({ mcolorap: 0x8b4513 }); //applying a texture to the table top
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.position.y = 1; // making it a big higher than the floor
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;

    const drawerGeometry = new THREE.BoxGeometry(1, 0.5, 0.8);
    const drawerMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

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

    tableGroup.add(tableTop);
    tableGroup.add(drawer1);
    tableGroup.add(drawer2);
    tableGroup.add(drawer3);

    tableGroup.position.set(2.5, -0.44, 0);
    tableGroup.rotation.y = Math.PI / 2;

    const buttonGeometry = new THREE.PlaneGeometry(1, 0.3);
    const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
    const callToActionButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    callToActionButton.position.set(0, 1, 0.07);

    tableGroup.add(callToActionButton);

    function toggleButtonVisibility() {
        callToActionButton.visible = !callToActionButton.visible;
        setTimeout(toggleButtonVisibility, Math.random() * 2000 + 1000);
    }
    toggleButtonVisibility();

    return tableGroup;
}

// Function to create the mini fridge
function createMiniFridge() {
    const fridgeGroup = new THREE.Group();
//creating a group to hold all of the parts
const exteriorMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const interiorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); //regular white colour for the interior of the fridge
    /**
     * I made an exterior and an interior of the fridge to make the outside red but the inside white (like a real fridge)
     * I chose the colour red because I thought It was a good colour to contrast from the rest of the scene
     */


    //creating the exterior and the interior parts of the fridge
    //left side exterior
    const exteriorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 1), exteriorMaterial);
    exteriorLeft.position.set(-0.53, 0, 0);
    exteriorLeft.castShadow = true;
    exteriorLeft.receiveShadow = true;

    //left side interior
    const interiorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.4, 0.9), interiorMaterial);
    interiorLeft.position.set(-0.51, 0, 0);
    interiorLeft.castShadow = true;
    interiorLeft.receiveShadow = true;


    //right side exterior
    const exteriorRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 1), exteriorMaterial);
    exteriorRight.position.set(0.55, 0, 0);
    exteriorRight.castShadow = true;
    exteriorRight.receiveShadow = true;


    //right side interior
    const interiorRight = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.4, 0.9), interiorMaterial);
    interiorRight.position.set(0.52, 0, 0);
    interiorRight.castShadow = true;
    interiorRight.receiveShadow = true;


    //top exterior
    const exteriorTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 1), exteriorMaterial);
    exteriorTop.position.set(0, 0.75, 0);
    exteriorTop.castShadow = true;
    exteriorTop.receiveShadow = true;


    //top interior
    const interiorTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.9), interiorMaterial);
    interiorTop.position.set(0, 0.72, 0);
    interiorTop.castShadow = true;
    interiorTop.receiveShadow = true;


    //bottom exterior
    const exteriorBottom = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 1), exteriorMaterial);
    exteriorBottom.position.set(0, -0.8, 0);
    exteriorBottom.castShadow = true;
    exteriorBottom.receiveShadow = true;


    //bottom interior
    const interiorBottom = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.9), interiorMaterial);
    interiorBottom.position.set(0, -0.77, 0);
    interiorBottom.castShadow = true;
    interiorBottom.receiveShadow = true;


    //back side exterior
    const exteriorBack = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.07), exteriorMaterial);
    exteriorBack.position.set(0, 0, -0.51);
    exteriorBack.castShadow = true;
    exteriorBack.receiveShadow = true;



    //back side interior
    const interiorBack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.03), interiorMaterial);
    interiorBack.position.set(0, 0, -0.45);
    interiorBack.castShadow = true;
    interiorBack.receiveShadow = true;


  // fridge door
    const fridgeDoorGeometry = new THREE.BoxGeometry(1, 1.5, 0.2);
    const fridgeDoorMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red
   
    const fridgeDoor = new THREE.Mesh(fridgeDoorGeometry, fridgeDoorMaterial);
    fridgeDoor.userData.clickable = true;
    fridgeDoor.castShadow = true;
    fridgeDoor.receiveShadow = true;

    const doorPivot = new THREE.Group();
    doorPivot.position.set(-0.5, 0, 0.45);
    doorPivot.add(fridgeDoor);
    fridgeDoor.position.set(0.5, 0, 0);

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

    const fridgeLight = new THREE.SpotLight(0xffffff, 1, 2, Math.PI / 4, 1, 2);
    fridgeLight.position.set(0, 0.80, -0.3);
    fridgeLight.target.position.set(0, -0.5, 0);
    fridgeLight.castShadow = true;
    fridgeLight.visible = false;
    fridgeLight.intensity = 12;
    fridgeLight.spread = 12;
    fridgeGroup.add(fridgeLight);
    fridgeGroup.add(fridgeLight.target);

    const fridgeLightB = new THREE.SpotLight(0xffffff, 1, 2, Math.PI / 4, 1, 2);
    fridgeLightB.position.set(0.6, 0.80, -0.3);
    fridgeLightB.target.position.set(0, -0.5, 0);
    fridgeLightB.castShadow = true;
    fridgeLightB.visible = false;
    fridgeLightB.intensity = 12;
    fridgeLightB.spread = 12;
    fridgeGroup.add(fridgeLightB);
    fridgeGroup.add(fridgeLightB.target);

// creating edges with cylinders for the fridge so that it doesnt look too geometrical
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const edgeRadius = 0.05;
    const edgeHeight = 1;

    const edgeGeometry = new THREE.CylinderGeometry(edgeRadius, edgeRadius, edgeHeight, 32);
    const edge1 = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge1.position.set(0, 0.75, 0.5);
    edge1.rotation.z = Math.PI / 2;
    edge1.castShadow = true;
    edge1.receiveShadow = true;
//positioning edges on the fridge 
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

    fridgeGroup.add(edge1);
    fridgeGroup.add(edge2);
    fridgeGroup.add(edge3);
    fridgeGroup.add(edge4);

    fridgeGroup.position.set(-2.3, 0.9, 2.3);

    fridgeGroup.rotation.y = -Math.PI / -2;

    let isDoorOpen = false;

    function onFridgeDoorClick() {
        if (isDoorOpen) {
            gsap.to(doorPivot.rotation, { duration: 1, y: 0 });
            fridgeLight.visible = false;
            fridgeLightB.visible = false;
        } else {
            gsap.to(doorPivot.rotation, { duration: 1, y: -Math.PI / 2 });
            fridgeLight.visible = true;
            fridgeLightB.visible = true;
            fridgeLight.intensity = 5;
            fridgeLightB.intensity = 5;
        }
        isDoorOpen = !isDoorOpen;
    }

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.clickable) {
                if (intersects[i].object === fridgeDoor) {
                    onFridgeDoorClick();
                    break;
                }
            }
        }
    }
 

    return fridgeGroup;
}
sceneGroup.position.set(0, 0, 0);
camera.position.set(0, 5, 10); // Position camera to look at the scene from a good angle
camera.lookAt(sceneGroup.position); // Ensure the camera focuses on the sceneGroup
const bedGroup = createBed();
sceneGroup.add(bedGroup);

const roomGroup = createRoom();
sceneGroup.add(roomGroup);

const tableGroup = createTable();
sceneGroup.add(tableGroup);

const fridgeGroup = createMiniFridge();
sceneGroup.add(fridgeGroup);

// // Adjust the entire scene position
// sceneGroup.position.x = -5;
// sceneGroup.position.z -= 2;
// sceneGroup.rotation.y = Math.PI / 4;

// Initialize the GLTFLoaders
const deskLoader = new GLTFLoader();
const tvLoader = new GLTFLoader();

const deskModelPath = 'models/Standing Desk.glb';
const tvModelPath = 'models/TV.glb';

// Load the desk model
deskLoader.load(
    deskModelPath,
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0.3, 3.03, -8.9);
        model.rotation.y = Math.PI / 1;
        model.castShadow = true;
        model.receiveShadow = true;
        model.position.y -= 3;
        sceneGroup.add(model);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);

// Load the TV model
tvLoader.load(
    tvModelPath,
    function (gltf) {
        const tvModel = gltf.scene;
        tvModel.position.set(2.5, 3.85, 0);
        tvModel.castShadow = true;
        tvModel.receiveShadow = true;
        tvModel.scale.set(1, 1, 1);
        tvModel.position.y -= 3;
        sceneGroup.add(tvModel);
        tvModel.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
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

// Handle window resize
window.addEventListener('resize', () => {
    camera.fov = 60;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

// Add ambient light from the TV screen
const tvLight = new THREE.PointLight(0x00ffff, 1, 12);
tvLight.position.set(2.4, 1.6, 0.1);
scene.add(tvLight);

// Raycaster and mouse vector for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// function onMouseMove(event) {
//     // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     // Map mouse coordinates to camera displacement
//     const cameraDisplacement = 0.1; // Max displacement on mouse move
//     camera.position.x += (mouse.x * cameraDisplacement - camera.position.x) * 0.5;
//     camera.position.y += (mouse.y * cameraDisplacement - camera.position.y) * 1;

//     // Optional: adjust the camera looking direction or add some rotation if desired
//     camera.lookAt(scene.position);
    
// }

//  // usage:
//  rotateObject(myPlane, 40, 30, 20);


// Function to update the scene rotation
function updateSceneRotation(sceneGroup, speed) {
    // Increment the rotation around the y-axis
    sceneGroup.rotation.y += speed;
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update the scene rotation
    updateSceneRotation(sceneGroup, 0.005); // Adjust speed as necessary
    
    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();













window.addEventListener('mousemove', onMouseMove, false);
