/* This scene allows you to play with lots of transformations 
 * of the barn.
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
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
}

const barn = TW.createMesh(TW.barnGeometry(30, 40, 50));
scene.add(barn);

/* This sets the transformation of the barn, 
   overwriting any past transformations
 */

function transformBarn1() {
    barn.position.set(params.translateX,
                      params.translateY,
                      params.translateZ);
    barn.rotation.set(params.rotateX,
                      params.rotateY,
                      params.rotateZ);
    barn.scale.set(params.scaleX,
                   params.scaleY,
                   params.scaleZ);
}

// This actually does nothing with the initial settings of the
// parameters, but might matter if we change them
transformBarn1();
    
/* This function does *further* translations and rotations, on top of
 * any that the mesh already has. That is, they accumulate. It's not
 * used in this demo, but is worth discussing in this context.
*/

function transformBarnAccumulate() {
    barn.translateX(params.translateX);
    barn.translateY(params.translateY);
    barn.translateZ(params.translateZ);
    barn.rotateX(params.rotateX);
    barn.rotateY(params.rotateY);
    barn.rotateZ(params.rotateZ);
    barn.scale.set(params.scaleX,
                   params.scaleY,
                   params.scaleZ);
}


// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const PI = Math.PI;

const gui = new GUI();
gui.add(params, 'translateX', -100, 100).onChange(transformBarn1);
gui.add(params, 'translateY', -100, 100).onChange(transformBarn1);
gui.add(params, 'translateY', -100, 100).onChange(transformBarn1);
gui.add(params, 'rotateX', -PI, PI).onChange(transformBarn1);
gui.add(params, 'rotateY', -PI, PI).onChange(transformBarn1);
gui.add(params, 'rotateZ', -PI, PI).onChange(transformBarn1);
gui.add(params, 'scaleX', -2, 2).onChange(transformBarn1);
gui.add(params, 'scaleY', -2, 2).onChange(transformBarn1);
gui.add(params, 'scaleZ', -2, 2).onChange(transformBarn1);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: 0, maxx: 30,
                            miny: 0, maxy: 50,
                            minz: -50, maxz: 0});
TW.toggleAxes("show");


