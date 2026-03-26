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

// Lighting 
function addLights() {

    var ambLight = new THREE.AmbientLight(0xffffff, 0.5); // soft light
    scene.add(ambLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1); 
    dirLight.position.set(2, 3, 1);


    scene.add(dirLight);

    return ambLight;
    
}

addLights();

// This has 9 faces. Here's the documentation in TW; feel free
// to look at the code as well.

/* The resulting geometry has these sides/material groups:

     0 front quad
     1 east or +x quad
     2 west -x quad
     3 east roof quad
     4 west roof quad
     5 bottom quad
     6 back quad
     7 front upper triangle
     8 back upper triangle
     */

var barnMesh;

const houseMat = [
    "images/brick.jpeg",
    "images/roof.jpeg"
];

async function finalHouse() {
    scene.remove(barnMesh);
    const barnGeometry = TW.barnGeometryWithMaterialGroups(30, 40, 50);

    TW.loadTextures(houseMat, function (texArray) {
        
        // repition and wrapping for the textures
        var wallTex = texArray[0];
        wallTex.wrapS = THREE.RepeatWrapping;
        wallTex.wrapT = THREE.RepeatWrapping;
        wallTex.repeat.set(3, 3);

        var roofTex = texArray[1];
        roofTex.wrapS = THREE.RepeatWrapping;
        roofTex.wrapT = THREE.RepeatWrapping;
        roofTex.repeat.set(1, 1); 

        var wallMat = new THREE.MeshPhongMaterial({ color: 0xffffff, map: wallTex });
        var roofMat = new THREE.MeshPhongMaterial({ color: 0xffffff, map: roofTex });

        // Correlate the two materials with corresponding side
        var matArray = [
            wallMat, // 0 front
            wallMat, // 1 east
            wallMat, // 2 west
            roofMat, // 3 east roof
            roofMat, // 4 west roof
            wallMat, // 5 bottom
            wallMat, // 6 back
            wallMat, // 7 front upper triangle 
            wallMat  // 8 back upper triangle
        ];

        barnMesh = new THREE.Mesh(barnGeometry, matArray);
        scene.add(barnMesh);
    });
    return barnMesh;
}

finalHouse();

// Add lighting to the house
function houseLighting() {
    scene.remove(barnMesh);

    const whiteMat = new THREE.MeshPhongMaterial({ color: 0xfafafa });
    const barnGeometry = TW.barnGeometryWithMaterialGroups(30, 40, 50);

    barnMesh = new THREE.Mesh(barnGeometry, whiteMat);
    scene.add(barnMesh);
    return barnMesh;
}
    

// ===============================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer, scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -30, maxx: 30,
                            miny: 0, maxy: 12,
                            minz: -30, maxz: 30});



// simple gui to switch between two versions
const gui = new GUI();

const guiParams = {
    'final': finalHouse,
    'lighting': houseLighting
}

gui.add(guiParams, 'final');
gui.add(guiParams, 'lighting');