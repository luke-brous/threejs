/* This demo shows using mouse clicks to turn the camera
 * proportionally to how far left/right of center you click.
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'gui';
import * as TOWN from './town.js';
import * as CAM from './movingCamera.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// setup

const renderer = new THREE.WebGLRenderer();

var canvas = renderer.domElement;
document.body.appendChild(canvas);
renderer.setSize(canvas.clientWidth,canvas.clientHeight);
renderer.setClearColor( 0xffffff, 1);

// ================================================================
// Build your scene here

const params = {
};

TOWN.makeTown(scene);

const scene_bb = {
    minx: -10, maxx: 10,
    miny: 0, maxy: 10,
    minz: -10, maxz: 10};


const fovy = 75;
const aspect_ratio = canvas.clientWidth/canvas.clientHeight;
const myCam = CAM.makeMovingCamera(renderer, scene_bb, fovy, 1, 15);
globalThis.myCam = myCam;
/*
TW.mainInit(renderer, scene);
const state = TW.cameraSetup(renderer, scene, scene_bb);
globalThis.state = state;
*/

function animationLoop() {
    renderer.render(scene,myCam);
    requestAnimationFrame(animationLoop);
}
animationLoop();

// const gui = new GUI();

// ================================================================
// keyboard callbacks

function handleKey(event) {
    switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
        myCam.forward(1);
        break;
    case 'KeyS':
    case 'ArrowDown':
        myCam.backward(1);
        break;
    case 'KeyD':
    case 'ArrowRight':
        myCam.right(10);
        break;
    case 'KeyA':
    case 'ArrowLeft':
        myCam.left(10);
        break;
    }
    
}

document.addEventListener('keydown', handleKey);

// ================================================================
// Mouse Callback

const forwardSpeed = 3.0;       // distance in world units
const turnSpeed = 45.0;         // degrees


function onMouseClick (event) {
    var mx = event.clientX;
    var my = event.clientY;
    console.log("click at (" + mx + "," + my + ")");
    var target = event.target;
    var rect = target.getBoundingClientRect();
    var cx = mx - rect.left;
    var cy = my - rect.top;
    console.log("clicked on c1 at (" + cx + "," + cy + ")");
    // Now, do something with it
    const x = cx - rect.width/2
    const y = rect.height/2 - cy;
    const fx = x/(rect.width/2);
    const fy = y/(rect.height/2);
    console.log(fx, fy);
    myCam.forward(forwardSpeed * fy);
    myCam.right(turnSpeed * fx);
}

document.addEventListener('click', onMouseClick);
