/**
 * @author Luke Broussard
 * @abstract A Rocket League mini version built with Three.js and Cannon-es.js. 
 * 
 * 
 * ISSUES TO WORK ON 04/25:
 * - Add shadows to the scene (cast and receive)
 * - Fix jump logic so that the car only jumps when it is grounded -- done
 * - Create the actual arena (goals ceiling walls) -- done
 * - Need to fix the ramps so the physics work
 * - Add stands and decerations outside of arena
 * - let the car rotate on an axis
 * - let the car double jump
 * - make sure arena has transparency -- done
 * - fix on screen text -- done
 * - add sound effects
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger'
import car from './car.js'
import arena from './arena.js'
import ball from './ball.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { updateCarCamera } from './camera.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.CANNON = CANNON;

// global variables 
let camera, scene, renderer;
let world;
let controls;
let cannonDebugger;
let arenaInstance;
let carInstance;
let ballInstance;
let isBallCam = false; // Start in Car Cam mode
let isOrbitMode = false; // Orbit camera mode

// common RL spawns
const KICKOFF_SPAWNS = [
    { x: 0, z: 75 },
    { x: -10, z: 78 },
    { x: 10, z: 78 },
    { x: -30, z: 40 },
    { x: 30, z: 40 },
];

// Load world
threeInit()
cannonInit()

arenaInstance = arena(scene, world, 1000, 1000, onGoalScored);
carInstance = car(scene,world)
ballInstance = ball(scene,world)
cannonDebugger = new CannonDebugger(scene, world, {})

resetCarToRandomKickoff();

animate()

//===================================================================
// Set up Three.js

function threeInit() {
    console.log("Initializing Three.js");
    // Create an initial empty Scene
    scene = new THREE.Scene();
    globalThis.scene = scene;
    scene.background = new THREE.Color(0x87ceeb);

    // Create the axes helper (the number 10 sets the length of the lines)
    const axesHelper = new THREE.AxesHelper(10);
    
    // Set it to invisible by default, just like TW
    axesHelper.visible = false; 
    scene.add(axesHelper);

    // Listen for the x key to toggle visibility of axes
    window.addEventListener('keydown', (event) => {
        if (event.key === 'x' || event.key === 'X') {
            axesHelper.visible = !axesHelper.visible;
        }
    });

    // Change from Car Cam to Ball Cam when f is pressed
    window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'f') {
        isBallCam = !isBallCam;
        console.log(`Camera Mode: ${isBallCam ? 'Ball Cam' : 'Car Cam'}`);
        }
    });

    // Toggle Orbit Camera mode when o is pressed
    window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'o') {
        isOrbitMode = !isOrbitMode;
        console.log(`Camera Mode: ${isOrbitMode ? 'Orbit Cam' : 'Car Cam'}`);
        }
    });


    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000);

    // Set initial camera position
    camera.position.set(0, 10, 20); 
    camera.lookAt(0, 0, 0);

     // Create a renderer to render the scene
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping

    document.body.appendChild(renderer.domElement)

    controls = new OrbitControls( camera, renderer.domElement );
    // controls.update() must be called after any manual changes to the camera's transform
    controls.update();

    

    window.addEventListener('resize', onWindowResize, false);


}

function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

//====================================================================
// Set up Cannon.js

function cannonInit() {
    console.log("Initializing Cannon.js");

    world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82 * 1.5, 0) })


}

//====================================================================
// Animate loop

function animate() {
    requestAnimationFrame(animate);
    
    // Only update OrbitControls in orbit mode
    if (isOrbitMode) {
        controls.update();
    }
    const deltaTime = 1/60; // Fixed time step for physics
    
    world.fixedStep();
    // cannonDebugger.update() // Update the CannonDebugger meshes
    carInstance.update()
    ballInstance.update()

    // Only update custom camera when not in orbit mode
    if (!isOrbitMode) {
        updateCarCamera(camera, carInstance.mesh.chassisMesh, ballInstance.mesh, isBallCam);
    }

    renderer.render(scene, camera);
}
function resetCarToRandomKickoff() {
    const spawn = KICKOFF_SPAWNS[Math.floor(Math.random() * KICKOFF_SPAWNS.length)];
    const isSouthSide = Math.random() < 0.5;

    // Determine the Z-position based on the side
    let zCoordinate;
    let targetYaw;

    if (isSouthSide) {
        // Spawn on the positive Z side
        zCoordinate = spawn.z; 
        // Rotate 90 degrees left to face the center
        targetYaw = -Math.PI / 2; 
    } else {
        // Spawn on the negative Z side
        zCoordinate = -spawn.z; 
        // Rotate 90 degrees right to face the center
        targetYaw = Math.PI / 2; 
    }

    // Apply the physics reset
    const chassis = carInstance.physics.chassisBody;
    
    chassis.position.set(spawn.x, 2, zCoordinate);
    
    chassis.velocity.set(0, 0, 0);
    chassis.angularVelocity.set(0, 0, 0);

    // Set the rotation
    // Set the y so the car is flat on the ground
    chassis.quaternion.setFromEuler(0, targetYaw, 0);
}

/**
 * @function onGoalScored, which is called by the arena when a goal is scored. 
 * It resets the ball and car to kickoff positions, and logs the team that scored.    
 * @param {*} team 
 */
function onGoalScored(team) {
    console.log(`Goal scored for ${team}!`);
    
    ballInstance.physics.position.set(0, 2, 0);
    ballInstance.physics.velocity.set(0, 0, 0);
    ballInstance.physics.angularVelocity.set(0, 0, 0);

    // Reset Car to a random kickoff spawn
    resetCarToRandomKickoff();
}