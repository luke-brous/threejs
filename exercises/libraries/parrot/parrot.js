/* This demo shows how to load a glTF object

   I followed https://discoverthreejs.com/book/first-steps/load-models/

   and I got the parrot from:

   https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Parrot.glb
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

console.log(`Loaded Three.js version ${THREE.REVISION}`);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

TW.clearColor = 0xffffff;
TW.mainInit(renderer, scene);

// ================================================================
//

const amb = new THREE.AmbientLight(0x404040);
scene.add(amb);

const sun = new THREE.DirectionalLight(0xffffff, 10);
sun.position.set(5,10,1);
scene.add(sun);

const loader = new GLTFLoader();

async function loadParrot() {
    const parrotData = await loader.loadAsync('Parrot.glb');
    console.log('Squawk!', parrotData);
    const parrot = parrotData.scene; // this is actually a Group()
    globalThis.parrot = parrot;
    const box = new THREE.Box3().setFromObject(parrot);
    console.log(box);
    scene.add(parrot);
    TW.cameraSetup(renderer,
                   scene,
                   TW.objectBoundingBox(parrot));
}
loadParrot();


