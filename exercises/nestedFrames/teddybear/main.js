//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as TB from './teddybear.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

const initialBodyColor = 0xD08050;
const initialHeadColor = 0xB07040; // like body, but darker
const initialEyeColor = 0x000;     // black
const initialNoseColor = 0x000;    // black

// Related parameters are grouped, and later we will put them in
// folders by groups

const parameters = {
    // basic
    wireframe: false,
    sphereDetail: 10,
    cylinderDetail: 10,
    bodyRadius: 5,
    bodyScaleY: 2,
    // head
    head: true,
    headRadius: 2,
    nose: true,
    noseRadius: 0.5,
    noseRotation: TW.degrees2radians(10),
    ears: true,
    earRadius: 0.6,
    earScale: 0.5,
    earAngle: Math.PI/4,
    eyes: true,
    eyeRadius: 0.3,
    eyeAngleX: -Math.PI/6,
    eyeAngleY: +Math.PI/6,
    // arms
    arms: true,
    armLength: 7,
    armRadiusTop: 1.5,
    armRadiusBottom: 1.2,
    // legs
    legs: true,
    legRadiusTop: 1.8,
    legRadiusBottom: 1.4,
    legLength: 9,
    legRotationX: -TW.degrees2radians(60),
    legRotationZ: TW.degrees2radians(20),
    hipWidth: 2.5,
    hipHeight: -7,
    // colors. values are the constants above
    bodyColor: initialBodyColor, // also used for limbs
    headColor: initialHeadColor,
    eyeColor: initialEyeColor,
    noseColor: initialNoseColor,
    // materials. Not part of the GUI, but part of the API
    bodyMaterial: new THREE.MeshBasicMaterial({color: initialBodyColor}),
    headMaterial:  new THREE.MeshBasicMaterial({color: initialHeadColor}),
    armMaterial:  new THREE.MeshBasicMaterial({color: initialHeadColor}),
    legMaterial:  new THREE.MeshBasicMaterial({color: initialHeadColor}),
    noseMaterial:  new THREE.MeshBasicMaterial({color: initialNoseColor}),
    eyeMaterial:  new THREE.MeshBasicMaterial({color: initialEyeColor}),
};

var teddy;

function remakeTeddy() {
    scene.remove(teddy);
    // use the global parameters
    teddy = TB.makeTeddyBear(parameters);
    scene.add(teddy);
}
                                 
function updateScene() {
    remakeTeddy();
}
updateScene();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// lots of folders
const gui = new GUI();
const basic = gui.addFolder('basic').close();
basic.add(parameters, 'wireframe').onChange(updateScene);
basic.add(parameters, 'sphereDetail',2,30).step(1).onChange(updateScene);
basic.add(parameters, 'cylinderDetail',3,30).step(1).onChange(updateScene);
basic.add(parameters, 'bodyRadius',2,10).onChange(updateScene);
basic.add(parameters, 'bodyScaleY',1,3).onChange(updateScene);
const head = gui.addFolder('head').close();
head.add(parameters, 'head').onChange(updateScene);
head.add(parameters, 'headRadius',1,3).onChange(updateScene);
head.add(parameters, 'nose').onChange(updateScene);
head.add(parameters, 'noseRadius',0.1,0.9).onChange(updateScene);
head.add(parameters, 'noseRotation',0.1,Math.PI/2).onChange(updateScene);
head.add(parameters, 'ears').onChange(updateScene);
head.add(parameters, 'earRadius',0.1,0.9).onChange(updateScene);
head.add(parameters, 'earScale',0.1,0.9).onChange(updateScene);
head.add(parameters, 'earAngle',0.1,Math.PI/2).onChange(updateScene);
head.add(parameters, 'eyes').onChange(updateScene);
head.add(parameters, 'eyeRadius',0.1,0.6).onChange(updateScene);
head.add(parameters, 'eyeAngleX',-Math.PI/2,0).onChange(updateScene);
head.add(parameters, 'eyeAngleY',0,Math.PI/2).onChange(updateScene);
const arms = gui.addFolder('arms').close();
arms.add(parameters, 'arms').onChange(updateScene);
arms.add(parameters, 'armLength',3,14).onChange(updateScene);
arms.add(parameters, 'armRadiusTop',0.5,3).onChange(updateScene);
arms.add(parameters, 'armRadiusBottom',0.5,3).onChange(updateScene);
const legs = gui.addFolder('legs').close();
legs.add(parameters, 'legs').onChange(updateScene);
legs.add(parameters, 'legRadiusTop',0.5,3).onChange(updateScene);
legs.add(parameters, 'legRadiusBottom',0.5,3).onChange(updateScene);
legs.add(parameters, 'legLength',3,14).onChange(updateScene);
legs.add(parameters, 'legRotationX',-3,0).step(0.01).onChange(updateScene);
legs.add(parameters, 'legRotationZ',0.0,3).step(0.01).onChange(updateScene);
legs.add(parameters, 'hipHeight',-10,-1).step(0.1).onChange(updateScene);
legs.add(parameters, 'hipWidth',1.0,5.0).step(0.1).onChange(updateScene);
const colors = gui.addFolder('colors').close();
colors.addColor(parameters, 'bodyColor').onChange((val) => parameters.bodyMaterial.color.set(val));
colors.addColor(parameters, 'noseColor').onChange((val) => parameters.noseMaterial.color.set(val));
colors.addColor(parameters, 'eyeColor').onChange((val) => parameters.eyeMaterial.color.set(val));
colors.addColor(parameters, 'headColor')
    .onChange((val) => {
        parameters.headMaterial.color.set(val);
        parameters.armMaterial.color.set(val);
        parameters.letMaterial.color.set(val);
    });

// Set up a camera for the scene
TW.cameraSetup(renderer,
               scene,
               {minx: -5, maxx: 5,
                miny: -10, maxy: 15,
                minz: -5, maxz: 5});
TW.toggleAxes("show");
