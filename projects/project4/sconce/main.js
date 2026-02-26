//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

const colors = [
    'red',
    'green',
    'blue',
    'cyan',
    'magenta',
    'yellow'
];

// Creates and returns a box with each side a different color, viewed
// from the *inside*.

// See https://threejs.org/docs/#api/en/constants/Materials

function makeBox(width, height, depth) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mats = colors.map( color => new THREE.MeshBasicMaterial({color: color,
                                                                   side: THREE.BackSide}));
    return new THREE.Mesh(geo, mats);
}

const box = makeBox(100, 100, 100);
scene.add(box);


function wallLight() {
    const coneGeo = new THREE.ConeGeometry(params.coneRad, params.coneHeight, 16,16,true)
    const coneMesh = new THREE.MeshStandardMaterial()
}



// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -50, maxx: 50,
                            miny: -50, maxy: 50,
                            minz: -50, maxz: 50});
TW.toggleAxes("show");


