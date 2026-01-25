/*-----------------------------------------------------------------
 * Second Box Exercise
 * 
 * Modify the box to change its dimensions.
 * Add a second box, next to the first, 
 *   moving it by using <mesh>.position.set(x,y,z)
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
    const geo = new THREE.BoxGeometry(box1dims.width,
                                      box1dims.height,
                                      box1dims.depth);
    const mat = new THREE.MeshNormalMaterial();
    box1 = new THREE.Mesh(geo, mat);
    box1.name = "box1";
    scene.add(box1);
}

newBox();

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
                           {minx: -5, maxx: 5,
                            miny: -5, maxy: 5,
                            minz: -5, maxz: 5});

