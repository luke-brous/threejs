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
// Build your scene here

var tree;

// Function adds the textured tree to the scene once the texture is loaded.
// Tree is 120 units high and 30 radius

function makeTree (textures) {
    scene.remove(tree);
    // create a tree with a cone and cylinder, and map image
    // textures of pine needles and tree bark onto the parts
    const grp = new THREE.Group();

    const topHeight = 100;
    const botHeight = 20;

    const pine = textures[0];
    const bark = textures[1];
    
    var topGeom = new THREE.ConeGeometry(30,topHeight,16);
    pine.repeat.set(8,4);
    pine.wrapS = THREE.MirrorRepeatWrapping;
    pine.wrapT = THREE.MirrorRepeatWrapping;
    pine.needsUpdate = true;
    var topMat = new THREE.MeshBasicMaterial({color: 0xffffff,
                                              map: pine});
    var topMesh = new THREE.Mesh(topGeom, topMat);
    topMesh.position.set(0,botHeight+topHeight/2,0);
    grp.add(topMesh);

    var trunkGeom = new THREE.CylinderGeometry(5,5,botHeight);
    bark.repeat.set(2,2);
    bark.wrapS = THREE.MirrorRepeatWrapping;
    bark.wrapT = THREE.MirrorRepeatWrapping;
    bark.needsUpdate = true;
    var trunkMat = new THREE.MeshBasicMaterial( {color: 0xffffff,
                                                 map: bark} );
    var trunkMesh = new THREE.Mesh(trunkGeom, trunkMat);
    trunkMesh.position.set(0,botHeight/2,0);
    grp.add(trunkMesh);

    // global variable
    tree = grp;
    scene.add(tree);
    TW.render();    // render the scene
}

// create a TextureLoader for loading the image file

var loader = new THREE.TextureLoader();

async function loadTreeTextures(tree, bark) {
    document.getElementById('texture1').src = tree;
    document.getElementById('texture2').src = bark;
    TW.loadTextures([tree, bark], makeTree);
}

async function pineTree() {
    loadTreeTextures("images/pineTexture.jpg",
                     "images/pineBarkTexture.jpg");
}

async function uvTree() {
    loadTreeTextures("images/UV_Grid_Sm.jpg",
                     "images/UV_Grid_Sm.jpg");
}


pineTree();
// ================================================================

var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene,
               {minx: -30, maxx: 30,
                miny: -0, maxy: 120,
                minz: -30, maxz: 30});

// ================================================================
TW.setKeyboardCallback('1', pineTree, 'pine tree');
TW.setKeyboardCallback('2', uvTree, 'UV tree');

