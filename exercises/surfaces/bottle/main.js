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
// A "coke bottle" created by lathe geometry

// Upper curve, from diameter of 0.75in at height 5in to diameter of 1.5in
// at height 2.5in. 
const upperCP = [[0.5/2, 5.0, 0.0],
                 [0.5/2, 4.0, 0.0],
                 [1.5/2, 3.0, 0.0],
                 [1.5/2, 2.5, 0.0]];

// Middle curve, from upper bulge [see previous] to dent with diameter of
// 1.25in at height of 1.25in. */
const middleCP = [[1.5/2,  2.5,  0.0],
                  [1.5/2,  2.0,  0.0],
                  [1.25/2, 1.75, 0.0],
                  [1.25/2, 1.25, 0.0]];
                          
// Lower curve, from dent to base, with a radius the same as the bulge. 
const lowerCP = [[1.25/2, 1.25, 0.0],
                 [1.25/2, 0.75, 0.0],
                 [1.5/2,  0.50, 0.0],
                 [1.5/2,  0.00, 0.0]];

/* given the control points for a bezier curve, return a bunch of 2D
 * points on that curve.
*/
function createBezierCurve (controlPoints, numPoints) {
    const vecs = controlPoints.map( a => new THREE.Vector3(...a) );
    const curve = new THREE.CubicBezierCurve3(...vecs);
    const points = curve.getPoints(numPoints);
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(points);
    return geo;
};

function makeBezierPoints(cp, stacks) {
    const vecs = cp.map( a => new THREE.Vector2(...a) );
    // note that this is CubicBezierCurve not CubicBezierCurve3
    const curve = new THREE.CubicBezierCurve(...vecs);
    const pts = curve.getPoints(stacks);
    return pts;
}

function makeCokeGeometry() {
    const stacks = 16;
    const slices = 8;
    const allPts = [].concat(
        makeBezierPoints(upperCP, 8),
        makeBezierPoints(middleCP, 8),
        makeBezierPoints(lowerCP, 8));
    const geo = new THREE.LatheGeometry(allPts, 8);
    return geo;
}

function makeCokeBottle() {
    const geo = makeCokeGeometry();
    const mat = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh( geo, mat );
    scene.add(mesh);
    return mesh;
}
const cokeMesh = makeCokeBottle();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// const gui = new GUI();

// Set up a camera for the scene
const bb = new THREE.Box3().setFromObject(cokeMesh);
TW.cameraSetup(renderer,scene, {minx: bb.min.x, maxx: bb.max.x,
                                miny: bb.min.y, maxy: bb.max.y,
                                minz: bb.min.z, maxz: bb.max.z});

