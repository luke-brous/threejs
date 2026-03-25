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



// This has 9 faces. Here's the documentation in TW; feel free
// to look at the code as well.

/* The resulting geometry has these sides/material groups:

     0 front quad
     1 east or +x quad
     2 west -x quad
     3 east roof quad
     4 west roof quad
     5 bottom quad
     6 back quad
     7 front upper triangle
     8 back upper triangle
     */
function house() {
    const barnGeometry = TW.barnGeometryWithMaterialGroups(30, 40, 50);

    


    scene.add(barnMesh);
    return barnMesh
}


function colorsBox() {
    scene.remove(boxMesh);
    const matArray = colorsArray.map((c) => new THREE.MeshBasicMaterial({color: c}));
    boxMesh = new THREE.Mesh( boxGeom, matArray );
    scene.add(boxMesh);
}


    

// ===============================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer, scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -50, maxx: 50,
                            miny: 0, maxy: 12,
                            minz: -50, maxz: 50});

