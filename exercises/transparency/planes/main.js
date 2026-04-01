/* This shows three planes with adjustable transparency (alpha)
 * values, at different distances from the camera.
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
    bgColor: 'black',           // symbolic value, for menu
    clearColor: 0x000000,
    plane1: {
        color: 0x00ffff,        // cyan
        z: 0,
        opacity: 0.5,
        transparent: true,
        depthTest: true
    },
    plane2: {
        color: 0xffff00,        // yellow
        z: -1,
        opacity: 0.5,
        transparent: true,
        depthTest: true
    },
    plane3: {
        color: 0xff00ff,        // magenta
        z: -2,
        opacity: 0.5,
        transparent: true,
        depthTest: true
    },
    colors: {
        // for experiments. You can use these to "save" colors using the eyedropper
        color1: 0x0,
        color2: 0x0,
        color3: 0x0,
        color4: 0x0,
    }
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
var plane1, plane2, plane3;

function redrawPlanes() {

    const geo = new THREE.PlaneGeometry(10,10);
    function remakePlane(old, params, x) {
        scene.remove(old);
        const mat = makeBasicMaterial(params);
        const plane = new THREE.Mesh(geo,mat);
        scene.add(plane);
        plane.position.set(x,0,params.z);
        return plane;
    }
    plane1 = remakePlane(plane1, params.plane1, 0, 0);
    plane2 = remakePlane(plane2, params.plane2, 2, -2);
    plane3 = remakePlane(plane3, params.plane3, 4, -4);
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
gui.add(params, 'bgColor', ['black','white','custom']).onChange(
    function () {
        switch ( params.bgColor ) {
            case 'black': params.clearColor = 0x000000; break;
            case 'white': params.clearColor = 0xFFFFFF; break;
        }
        renderer.setClearColor( params.clearColor );
        TW.render();
    });
gui.addColor(params, 'clearColor').onChange(function () {
    renderer.setClearColor( params.clearColor );
    TW.render();
});
const gui1 = gui.addFolder('plane1');
gui1.add(params.plane1, 'opacity', 0, 1).onChange(redrawPlanes);
gui1.add(params.plane1, 'z',-4,0).step(1).onChange(redrawPlanes);
gui1.add(params.plane1, 'transparent').onChange(redrawPlanes);
gui1.add(params.plane1, 'depthTest').onChange(redrawPlanes);
const gui2 = gui.addFolder('plane2');
gui2.add(params.plane2, 'opacity', 0, 1).onChange(redrawPlanes);
gui2.add(params.plane2, 'z',-4,0).step(1).onChange(redrawPlanes);
gui2.add(params.plane2, 'transparent').onChange(redrawPlanes);
gui2.add(params.plane2, 'depthTest').onChange(redrawPlanes);
const gui3 = gui.addFolder('plane3');
gui3.add(params.plane3, 'opacity', 0, 1).onChange(redrawPlanes);
gui3.add(params.plane3, 'z',-4,0).step(1).onChange(redrawPlanes);
gui3.add(params.plane3, 'transparent').onChange(redrawPlanes);
gui3.add(params.plane3, 'depthTest').onChange(redrawPlanes);
const gui4 = gui.addFolder('colors');
gui4.addColor(params.colors, 'color1');
gui4.addColor(params.colors, 'color2');
gui4.addColor(params.colors, 'color3');
gui4.addColor(params.colors, 'color4');
