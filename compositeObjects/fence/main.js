/* This scene shows a long series or chain of transformations to 
 * construct a picket fence from barn geometries.   
 */

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

const params = {
    picketWidth: 1,
    picketHeight: 5,
    picketDepth: 0.5,
    picketTurn: 0,
    numPickets: 30,
}

const barn = TW.createMesh(TW.barnGeometry(30,40,50));
barn.translateX(-30);
scene.add(barn);

var fence;

function remakeFence() {
    scene.remove(fence);
    fence = new THREE.Group();
    const geo = TW.barnGeometry(params.picketWidth,
                                params.picketHeight,
                                params.picketDepth);
    // we will be modifying this variable
    let picket = TW.createMesh(geo);
    fence.add(picket);
    for(let i = 0; i < params.numPickets; i++ ) {
        picket = picket.clone();
        picket.translateX(params.picketWidth*1.1);
        picket.rotateY(params.picketTurn);
        fence.add(picket);
    }
    scene.add(fence);
}

remakeFence();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const PI = Math.PI;

const gui = new GUI();
gui.add(params, 'picketWidth', 0, 3).onChange(remakeFence);
gui.add(params, 'picketHeight', 0, 10).onChange(remakeFence);
gui.add(params, 'picketDepth', 0, 1).onChange(remakeFence);
gui.add(params, 'picketTurn', 0, Math.PI/18).onChange(remakeFence);
gui.add(params, 'numPickets', 0, 50).onChange(remakeFence);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: 0, maxx: 30,
                            miny: 0, maxy: 50,
                            minz: -50, maxz: 0});
TW.toggleAxes("show");
