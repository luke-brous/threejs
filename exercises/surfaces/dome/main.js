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


// Returns the binomial coefficient for N choose K
function binomial(n, k) {
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n + 1 - i) / i;
  }
  return res;
}

// Returns the value of the Bernstein polynomial (with parameters n
// and i) for a given value of t.
function bernstein(n, i, t) {
  return binomial(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}

// Given an array of arrays of arrays, where the innermost array are
// 3-place specifications of points, returns an array of arrays of
// Vector3 objects.
function array2vectors(array2) {
    return array2.map(inner => inner.map( a => new THREE.Vector3(...a)));
}

const topToBottom = [
    [ [0,3,0],  [2,4,1],  [4,4,1],  [6, 3, 0] ],
    [ [-1,2,0], [2,2,1],  [4,2,1],  [7, 2, 0] ],
    [ [-1,1,0], [2,1,1],  [4,1,1],  [7, 1, 0] ],
    [ [0,0,0],  [2,-1,0], [4,-1,0], [6, 0, 0] ],
];

const controlPoints = array2vectors(topToBottom);

// Function that uses the global variable controlPoints to compute a
// point on the 2D cubic Bezier, given parameters s and t. The
// 'target' argument is a Vector3 object which is used to store the
// result. There is no return value.
function bicubicBezier(s, t, target) {
  target.set(0, 0, 0);
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      const b_i = bernstein(3, i, s);
      const b_j = bernstein(3, j, t);
      const cp = controlPoints[j][i];
      target.x += cp.x * (b_i * b_j);
      target.y += cp.y * (b_i * b_j);
      target.z += cp.z * (b_i * b_j);
    }
  }
}

function makeDome(slices=8, stacks=8, showMesh=false) {
    const geometry = new ParametricGeometry(bicubicBezier, slices, stacks);
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "dome";
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

showCP2D(topToBottom);          // optional, for debugging.

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// const gui = new GUI();

// Set up a camera for the scene
TW.cameraSetup(renderer,scene, {minx:-1,maxx:8,miny:0,maxy:3,minz:0,maxz:0});

