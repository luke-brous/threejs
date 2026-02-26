/*-----------------------------------------------------------------
 * Heart Exercise
 * 
 * Devise the control points to draw a heart, like 
 * goal.png.
 * 
 * Hint: This requires two Bezier curves.
 *---------------------------------------------------------------*/

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

const controlPoints1 = [
    [0,0,0],   // start at origin
    [2,2,0],   //  Right side of the heart
    [2,5,0],  // Left side of the heart
    [0,3,0],   // Top of the heart
];

const controlPoints2 = [
    [0,0,0],   // start at origin
    [-2,2,0],   //  Left side of the heart
    [-2,5,0],  // Right side of the heart
    [0,3,0],   // Top of the heart
];

function createBezierCurve(controlPoints, numPoints) {
    const vecs = controlPoints.map( a => new THREE.Vector3(...a) );
    const curve = new THREE.CubicBezierCurve3(...vecs);
    const points = curve.getPoints(numPoints);
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(points);
    return geo;
}

const curveMat = new THREE.LineBasicMaterial( { color: "red",
                                                linewidth: 5 } );

const curveGeo = createBezierCurve(controlPoints1, 120);
const curve = new THREE.Line( curveGeo, curveMat );
scene.add(curve);

const curveGeo2 = createBezierCurve(controlPoints2, 120);
const curve2 = new THREE.Line( curveGeo2, curveMat );
scene.add(curve2);

// This creates a tiny sphere at each control point
function showCP(cpList) {
    for( var i=0; i < cpList.length; i++ ) {
        scene.add(TW.createPoint(cpList[i]));
    }
};

showCP(controlPoints1);          // optional, for debugging.
showCP(controlPoints2);          // optional, for debugging.

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// const gui = new GUI();

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -2, maxx: +2,
                            miny: 0, maxy: 3,
                            minz: 0, maxz: 0});

