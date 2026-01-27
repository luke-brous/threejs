//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as SNAKE from './snake.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

const parameters = {
    numSegments: 10,
    segmentLength: 1,
    jointAngles: new Array(10).fill(0),
};

var snake;

function remakeSnake() {
    scene.remove(snake);
    // snake = SNAKE.makeSnake(parameters);
    snake = SNAKE.makeSnakeRec(parameters);
    scene.add(snake);
}

function updateScene() {
    remakeSnake();
}
updateScene();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const halfPI = Math.PI / 2.0;

const gui = new GUI();
gui.add(parameters, 'numSegments', 1, 10).step(1).onChange(updateScene);
gui.add(parameters, 'segmentLength', 1, 5).step(1).onChange(updateScene);
const jointsFolder = gui.addFolder('Joint Angles');

// Limit rotations to 60 degrees
// These variables aren't great names, but they are just used below.
const a0 = TW.degrees2radians(-60);
const a1 = TW.degrees2radians(60);

const ja = parameters.jointAngles;
ja.forEach((_, i) => {
    jointsFolder.add(ja, i, a0, a1).name(`Joint ${i}`).onChange(updateScene);
});

// Set up a camera for the scene
TW.cameraSetup(renderer,
               scene,
               {minx: 0, maxx: 5,
                maxy: 0, miny: -(parameters.numSegments*parameters.segmentLength),
                minz: -3, maxz: 3});
TW.toggleAxes("show");
