/* This scene shows a group of only one mesh (a bell), so we can 
 * rotate it around a different location.
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
    bellWidth: 2,
    bellHeight: 4,
    frameAngle: 0,              // angle of the frame contain the cone
    coneAngle: 0,               // angle of the cone around its center
    wireBell: true,
};

function makeBell(params) {
    const bellFrame = new THREE.Group();

    // we will mark the origin of the bellFrame with a box,
    // since we can easily see how a box is rotated, and the origin
    // is at the center of the box.
    const boxGeom = new THREE.BoxGeometry(1,1,1);
    const boxMat = new THREE.MeshBasicMaterial({color: "black", wireframe: true});
    const box = new THREE.Mesh(boxGeom, boxMat);
    bellFrame.add(box);

    // Now, the bell itself. Very sparse, so we can see inside
    const coneGeom = new THREE.ConeGeometry(params.bellWidth,
                                            params.bellHeight,
                                            6, // hexagonal end
                                            true, // open-ended
                                           );
    const coneMat = new THREE.MeshBasicMaterial({color: "brown",
                                                 wireframe: params.wireBell});
    const coneMesh = new THREE.Mesh(coneGeom, coneMat);
    // move it *down* by half its height
    coneMesh.translateY(-1*params.bellHeight/2);
    // this rotates around the bell's center
    coneMesh.rotateZ(params.coneAngle);

    bellFrame.add(coneMesh);

    return bellFrame;
}

var bell;

function updateScene() {
    scene.remove(bell);
    bell = makeBell(params);
    // this rotates around the origin of the frame,
    // which corresponds to the peak of the cone
    bell.rotateZ(params.frameAngle);
    scene.add(bell);
}
updateScene();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const halfPI = Math.PI / 2.0;

const gui = new GUI();
gui.add(params, 'bellWidth', 1, 10).onChange(updateScene);
gui.add(params, 'bellHeight', 1, 10).onChange(updateScene);
gui.add(params, 'frameAngle', -halfPI, halfPI).onChange(updateScene);
gui.add(params, 'coneAngle', -halfPI, halfPI).step(0.01).onChange(updateScene);
gui.add(params, 'wireBell').onChange(updateScene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -5, maxx: 5,
                            miny: -5, maxy: 5,
                            minz: -5, maxz: 5});

