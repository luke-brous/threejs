/* This shows two planes at the same depth
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
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
// Build your scene here

const params = {
    plane1: {
        color: 0xff0000,
        opacity: 0.9,
        transparent: true,
        depthTest: true
    },
    plane2: {
        color: 0x0000ff,
        opacity: 0.9,
        transparent: true,
        depthTest: true
    },
};

function makeBasicMaterial(params) {
    const p = params;
    const mat = new THREE.MeshBasicMaterial(
        {color: p.color,
         side: THREE.DoubleSide,
         transparent: p.transparent, // boolean
         opacity: p.opacity,         // float 0-1
         depthTest: p.depthTest      // boolean, typically true and omitted
        });
    return mat;
}
 
// Globals, so we can remove them
var plane1, plane2;

function redrawPlanes() {

    const geo = new THREE.PlaneGeometry(10,10);
    function remakePlane(old, params, x, z) {
        scene.remove(old);
        const mat = makeBasicMaterial(params);
        const plane = new THREE.Mesh(geo,mat);
        scene.add(plane);
        plane.position.set(x,0,z);
        return plane;
    }
    plane1 = remakePlane(plane1, params.plane1, 0, 0);
    plane2 = remakePlane(plane2, params.plane2, 2, 0);
    TW.render();
}

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

TW.clearColor = params.clearColor;
TW.mainInit(renderer,scene);
        
TW.cameraSetup(renderer,
               scene,
               {minx: -5, maxx: 5,
                miny: -5, maxy: 5,
                minz: -5, maxz: 5});
redrawPlanes();


const gui = new GUI();
const gui1 = gui.addFolder('plane1');
gui1.add(params.plane1, 'opacity', 0, 1).onChange(redrawPlanes);
gui1.add(params.plane1, 'transparent').onChange(redrawPlanes);
gui1.add(params.plane1, 'depthTest').onChange(redrawPlanes);
const gui2 = gui.addFolder('plane2');
gui2.add(params.plane2, 'opacity', 0, 1).onChange(redrawPlanes);
gui2.add(params.plane2, 'transparent').onChange(redrawPlanes);
gui2.add(params.plane2, 'depthTest').onChange(redrawPlanes);
