/*-----------------------------------------------------------------
 * Moving and Decaying Bouncing Ball Exercise
 * 
 * In this exercise, you'll simulate a bouncing ball whose height
 * decays over time. The ball will also move to the right over 
 * time, with a specified velocity in the X direction.
 * 
 * Your task is to modify the setBallPosition() and updateState() 
 * functions to implement the change in X position of the ball and 
 * decay of ball height over time.
 *  
 * Look for the TODO in the code. 
 * 
 * Hints:
 * - the X position of the ball can be computed from velocity and
 * time: x = x_0 + V * t, where t is the time elapsed since the 
 * start of the simulation, and x_0 is the initial location.
 * 
 * - the ballHeightDecay parameter captures the rate of decay of 
 * ball height over time. Let bH refer to the height of the ball 
 * if there were no decay, let bHa be the adjusted height of the 
 * ball with decay, and let D refer to the ballHeightDecay factor. 
 * The adjusted ball height as a function of time is given by the 
 * following expression: bHa = bH * D^t
 * 
 * - the Math.pow function can be useful here. 
 *---------------------------------------------------------------*/

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

/* This builds a scene with a ball bouncing on the ground. The ball
follows a curve matching the absolute value of the cosine function,
which is not physically correct, but looks good and is easy to
program.
*/

// Parameters of the scene and animation:
var guiParams = {
    ballRadius: 1,
    ballBouncePeriod: 3,  // time to bounce once, in arbitrary time units
    ballHeightDecay: 0.9,          //   amount that height of bounce decays over time
    maxBallHeight: 8,     // max y position of the center of the ball
    deltaT: 0.035         // time between steps, in arbitrary time units
};

const ballVelocityX = 0.9;    // movement per frame in X direction
const ballHeightDecay = 0.9;  // amount that height of bounce decays over time

// State variables of the animation
var animationState;

// sets the animationState to its initial setting
function resetAnimationState() {
    animationState = {
        ballHeight: guiParams.maxBallHeight, // fall from highest height
        time: 0,
        ballX: 0,
    };
}

resetAnimationState();

const renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene, 
               {minx: -guiParams.ballRadius, maxx: guiParams.ballRadius,
                miny: 0, maxy: guiParams.maxBallHeight+guiParams.ballRadius,
                minz: -guiParams.ballRadius, maxz: guiParams.ballRadius});

// needs to be a global so we can update its position
var ball;
var ground;

// create green ground plane and add to the scene
var ground = new THREE.Mesh(new THREE.PlaneGeometry(10,10),
                            new THREE.MeshBasicMaterial({color:0x009900}) );
ground.rotation.x = -Math.PI/2;
scene.add(ground);


function makeBall () {
    if ( ball != null ) {
       scene.remove(ball);
    }
    const ballG = new THREE.SphereGeometry(guiParams.ballRadius,30,30);
    const ballMat = new THREE.MeshNormalMaterial();
    ball = new THREE.Mesh(ballG,ballMat);
    // sets initial X and Y positions of ball
    ball.position.set(animationState.ballX,animationState.ballHeight,0);    
    scene.add(ball);
}

makeBall();

// transforms x in the range [minx,maxx] to y in the range [miny,maxy]
function linearMap (x, minx, maxx, miny, maxy) {
    // t is in the range [0,1]
    const t = (x-minx)/(maxx-minx);
    const y = t*(maxy-miny)+miny;
    return y;
};

// sets the position of the ball based on current time
function setBallPosition (time) {
    // rescale the time dimension so that the period of bouncing maps to pi
    const angle = time * Math.PI / guiParams.ballBouncePeriod; 
    const abs_cos = Math.abs(Math.cos(angle));
    // TODO: add code to use ballHeightDecay and input time to reduce ballHeight
    // bHa = bH * D^t
    const decayedHeight = abs_cos * Math.pow(ballHeightDecay, time);
    const ballHeight = linearMap(decayedHeight, 0, 1, 
                                 guiParams.ballRadius, guiParams.maxBallHeight);


    ball.position.y = ballHeight;

    // TODO: ADD CODE TO USE ballVelocityX AND INPUT time TO COMPUTE THE NEW
    // X POSITION OF THE BALL, SET THE BALL'S X POSITION TO THIS NEW
    // VALUE, AND RETURN AN ARRAY WITH THE BALL'S X POSITION AND HEIGHT
    x_pos = animationState.ballX +  ballVelocityX * time 
    animationState.ballX = x_pos
    values = [animationState.ballX, ballHeight]

    return values;
}

function firstState() {
    resetAnimationState();
    const state = setBallPosition(animationState.time);   
    animationState.ballX = state[0];                    
    animationState.ballHeight = state[1];               
    TW.render();
}

function updateState() {
    animationState.time += guiParams.deltaT;
    // TODO: THE MODIFIED setBallPosition() FUNCTION RETURNS AN ARRAY
    // WITH BOTH THE BALL'S NEW X POSITION AND HEIGHT - MODIFY
    // THE CODE BELOW TO UPDATE THE CORRESPONDING VALUES IN THE
    // animationState OBJECT

    const state = setBallPosition(animationState.time); 
    animationState.ballX = state[0];               
    animationState.ballHeight = state[1];               

    console.log("time is " + animationState.time + " and ball height is " + animationState.ballHeight);
}
                
function oneStep() {
    updateState();
    TW.render();
}
    

// Stored so that we can cancel the animation if we want
var animationId = null;                

function animate(timestamp) {
    if( animationId ) cancelAnimationFrame(animationId);
    oneStep();
    animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
        console.log("Cancelled animation using "+animationId);
    }
}

TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",animate,"go:  start animation");
TW.setKeyboardCallback("q",stopAnimation,"quit/stop animation");

var gui = new GUI();
gui.add(guiParams,"ballRadius",0.1,3)
    .onChange(function(){ makeBall(); TW.render(); });
gui.add(guiParams,"deltaT",0.001,0.999).step(0.001);
gui.add(guiParams,"ballBouncePeriod",1,30).step(1);

