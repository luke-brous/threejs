//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import GUI from 'gui';
import { TW } from 'tw';
import { createTree } from 'cs360/town/tree.js';
import { createSnowPerson } from 'cs360/town/snowperson.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

const scene = new THREE.Scene();
globalThis.scene = scene;
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; // new for shadows

TW.clearColor = 0;
TW.mainInit(renderer, scene);

// ================================================================
// Lights

const lightParams = {
    ambIntensity: 1,
    sunIntensity: 50,
    pos: {x: 30, y: 20, z: 10},
};

const amb = new THREE.AmbientLight();
amb.intensity = lightParams.ambIntensity;
scene.add(amb);

function makeDirectionalLight(intensity) {
    const dirLight = new THREE.DirectionalLight(0xffffff, intensity);
    dirLight.castShadow = true;
    // shadow camera frustum for directional light (important)
    const d = 20;               // should be enough for our 20x20 ground
    dirLight.shadow.camera.left   = -d;
    dirLight.shadow.camera.right  =  d;
    dirLight.shadow.camera.top    =  d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.near   = 1;
    dirLight.shadow.camera.far    = 100;
    const helper = new THREE.CameraHelper(dirLight.shadow.camera);
    scene.add(helper);
    return dirLight;
}

function makePointLight(intensity) {
    const light = new THREE.PointLight(0xffffff, intensity);
    light.decay = 0;
    light.distance = 0;
    light.castShadow = true;
    scene.add(light);
    const helper = new THREE.PointLightHelper( light, 1 );
    scene.add( helper );
    return light;
}

const sun = makePointLight(lightParams.sunIntensity);
sun.position.copy(lightParams.pos);

// ================================================================
// a 20x20 area with trees and snowman

function makeGround() {
    const geo = new THREE.PlaneGeometry(20,20);
    // const mat = new THREE.MeshStandardMaterial({color: 0x4F7942}); // aka ferngreen
    const mat = new THREE.MeshPhongMaterial({color: 0x4F7942, side: THREE.DoubleSide}); // aka ferngreen
    mat.roughness = 1;
    const mesh = new THREE.Mesh( geo, mat );
    mesh.name = "shadow ground";
    mesh.position.set(10,0,10);
    mesh.rotation.x = -Math.PI/2;
    // ground only receives shadow, doesn't cast it.
    mesh.receiveShadow = true;
    scene.add(mesh);
}

makeGround();

function childrenShadows(group, cast, receive) {
    for( let c of group.children ) {
        c.castShadow = cast;    // new for shadows
        c.receiveShadow = receive; // new for shadows
    }
}
    

/* In this particular forest, I don't think the trees will in fact
   receive any shadows, but in a thicker forest or if the sun is low,
   they might. The tree foliage and trunk will both cast and receive
   shadows
   */

function createTreeWithShadow(inits) {
    const coneMaterial = new THREE.MeshStandardMaterial({color: "darkgreen"});
    coneMaterial.roughness = 1; // this is the default, but I wanted to be explicit
    const trunkMaterial = new THREE.MeshStandardMaterial({color: "brown"});
    trunkMaterial.roughness = 1;
    inits.coneMaterial = coneMaterial;
    inits.trunkMaterial = trunkMaterial;
    const tree = createTree(inits);
    tree.name = "tree with shadow";
    childrenShadows(tree, true, true);
    scene.add(tree);
    return tree;
}

const tree1 = createTreeWithShadow({});
tree1.position.set(1,0,1);

const tree2 = createTreeWithShadow({coneHeight: 12});
tree2.position.set(18,0,1);

const tree3 = createTreeWithShadow({coneHeight: 8, coneRadius: 3});
tree3.position.set(18,0,18);

const tree4 = createTreeWithShadow({trunkHeight: 5, coneRadius: 3});
tree4.position.set(1,0,18);

function createSnowPersonWithShadow(inits) {
    const snowMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee});
    snowMaterial.roughness = 0.2;   // pretty smooth, I hope
    inits.mat = snowMaterial;
    const group = createSnowPerson(inits);
    group.name = "snowperson with shadow";
    childrenShadows(group, true, true);
    scene.add(group);
    return group;
}

const frosty = createSnowPersonWithShadow({r1: 0.4, r2: 0.5, r3: 0.6});
frosty.position.set(10,0,10);
scene.add(frosty);

const sceneBB = {minx: 0, maxx: 20,
                 miny: 0, maxy: 20,
                 minz: 0, maxz: 20};

TW.cameraSetup(renderer,
               scene,
               sceneBB);

const gui = new GUI();
const lightGui = gui.addFolder('light');

lightGui.add(lightParams, 'ambIntensity', 0, 5).onChange(v => amb.intensity = v);
lightGui.add(lightParams, 'sunIntensity', 10, 100).onChange(v => sun.intensity = v);
lightGui.add(lightParams.pos, 'x', -10, 30).onChange(v => sun.position.x = v);
lightGui.add(lightParams.pos, 'y', 20, 40).onChange(v => sun.position.y = v);
lightGui.add(lightParams.pos, 'z', -10, 30).onChange(v => sun.position.z = v);

