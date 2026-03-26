/* This demo show using a raycaster to create points and drag them around.
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TW } from 'tw';
import GUI from 'gui';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// init

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

// ================================================================
// camera setup

const cameraFOVY = 75;
const canvas = renderer.domElement;
const aspectRatio = canvas.clientWidth/canvas.clientHeight;

const sceneBoundingBox = {
    minx: -10, maxx: 10,
    miny: -10, maxy: 10,
    minz: 0, maxz: 0
};

var render;

function setupCamera(orbiting) {
    const cp = TW.cameraSetupParams(sceneBoundingBox, cameraFOVY);
    const camera = new THREE.PerspectiveCamera(cameraFOVY, aspectRatio, cp.near, cp.far);
    const at = cp.center;
    camera.position.set(at.x, at.y, at.z+cp.cameraRadius);
    render = function () { renderer.render(scene, camera); }
    globalThis.render = render;
    if(orbiting) {
        const oc = new OrbitControls(camera, canvas);
        oc.addEventListener('change', render);
        oc.target.copy( cp.center );
        oc.enablePan = false; // otherwise, dragging is panning, which we don't want.
        oc.update();
    }
    return camera;
}
const camera = setupCamera(true);
globalThis.camera = camera;

// ================================================================
// Build your scene here
// This scene has a white plane (like a piece of paper) at Z=0.
// It will also points (small spheres) dynamically added.

const paper = new THREE.Mesh(new THREE.PlaneGeometry(20,20),
                             new THREE.MeshBasicMaterial({color: "white"}));
paper.name = "paper";
scene.add(paper);

// This is the list of objects we are interested in "picking"

const intersectionObjects = [paper];

// ================================================================
// dynamic list of points

const points = [];              // the points that have been dynamically added
var currPointObj = null;        // the current point, for moving

// useful if we want to print the points, maybe to use in another graphics project
function printPoints() {
    var i;
    console.log("[");
    // start at 1 to skip the paper plane
    for( let i=1; i<intersectionObjects.length; i++) {
        const p = intersectionObjects[i].position;
        console.log("["+p.x+","+p.y+","+p.z+"],");
    }
    console.log("]");
}
globalThis.printPoints = printPoints;

// return a copy of the vertex3 objects, suitable for creating Lathe
// and other geometries.

function getPoints() {
    var pts = [];
    // start at 1 to skip the paper plane
    for( let i=1; i<intersectionObjects.length; i++) {
        pts.push( intersectionObjects[i].position.clone() );
    }
    return pts;
}

function addSphereAt(pt) {
    var sph = new THREE.Mesh( new THREE.SphereGeometry(0.5),
                              new THREE.MeshNormalMaterial());
    sph.position.copy(pt);
    scene.add(sph);
    return sph;
}

// ================================================================
// mouse handling and picking

var isMouseDown = false;

function convertMousePositionToNDC(event) {
    const rect = event.target.getBoundingClientRect();
    // Note the difference for converting Y. That's because Y goes from top to bottom
    const xNDC = ( (event.clientX - rect.left) / rect.width ) * 2 - 1;
    const yNDC = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;
    const ndc = new THREE.Vector2(xNDC, yNDC);
    return ndc;
}
                                   
const raycaster = new THREE.Raycaster();

// Pick an object in the scene (among the pickable objects). Either
// (1) paper, (2) an existing point, or (3) null.
function pickPaperPoint(clickNDC) {
    const click = clickNDC;
    const clickNear = new THREE.Vector3( click.x, click.y, -1 );
    const clickFar  = new THREE.Vector3( click.x, click.y, +1 );
    clickNear.unproject( camera);
    clickFar.unproject( camera);

    // configure raycaster with origin and direction
    const dir = clickFar.clone();
    dir.sub(clickNear).normalize();
    raycaster.set( clickNear, dir );

    // console.log("looking for intersections");
    const intersects = raycaster.intersectObjects(intersectionObjects);
    // console.log("found "+intersects.length+" intersections");
    if(intersects.length == 0) {
        // console.log('no intersection');
        return null;
    } else {
        return intersects[0];
    }
}

function onMouseDown(evt) {
    if( ! evt.shiftKey ) return; // only handle shift-click
    isMouseDown = true;
    const click = convertMousePositionToNDC(evt);
    const pick = pickPaperPoint(click);
    if(pick == null) return;
    if(pick.object == paper) {
        console.log("picked the paper, so create a sphere there");
        const point = pick.point.clone(); // the point of intersection, in world coordinates
        if( Math.abs(point.z) > 0.000001 ) {
            console.log("Something is wrong in this intersection; z should be zero");
        }
        point.z = 0;                // in case there's a tiny, non-zero bit
        // create a new object and set the global
        currPointObj = addSphereAt(point);
        intersectionObjects.push(currPointObj);
        render();
    } else {
        console.log('picked a point; save it for dragging');
        currPointObj = pick.object;
    }
}

function onMouseMove(evt) {
    if( ! evt.shiftKey ) return; // only handle shift-click
    if( ! isMouseDown ) return;
    // evt.stopPropagation();     // don't propagate this event; we own it
    // we're only interested in moving the currentPointObj
    if( currPointObj == null ) {
        return;
    }

    const click = convertMousePositionToNDC(evt);
    const pick = pickPaperPoint(click);
    if(pick == null) return;

    // move currentPointObj to new location, defined by pick.point;
    // To avoid moving it towards the camera, we zero out the z coordinate
    const tmp = pick.point.clone();
    tmp.z = 0;
    currPointObj.position.copy(tmp);
    render();
}

function onMouseUp(evt) {
    isMouseDown = false;
    currPointObj = null;
}

document.addEventListener( 'mousedown', onMouseDown, true );
document.addEventListener( 'mousemove', onMouseMove, true );
document.addEventListener( 'mouseup', onMouseUp, true );

// ================================================================

render();
