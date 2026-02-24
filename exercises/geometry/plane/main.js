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

// ====================================================================
// Building Geometry

const plane1 = new THREE.PlaneGeometry(2,2);
const plane1mesh = new THREE.Mesh( plane1, new THREE.MeshNormalMaterial());
plane1mesh.position.set(+2,0,0,);
scene.add(plane1mesh);

const gi = TW.geometryInfo(plane1);
globalThis.gi = gi;
TW.printGeometryInfo(gi);

function makePlaneGeometry(width, height) {
    const [w, h] = [width/2, height/2];
    const norm = [0,0,1];
    const vertices = [
        {pos: [-w,+w,0], norm: norm, uv: [0,1]},
        {pos: [+w,+w,0], norm: norm, uv: [1,1]},
        {pos: [-w,-w,0], norm: norm, uv: [0,0]},
        {pos: [+w,-w,0], norm: norm, uv: [1,0]},
    ];
    const geometry = new THREE.BufferGeometry();
    TW.setBufferGeometryFromVertices(geometry, vertices);
    geometry.setIndex([
        0, 2, 1,
        2, 3, 1
    ]);
    return geometry;
}
const plane2 = makePlaneGeometry(2,2);
const plane2mesh = new THREE.Mesh( plane2, new THREE.MeshNormalMaterial());
plane2mesh.position.set(-2,0,0,);
scene.add(plane2mesh);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -3, maxx: 3,
                            miny: -3, maxy: 3,
                            minz: -3, maxz: 3});
