//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as LEG from './leg.js';

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
    ankleRotation: TW.degrees2radians(-10),
    kneeRotation: TW.degrees2radians(-30),
    hipRotation: TW.degrees2radians(45),
    footLength: 10,
    calfLength: 20,
    thighLength: 25
};

var leg;

function remakeLeg() {
    scene.remove(leg);
    leg = LEG.makeLeg(parameters);
    scene.add(leg);
}

function moveLeg() {
    LEG.adjustJointAngles(leg, parameters);
}
   
remakeLeg();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const halfPI = Math.PI / 2.0;

const gui = new GUI();
gui.add(parameters,'ankleRotation',-Math.PI/3,Math.PI/3).step(0.001).onChange(moveLeg);
gui.add(parameters,'kneeRotation', -2*Math.PI/3, 0.1).step(0.001).onChange(moveLeg);
gui.add(parameters,'hipRotation', -Math.PI/6,Math.PI).step(0.001).onChange(moveLeg);
gui.add(parameters,'footLength', 1, 20).step(1).onChange(remakeLeg);
gui.add(parameters,'calfLength', 1, 40).step(1).onChange(remakeLeg);
gui.add(parameters,'thighLength', 1, 50).step(1).onChange(remakeLeg);

// Set up a camera for the scene
TW.cameraSetup(renderer,
               scene,
               {minx: 0, maxx: 5,
                maxy: 0, miny: -(parameters.thighLength+parameters.calfLength),
                minz: -3, maxz: 3});
TW.toggleAxes("show");
