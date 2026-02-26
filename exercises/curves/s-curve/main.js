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

const controlPoints = [
    [0,0,0],   // start at origin
    [2,2,0],   // head northeast
    [-2,1,0],  // finish from southwest
    [0,3,0],   // finish here
];

function createBezierCurve(controlPoints, numPoints) {
    const vecs = controlPoints.map( a => new THREE.Vector3(...a) );
    const curve = new THREE.CubicBezierCurve3(...vecs);
    const points = curve.getPoints(numPoints);
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(points);
    return geo;
}

const curveMat = new THREE.LineBasicMaterial( { color: "blue",
                                                linewidth: 5 } );

const curveGeo = createBezierCurve(controlPoints, 20);
const curve = new THREE.Line( curveGeo, curveMat );
scene.add(curve);

// This creates a tiny sphere at each control point
function showCP(cpList) {
    for( var i=0; i < cpList.length; i++ ) {
        scene.add(TW.createPoint(cpList[i]));
    }
};

showCP(controlPoints);          // optional, for debugging.

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

