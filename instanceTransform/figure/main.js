/* This demo shows (1) creating several different objects (sphere,
 * cube, cones), (2) specifying colors for them, (3) and placing them
 * in the scene.
 */

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import { makeFigureParams } from './figure.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

const params = {hatHeight: 4,
                hatAngle: Math.PI/10,
                headDim: 2,
                bodyHeight: 16,
                bodyWidth: 8,
                bodyColor: 0x228b22, // forestGreen
                headColor: 0x000000, // black
                faceColor: 0xd2b28c, // tan
                hatColor: 0x008080, // teal
               };

// Globals to store parts of the figure. Some of these are used in the GUI below.
// All are used when we re-make the figure, so we can remove the old figure

var body;
var head;
var hat;

function remakeFigure() {
    scene.remove(body);
    scene.remove(head);
    scene.remove(hat);
    makeFigureParams(scene, params);
    body = scene.getObjectByName("body");
    head = scene.getObjectByName("head");
    hat = scene.getObjectByName("hat");
}

// invoke this when the page loads, so that there's an initial figure
remakeFigure();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.add(params, 'hatHeight', 1, 10).onChange(remakeFigure);
gui.add(params, 'hatAngle', -Math.PI/2, +Math.PI/2).onChange(remakeFigure);
gui.add(params, 'headDim', 1, 10).onChange(remakeFigure);
gui.add(params, 'bodyHeight', 1, 20).onChange(remakeFigure);
gui.add(params, 'bodyWidth', 1, 10).onChange(remakeFigure);
gui.addColor(params, 'bodyColor').onChange((val) => body.material.color.setHex(val));
gui.addColor(params, 'headColor').onChange(remakeFigure);
gui.addColor(params, 'faceColor').onChange(remakeFigure);
gui.addColor(params, 'hatColor').onChange((val) => hat.material.color.setHex(val));

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -1.5, maxx: +1.5,
                            miny: 0, maxy: 30,
                            minz: -1.5, maxz: +1.5});

