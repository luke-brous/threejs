/*-----------------------------------------------------------------
 * Town View Exercise
 * 
 * We want to set up a camera to creat the view in 
 * camera-exercise-goal.png.
 * 
 * 1. Get rid of the TW.cameraSetup
 * 2. Implement the setup of the camera
 * 3. get that working
 * 4. Implement the update of the camera via the GUI
 * 5. get that working
 * 6. adjust the camera so that it replicates the scene  
 *---------------------------------------------------------------*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
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

const house1 = TW.createMesh( TW.barnGeometry(2,3,3) );
house1.position.set(4,0,3);
scene.add(house1);

const house2 = TW.createMesh( TW.barnGeometry(2,3,3) );
house2.position.set(3,0,7);
house2.rotation.y = Math.PI/2;
scene.add(house2);

const house3 = TW.createMesh( TW.barnGeometry(2,3,3) );
house3.position.set(8,0,5);
house3.rotation.y = -Math.PI/4;
scene.add(house3);

// Tree: This function is different from last time, because it uses
// grouping and doesn't add anything to the scene.

function makeTree(treeHeight, trunkHeight) { 
    const grp = new THREE.Group();
    const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,trunkHeight),
                                  new THREE.MeshBasicMaterial({color: 'brown'}));
    const tree1 = new THREE.Mesh(new THREE.ConeGeometry(1,treeHeight),
                                 new THREE.MeshBasicMaterial({color: 'darkgreen'}));
    trunk1.position.set(0,trunkHeight/2,0);
    tree1.position.set(0,treeHeight/2+trunkHeight,0);
    grp.add(trunk1);
    grp.add(tree1);
    return grp;
}

const tree1 = makeTree(6,1);
tree1.position.set(8,0,10);
scene.add(tree1);

function ground(color) {
    const snowMat = new THREE.MeshBasicMaterial({color: color,
                                                 side: THREE.DoubleSide});
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(12,12), snowMat);
    ground.rotateX(Math.PI/2);
    ground.position.set(6,0,6);
    scene.add(ground);
}
ground("green");

// add the snowman
const frosty = SNOW.makeSnowPerson({wireFrame: false,
                                    snowcolor: THREE.Color.NAMES.snow});
frosty.position.set(3,0,10);

// the default height is 12, with center of head at 11, so scaling by
// 0.2 results in a height of 0.2*12=2.4, with the center of the head
// at 0.2*11=0.22

const smaller = 0.2;
frosty.scale.set(smaller, smaller, smaller);
scene.add(frosty);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
const canvas = TW.mainInit(renderer,scene);

// these correspond to camera-exercise-goal1.png
const cameraParameters = {
    fov: 45,                // degrees
    aspectRatio: canvas.clientWidth/canvas.clientHeight,
    near: 1,
    far: 100,
    at: {x: 3, y: 2.2, z: 10},
    eye: {x: 3, y: 1, z: 17},
    up: {x: 0, y: 1, z: 0},
};

// setupCamera() function creates and returns a camera with the desired parameters

function setupCamera (cameraParameters) {
    // set up an abbreviation 
    const cp = cameraParameters;
    TW.checkCameraShapeParameters(cp.fov, cp.aspectRatio, cp.near, cp.far);
    // create an initial camera with the desired shape
    const camera = new THREE.PerspectiveCamera(cp.fov, cp.aspectRatio, cp.near, cp.far);
    // set the camera location and orientation
    camera.position.copy(cp.eye);
    camera.up.copy(cp.up);
    if(false) {
        // mark the AT point
        const at = new THREE.Mesh(new THREE.SphereGeometry(0.1),
                                  new THREE.MeshBasicMaterial({color: "red"}));
        at.position.copy(cp.at);
        scene.add(at);
    }
    camera.lookAt(new THREE.Vector3(cp.at.x, cp.at.y, cp.at.z));
    return camera;
}

var theCamera = setupCamera(cameraParameters);

function render() {
    // a render function; assume global variables scene, renderer, and camera
    renderer.render(scene, theCamera);
}
render();

function adjustCamera() {
    const cam = theCamera;
    const cp = cameraParameters;
    TW.checkCameraShapeParameters(cp.fov, cp.aspectRatio, cp.near, cp.far);
    // adjust camera shape
    cam.fov = cp.fov;
    cam.aspect = cp.aspectRatio;
    cam.near = cp.near;
    cam.far = cp.far;
    // have to update the matrix after adjusting its shape
    cam.updateProjectionMatrix();
    // now its placement
    cam.position.copy(cp.eye);
    cam.up.copy(cp.up);
    cam.lookAt(cp.at.x, cp.at.y, cp.at.z);
    // finally, re-render the scene
    render();
}

const gui = new GUI();
gui.add(cameraParameters, 'fov', 1, 180).onChange(adjustCamera);

const eyeGui = gui.addFolder('eye').close();
eyeGui.add(cameraParameters.eye, 'x', -4, 20).onChange(adjustCamera);
eyeGui.add(cameraParameters.eye, 'y', -4, 20).onChange(adjustCamera);
eyeGui.add(cameraParameters.eye, 'z', -4, 20).onChange(adjustCamera);

const atGui = gui.addFolder('at').close();
atGui.add(cameraParameters.at, 'x', -4, 20).onChange(adjustCamera);
atGui.add(cameraParameters.at, 'y', -4, 20).onChange(adjustCamera);
atGui.add(cameraParameters.at, 'z', -4, 20).onChange(adjustCamera);

const upGui = gui.addFolder('up').close();
upGui.add(cameraParameters.up, 'x', -1, 1).onChange(adjustCamera);
upGui.add(cameraParameters.up, 'y', -1, 1).onChange(adjustCamera);
upGui.add(cameraParameters.up, 'z', -1, 1).onChange(adjustCamera);