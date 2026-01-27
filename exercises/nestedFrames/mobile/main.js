//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as MOB from './mobile.js';

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
    topLength: 10,
    rightLength: 8,
    topAngle: 0,
    rightAngle: 0,
    barnAngle: 0,
    boxAngle: 0,
    gemAngle: 0,
};

var mobile;

function makeMobile(parameters) {
    const p = parameters;

    // build the leaves, left to right
    const barn = MOB.barn(1,2,3);
    barn.rotation.y = p.barnAngle;
    const box = MOB.box(2,1,2);
    box.rotation.y = p.boxAngle;
    const gem = MOB.octahedron(1);
    gem.rotation.y = p.gemAngle;

    // Now, build the right branch
    const rightBranch = MOB.branch("red",
                                   p.rightLength,
                                   MOB.string(3, box),
                                   MOB.string(3, gem));
    rightBranch.rotation.y = p.rightAngle;
    // and the top
    const topBranch = MOB.branch("blue",
                                 p.topLength,
                                 MOB.string(4, barn),
                                 MOB.string(4, rightBranch));
    topBranch.rotation.y = p.topAngle;
    return MOB.string(5,topBranch);
}
                                 
function remakeMobile() {
    scene.remove(mobile);
    mobile = makeMobile(parameters);
    scene.add(mobile);
}

function updateScene() {
    remakeMobile();
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
gui.add(parameters, 'topLength', 1, 10).step(1).onChange(updateScene);
gui.add(parameters, 'rightLength', 1, 8).step(1).onChange(updateScene);
gui.add(parameters, 'topAngle', -halfPI, +halfPI).onChange(updateScene);
gui.add(parameters, 'rightAngle', -halfPI, +halfPI).onChange(updateScene);
gui.add(parameters, 'barnAngle', -halfPI, +halfPI).onChange(updateScene);
gui.add(parameters, 'boxAngle', -halfPI, +halfPI).onChange(updateScene);
gui.add(parameters, 'gemAngle', -halfPI, +halfPI).onChange(updateScene);

// Set up a camera for the scene
TW.cameraSetup(renderer,
               scene,
               {minx: -8, maxx: 8,
                maxy: 0, miny: -12,
                minz: -8, maxz: 8});
TW.toggleAxes("show");
