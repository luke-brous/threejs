
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
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



var barngeometry = new THREE.BoxGeometry(12, 12, 12);
var barnmaterial = new THREE.MeshStandardMaterial( {color: 0xff0000} );
var barn = new THREE.Mesh( barngeometry, barnmaterial );
barn.position.set(0,6,0);
scene.add( barn );
















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
