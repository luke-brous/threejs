//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';

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
    kind: 'ball',
    numObjects: 2,
    radius: 1,
    velocity: 1,
    twoObjectTestCase: false,
};

// state variables of the animation
const animationState = {
        time: 0,
};

// sets the animationState to its initial setting
function resetAnimationState() {
    animationState.time = 0;
}

// ================================================================


/* make a box with all six sides different colors, but only showing
 * the inside surface, like with the sconce scene. */

function makeBox(size) {
    const geo = new THREE.BoxGeometry(size, size, size);
    // const colors = ["red", "pink", "green", "lime", "blue", "cyan"];
    const colors = [0xffbbbb, 0xffdddd, 0xbbffbb, 0xddffdd, 0xbbbbff, 0xddddff];
    const mats = colors.map( c => new THREE.MeshBasicMaterial({color: c, side: THREE.BackSide}));
    return new THREE.Mesh( geo, mats );
}
const BoxSize = 10;             // global because Ball methods need it
scene.add(makeBox(BoxSize));

const colorNames = Object.keys(THREE.Color.NAMES);

function randomIntBelow(upperBound) {
    return Math.floor(upperBound * Math.random());
}

function randomColor() {
    const i = randomIntBelow(colorNames.length);
    const name = colorNames[i];
    return THREE.Color.NAMES[name];
}

function randomFloatBetween(min, max) {
    const width = max - min;
    return min+(width * Math.random());
}

function randomBoxPosition() {
    const r = guiParams.radius;
    const B = BoxSize/2 - r;
    return new THREE.Vector3( randomFloatBetween( -B, +B ),
                              randomFloatBetween( -B, +B ),
                              randomFloatBetween( -B, +B ));
}

function randomVelocityVector() {
    const rv = new THREE.Vector3( Math.random(),
                                  Math.random(),
                                  Math.random());
    rv.setLength(guiParams.velocity);
    return rv;
}

function makeObject() {
    let obj;
    const color = randomColor();
    switch(guiParams.kind) {
    case 'ball':
        obj = new THREE.Mesh(new THREE.SphereGeometry(guiParams.radius),
                             new THREE.MeshBasicMaterial({color}));
        break;
    case 'box':
        const d = guiParams.radius/Math.sqrt(3);
        obj = new THREE.Mesh(new THREE.BoxGeometry(d,d,d),
                             new THREE.MeshBasicMaterial({color}));
        break;
    case 'teapot':
        const scale = guiParams.radius/2;
        obj = new THREE.Mesh(new TeapotGeometry(scale, 16),
                             new THREE.MeshBasicMaterial({color}));
        break;
    }
    // but with the magitude from the guiParams
    obj.init = function () {
        this.position.copy(randomBoxPosition());
        this.velocity = randomVelocityVector();
    }
    // move, bouncing off walls if needed
    obj.update = function (time) {
        // console.log('pos', this.position, 'vel', this.velocity);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
        function axisAlignedBounce(obj, axis, wall, direction) {
            if( (direction == 'pos' && obj.position[axis] > wall) ||
                (direction == 'neg' && obj.position[axis] < wall)
              ) {
                obj.velocity[axis] = -obj.velocity[axis];
                obj.position[axis] = 2*wall - obj.position[axis];
            }
        }
        const B2 = BoxSize/2;
        const r = this.geometry.boundingSphere.radius;
        axisAlignedBounce(this, 'x', +B2-r, 'pos');
        axisAlignedBounce(this, 'x', -B2+r, 'neg');
        axisAlignedBounce(this, 'y', +B2-r, 'pos');
        axisAlignedBounce(this, 'y', -B2+r, 'neg');
        axisAlignedBounce(this, 'z', +B2-r, 'pos');
        axisAlignedBounce(this, 'z', -B2+r, 'neg');
    }
    return obj;
}
                
// needs to be a global so we can update their positions
var objects = [];

function makeObjects() {
    console.log('num objects', objects.length);
    for(const o of objects) {
        scene.remove(o);
    }
    const n = guiParams.twoObjectTestCase ? 2 : Math.floor(guiParams.numObjects);
    objects = [];
    // normal case
    for(let i=0; i<n; i++ ) {
        const obj = makeObject();
        obj.init();
        objects.push(obj);
        scene.add(obj);
    }
    if(guiParams.twoObjectTestCase) {
        const a = objects[0];
        const b = objects[1];
        globalThis.a = a;
        globalThis.b = b;
        a.material = new THREE.MeshBasicMaterial({color: "red"});
        a.position.set(5,0,0);
        a.velocity.set(-1,0,0);
        b.material = new THREE.MeshBasicMaterial({color: "green"});
        b.position.set(-5,0,0);
        b.velocity.set(+1,0,0);
    }
    globalThis.objects = objects;
}
makeObjects();

// ================================================================

const tmpVector3 = new THREE.Vector3();

function swapVelocities(a, b) {
    const tmp = tmpVector3;
    tmp.copy(a.velocity);
    a.velocity.copy(b.velocity);
    b.velocity.copy(tmp);
}


function updateState() {
    animationState.time += 1;
    for(const o of objects) {
        o.update(animationState.time);
    }
    // consider objects bouncing off each other:
    scene.updateMatrixWorld(true);
    const n = objects.length;
    for(let i=0; i<n; i++ )
        for( let j=i+1; j<n; j++ ) {
            const a = objects[i];
            const b = objects[j];
            // transform bounding spheres into world space
            const bsA = a.geometry.boundingSphere.clone().applyMatrix4(a.matrixWorld);
            const bsB = b.geometry.boundingSphere.clone().applyMatrix4(b.matrixWorld);
            // collision test
            const distance = bsA.center.distanceTo(bsB.center);
            if (distance <= (bsA.radius + bsB.radius)) {
                console.log(`${i} hit ${j} at a distance of ${distance}`);
                // d is the penetration distance.
                const d = (bsA.radius + bsB.radius) - distance;
                swapVelocities(a,b);
                a.position.addScaledVector(a.velocity, d/2);
                b.position.addScaledVector(b.velocity, d/2);
            }
        }
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
gui.add(guiParams,"kind",['ball', 'box', 'teapot']).onChange(makeObjects);
gui.add(guiParams,"numObjects",1,30).step(1).onChange(makeObjects);
gui.add(guiParams,"radius",0,5).onChange(makeObjects);
gui.add(guiParams,"velocity",0,5).onChange(() => objects.forEach( o => o.velocity = randomVelocityVector() ));
gui.add(guiParams,"twoObjectTestCase").onChange(makeObjects);
