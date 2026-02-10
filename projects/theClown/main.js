/* Luke Broussard
2/9/2026
The main file for the clown project. This file sets up the scene and calls functions from clown.js to create the clown.
*/
import * as THREE from 'three';
import { TW } from 'tw';
import * as clown from './clown.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Scene

clown.originPoint();

// right leg
clown.makeLeg(1);

// left leg 
clown.makeLeg(-1);

// body
clown.makeBody();

// arms
clown.makeArm(1);
clown.makeArm(-1);

// head
clown.makeHead();

// ===============================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer, scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: 0, maxy: 12,
                            minz: -10, maxz: 10});
