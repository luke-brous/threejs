/*-----------------------------------------------------------------
 * Kicking Leg Exercise
 * 
 * There are three parts of the code to complete, described in the
 * comments:
 * 
 * - complete the updateState() function to update the ankle, knee,
 * and hip rotations, and increment the step (frame) number
 * 
 * - complete the oneStep() function to perform one step of the 
 * animation
 * 
 * - modify animationLoop() to stop the animation when a desired 
 * total number of steps of the animation is reached 
 *---------------------------------------------------------------*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import * as leg from './leg.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;


// ================================================================

// total number of steps in animation

const steps = 100;

// leg parameters for animation

const params = {
    ankleRotation: -Math.PI/3,         // angle of foot relative to lower leg
    kneeRotation: -2*Math.PI/3,        // angle of lower leg relative to thigh
    hipRotation: -Math.PI/4,           // angle of hip in scene coordinate frame
    ankleChange: (Math.PI/3)/steps,    // change of ankleRotation per frame
    kneeChange: (2*Math.PI/3)/steps,   // change of kneeRotation per frame
    hipChange: (3*Math.PI/4)/steps,    // change of hipRotation per frame
    footLength: 10,                    // dimensions of parts of leg
    calfLength: 20,
    thighLength: 25,
    step: 0                            // frame number in animation
};

var leg1;                       // instance of a leg

function firstState() {
    params.ankleRotation = -Math.PI/3;
    params.kneeRotation = -2*Math.PI/3;
    params.hipRotation = -Math.PI/4;
    params.step = 0;
    if ( leg1 != null ) {
        scene.remove(leg1);
    }
    leg1 = leg.makeLeg(params);
    scene.add(leg1);
    TW.render();
}

function updateState() {
    // TODO: add code to update the ankle, knee, and hip rotations,
    // and increment the step number, for the next frame of the
    // animation (all relevant information is stored in the global
    // params object)

}


function oneStep() {
    // TODO: add code to perform one step of the animation: remove the
    // current leg object, update the state (use updatestate() for
    // this), remake the leg, and render the scene

}
    
// stored so that we can cancel the animation if we want
var animationId = null;                

function animationLoop() {
    oneStep();

    // TODO: modify the last statement in this function so that the
    // animation stops when params.step reaches steps

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

// ================================================================

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

TW.cameraSetup(renderer,
               scene,
               {minx: 0, maxx: 5,
                maxy: 0, miny: -(params.thighLength + params.calfLength),
                minz: -3, maxz: 3});

// This draws the initial state. Have to do this after the mainInit and cameraSetup
firstState();

TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",startAnimation,"go:  start animation");
TW.setKeyboardCallback("q",stopAnimation,"quit: stop animation");
