//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
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

const params = {radius: 5,
                widthSegments: 8,
                heightSegments: 8,
                vertexHelpers: false,
                ambientLightOn: true,
                upperLeftLightOn: true,
                overheadLightOn: true,
               };

// Lights first

var light0, light1, light2;

function makeLights() {
    // we're using globals for the lights, for the GUI

    light0 = new THREE.AmbientLight( 0xffffff, 1 );
    light0.visible = params.ambientOn;
    scene.add(light0);

    light2 = new THREE.DirectionalLight( 0xffffff, 2 );
    light2.position.set( 0, 100, 10 );
    light2.visible = params.overheadLightOn;
    scene.add(light2);
}
makeLights();
    
// maybe later
/*
var light1helper, light2helper;

function addLightHelpers() {
    light1helper = new THREE.PointLightHelper(light1, 0.2);
    scene.add(light1helper);
    light2helper = new THREE.DirectionalLightHelper(light2, 1);
    scene.add(light2helper);
}
addLightHelpers();
*/


// Objects

var ball, ballHelper;
var jewel, jewelHelper;
const color = "CornflowerBlue";

const ballMaterial = new THREE.MeshPhongMaterial(
    {color: color,
     specular: 0xffffff,
     flatShading: false });

const jewelMaterial = new THREE.MeshPhongMaterial(
    {color: color,
     specular: 0xffffff,
     flatShading: true });

function buildObjects() {
    scene.remove(ball);
    scene.remove(jewel);
    const ballGeom  = new THREE.SphereGeometry( params.radius,
                                                params.widthSegments,
                                                params.heightSegments );
    const jewelGeom  = new THREE.SphereGeometry( params.radius,
                                                params.widthSegments,
                                                params.heightSegments );
    // the following is just for the visualization via the helper. It
    // doesn't affect the rendering
    // actually, it doesn't seem to work at all.
    /*
    jewelGeom.toNonIndexed();
    jewelGeom.computeVertexNormals();
    */

    ball  = new THREE.Mesh( ballGeom, ballMaterial );
    jewel = new THREE.Mesh( jewelGeom, jewelMaterial );
    ball.name = "ball";
    jewel.name = "jewel";
    ball.position.setX(-2*params.radius);
    jewel.position.setX(2*params.radius);
    scene.add(ball);
    scene.add(jewel);

    scene.remove(ballHelper);
    scene.remove(jewelHelper);
    // note, these are *not* in THREE; they are an add-on
    ballHelper = new VertexNormalsHelper(ball, params.radius*0.1, 0xff0000);
    jewelHelper = new VertexNormalsHelper(jewel, params.radius*0.1, 0xff0000);
    ballHelper.visible = params.vertexHelpers;
    jewelHelper.visible = params.vertexHelpers;
    scene.add(ballHelper);
    scene.add(jewelHelper);
}

buildObjects();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.add(params, 'radius', 1, 10).onChange(buildObjects);
gui.add(params, 'widthSegments', 3, 128).step(1).onChange(buildObjects);
gui.add(params, 'heightSegments', 2, 64).step(1).onChange(buildObjects);
gui.add(params, 'vertexHelpers').onChange((v) => { ballHelper.visible=v;
                                                   jewelHelper.visible=v; });



// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -5, maxx: 5,
                            miny: -5, maxy: 5,
                            minz: -5, maxz: 5});

