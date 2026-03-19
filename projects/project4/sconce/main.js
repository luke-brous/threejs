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

const lightParams1 = {
    spotlightX: -30,
    spotlightY: 25,
    spotlightZ: -40,
    spotlightColor: 0xffffff,
    spotlightIntensity: 20,
    spotlightDistance: 0,
    spotlightAngle: 0.4,
    spotlightPenumbra: 0.05,
    spotlightDecay: 0.5,
    targetX: -30,
    targetY: 8,
    targetZ: -40,
}

const lightParams2 = {
    spotlightX: -30,
    spotlightY: 0,
    spotlightZ: -40,
    spotlightColor: 0xffffff,
    spotlightIntensity: 20,
    spotlightDistance: 0,
    spotlightAngle: 0.4,
    spotlightPenumbra: 0.05,
    spotlightDecay: 0.5,
    targetX: -30,
    targetY: 18,
    targetZ: -40,
}

const params = {
    sphereRad: 10,
    coneRad: 4,
    coneHeight: 10
}

const colors = [
    0xadd8e6, // pale blue
    0xf5f5dc, // beige
    0x006400, // dark green
    0xbe29ec,  // purple
    0xfafafa
];

// Creates and returns a box with each side a different color, viewed
// from the *inside*.

// See https://threejs.org/docs/#api/en/constants/Materials

// 4 sides are pale blue, bottom is beige, top is dark green
function makeBox(width, height, depth) {
    const geo = new THREE.BoxGeometry(width, height, depth);

    const mats = [
        new THREE.MeshPhongMaterial({color: colors[0], side: THREE.BackSide}), // right
        new THREE.MeshPhongMaterial({color: colors[0], side: THREE.BackSide}), // left
        new THREE.MeshPhongMaterial({color: colors[2], side: THREE.BackSide}), // top
        new THREE.MeshPhongMaterial({color: colors[1], side: THREE.BackSide}), // bottom
        new THREE.MeshPhongMaterial({color: colors[0], side: THREE.BackSide}), // front
        new THREE.MeshPhongMaterial({color: colors[0], side: THREE.BackSide}), // back
    ];
    
    return new THREE.Mesh(geo, mats);
}

const box = makeBox(100, 100, 100);
scene.add(box);

function makeSphere(){
    const sphereGeo = new THREE.SphereGeometry(params.sphereRad, 16, 16)
    const sphereMat = new THREE.MeshPhongMaterial({color: colors[3], specular: 0x444444, shininess: 40})
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    sphere.position.set(-35, -40, -40)
    scene.add(sphere)
    return sphere
}
makeSphere()


function wallLight() {
    const coneGeo = new THREE.ConeGeometry(params.coneRad, params.coneHeight, 16,16,true)
    const coneMesh = new THREE.MeshPhongMaterial({color: colors[4], side: THREE.DoubleSide})
    const cone1 = new THREE.Mesh(coneGeo, coneMesh)
    scene.add(cone1)
    cone1.position.set(-30, 8, -40)
    const cone2 = new THREE.Mesh(coneGeo, coneMesh)
    scene.add(cone2)
    cone2.position.set(-30, 17, -40)
    cone2.rotation.set(Math.PI, 0, 0)
    
    return cone1
}
wallLight()

function ambientLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    ambientLight.name = "ambientLight"
    return ambientLight
}
ambientLight()

function directionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    directionalLight.name = "directionalLight"
    return directionalLight
}
directionalLight()

function spotLight() {
    const spotLight = new THREE.Group();

    const spotLight1 = new THREE.SpotLight(
        lightParams1.spotlightColor,
        lightParams1.spotlightIntensity,
        lightParams1.spotlightDistance,
        lightParams1.spotlightAngle,
        lightParams1.spotlightPenumbra,
        lightParams1.spotlightDecay
    );
    spotLight1.position.set(
        lightParams1.spotlightX,
        lightParams1.spotlightY,
        lightParams1.spotlightZ
    );
    spotLight1.target.position.set(
        lightParams1.targetX,
        lightParams1.targetY,
        lightParams1.targetZ
    );
    scene.add(spotLight1);
    scene.add(spotLight1.target);
    spotLight1.name = "spotLight1"

    // spotlight facing upwards
    const spotLight2 = new THREE.SpotLight(
        lightParams2.spotlightColor,
        lightParams2.spotlightIntensity,
        lightParams2.spotlightDistance,
        lightParams2.spotlightAngle,
        lightParams2.spotlightPenumbra,
        lightParams2.spotlightDecay
    );
    spotLight2.position.set(
        lightParams2.spotlightX,
        lightParams2.spotlightY,
        lightParams2.spotlightZ
    );
    spotLight2.target.position.set(
        lightParams2.targetX,
        lightParams2.targetY,
        lightParams2.targetZ
    );
    scene.add(spotLight2);
    scene.add(spotLight2.target);
    spotLight2.name = "spotLight2"

    spotLight.add(spotLight1);
    spotLight.add(spotLight2);
    scene.add(spotLight);


    return spotLight1
}
spotLight()




// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// turn off and on ambient, directional, and point lights
const gui = new GUI();
gui.add(scene.getObjectByName("ambientLight"), 'visible').name('Ambient Light');
gui.add(scene.getObjectByName("directionalLight"), 'visible').name('Directional Light');
// make both spottlights turn off and on together
const spotlightToggle = { visible: true };
gui.add(spotlightToggle, 'visible').name('Spotlights').onChange((isVisible) => {
    const spotLight1 = scene.getObjectByName("spotLight1");
    const spotLight2 = scene.getObjectByName("spotLight2");
    if (spotLight1) {
        spotLight1.visible = isVisible;
    }
    if (spotLight2) {
        spotLight2.visible = isVisible;
    }
});

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -50, maxx: 50,
                            miny: -50, maxy: 50,
                            minz: -50, maxz: 50});
TW.toggleAxes("show");



