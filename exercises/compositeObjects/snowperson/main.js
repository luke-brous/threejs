/* This scene shows a group of meshes treated as one thing, in 
 * this case, a snowperson.
 */

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as SP from './snowperson.js';

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
    wireFrame: true,
    snowColor: 0xffffff,        // white
    noseColor: 0xff8c00,        // orange
    botSize: 3,                 // bottom ball
    midSize: 2,                 // middle ball
    topSize: 1,                 // top ball
    noseSize: 0.5,              // length of nose
};

var olaf;
var frosty;

function remakeScene() {
    scene.remove(olaf);
    scene.remove(frosty);
    
    olaf = SP.makeSnowPerson(params);
    olaf.rotateY(-Math.PI/4);  // 45 degrees towards us
    frosty = SP.makeSnowPerson({botSize: 4});
    frosty.translateX(10,0,0);

    scene.add(olaf);
    scene.add(frosty);
}

// invoke this when the page loads, so that there's an initial figure
remakeScene();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.add(params, 'wireFrame').onChange(remakeScene);
gui.add(params, 'botSize', 1, 10).onChange(remakeScene);
gui.add(params, 'midSize', 1, 10).onChange(remakeScene);
gui.add(params, 'topSize', 1, 10).onChange(remakeScene);
gui.add(params, 'noseSize', 1, 10).onChange(remakeScene);
gui.addColor(params, 'snowColor').onChange(remakeScene);
gui.addColor(params, 'noseColor').onChange(remakeScene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: +10,
                            miny: 0, maxy: 15,
                            minz: -10, maxz: +10});

