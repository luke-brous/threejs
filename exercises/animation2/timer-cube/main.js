//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'gui';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================

/* Our simplest animation; a cube tumbles in the scene, rotating
 * around all three axes at various angular velocities. */

// parameters of the scene and animation:
const guiParams = {
    vx: 0.02,       // x rotation velocity
    vy: 0.03,       // y rotation velocity 
    vz: 0.05,       // z rotation velocity 
    frameTime: 1000, // milliseconds
};

// state variables of the animation
var animationState;

// sets the animationState to its initial setting
function resetAnimationState() {
    animationState = {
        time: 0,
        // rotation angles
        rx: 0,
        ry: 0,
        rz: 0
    };
}
resetAnimationState();

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene, 
               {minx: -2, maxx: 2,
                miny: -2, maxy: 2,
                minz: -2, maxz: 2});

// needs to be a global so we can update its position
var cube;

function makeScene() {
    scene.remove(cube);
    cube = new THREE.Mesh(new THREE.BoxGeometry(2,2,2),
                          new THREE.MeshNormalMaterial());
    const as = animationState;  // just a shorthand
    // set the initial state of the cube
    cube.rotation.set(as.rx, as.ry, as.rz); 
    scene.add(cube);
}
makeScene();
                
function updateState() {
    animationState.time += 1;
    // increase the total rotations by the user-specified velocity
    animationState.rx += guiParams.vx;
    animationState.ry += guiParams.vy;
    animationState.rz += guiParams.vz;
    // rotate the cube around the x,y,z axes
    cube.rotateX(guiParams.vx);
    cube.rotateY(guiParams.vy);
    cube.rotateZ(guiParams.vz);
}

function firstState() {
    resetAnimationState();
    makeScene();
    TW.render();
}
                
function oneStep() {
    updateState();
    TW.render();
}
    
// stored so that we can cancel the animation if we want
var animationId = null;                

function animationLoop() {
    animationId = setInterval(oneStep, guiParams.frameTime);
}

function startAnimation() {
    // stop any existing animation
    stopAnimation();
    animationLoop();
}

function stopAnimation() {
    if( animationId != null ) {
        clearInterval(animationId);
        console.log("Cancelled animation using "+animationId);
    }
}

TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",startAnimation,"go:  start animation");
TW.setKeyboardCallback("q",stopAnimation,"quit: stop animation");

var gui = new GUI();
gui.add(guiParams,"vx",0,0.5);
gui.add(guiParams,"vy",0,0.5);
gui.add(guiParams,"vz",0,0.5);
gui.add(guiParams,"frameTime",50,10000).step(1).onChange(startAnimation);

