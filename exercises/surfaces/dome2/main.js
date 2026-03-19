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

// ================================================================
// A dome: a 2D curved surface

// Given an array of arrays of arrays, where the innermost array are
// 3-place specifications of points, returns an array of arrays of
// Vector3 objects.
function array2vectors(array2) {
    return array2.map(inner => inner.map( a => new THREE.Vector3(...a)));
}

const dome0 = [
    [ [0,3,0],  [2,4,1],  [4,4,1],  [6, 3, 0] ],
    [ [-1,2,0], [2,2,1],  [4,2,1],  [7, 2, 0] ],
    [ [-1,1,0], [2,1,1],  [4,1,1],  [7, 1, 0] ],
    [ [0,0,0],  [2,-1,0], [4,-1,0], [6, 0, 0] ],
];

// Much bigger arches than dome0
const dome1 = [
    [ [0,10,0], [5,10,5], [15,10,5], [20, 10, 0] ],
    [ [0,7,3],  [5,7,8],  [15,7,8],  [20, 7, 3] ],
    [ [0,3,3],  [5,3,8],  [15,3,8],  [20, 3, 3] ],
    [ [0,0,0],  [5,0,5],  [15,0,5],  [20, 0, 0] ],
];

// Same as dome1, but from the side
const dome2 = [
    [ [0,0,-10], [5,5,-10], [15,5,-10], [20, 0, -10] ],
    [ [0,5,-7],  [5,7,-7],  [15,7,-7],  [20, 5, -7] ],
    [ [0,5,-3],  [5,7,-3],  [15,7,-3],  [20, 5, -3] ],
    [ [0,0,0],  [5,5,0],  [15,5,0],  [20, 0, 0] ],
];

function makeDome(slices=8, stacks=8, showMesh=false) {
    const cp = array2vectors(dome2.reverse());
    const paramFunction = TW.bicubicBezierFunction(cp)
    const geometry = new ParametricGeometry(paramFunction, slices, stacks);
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    // for debugging
    if(showMesh) {
        const wire = new THREE.MeshBasicMaterial( { color: "white",
                                                    wireframe: true,
                                                    wireframeLinewidth: 2 } );
        const demo = new THREE.Mesh(geometry, wire);
        scene.add(demo);
    }
    return mesh;
}
makeDome(8,8,true);

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

showCP2D(dome2);          // optional, for debugging.

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// const gui = new GUI();

// Set up a camera for the scene
TW.cameraSetup(renderer,scene, {minx:0,maxx:20,
                                miny:0,maxy:7,
                                minz:-10,maxz:0});

