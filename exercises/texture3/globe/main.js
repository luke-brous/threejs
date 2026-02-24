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

var sphere;

// Function adds the textured sphere to the scene once the texture is loaded.
function makeSphere (texture) {
    // sphere geometry with texture-mapped world map
    const geo = new THREE.SphereGeometry(50,30,30);
    const mat = new THREE.MeshBasicMaterial( {color: 0xffffff,
                                            map: texture} );
    sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);

    TW.render();    // render the scene
}

// create a TextureLoader for loading the image file
var loader = new THREE.TextureLoader();

async function loadTexture(url) {
    document.getElementById('texture').src = url;
    loader.load(url, makeSphere);
}

async function globe() {
    scene.remove(sphere);
    loadTexture("images/world.jpg");
}

async function uvSphere() {
    scene.remove(sphere);
    loadTexture("images/UV_Grid_Sm.jpg");
}

async function gridSphere() {
    scene.remove(sphere);
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
                minz: -50, maxz: 50});

// ================================================================
TW.setKeyboardCallback('1', globe, 'globe');
TW.setKeyboardCallback('2', uvSphere, 'UV sphere');
TW.setKeyboardCallback('3', gridSphere, 'grid sphere');

