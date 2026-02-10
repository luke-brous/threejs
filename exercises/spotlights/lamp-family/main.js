/*-----------------------------------------------------------------
 * Lamp Exercise
 * 
 * We want to set up spotlights to create the scene in 
 * lamp-goal.png.
 * 
 * 1. Change the materials to Phong Materials
 * 2. Make spotlight objects (intensity, cutoff angle, etc.)
 * 3. Position the spotlight objects (one for mom and one for jr)
 *---------------------------------------------------------------*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as lamp from './lamp.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Scene



// these are the defaults, but adjustable via GUI
const params = {
    shadeAngle: 90,
    elbowAngle: -90,
    baseAngle: 45,
};

// angle of the light direction inside the shade
const angle = Math.atan(3 / 5); 

const lightParams = {
    spotlightX: -3,
    spotlightY: 8,
    spotlightZ: 0,
    spotlightColor: 0xffffff,
    spotlightIntensity: 5,
    spotlightDistance: 0,
    spotlightAngle: angle,
    spotlightPenumbra: 0.01,
    spotlightDecay: 0,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
};

function removeByName(name) {
    var obj = scene.getObjectByName(name);
    if( obj ) scene.remove(obj);
}

var mom;
var jr;
// build the lamp and add it to the scene
function makeScene() {
    removeByName("mom");
    mom = lamp.makeLamp(params);
    mom.position.set(-5,0,0);
    mom.name = "mom";
    scene.add(mom);

    removeByName("jr");
    jr = lamp.makeLamp({baseMaterial: new THREE.MeshPhongMaterial({color:"red"})});
    jr.position.set(+5,0,0);
    jr.rotateY(Math.PI);
    jr.scale.set(0.5, 0.5, 0.5);
    jr.name = "jr";
    scene.add(jr);

    const planeMaterial = new THREE.MeshPhongMaterial({color: 0x30D040, side: THREE.DoubleSide});
    const plane = new THREE.Mesh( new THREE.PlaneGeometry(25,25), planeMaterial );
    plane.rotateX(-Math.PI/2);
    plane.position.set(0,-0.01,0);
    scene.add(plane);

    return mom;
}

makeScene();


// get the position of the shade
scene.updateMatrixWorld(true); // make sure all world matrices are up to date
const bp = mom.getObjectByName("shade").getWorldPosition(new THREE.Vector3());
THREE.Light.position.copy(bp);
print(`shade position: ${bp.x}, ${bp.y}, ${bp.z}`);

function makeSpotlight() {
    removeByName("spot");
    const spotLight = new THREE.SpotLight(
        lightParams.spotlightColor,
        lightParams.spotlightIntensity,
        lightParams.spotlightDistance,
        lightParams.spotlightAngle,
        lightParams.spotlightPenumbra,
        lightParams.spotlightDecay
    );
    spotLight.name = "spot";
    spotLight.position.set(lightParams.spotlightX, lightParams.spotlightY, lightParams.spotlightZ); 

    const target = new THREE.Object3D();
    target.position.set(lightParams.targetX, lightParams.targetY, lightParams.targetZ);
    scene.add(target);
    spotLight.target = target;
    
    scene.add(spotLight);

    return spotLight;
}






makeSpotlight();


// const mom = lamp.makeShade({});
// const mom = lamp.makeLowerArm(params);




// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const PI = 180;

const gui = new GUI();
gui.add(params, 'shadeAngle', -PI, PI).onChange((val) => {
    mom.getObjectByName("shade").rotation.z = TW.degrees2radians(val);
});
gui.add(params, 'elbowAngle', -PI, PI).onChange((val) => {
    mom.getObjectByName("elbow").rotation.z = TW.degrees2radians(val);
});
gui.add(params, 'baseAngle', -PI, PI).onChange((val) => {
    const grp = mom.getObjectByName("base");
    mom.getObjectByName("base").rotation.z = TW.degrees2radians(val);
});


// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: 0, maxy: 12,
                            minz: -10, maxz: 10});
