//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as TB from './teddybear.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

/* this version uses decay=0 for the point lights, which means we
 * don't have to use super intensities to see any effects. */

const pointLightDistance = 0; // the default
const pointLightDecay = 0;    // default is 2, physical model

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

var teddy;

function remakeTeddy() {
    scene.remove(teddy);
    // use the default parameters except for material
    const bodyMaterial = new THREE.MeshLambertMaterial({color: 0xD08050});
    const headMaterial = new THREE.MeshLambertMaterial({color: 0xB07040});
    const eyeMaterial = new THREE.MeshPhongMaterial({color: 0x000000,
                                                     specular: 0xffffff,
                                                     shininess: 50,
                                                    });
    const noseMaterial = eyeMaterial;
    teddy = TB.makeTeddyBear({bodyMaterial, headMaterial, eyeMaterial, noseMaterial});
    scene.add(teddy);
}
                                 
function updateScene() {
    remakeTeddy();
}
updateScene();

// ==== lighting ===
// Use nested dictionaries for a bit of brevity

const parameters = {
    ambient: {
        on: true,
        color: 0xffffff,
        intensity: 1},
    point: {
        on: true,
        color: 0xffffff,
        intensity: 1,
        x: -12,
        y: 15,
        z: 10,
    },
    directional: {
        on: true,
        color: 0xffffff,
        intensity: 1,
        x: 0,
        y: 100,
        z: 10,
    },
};

// we're using globals for the lights, for the GUI
var light0;
var light1;
var light2;

function makeLights() {
    scene.remove(light0);
    scene.remove(light1);
    scene.remove(light2);

    const p = parameters;

    if(p.ambient.on) {
        light0 = new THREE.AmbientLight( p.ambient.color, p.ambient.intensity );
        scene.add(light0);
    }
 
    if(p.directional.on) {
        light1 = new THREE.DirectionalLight( p.directionalColor, p.directionalIntensity );
        light1.position.set( p.directional.x, p.directional.y, p.directional.z );
        scene.add(light1);
    }

    if(p.point.on) {
        light2 = new THREE.PointLight( p.point.color,
                                       p.point.intensity,
                                       pointLightDistance,
                                       pointLightDecay
                                     );
        light2.position.set( p.point.x, p.point.y, p.point.z );
        scene.add(light2);
    }
 
}
makeLights();

// ==== postlude === 

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Keep the GUI lean, because this demo is presented before
// the students know all the different kinds

const gui = new GUI();
gui.add(parameters.ambient, 'intensity', 0, 5)
    .onChange(v=>light0.intensity=v);
gui.add(parameters.directional, 'intensity', 0, 5)
    .onChange(v=>light1.intensity=v);
gui.add(parameters.point, 'intensity', 0, 5)
    .onChange(v=>light2.intensity=v);

// Set up a camera for the scene
TW.cameraSetup(renderer,
               scene,
               {minx: -5, maxx: 5,
                miny: -10, maxy: 15,
                minz: -5, maxz: 5});
TW.toggleAxes("show");
