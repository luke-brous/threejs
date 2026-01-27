//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as lamp from './lamp.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Scene

// these are the defaults, but adjustable via GUI
const params = {
    shadeAngle: 90,
    elbowAngle: -90,
    baseAngle: 45,
};

const mom = lamp.makeUpperArm(params);
// caller sets the rotation of the object
mom.getObjectByName("elbow").rotation.z = TW.degrees2radians(params.elbowAngle);
scene.add(mom);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const PI = 180;                 // this is convenient, but it's an abomination

const gui = new GUI();
gui.add(params, 'shadeAngle', -PI, PI).onChange((val) => {
    mom.getObjectByName("shade").rotation.z = TW.degrees2radians(val);
});
gui.add(params, 'elbowAngle', -PI, PI).onChange((val) => {
    mom.getObjectByName("elbow").rotation.z = TW.degrees2radians(val);
});


// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: 0, maxy: 12,
                            minz: -10, maxz: 10});
