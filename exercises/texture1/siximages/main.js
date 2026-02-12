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

// ================================================================

var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: 0, maxx: 6,
                            miny: -0.5, maxy: 0.5,
                            minz: 0, maxz: 1});

globalThis.state = state;
state.renderer.setAnimationLoop(null);

// ================================================================
// Build your scene here

// Function adds the textured box to the scene once the textures are loaded.
const planeGeom = new THREE.PlaneGeometry(1, 1);

const faceFiles = ["buffy.gif",
                   "willow.gif",
                   "xander.gif",
                   "angel.gif",
                   "giles.gif",
                   "dawn.gif"];

const loader = new THREE.TextureLoader();
for(const i in faceFiles) {
    const ff = faceFiles[i];
    // append a random number to the URL to ensure that the image hasn't been cached
    const rnd = Math.floor(Math.random()*10000);
    const texture = loader.load("images/"+ff+"?"+rnd);
    const mat = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture});
    const mesh = new THREE.Mesh( planeGeom, mat );
    scene.add(mesh);
    mesh.position.x = i;
    console.log('added ', ff);
}
// This might be before the images are all loaded
TW.render();
    
// ================================================================

console.log('main.js is done');
