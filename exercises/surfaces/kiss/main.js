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
// A "kiss" created by lathe geometry

const kissControlPoints = [
    [0, 20],
    [8, 4],
    [12, 5],
    [12, 0],
];

/* given the control points for a bezier curve that is the silhouette
 * of a lathe geometry, create and return a lathe geometry with that
 * silhouette. The "stacks" variable is the number of circular
 * cross-sections (Y values) and the "slices" variable is the number
 * of segments on each circle (think of it as slices of pizza).
*/
function makeBezierLatheGeometry(cp, stacks, slices) {
    // note that these are Vector2, not Vector3
    const vecs = cp.map( a => new THREE.Vector2(...a) );
    // note that this is CubicBezierCurve not CubicBezierCurve3
    const curve = new THREE.CubicBezierCurve(...vecs);
    const pts = curve.getPoints(stacks);
    const geo = new THREE.LatheGeometry(pts, slices);
    return geo;
}

function makeKiss() {
    const geo = makeBezierLatheGeometry(kissControlPoints, 20, 32);
    const mat = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh( geo, mat );
    scene.add(mesh);
    return mesh;
}
makeKiss();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// const gui = new GUI();

// Set up a camera for the scene
TW.cameraSetup(renderer,scene, {minx:-10,maxx:10,
                                miny:0,maxy:20,
                                minz:-10,maxz:10});

