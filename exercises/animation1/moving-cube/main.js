/*-----------------------------------------------------------------
 * Foiling the Escape Exercise
 * 
 * Add code to do the following (see comments in the code):
 * 
 * - add a wireframe cage around the initial position of the cube, 
 * which is twice the size of the cube. A wireframe material can 
 * be created with new THREE.MeshBasicMaterial({color: "whatever", 
 * wireframe: true})
 * 
 * - update the position of the cube based on the tx and ty 
 * parameters set by the user in the GUI — update both the 
 * animationState and the cube.position
 * 
 * - modify the animate() function to capture the logic outlined 
 * in the comments 
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

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

TW.cameraSetup(renderer,
               scene, 
               {minx: -2.5, maxx: 2.5,
                miny: -2.5, maxy: 2.5,
                minz: -2.5, maxz: 2.5});

// ================================================================

/* Our simplest animation; a cube tumbles in the scene, rotating
 * around all three axes. */

// parameters of the scene and animation:
var guiParams = {
    vx: 0.01,       // x rotation velocity
    vy: 0.02,       // y rotation velocity 
    vz: 0.04,       // z rotation velocity 
    tx: 0.1,        // x velocity 
    ty: 0.1         // y velocity 
};

// state variables of the animation
var animationState, cube;

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

function firstState() {
    animationState = {
        time: 0,       // total time of the animation
        rx: 0,         // total x rotation
        ry: 0,         // total y rotation
        rz: 0,         // total z rotation
        px: 0,         // x position
        py: 0          // y position
    };
    if ( cube != null ) {
        scene.remove(cube);
    }
    cube = new THREE.Mesh(new THREE.BoxGeometry(2,2,2),
                          new THREE.MeshNormalMaterial());
    scene.add(cube);
    TW.render();
}

// TODO: add a wireframe cage surrounding the initial position of the
// cube, (twice the size of the cube) and add it to the scene




firstState();

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

    // TODO: update the x,y position of the cube based on the tx and
    // ty parameters set by the user in the gui - update both the
    // animationstate and the cube.position.x and cube.position.y

}

// oneStep() performs one step of the animation
 
function oneStep() {
    updateState();
    TW.render();
}
    
// stored so that we can cancel the animation if we want
var animationId = null;                

function animationLoop() {
    oneStep();
    // TODO:

    // modify the last code statement in this function to capture the
    // following logic:
    //    IF THE CUBE'S POSITION IS OUTSIDE THE CAGE
    //        stopAnimation();
    //    OTHERWISE
    //        animationId = requestAnimationFrame(animate);

    animationId = requestAnimationFrame(animationLoop);
}

function startAnimation() {
    // stop any existing animation
    stopAnimation();
    animationLoop();
}

function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
        console.log("Cancelled animation using "+animationId);
    }
}

TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",startAnimation,"go:  start animation");
TW.setKeyboardCallback("q",stopAnimation,"quit: stop animation");

const gui = new GUI();
gui.add(guiParams,"vx",0,0.5);
gui.add(guiParams,"vy",0,0.5);
gui.add(guiParams,"vz",0,0.5);
gui.add(guiParams, "tx", -0.2, 0.2, 0.01);
gui.add(guiParams, "ty", -0.2, 0.2, 0.01);
