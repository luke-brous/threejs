/*-----------------------------------------------------------------
 * Expand Steve's Movement Exercise
 * 
 * - Add an option where the "e" key causes Steve to go northeast
 * 
 * - Add an option where the "t" key causes Steve to teleport to 
 * his initial location
 * 
 * - Add an event handler for mouse clicks:
 *     - A mouse click in the upper region of the window causes 
 *       Steve's Y position to increase
 *     - A mouse click in the lower region of the window causes 
 *       Steve's Y position to decrease
 *---------------------------------------------------------------*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';   
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as STEVE from './steve.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Infrastructure

// Create a renderer to render the scene
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xffffff ); // white background
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 250, -150);
globalThis.camera = camera;
//this allows the user to drag the scene around the origin
const controls = new OrbitControls(camera, renderer.domElement);   

// ================================================================
// Build your scene here

//add a grid to the scene
const size = 300; 
const step = 10; 
const gridHelper = new THREE.GridHelper( size, step ); 
gridHelper.position.set(0,0,0);
scene.add( gridHelper );

var steve = STEVE.makeSteve();
globalThis.steve = steve;

scene.add(steve);

// ================================================================
// Movement computations

//the following functions are adapted from http://webmaestro.fr/character-controls-three-js/


function motion() {
    //setDirection();
    // (if any)
    const dv = steve.directionVec;
    if (dv.x !== 0 || dv.z !== 0) {
        steve.walk(); 
        steve.rotate();
        steve.move();
    }
}
    
globalThis.motion = motion;

// ================================================================
// Keyboard Callbacks

//determines which key has been pressed and updates the direction vector accordingly
function onKeyDown( event ) {
    
    switch ( event.code ) {

        // up  move forward
    case 'ArrowUp':
    case 'KeyW':
        steve.directionVec.setZ(1);
        break;


        // left move to +X
    case 'ArrowLeft':
    case 'KeyA':
        steve.directionVec.setX(1);
        break;

        // down move backwards
    case 'ArrowDown':
    case 'KeyS':
        steve.directionVec.setZ(-1);
        break;

    case 'ArrowRight':
    case 'KeyD':
        steve.directionVec.setX(-1);
        break;
    }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', () => steve.directionVec.set(0,0,0));


// ================================================================
// animation loop

function oneStep() {
    motion();
    renderer.render(scene,camera);
}
globalThis.oneStep = oneStep;

function render(){
    requestAnimationFrame(render);
    oneStep();
}
render();                   

