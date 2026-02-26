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
};

// These control points are all at the corners of a unit cube.

const controlPoints = [ [0,0,1],
                        [1,0,1],
                        [1,0,0],
                        [1,1,0] ];

const curveMat = new THREE.LineBasicMaterial( { color: "cyan" });
const curveGeo = TW.createBezierCurve(controlPoints, 20);
const curve = new THREE.Line( curveGeo, curveMat );
scene.add(curve);

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


