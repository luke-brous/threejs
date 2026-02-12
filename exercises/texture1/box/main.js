//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

// Function adds the textured box to the scene once the textures are loaded.
const boxGeom = new THREE.BoxGeometry(10, 10, 10);
var boxMesh;

// First example is w/o texturing, just different colors:

const colorsArray = [
    "red",
    "green",
    "blue",
    "cyan",
    "magenta",
    "yellow"];

function colorsBox() {
    scene.remove(boxMesh);
    const matArray = colorsArray.map((c) => new THREE.MeshBasicMaterial({color: c}));
    boxMesh = new THREE.Mesh( boxGeom, matArray );
    scene.add(boxMesh);
}

const faceFiles = [
    "images/giles.gif",
    "images/willow.gif",
    "images/xander.gif",
    "images/angel.gif",
    "images/buffy.gif",
    "images/dawn.gif"];

async function faces() {
    scene.remove(boxMesh);
    console.log('adding faces', faceFiles);
    TW.loadTextures(
        faceFiles,
        function (texArray) {
            console.log("done loading face textures");
            const matArray = texArray.map(ta => new THREE.MeshBasicMaterial({map: ta}));
            boxMesh = new THREE.Mesh(boxGeom, matArray);
            scene.add(boxMesh);
        });
}

/*
  Dice images from Wikimedia

Nein Arimasen, CC BY-SA 3.0 <http://creativecommons.org/licenses/by-sa/3.0/>, via Wikimedia Commons
*/

/* On real dice, the opposite faces add to 7. This does that. */

const diceFiles = [1,6,3,4,5,2]
      .map(i => `images/Dice-${i}.png`);

async function dice() {
    scene.remove(boxMesh);
    console.log('adding dice mappings', diceFiles);
    TW.loadTextures(
        diceFiles,
        function (texArray) {
            console.log("done loading die textures");
            const matArray = texArray.map(ta => new THREE.MeshBasicMaterial({map: ta}));
            boxMesh = new THREE.Mesh(boxGeom, matArray);
            scene.add(boxMesh);
        });
}

const natureFiles = [1,2,3,4,5,6].map(i => `images/pexels${i}.jpg`);

async function nature() {
    scene.remove(boxMesh);
    console.log('adding nature mappings', natureFiles);
    TW.loadTextures(
        natureFiles,
        function (texArray) {
            console.log('done loading nature textures');
            const matArray = texArray.map(ta => new THREE.MeshBasicMaterial({map: ta}));
            boxMesh = new THREE.Mesh(boxGeom, matArray);
            scene.add(boxMesh);
        }
    )
}

nature();


// ================================================================

var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -5, maxx: 5,
                            miny: -5, maxy: 5,
                            minz: -5, maxz: 5});

// ================================================================
TW.setKeyboardCallback('1', colorsBox, 'colors');
TW.setKeyboardCallback('2', faces, 'faces');
TW.setKeyboardCallback('3', dice, 'dice');
TW.setKeyboardCallback('4', nature, 'nature');