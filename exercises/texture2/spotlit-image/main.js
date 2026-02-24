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

const params = {
    width: 20,
    height: 20,
    planeColor : 0xffffff,
    planeSpecular: 0xffffff,
    planeShininess: 1,
    spotlightX: 9,
    spotlightY: 0,
    spotlightZ: 9,
    spotlightColor: 0xffffff,
    spotlightIntensity: 3,
    spotlightDistance: 0,
    spotlightAngle: Math.PI/5,
    spotlightPenumbra: 0.2,
    spotlightDecay: 0,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
};

const wrgb = TW.makeWRGBimage();

const images = {
    'wrgb': wrgb,
    'uv-grid': null,            // set by the loader
    'buffy': null,
};

var theTexture = wrgb;          // the initial value
globalThis.images = images;

// Add the images to the params, so the GUI can use it
params.image = 'wrgb';
params.images = images;

// ========
// Rest of the code is very similar to the spotlit tutor

// A useful helper, to reduce the number of globals
function removeByName(name) {
    var obj = scene.getObjectByName(name);
    if( obj ) scene.remove(obj);
}

// Lights first

var spotLight;

function makeSpotlight() {
    removeByName("target");
    // make the target first
    var target = new THREE.Mesh( new THREE.SphereGeometry(0.5,8,8),
                                 new THREE.MeshBasicMaterial({color:0xFFFFFF}) );
    target.position.set( params.targetX, params.targetY, params.targetZ );
    target.name = "target";
    scene.add(target);

    removeByName("spot");
    spotLight = new THREE.SpotLight( params.spotlightColor,
                                     params.spotlightIntensity,
                                     params.spotlightDistance,
                                     params.spotlightAngle,
                                     params.spotlightPenumbra,
                                     params.spotlightDecay );
    spotLight.name = "spot";
    spotLight.position.set(params.spotlightX, params.spotlightY, params.spotlightZ); 
    spotLight.target = target;
    
    scene.add(spotLight);
    
    removeByName("helper");
    const helper = new THREE.SpotLightHelper( spotLight );
    helper.name = "helper";
    scene.add(helper);
}
makeSpotlight();
    
// Objects

var plane;
function displayPlane (texture) {
    const planeGeom = new THREE.PlaneGeometry(params.width, params.height);
    const planeMat = new THREE.MeshPhongMaterial({color: params.planeColor,
                                                  specular: params.planeSpecular,
                                                  shininess: params.planeShininess,
                                                  map: texture});

    scene.remove(plane);
    plane = new THREE.Mesh(planeGeom, planeMat);
    scene.add(plane);
    console.log("new plane");
}

function buildObjects() {
    displayPlane(theTexture);
}
buildObjects();

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
gui.addColor(params,'planeColor').onChange(buildObjects);
gui.addColor(params,'planeSpecular').onChange(buildObjects);
gui.add(params,'planeShininess',0,100).onChange(buildObjects);
gui.add(params,'spotlightX',0,20).onChange(makeSpotlight);
gui.add(params,'spotlightY',-20,20).onChange(makeSpotlight);
gui.add(params,'spotlightZ',0,20).onChange(makeSpotlight);
gui.add(params,'targetX',-10,10).onChange(makeSpotlight);
gui.add(params,'targetY',-10,10).onChange(makeSpotlight);
gui.addColor(params,'spotlightColor').onChange(makeSpotlight);
gui.add(params,'spotlightIntensity',0,20).onChange(makeSpotlight);
gui.add(params,'spotlightDistance',0,100).onChange(makeSpotlight);
gui.add(params,'spotlightAngle',0,Math.PI/2).onChange(makeSpotlight);
gui.add(params,'spotlightPenumbra',0,1).onChange(makeSpotlight);
gui.add(params,'spotlightDecay',0,1).onChange(makeSpotlight);
const imageControl = gui.add(params, 'image', Object.keys(images))
      .onChange(val => { theTexture = images[val];
                         displayPlane(theTexture); });


// load the textures we will use

const loader = new THREE.TextureLoader();

var uvGrid, buffy;
loader.load("images/UV_Grid_Sm.jpg", tex => {uvGrid = images['uv-grid'] = tex});
loader.load("images/buffy.gif", tex => {buffy = images['buffy'] = tex;
                                        console.log('make buffy the current image');
                                        params.image = 'buffy';
                                        imageControl.updateDisplay();
                                        theTexture = tex;
                                        displayPlane(theTexture);});


// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: -10, maxy: 10,
                            minz: -10, maxz: 10});

