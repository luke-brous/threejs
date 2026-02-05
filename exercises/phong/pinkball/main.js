/*-----------------------------------------------------------------
 * Pink Ball Exercise
 * 
 * We want to set up material and lighting to create the view in 
 * pinkball-goal.png.
 * 
 * 1. Use the GUI to adjust the scene parameters.
 * 2. When you get something that matches the goal, copy those 
 *    into the code as the initial values for sceneParams. 
 *---------------------------------------------------------------*/

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

var sceneParams = { ballColor : 0xFF8FC7,
                    ballSpecular: 0x444444,
                    ballShininess: 20,
                    lightX: 40,
                    lightY: 40,
                    lightZ: 0,
                    lightColor: 0xffffff,
                    lightIntensity: 1,
                    ambLightColor: 0x333333,
                    undefined: null
                  };
        
// It's wasteful to discard everything and rebuild from scratch, but
// it simplifies the implementation.

// removes a named object from the scene.

function removeByName(name) {
    var obj = scene.getObjectByName(name);
    if( obj ) scene.remove(obj);
}

function drawScene() {
    // delete old stuff; important when we adjust parameters
    removeByName("ball");
    removeByName("dirlight");
    removeByName("ambient");

    //create the ball
    var ballG = new THREE.SphereGeometry(10,50,50);
    var ballM = new THREE.MeshPhongMaterial({color: sceneParams.ballColor,
                                             specular: sceneParams.ballSpecular,
                                             shininess: sceneParams.ballShininess});
    var ball = new THREE.Mesh(ballG,ballM);
    ball.name = "ball";         // give it a name, so we can remove it next time.
    
    scene.add(ball);
    
    //create a spotlight
    var dirlight = new THREE.DirectionalLight( sceneParams.lightColor,
                                               sceneParams.lightIntensity );
    dirlight.name = "dirlight";
    dirlight.target = ball;     // point the light at the ball
    dirlight.position.set(sceneParams.lightX,sceneParams.lightY,sceneParams.lightZ); 
    scene.add(dirlight);
    
    var ambLight = new THREE.AmbientLight( sceneParams.ambLightColor); // soft white light 
    ambLight.name = "ambient";
    scene.add( ambLight );
    
    TW.render();
}

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.addColor(sceneParams,'ballColor').onChange(drawScene);
gui.addColor(sceneParams,'ballSpecular').onChange(drawScene);
gui.add(sceneParams,'ballShininess',0,200).onChange(drawScene);
gui.add(sceneParams,'lightX',-100,200).onChange(drawScene);
gui.add(sceneParams,'lightY',-100,200).onChange(drawScene);
gui.add(sceneParams,'lightZ',-100,200).onChange(drawScene);
gui.add(sceneParams,'lightIntensity', 0.1, 10).onChange(drawScene);
gui.addColor(sceneParams,'lightColor').onChange(drawScene);
gui.addColor(sceneParams,'ambLightColor').onChange(drawScene);


// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -6, maxx: 6,
                            miny: -6, maxy: 6,
                            minz: -6, maxz: 6});

drawScene();
