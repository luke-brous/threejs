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
// The class mass-spring system, except that this uses a line in place
// of the spring, so I've called it "mass-string". Think of it as a bungee cord.

// Transforms x from [minx,maxx] to y in [miny,maxy]

TW.linearMap = function(x,minx,maxx,miny,maxy) {
    //t is in [0,1], assuming minx <= x <= maxx
    const t = (x-minx)/(maxx-minx);
    const y = t*(maxy-miny)+miny;
    return y;
};

// Parameters of the scene and animation:
const guiParams = {
    sceneWidth: 100,
    wallWidth: 10,          // thickness of left wall
    wallSize: 50,           // height and depth of left wall
    tableHeight: 10,
    massSize: 20,
    massInitialX: 40,
    mass: 1200,                 // in Kg?
    originSize: 1,
    springK: 3,
    deltaT: 1,              // time between steps, in arbitrary time units
};

// state variables of the animation
var animationState;

function resetAnimationState() {
    animationState = {
        time: 0,
        massX: guiParams.massInitialX,
        massV: 0,
        massA: 0,
        lastParam: null
    };
}

resetAnimationState();

// need to be a global so we can update positions, etc.
var massObj;
var springObj;

// function to draw a line [from, to] where both arguments are Vector3
function line(from,to,color) {
    var geo = new THREE.BufferGeometry();
    geo.setFromPoints([from, to]);
    var mat = new THREE.LineBasicMaterial( { color: color || 0xFF0000 } );
    var line = new THREE.Line(geo, mat);
    return line;
}

                
// If we start over, this function gets called, so we need to remove the mass and recreate it.
// Ideally, we remove all the objects and re-create them, but since they don't move, duplicates aren't visible.

function makeScene() {
    var wall = new THREE.Mesh(new THREE.BoxGeometry(guiParams.wallWidth,guiParams.wallSize,guiParams.wallSize),
                              new THREE.MeshBasicMaterial({color: "yellow"}));
    wall.position.x = -0.5*(guiParams.sceneWidth + guiParams.wallWidth);
    scene.add(wall);

    var table = new THREE.Mesh(new THREE.BoxGeometry(guiParams.sceneWidth,guiParams.tableHeight,guiParams.wallSize),
                               new THREE.MeshBasicMaterial({color: "brown"}));
    // the following makes the surface of the table at y=0;
    table.position.y = -guiParams.tableHeight/2;
    scene.add(table);

    var origin = new THREE.Mesh(new THREE.SphereGeometry(guiParams.originSize,8,8),
                                new THREE.MeshBasicMaterial({color: "cyan"}));
    scene.add(origin);
                                
    scene.remove(massObj);
    massObj = new THREE.Mesh(new THREE.BoxGeometry(guiParams.massSize,guiParams.massSize,guiParams.massSize),
                             new THREE.MeshBasicMaterial({color: "blue"}));
    massObj.position.y = guiParams.massSize/2;
    massObj.position.x = guiParams.massInitialX;
    massObj.name = "mass";
    scene.add(massObj);
    console.log('add mass');

    scene.remove(springObj);
    springObj = line(new THREE.Vector3(-guiParams.sceneWidth/2, guiParams.massSize/2, 0),
                     new THREE.Vector3(guiParams.massInitialX, guiParams.massSize/2, 0));
    scene.add(springObj);
}
makeScene();

function updateState() {
    // changes the time and everything in the state that depends on it
    animationState.time += guiParams.deltaT;
    var x = animationState.massX;
    var v = animationState.massV;
    var a = animationState.massA;
    var dt = guiParams.deltaT;
    
    // by diff eq
    a = -1 * guiParams.springK / guiParams.mass * x;
    v += a * dt;
    x += v * dt;

    // copy back into state
    animationState.massX = x;
    animationState.massV = v;
    animationState.massA = a;
    
    // update the scene:
    massObj.position.x = x;
    scene.remove(springObj);
    springObj = line(new THREE.Vector3(-guiParams.sceneWidth/2, guiParams.massSize/2, 0),
                     new THREE.Vector3(x,                       guiParams.massSize/2, 0));
    scene.add(springObj);
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

var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene,
               {minx: -guiParams.sceneWidth/2, maxx: guiParams.sceneWidth/2,
                miny: 0, maxy: guiParams.wallSize,
                minz: -guiParams.wallSize/2, maxz: guiParams.wallSize/2});

TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",startAnimation,"go:  start animation");
TW.setKeyboardCallback("q",stopAnimation,"quit: stop animation");

var gui = new GUI();
gui.add(guiParams,"deltaT",0.01,3.0).step(0.01);
gui.add(guiParams,"massInitialX",-50,50).step(1);
gui.add(guiParams,"mass",300,4800).step(10);
gui.add(guiParams,"springK",1,9).step(1);

firstState();

