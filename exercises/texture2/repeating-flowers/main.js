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
    width: 10,
    height: 10,
    repeatS: 4,
    repeatT: 2,
};

// Notice this takes a texture as its argument. The next function
// loads a texture file and invokes this.

var plane;

function displayPlane (texture) {
    // The flower0 is 256x256, so we need a square plane to map it onto.
    const planeGeom = new THREE.PlaneGeometry(params.width, params.height);
    // update the texture
    texture.repeat.set(params.repeatS, params.repeatT);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    const planeMat = new THREE.MeshBasicMaterial({color: 0xffffff,
                                                  map: texture});
    scene.remove(plane);
    plane = new THREE.Mesh(planeGeom, planeMat);
    scene.add(plane);
}

// create a TextureLoader for loading the image file
var loader = new THREE.TextureLoader();

// load the flower0.jpg image (stored in the same folder as this
// webpage), and when the image load is done, invoke the anonymous
// function callback

var theTexture;

function reportTextureSize(texture) {
    const image = texture.image;
    const width = image.width;
    const height = image.height;
    console.log(`Texture dimensions: ${width}x${height}`);
}


const imageFile = "flower0.jpg";

loader.load(imageFile,
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
gui.add(params, 'width', 1, 10).onChange(() => displayPlane(theTexture));
gui.add(params, 'height', 1, 10).onChange(() => displayPlane(theTexture));
gui.add(params, 'repeatS', 0, 5).onChange(() => displayPlane(theTexture));
gui.add(params, 'repeatT', 0, 5).onChange(() => displayPlane(theTexture));

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -5, maxx: 5,
                            miny: -5, maxy: 5,
                            minz: -5, maxz: 5});

