/*-----------------------------------------------------------------
 * Build a Town Exercise
 * 
 * Follow the instructions in town.md to build your own town scene.
 * Add multiple trees and multiple snowmen.  
 * I strongly suggest that you use a group for the tree:
 *     - create a THREE.Group to hold the two parts of the tree
 *     - define a function to create and return the group
 *     - place the group in the scene using position.set()
 *---------------------------------------------------------------*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import * as SNOW from './snowperson.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// build your town here

var params = {
    planeColor: 0xffffff,
    treeColor: 0x006400,
    trunkColor: 0x964B00,
    radius: 2,
    treeHeight: 10,
    radSeg: 8,
    radTop: 0.5,
    radBot: 0.5,
    trunkHeight: 2,
    trunkRadSeg: 8
}

const snowParams = {
    wireFrame: true,
    snowColor: 0xffffff,        // white
    noseColor: 0xff8c00,        // orange
    botSize: 3,                 // bottom ball
    midSize: 2,                 // middle ball
    topSize: 1,                 // top ball
    noseSize: 0.5,              // length of nose
};

function remakeSnowmen(x, z, rotate) {
    const snowman = SNOW.makeSnowPerson(snowParams);
    snowman.position.set(x,0,z);
    scene.add(snowman);
    snowman.rotateY(rotate || 0)
    return snowman;
}



function newHouse(x,y,z,rotate) {
    const house = TW.createMesh( TW.barnGeometry( 3, 4, 6 ) );
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


function newTree(params, x, z) {
    const tree = new THREE.Group();
    
    const geoTree = new THREE.ConeGeometry( params.radius, params.treeHeight, params.radSeg );
    const matTree = new THREE.MeshBasicMaterial( {color: params.treeColor})
    const treeMesh = new THREE.Mesh( geoTree, matTree )

    const geoTrunk = new THREE.CylinderGeometry(
    params.radTop, params.radBot, params.trunkHeight, params.trunkRadSeg );
    const matTrunk = new THREE.MeshBasicMaterial( {color: params.trunkColor})
    const trunkMesh = new THREE.Mesh( geoTrunk, matTrunk)

    tree.add( treeMesh );
    tree.add( trunkMesh );

    trunkMesh.position.set(x, params.trunkHeight/2, z);
    treeMesh.position.set(x, params.trunkHeight + params.treeHeight/2, z);


    scene.add( tree )
    return tree;
}


// create the scene objects
newHouse(10,0,10,Math.PI/2);
newHouse(14,0,10);
newHouse(20,0,20,Math.PI/4);
newHouse(5,0,25,Math.PI/3);

newPlane(30, 30);

newTree(params, 4, 4);
newTree(params, 10, 15);
newTree(params, 20, 8);
newTree(params, 28, 20);
newTree(params, 15, 28);

remakeSnowmen(27,27, -Math.PI/4);
remakeSnowmen(27,2, Math.PI )









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

