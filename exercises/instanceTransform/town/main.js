/*-----------------------------------------------------------------
 * Build a Town Exercise
 * 
 * Follow the instructions in town.md to build your own town scene.
 *---------------------------------------------------------------*/

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

var params = {
    planeColor: 0xffffff,
    treeColor: 0x006400,
    trunkColor: 0x964B00
}

// ================================================================
// build your town here

function newHouse(x,y,z,rotate) {
    const house = TW.createMesh( TW.barnGeometry( 5, 6, 10 ) );
    house.position.set(x,y,z)
    house.rotateY(rotate || 0);
    scene.add(house)
    return house;

}

function newPlane(width, height) {
    const geo = new THREE.PlaneGeometry( width, height );
    const mat = new THREE.MeshBasicMaterial( {color: params.planeColor, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geo, mat );
    plane.rotateX(-Math.PI/2);
    plane.position.set(width/2,0,height/2)
    scene.add( plane );
    return plane;
}

function newTree(radius, height, radSeg) {
    // upper/leaf part of the tree
    const geoTree = new THREE.ConeGeometry( radius, height, radSeg );
    const matTree = new THREE.MeshBasicMaterial( {color: params.treeColor})
    const tree = new THREE.Mesh( geoTree, matTree )
    tree.position.set(12,6,25)

    scene.add( tree )
    return tree;
}

function newTrunk(radTop, radBot, height, radSeg) {

    // trunk part of the tree
    const geoTrunk = new THREE.CylinderGeometry(
	radTop, radBot, height, radSeg );
    const matTrunk = new THREE.MeshBasicMaterial( {color: params.trunkColor})
    const trunk = new THREE.Mesh( geoTrunk, matTrunk)
    trunk.position.set(12,1.5,25)

    scene.add(trunk)
    return trunk;
}



// create the houses 
newHouse(10,0,15,Math.PI/2);
newHouse(14,0,10);
newHouse(20,0,16, Math.PI*1.7);

newPlane(35,35);

newTree(2,9,20)

newTrunk(.5,.5,3,10)











// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -5, maxx: 35,
                            miny: 0, maxy: 60,
                            minz: -60, maxz: 0});

