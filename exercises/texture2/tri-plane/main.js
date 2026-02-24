/*-----------------------------------------------------------------
 * Triptych Exercise
 * 
 * Load the images and do the texture mapping to create the scene 
 * in triptych-goal.png.
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

const params = {
    width: 10,
    height: 10,
    white: false,
    angle: 45,
};

// Notice this takes a texture as its argument. The next function
// loads a texture file and invokes this.

var tri;

function displayPlanes (textures) {
    scene.remove(tri);
    const angle = TW.degrees2radians(params.angle);
    // set the global
    tri = new THREE.Group();
    // this is the center panel
    const planeGeom = new THREE.PlaneGeometry(params.width, params.height);
    const planeMat = new THREE.MeshBasicMaterial({color: "white"})
    const plane = new THREE.Mesh(planeGeom, planeMat);
    tri.add(plane)
    // RED left panel . A group with the plane but hinge (origin) is on the right
    const left = new THREE.Group();
    const geoL = new THREE.PlaneGeometry(params.width, params.height);
    const matL = new THREE.MeshBasicMaterial({color: (params.white? "white" : "red")});
    const meshL = new THREE.Mesh(geoL, matL);
    meshL.position.setX(-params.width/2);
    left.add(meshL);
    left.rotateY(+angle);
    left.position.setX(-params.width/2);
    tri.add(left);
    // BLUE right panel. Pretty much the same, but hinge (origin) is on the left
    const right = new THREE.Group();
    const geoR = new THREE.PlaneGeometry(params.width, params.height);
    const matR = new THREE.MeshBasicMaterial({color: (params.white ? "white" : "blue")});
    const meshR = new THREE.Mesh(geoR, matR);
    meshR.position.setX(params.width/2);
    right.add(meshR);
    right.rotateY(-angle);
    right.position.setX(params.width/2);
    tri.add(right);
    // all done, add to scene
    scene.add(tri);
}

var theTextures;
displayPlanes(theTextures);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.add(params, 'width', 1, 10).onChange(() => displayPlanes(theTextures));
gui.add(params, 'height', 1, 10).onChange(() => displayPlanes(theTextures));
gui.add(params, 'white').onChange(() => displayPlanes(theTextures));
gui.add(params, 'angle', -90, +90).onChange(() => displayPlanes(theTextures));

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: -5, maxy: 5,
                            minz: -5, maxz: 5});

