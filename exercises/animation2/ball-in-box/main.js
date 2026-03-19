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
               {minx: -5, maxx: 5,
                miny: -5, maxy: 5,
                minz: -5, maxz: 5});

// ================================================================

/* Animation of a ball bouncing around the inside of a box */

// parameters of the scene and animation:
const guiParams = {
    radius: 1,
    vx: 1,
    vy: 0,
    vz: 0,
};

// state variables of the animation
var animationState;
// Needs to be global so we can update its position.
var ball;

// sets the animationState to its initial setting
function resetAnimationState() {
    animationState = {
        time: 0,
    };
    ball.init();
}

// ================================================================


/* make a box with all six sides different colors, but only showing
 * the inside surface, like with the scone scene. */

function makeBox(size) {
    const geo = new THREE.BoxGeometry(size, size, size);
    const colors = ["red", "pink", "green", "lime", "blue", "cyan"];
    const mats = colors.map( c => new THREE.MeshBasicMaterial({color: c, side: THREE.BackSide}));
    return new THREE.Mesh( geo, mats );
}
const BoxSize = 10;             // global because Ball methods need it
const W = BoxSize/2;            // the Wall locations
scene.add(makeBox(BoxSize));

// needs to be a global so we can update its position
var ball;

function makeBall() {
    scene.remove(ball);
    ball = new THREE.Mesh(new THREE.SphereGeometry(guiParams.radius),
                          new THREE.MeshBasicMaterial());
    ball.name = "ball";
    // move ball to center, but give it a random velocity vector
    // but with the magitude from the guiParams
    ball.init = function () {
        this.position.set(0,0,0);
        const v = new THREE.Vector3( guiParams.vx,
                                     guiParams.vy,
                                     guiParams.vz);
        const rv = new THREE.Vector3( Math.random(),
                                      Math.random(),
                                      Math.random());
        rv.normalize();
        rv.setLength(guiParams.velocity);
        // set it as a property of the ball
        this.velocity = v;
    }
    // move, bouncing off walls if needed
    ball.update = function (time) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
        function axisAlignedBounce(obj, axis, wall, direction) {
            if( (direction == 'pos' && obj.position[axis] > wall) ||
                (direction == 'neg' && obj.position[axis] < wall)
              ) {
                obj.velocity[axis] = -obj.velocity[axis];
                obj.position[axis] = 2*wall - obj.position[axis];
                console.log('bounce', obj.velocity.x, obj.velocity.y, obj.velocity.z);
            }
        }
        const r = this.geometry.boundingSphere.radius;
        if(true) {
            axisAlignedBounce(this, 'x', +W-r, 'pos');
            axisAlignedBounce(this, 'x', -W+r, 'neg');
            axisAlignedBounce(this, 'y', +W-r, 'pos');
            axisAlignedBounce(this, 'y', -W+r, 'neg');
            axisAlignedBounce(this, 'z', +W-r, 'pos');
            axisAlignedBounce(this, 'z', -W+r, 'neg');
        } else {
            // code I used during development, which is also in the reading
            const x = this.position.x;
            let WALL = +W-r;
            if( x > WALL ) {
                // reverse the x component of the velocity
                this.velocity.x = -this.velocity.x;
                // adjust the position to bounce back into the box
                const newx = WALL - (x - WALL);
                console.log(x, 'bounce to', newx);
                this.position.x = newx;
            }
            WALL = -W+r;
            if( x < WALL ) {
                // reverse the x component of the velocity
                this.velocity.x = -this.velocity.x;
                // adjust the position to bounce back into the box
                const newx = WALL + (WALL - x);
                console.log(x, 'bounce to', newx);
                this.position.x = newx;
            }
        }
    }
    scene.add(ball);
}
makeBall();
                
// Now that the ball has been created, it's safe to do this
resetAnimationState();

// ================================================================

function updateState() {
    animationState.time += 1;
    ball.update(animationState.time);
}

function firstState() {
    resetAnimationState();
    TW.render();
}
                
function oneStep() {
    updateState();
    TW.render();
}
    
// stored so that we can cancel the animation if we want
var animationId = null;                

function animationLoop(timestamp) {
    oneStep();
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

var gui = new GUI();
gui.add(guiParams,"radius",0,5);
gui.add(guiParams,"vx",0,5).onChange(() => ball.init());
gui.add(guiParams,"vy",0,5).onChange(() => ball.init());
gui.add(guiParams,"vz",0,5).onChange(() => ball.init());

