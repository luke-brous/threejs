//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
// init

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

// ================================================================
// Lighting

var light1 = new THREE.DirectionalLight(0xffffff, 2);
light1.position.set(1,1,1);
scene.add(light1);

var light2 = new THREE.DirectionalLight(0xffffff);
light2.position.set(-1,-1,-1);
scene.add(light2);

// ================================================================
// camera setup

const cameraFOVY = 75;
const canvas = renderer.domElement;
const aspectRatio = canvas.clientWidth/canvas.clientHeight;

const sceneBoundingBox = {
    minx: -400, maxx: 400,
    miny: -400, maxy: 400,
    minz: -400, maxz: 400,
};

var render;

function setupCamera(orbiting) {
    const cp = TW.cameraSetupParams(sceneBoundingBox, cameraFOVY);
    const camera = new THREE.PerspectiveCamera(cameraFOVY, aspectRatio, cp.near, cp.far);
    const at = cp.center;
    camera.position.set(at.x, at.y, at.z+cp.cameraRadius);
    render = function () { renderer.render(scene, camera); }
    globalThis.render = render;
    if(orbiting) {
        const oc = new OrbitControls(camera, canvas);
        oc.addEventListener('change', render);
        oc.target.copy( cp.center );
        oc.enablePan = false; // otherwise, dragging is panning, which we don't want.
        oc.update();
    }
    return camera;
}
const camera = setupCamera(true);
globalThis.camera = camera;

// ================================================================
// Scene stuff

function createScene() {
    // create box geometry to use for all the blocks

    var geometry = new THREE.BoxGeometry(200,200,200);

    // add 200 blocks to the scene at random positions and with random size and color
    for (let i = 0; i < 200; i++) {
        const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random()*0xffffff}));
        object.position.set(800*Math.random()-400, 800*Math.random()-400, 800*Math.random()-400);
        object.rotation.set(2*Math.PI*Math.random(), 2*Math.PI*Math.random(), 2*Math.PI*Math.random());
        object.scale.set(0.5*Math.random()+0.1, 0.5*Math.random()+0.1, 0.5*Math.random()+0.1);
        scene.add(object);
    }
}
createScene();

// ================================================================
// mouse handling and picking

var isMouseDown = false;

function convertMousePositionToNDC(event) {
    const rect = event.target.getBoundingClientRect();
    // Note the difference for converting Y. That's because Y goes from top to bottom
    const xNDC = ( (event.clientX - rect.left) / rect.width ) * 2 - 1;
    const yNDC = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;
    const ndc = new THREE.Vector2(xNDC, yNDC);
    return ndc;
}
                                   
const raycaster = new THREE.Raycaster();

// Pick an object in the scene (among the pickable objects). Either
// (1) paper, (2) an existing point, or (3) null.

function onClick(evt) {
    if( ! evt.shiftKey ) return; // only handle shift-click
    isMouseDown = true;
    const click = convertMousePositionToNDC(evt);
    raycaster.setFromCamera(click, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if( intersects.length > 0 ) {
        scene.remove(intersects[0].object);
    }
    render();
}

document.addEventListener( 'click', onClick, true );

// ================================================================

render();
