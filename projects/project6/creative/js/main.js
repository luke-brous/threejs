/* This scene shows (1) creating several different objects (sphere,
 * cube, cones), (2) specifying colors for them, (3) and placing them
 * in the scene.
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import GUI from 'gui';
import * as CANNON from 'cannon-es';
import car from './car.js'

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.CANNON = CANNON;

// global variables 
let camera, scene, renderer;
let world, body;

// Load world
threeInit()
cannonInit()
animate()



//===================================================================
// Set up Three.js

function threeInit() {
    console.log("Initializing Three.js");
// Create an initial empty Scene
    scene = new THREE.Scene();
    globalThis.scene = scene;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Set initial camera position
    camera.position.set(0, 10, 20); 
    camera.lookAt(0, 0, 0);

    window.addEventListener('resize', onWindowResize, false);



    // Create a renderer to render the scene
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement)

    car()

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
    
    
    world.fixedStep();

    renderer.render(scene, camera);
}


const gui = new GUI();
