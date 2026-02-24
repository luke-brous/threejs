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
// Build your scene here

// Precompute/load the textures we will use

const wrgb = TW.makeWRGBimage();
const nascar = TW.makeFlagTexture('nascar');

const loader = new THREE.TextureLoader();

var uvGrid;
loader.load("UV_Grid_Sm.jpg", tex => {uvGrid = images['uv-grid'] = tex});

const images = {
    'wrgb': wrgb,
    'nascar': nascar,
    'uv-grid': null,            // set by the loader
};

var theTexture = wrgb;          // the initial value
globalThis.images = images;

// Now, the tutor

const params = {
    image: 'wrgb',
    width: 10,
    height: 10,
    repeatS: 4,
    repeatT: 2,
    wrapS: 'repeat',
    wrapT: 'repeat',
    magFilter: 'nearest',       // the docs say that linear is the default, but empirically it's nearest
    flipY: false,
};

const magOptions = {
    'nearest': THREE.NearestFilter,
    'linear': THREE.LinearFilter,
};

const wrapOptions = {
    'repeat': THREE.RepeatWrapping,
    'clamp': THREE.ClampToEdgeWrapping,
    'mirror': THREE.MirroredRepeatWrapping,
};
    

// Notice this takes a texture as its argument. The next function
// loads a texture file and invokes this.

var plane;

function displayPlane (texture) {
    const planeGeom = new THREE.PlaneGeometry(params.width, params.height);
    // The flower0 is 256x256, so we need a square plane to map it onto.
    // update the texture
    texture.repeat.set(params.repeatS, params.repeatT);
    texture.magFilter = magOptions[params.magFilter];
    texture.wrapS = wrapOptions[params.wrapS];
    texture.wrapT = wrapOptions[params.wrapT];
    texture.flipY = params.flipY;
    texture.needsUpdate = true;

    const planeMat = new THREE.MeshBasicMaterial({color: 0xffffff,
                                                  map: texture});
    scene.remove(plane);
    plane = new THREE.Mesh(planeGeom, planeMat);
    scene.add(plane);
}

displayPlane(wrgb);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.add(params, 'width', 1, 10).onChange(() => displayPlane(theTexture));
gui.add(params, 'height', 1, 10).onChange(() => displayPlane(theTexture));
gui.add(params, 'repeatS', 0, 5).onChange(() => displayPlane(theTexture));
gui.add(params, 'repeatT', 0, 5).onChange(() => displayPlane(theTexture));
gui.add(params, 'flipY').onChange(() => displayPlane(theTexture));
gui.add(params, 'wrapS', Object.keys(wrapOptions)).onChange(() => displayPlane(theTexture));
gui.add(params, 'wrapT', Object.keys(wrapOptions)).onChange(() => displayPlane(theTexture));
gui.add(params, 'magFilter', Object.keys(magOptions)).onChange(() => displayPlane(theTexture));
gui.add(params, 'image', Object.keys(images))
    .onChange(val => { theTexture = images[val];
                       displayPlane(theTexture); });

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -5, maxx: 5,
                            miny: -5, maxy: 5,
                            minz: -5, maxz: 5});

