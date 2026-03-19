//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
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
// The Utah Teapot

const geometry = new TeapotGeometry( 50, 18 );
const material = new THREE.MeshNormalMaterial();
const teapot = new THREE.Mesh( geometry, material );
teapot.name = "teapot";
scene.add( teapot );

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

TW.clearColor = -1;
TW.mainInit(renderer,scene);

// const gui = new GUI();

// Set up a camera for the scene
// I got the bounding box from the object itself:
const bbox = new THREE.Box3().setFromObject(teapot);
TW.cameraSetup(renderer,scene, {
    minx: bbox.min.x, maxx: bbox.max.x,
    miny: bbox.min.y, maxy: bbox.max.y,
    minz: bbox.min.z, maxz: bbox.max.z});

