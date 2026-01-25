/*-----------------------------------------------------------------
 * Build a Town Exercise
 * 
 * Follow the instructions in town.md to build your own town scene.
 * Add multiple trees and multiple snowmen.  
 * I strongly suggest that you use a group for the tree:
 *     - create a THREE.Group to hold the two parts of the tree
 *     - define a function to create and return the group
 *     - place the group in the scene using position.set()
 *---------------------------------------------------------------*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import * as SNOW from './snowperson.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// build your town here






SNOW.makeSnowPerson(SNOW.snowParameters);








// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -5, maxx: 35,
                            miny: 0, maxy: 60,
                            minz: -60, maxz: 0});

