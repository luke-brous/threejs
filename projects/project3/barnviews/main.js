//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

var wireBarn = TW.wireBarnMesh(10, 10, 20);
scene.add(wireBarn);

var origin = new THREE.Mesh( new THREE.SphereGeometry(0.3),
                             new THREE.MeshBasicMaterial());
scene.add(origin)

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.clearColor = new THREE.Color(0,0,0);              // black
TW.mainInit(renderer,scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: 0, maxx: 10,
                            miny: 0, maxy: 15,
                            minz: -20, maxz: 0});
