/*-----------------------------------------------------------------
 * Be Creative Exercise
 * 
 * Add some additional objects into the scene.
 * boxes, spheres, or even
 * cones <https://threejs.org/docs/index.html#api/en/geometries/ConeGeometry>
 * cylinders <https://threejs.org/docs/index.html#api/en/geometries/CylinderGeometry>  
 * move them around with mesh.position.set(x,y,z)
 * be creative -- build a lollipop, barbell, jenga, toy, snowman, robot
 * have fun with it!
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
    const geo = TW.barnGeometry(box1dims.width,
                                box1dims.height,
                                box1dims.depth);
    box1 = TW.createMesh(geo);
    box1.name = "barn";
    scene.add(box1);
}

newBox();

function newSphere(x,y,z) {
    // add code here to create a sphere and add it to the scene
    scene.remove(sphereMesh);
    const sphereGeo = new THREE.SphereGeometry( 1, 32, 32 );
    var sphereMesh = TW.createMesh( sphereGeo );
    // add name
    sphereMesh.name = "snowman head";
    sphereMesh.position.set(x,y,z);

    scene.add( sphereMesh );

}

newSphere(0,4,0);
newSphere(4,6,0);
newSphere(6,8,8);

function newRectangle(x,y,z) {
    // add code here to create a rectangle and add it to the scene
    scene.remove(rectangleMesh);
    const rectangleGeo = new THREE.BoxGeometry( 1, 2, 4 );
    var rectangleMesh = TW.createMesh( rectangleGeo );
    // add name
    rectangleMesh.name = "door";
    rectangleMesh.position.set(x,y,z);

    scene.add( rectangleMesh );

}

newRectangle(2,4,2);

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
                           {minx: 0, maxx: 5,
                            miny: 0, maxy: 5,
                            minz: -5, maxz: 0});

