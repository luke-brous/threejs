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
// build your scene here

//this function is a slightly modified version of a function taken from the fence demo

/* Makes a fence, with the left end at the origin and proceeding down
   the x axis. The pickets are made from barn objects, scaled to be unit
   height (at the shoulder) and very thin. */
function makeFence(numPickets) {
    const fence = new THREE.Group();
            
    const picketG = TW.barnGeometry(.09, 1, 0.1);
    const picketM = new THREE.MeshNormalMaterial();
    let picket = new THREE.Mesh(picketG,picketM);   
            
    for( let i = 0; i < numPickets; ++i ) {
        picket = picket.clone(false);
        picket.translateX(0.1);
        fence.add(picket);
    }
    return fence;
}
        
//create a barn, fence and ground
var barn = new TW.createMesh(TW.barnGeometry(5,5,10));
scene.add(barn);
        
let fence = makeFence(40);
//fence.rotation.y = Math.PI/2;
fence.translateX(5);
        
let fence2 = fence.clone();
fence2.translateZ(-10);
        
let fence3 = makeFence(100);
fence3.translateX(9.2);
fence3.rotation.y = Math.PI/2;
        
scene.add(fence);
scene.add(fence2);
scene.add(fence3);
        
// ground will go from -10 to +10 in X and Z
// This is important in giving you your bearings on the scene
var ground = new THREE.Mesh(new THREE.PlaneGeometry(20,20),
                            new THREE.MeshBasicMaterial({color:THREE.Color.NAMES.darkgreen}));
ground.rotation.x = -Math.PI/2;
        
scene.add(ground);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
TW.cameraSetup(renderer,scene,{minx: -20, maxx: +20,
                               miny: 0, maxy: 50,
                               minz: -20, maxz: +20});

