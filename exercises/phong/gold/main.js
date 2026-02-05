/*-----------------------------------------------------------------
 * Golden Treasure Exercise
 * 
 * We want to set up material and lighting to create the scene in 
 * golden-treasure.png.
 * 
 * 1. Add a directional light and a point light
 * 2. Change the material to Phong
 * 3. Adjust until it seems about right
 *---------------------------------------------------------------*/

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

const golden = new THREE.MeshBasicMaterial( {color: "goldenrod"} );

// addTreasure() function adds gold cylinder, sphere, brick, and ring to the scene

function addTreasure () {

    // golden cylinder
    var cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(15,15,50,100),
                                      golden);
    cylinderMesh.position.set(-25,25,-25);
    scene.add(cylinderMesh);

    // golden sphere
    var sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(20,100,100), 
                                    golden);
    sphereMesh.position.set(25,20,-25);
    scene.add(sphereMesh);

    // golden brick
    var brickMesh = new THREE.Mesh(new THREE.BoxGeometry(40,10,20), 
                                   golden)
    brickMesh.position.set(-25,5,25);
    scene.add(brickMesh);

    // golden ring
    var ringMesh = new THREE.Mesh(new THREE.TorusGeometry(10,4,100,100),
                                  golden)
    ringMesh.position.set(25,5,25);
    ringMesh.rotation.set(-Math.PI/2,0,0);
    scene.add(ringMesh);
}

// add a rug to the scene
const green = new THREE.MeshBasicMaterial( {color: "green"});
var rug = new THREE.Mesh(new THREE.PlaneGeometry(120,120), green);
rug.rotation.set(-Math.PI/2,0,0);
scene.add(rug);

addTreasure();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

TW.cameraSetup(renderer,
               scene,
               {minx: -50, maxx: 50,
                miny: 0, maxy: 50,
                minz: -50, maxz: 50});
