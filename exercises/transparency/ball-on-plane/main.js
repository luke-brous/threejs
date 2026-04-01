//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'gui';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

var params = {
    ballRadius: 3,
    tableSize: 20,
    tableThickness: 0.1,
    ballAlpha: 1,
    lastParam: null
};

var renderer = new THREE.WebGLRenderer();
        
TW.mainInit(renderer,scene);
        
TW.cameraSetup(renderer,
               scene,
               {minx: -5, maxx: 5,
                miny: -5, maxy: 5,
                minz: -5, maxz: 5});

var ballTable, ball, table;

function makeScene() {
    scene.remove(ballTable);
    ballTable = new THREE.Object3D();

    ball = new THREE.Mesh( new THREE.SphereGeometry(params.ballRadius,30,30),
                           new THREE.MeshBasicMaterial({color: "red",
                                                        transparent: true,
                                                        opacity: params.ballAlpha}) );
    ball.translateZ(params.ballRadius);
    ballTable.add(ball);

    table = new THREE.Mesh( new THREE.BoxGeometry(params.tableSize,
                                                  params.tableSize,
                                                  params.tableThickness),
                            new THREE.MeshBasicMaterial({color: "saddleBrown",
                                                         transparent: false}) );
    ballTable.add(table);
    ballTable.rotateX( TW.degrees2radians(-30) );
    scene.add(ballTable);
    TW.render();
}
makeScene();

// ================================================================


const gui = new GUI();
gui.add(params, "ballAlpha", 0, 1).onChange(makeScene);
