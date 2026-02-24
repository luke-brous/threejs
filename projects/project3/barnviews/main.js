//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
const scene = new THREE.Scene();

const wireBarn = TW.wireBarnMesh(10, 10, 20);
scene.add(wireBarn);

const origin = new THREE.Mesh(
    new THREE.SphereGeometry(0.3),
    new THREE.MeshBasicMaterial({color: 0xffffff}) // White sphere for origin
);
scene.add(origin);


// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
const renderer = new THREE.WebGLRenderer();
TW.clearColor = new THREE.Color(0, 0, 0); // Black background
const canvas = TW.mainInit(renderer, scene);

const aspectRatio = canvas.clientWidth / canvas.clientHeight;
let camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);

// 4. Render Function
function render() {
    renderer.render(scene, camera);
}

function updateCamera(fov, eyeX, eyeY, eyeZ, atX, atY, atZ, upX = 0, upY = 1, upZ = 0) {
    camera.fov = fov;
    camera.updateProjectionMatrix(); // then add this line
    
    camera.position.set(eyeX, eyeY, eyeZ);
    camera.up.set(upX, upY, upZ);
    camera.lookAt(new THREE.Vector3(atX, atY, atZ)); // do this last
    
    render();
}

// different slides
function slide1() {
    document.getElementById("slidename").innerHTML = "Slide 1";
    updateCamera(40, 0, 0, 70, 0, 0, 0, 0, 1, 0);

}

function slide2() {
    document.getElementById("slidename").innerHTML = "Slide 2";
    updateCamera(40, 35, 0, 50, 0, 0, 0, 0, 1, 0);
}

function slide3() {
    document.getElementById("slidename").innerHTML = "Slide 3";
    updateCamera(40, 25, 25, 30, 0, 0, 0, 0, 1, 0);
}

function slide4() {
    document.getElementById("slidename").innerHTML = "Slide 4";
    updateCamera(50, 0, 60, 0, 0, 0, 0, 1, 0, 0);
}

function slide5() {
    document.getElementById("slidename").innerHTML = "Slide 5";
    updateCamera(55, -1, 60, 3, 0, 0, 0, 0, 1, 0);
}

TW.setKeyboardCallback('1', slide1, "Slide 1");
TW.setKeyboardCallback('2', slide2, "Slide 2");
TW.setKeyboardCallback('3', slide3, "Slide 3");
TW.setKeyboardCallback('4', slide4, "Slide 4");
TW.setKeyboardCallback('5', slide5, "Slide 5");

slide5();