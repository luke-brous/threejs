/*-----------------------------------------------------------------
 * Red Barn Exercise
 * 
 * Starting from the barn example, do the following:
 * 1. Change it to use basic material
 * 2. Make it a Red barn
 * 3. Add a GUI, so you can control the color
 * 
 * Hint: Use a hex value for the color in your params dicitonary,
 * namely 0xff0000
 *---------------------------------------------------------------*/

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

const box1dims = {width: 2,
                  height: 3,
                  depth: 4};

var box1;

function newBox() {
    scene.remove(box1);
    const geo = TW.barnGeometry(box1dims.width,
                                box1dims.height,
                                box1dims.depth);
    box1 = TW.createMesh(geo);
    box1.name = "barn";
    scene.add(box1);
}

newBox();

box1.position.set(2,1,0);
box1.rotateY(Math.PI/2);
box1.scale.z = 2;


// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.add(box1dims, 'width', 1, 10).onChange(newBox);
gui.add(box1dims, 'height', 1, 10).onChange(newBox);
gui.add(box1dims, 'depth', 1, 10).onChange(newBox);


// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: 0, maxx: 5,
                            miny: 0, maxy: 5,
                            minz: -5, maxz: 0});

