//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'gui';
import * as TOWN from './town.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// setup

const renderer = new THREE.WebGLRenderer();

var canvas = renderer.domElement;
document.body.appendChild(canvas);
renderer.setSize(canvas.clientWidth,canvas.clientHeight);
renderer.setClearColor( 0xffffff, 1);

// ================================================================
// Build your scene here

const params = {
};

TOWN.makeTown(scene);

const scene_bb = {
    minx: -10, maxx: 10,
    miny: 0, maxy: 10,
    minz: -10, maxz: 10};


const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth/canvas.clientHeight, 1, 100);
camera.position.set(0, 2, 20);
const controls = new OrbitControls( camera, renderer.domElement );


/*
TW.mainInit(renderer, scene);
const state = TW.cameraSetup(renderer, scene, scene_bb);
globalThis.state = state;
*/

function drawLine(a, b) {
    const geom = new THREE.BufferGeometry().setFromPoints([ a, b ]);
    const mat = new THREE.MeshBasicMaterial({color: "magenta"});
    const line = new THREE.Line(geom, mat );
    scene.add(line);
}    

// draw line from front to back of frustum
function drawLineThroughFrustum(ndc, cam) {
    const near = new THREE.Vector3( ndc.x, ndc.y, -1 );
    const far = new THREE.Vector3( ndc.x, ndc.y, 1 );
    near.unproject(cam);
    far.unproject(cam);
    console.log('near', near.x, near.y, near.z);
    drawLine(near, far);
}


// ================================================================
// mouse callback

function convertMouseCoordsToNDC(event) {
    const rect = event.target.getBoundingClientRect();
    console.log('eventx', event.x, event.offsetX, event.x-rect.left);
    // Note the difference for converting Y. That's because Y goes from top to bottom
    const xNDC = ( (event.clientX - rect.left) / rect.width ) * 2 - 1;
    const yNDC = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;
    const ndc = new THREE.Vector2(xNDC, yNDC);
    return ndc;
}
                                   
function handleShiftClick(event) {
    if( ! event.shiftKey ) return;
    const ndc = convertMouseCoordsToNDC(event);
    console.log('click', ndc.x, ndc.y );
    drawLineThroughFrustum(ndc, camera);
}

document.addEventListener('click', handleShiftClick);

// ================================================================
// animation loop

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
}

animate();
