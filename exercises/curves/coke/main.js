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
    allRed: true,
};

// Three bezier curves

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

const cokePoints = Array.prototype.concat(upperCP, middleCP, lowerCP);

function printPoints(points) {
    var i;
    console.log("[");
    for( i=0; i < points.length; i++) {
        p = points[i];
        console.log("["+p.x+","+p.y+","+p.z+"],");
    }
    console.log("]");
}

function makeVertex(p) {
    return new THREE.Vector3(p[0],p[1],p[2]);
}

function makeVertices(points) {
    return pts.map(p => new THREE.Vector3(...p));
}

function makeCurve( controlPoints, material ) {
    const geo = TW.createBezierCurve(controlPoints, 20);
    const mesh = new THREE.Line(geo, material);
    return mesh;
}

var cokeBottle;

function makeCokeBottle() {
    scene.remove(cokeBottle);

    const grp = new THREE.Group();
    const red = new THREE.LineBasicMaterial({color: "red", linewidth: 5});
    const white = new THREE.LineBasicMaterial({color: "white", linewidth: 5});
    grp.add(makeCurve( upperCP, red ));
    grp.add(makeCurve( middleCP, params.allRed ? red : white ));
    grp.add(makeCurve( lowerCP, red ));
    cokeBottle = grp;
    scene.add(grp);
}
makeCokeBottle();

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
        showCP(cokePoints);
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
                miny: 0, maxy: 5,
                minz: 0, maxz: 0});

const gui = new GUI();
gui.add(params, 'showControlPoints').onChange(maybeShowControlPoints);
gui.add(params, 'allRed').onChange(makeCokeBottle);
