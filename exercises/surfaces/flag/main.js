//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// Lights
scene.add( new THREE.AmbientLight( 0x404040 ));
var dirLight = new THREE.DirectionalLight( "white", 3 );
dirLight.position.set( 2, 3, 5 );
scene.add( dirLight );

// ================================================================
// A flag: a 2D curved surface

const params = {
    slices: 8,
    stacks: 8,
    flipY: true,
    pngFile: true,
    lighting: true,
    flag: true,
    wireframe: false,
    controlPoints: false,
};

const topToBottom = [
    [ [0,10,0],  [2,9,1],  [7,9,0],  [9,9,-1] ],
    [ [1,8,0], [2,8,1],  [7,8,-1],  [8,8,0] ],
    [ [1,2,0], [2,2,2],  [8,2,-1],  [8,8,0] ],
    [ [0,0,0],  [2,1,2], [8,2,-2], [9,3,0] ]
].reverse();

// Given an array of arrays of arrays, where the innermost array are
// 3-place specifications of points, returns an array of arrays of
// Vector3 objects.
function array2vectors(array2) {
    return array2.map(inner => inner.map( a => new THREE.Vector3(...a)));
}

var flagMesh;

function makeTexturedFlag(texture) {
    scene.remove(flagMesh);
    const vecs = array2vectors(topToBottom);
    const paramFunction = TW.bicubicBezierFunction(vecs);
    const geometry = new ParametricGeometry(paramFunction,
                                            Math.round(params.slices),
                                            Math.round(params.stacks));
    texture.flipY = params.flipY;
    texture.needsUpdate = true;
    const flagMat = 
          params.lighting ?
          new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) :
          new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
    flagMat.wireframe = params.wireframe;
    flagMesh = new THREE.Mesh( geometry, flagMat );
    flagMesh.name = "flag";
    scene.add(flagMesh);
    if(params.controlPoints) {
        showCP2D(topToBottom);
    }
}

const rgmb = TW.make2x2texture(["red","lime",
                                "magenta", "blue"]);
const flagDataTexture = rgmb;

function makeFlag() {
    if( params.pngFile ) {
        TW.loadTexture('USflag-2048.png', makeTexturedFlag);
        // TW.loadTexture('images/uv_grid.jpg', makeTexturedFlag);
    } else {
        makeTexturedFlag(flagDataTexture);
    }
}
makeFlag();

// This iterates over a 2D list of control points and shows each one with a tiny sphere.
// The argument is a 
function showCP2D(cpList, radius=0.1) {
    for( let j=0; j < cpList.length; j++ ) {
        let subList = cpList[j];                      
        for( let i=0; i < subList.length; i++ ) {
            scene.add(TW.createPoint(subList[i], radius));
        }
    }
};


// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
TW.cameraSetup(renderer,scene, {minx:0,maxx:9,
                                miny:0,maxy:10,
                                minz:-1,maxz:1});

const gui = new GUI();
gui.add(params, 'pngFile').onChange(makeFlag);
gui.add(params, 'flipY').onChange(makeFlag);
gui.add(params, 'lighting').onChange(makeFlag);
gui.add(params, 'wireframe').onChange(makeFlag);
gui.add(params, 'controlPoints').onChange(makeFlag);
gui.add(params, 'slices',1,32).step(1).onChange(makeFlag);
gui.add(params, 'stacks',1,32).step(1).onChange(makeFlag);
