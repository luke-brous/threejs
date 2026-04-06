/* This scene shows (1) creating several different objects (sphere,
 * cube, cones), (2) specifying colors for them, (3) and placing them
 * in the scene.
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import GUI from 'gui';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger'
import car from './car.js'
import arena from './arena.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.CANNON = CANNON;

// global variables 
let camera, scene, renderer;
let world, body;
let controls;
let cannonDebugger;
let arenaInstance;
let carInstance;

// Load world
threeInit()
cannonInit()


arenaInstance = arena(scene, world, 1000, 1000);
carInstance = car(scene,world)
cannonDebugger = new CannonDebugger(scene, world, {})

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

    // Listen for the "a" key to toggle visibility
    window.addEventListener('keydown', (event) => {
        if (event.key === 'x' || event.key === 'X') {
            axesHelper.visible = !axesHelper.visible;
        }
    });


    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000);

    // Set initial camera position
    camera.position.set(0, 10, 20); 
    camera.lookAt(0, 0, 0);

     // Create a renderer to render the scene
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

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

    world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) })


}

//====================================================================
// Animate loop

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    
    world.fixedStep();
    cannonDebugger.update() // Update the CannonDebugger meshes
    carInstance.update()

    renderer.render(scene, camera);
}


const gui = new GUI();
