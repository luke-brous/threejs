/*-----------------------------------------------------------------
 * Close the Box Exercise
 * 
 * Click and drag with the mouse, to look at the box from multiple
 * directions. You'll notice that I omitted the bottom.  Modify
 * boxGeometryWithMaterialGroups.js to add the bottom.    
 * 
 * Some suggestions:
 *   - try to draw a map/picture of the vertices
 *   - you want the vertices that are on the bottom (negative Y)
 *   - you want them counterclockwise from one corner
 *---------------------------------------------------------------*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import { boxGeometryWithMaterialGroups } from './boxGeometryWithMaterialGroups.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;
globalThis.boxGeometryWithMaterialGroups = boxGeometryWithMaterialGroups;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ====================================================================
// Building Geometry

const box2geom = boxGeometryWithMaterialGroups(2, 4, 6);
const box2mat = (['blue', 'red', 'green', 'cyan', 'yellow', 'magenta']
                 .map( color => new THREE.MeshBasicMaterial({color})));

// Create a multicolor for the box
const box2 = new THREE.Mesh( box2geom, box2mat);
box2.name = 'box2';
scene.add(box2);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -3, maxx: 3,
                            miny: -3, maxy: 3,
                            minz: -3, maxz: 3});
