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
    showControlPoints: false,
    tubularSegments: 16,
    radius: 0.1,
    radialSegments: 8,
    closed: false,
};

// These control points are all at the corners of a unit cube.
const controlPoints = [ [0,0,1],
                        [1,0,1],
                        [1,0,0],
                        [1,1,0] ];

var tube;

function makeTube() {
    scene.remove(tube);
    const vecs = controlPoints.map( a => new THREE.Vector3(...a) );
    const curve = new THREE.CubicBezierCurve3(...vecs);
    const geo = new THREE.TubeGeometry(curve,
                                       params.tubularSegments,
                                       params.radius,
                                       params.radialSegments,
                                       params.closed);
    const mat = new THREE.MeshNormalMaterial();
    tube = new THREE.Mesh( geo, mat );
    scene.add(tube);
}
makeTube();

// ================
// optionally show the control points

var cpGroup;

const basicYellow = new THREE.MeshBasicMaterial({color: "yellow"});

// This creates a tiny sphere at each control point
function showCP(cpList) {
    const grp = new THREE.Group();
    for( let i=0; i < cpList.length; i++ ) {
        grp.add(TW.createPoint(cpList[i], 0.03, basicYellow));
    }
    cpGroup = grp;
    scene.add(grp);
};

function maybeShowControlPoints() {
    scene.remove(cpGroup);
    if( params.showControlPoints ) {
        showCP(controlPoints);
    } 
}
maybeShowControlPoints();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

TW.clearColor = 0x000000;       // clear to black
TW.mainInit(renderer,scene);

// Set up a camera for the scene
TW.cameraSetup(renderer,
               scene,
               {minx: 0, maxx: 1,
                miny: 0, maxy: 1,
                minz: 0, maxz: 1});

const gui = new GUI();
gui.add(params, 'showControlPoints').onChange(maybeShowControlPoints);
gui.add(params, 'tubularSegments', 1, 32).step(1).onChange(makeTube);
gui.add(params, 'radius', 0, 1).onChange(makeTube);
gui.add(params, 'radialSegments', 3, 20).step(1).onChange(makeTube);
gui.add(params, 'closed').onChange(makeTube);
