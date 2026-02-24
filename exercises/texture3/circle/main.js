//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

var circle;

// Function adds the textured sphere to the scene once the texture is loaded.
function makeCircle (texture) {
    const geo = new THREE.CircleGeometry(50,30,30);
    const mat = new THREE.MeshBasicMaterial( {color: 0xffffff,
                                            map: texture} );
    circle = new THREE.Mesh(geo, mat);
    scene.add(circle);

    TW.render();    // render the scene
}

// create a TextureLoader for loading the image file
var loader = new THREE.TextureLoader();

async function loadTexture(url) {
    document.getElementById('texture').src = url;
    loader.load(url, makeCircle);
}

async function globe() {
    scene.remove(circle);
    loadTexture("images/world.jpg");
}

async function uvCircle() {
    scene.remove(circle);
    loadTexture("images/UV_Grid_Sm.jpg");
}

async function gridCircle() {
    scene.remove(circle);
    loadTexture("images/grid.jpg");
}

globe();
// ================================================================

var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene,
               {minx: -50, maxx: 50,
                miny: -50, maxy: 50,
                minz: -1, maxz: 1});

// ================================================================
TW.setKeyboardCallback('1', globe, 'globe');
TW.setKeyboardCallback('2', uvCircle, 'UV circle');
TW.setKeyboardCallback('3', gridCircle, 'grid circle');

