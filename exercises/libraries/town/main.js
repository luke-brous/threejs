/* This demo shows how to load objects from our a library.
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import { createTree } from 'cs360/town/tree.js';
import { createSnowPerson } from 'cs360/town/snowperson.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

TW.clearColor = 0;
TW.mainInit(renderer, scene);

// ================================================================
// a 20x20 area with trees and barns.

const tree1 = createTree({});
tree1.position.set(1,0,1);
scene.add(tree1);

const tree2 = createTree({coneHeight: 12});
tree2.position.set(18,0,1);
scene.add(tree2);

const tree3 = createTree({coneHeight: 8, coneRadius: 3});
tree3.position.set(18,0,18);
scene.add(tree3);

const tree4 = createTree({trunkHeight: 5, coneRadius: 3});
tree4.position.set(1,0,18);
scene.add(tree4);

const frosty = createSnowPerson({r1: 0.4, r2: 0.5, r3: 0.6});
frosty.position.set(10,0,10);
scene.add(frosty);

const sceneBB = {minx: 0, maxx: 20,
                 miny: 0, maxy: 20,
                 minz: 0, maxz: 20};

TW.cameraSetup(renderer,
               scene,
               sceneBB);
TW.toggleGroundPlane();


