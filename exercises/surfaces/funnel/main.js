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
// A funnel created by lathe geometry

const outline = [
    [1, 0],
    [2, 10],
    [15, 22 ]
];

function makeFunnel(outline) {
    const pts = outline.map(a => new THREE.Vector2(...a));
    const geo = new THREE.LatheGeometry(pts);
    const mat = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh( geo, mat );
    scene.add(mesh);
    return mesh;
}
makeFunnel(outline);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// const gui = new GUI();

// Set up a camera for the scene
TW.cameraSetup(renderer,scene, {minx:-15,maxx:15,
                                miny:0,maxy:22,
                                minz:-15,maxz:15});

