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

const params = {
    width: 1.9,
    height: 1,
};

// Notice this takes a texture as its argument. The next function
// loads a texture file and invokes this.

var plane;

function displayPlane (texture) {
    const planeGeom = new THREE.PlaneGeometry(params.width, params.height);
    const planeMat = new THREE.MeshBasicMaterial({color: 0xffffff,
                                                  map: texture});
    scene.remove(plane);
    plane = new THREE.Mesh(planeGeom, planeMat);
    scene.add(plane);
}

// create a TextureLoader for loading the image file
var loader = new THREE.TextureLoader();

// load the flag image (stored in a folder), and when the
// image load is done, invoke the anonymous function callback

var theTexture;

function reportTextureSize(texture) {
    const image = texture.image;
    const width = image.width;
    const height = image.height;
    const ar = width/height;
    console.log(`Texture dimensions: ${width}x${height} aspect ratio of: ${ar}`);
}


loader.load("images/USflag.png",
            function (texture) {
                // the following line isn't necessary; it's just for debugging
                globalThis.theTexture = theTexture = texture;
                // you don't need this, either
                reportTextureSize(texture);
                // this call does the real work
                displayPlane(texture);
            } );

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.add(params, 'width', 1, 5).onChange(() => displayPlane(theTexture));
gui.add(params, 'height', 1, 5).onChange(() => displayPlane(theTexture));

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -1, maxx: 1,
                            miny: -1, maxy: 1,
                            minz: -1, maxz: 1});
