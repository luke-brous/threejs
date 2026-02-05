/* this version uses decay=0 for the point lights, which means we
 * don't have to use super intensities to see any effects. */

const pointLightDistance = 0; // the default
const pointLightDecay = 0;    // default is 2, physical model

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

// Use nested dictionaries for a bit of brevity

const parameters = {
    material: {
        kind: 'lambert',
        color: 0x88ccff,
        specular: 0xffffff,
        shininess: 30,
    },
    ambient: {
        on: false,
        color: 0xffffff,
        intensity: 1},
    directional: {
        on: false,
        color: 0xffffff,
        intensity: 3,
        from: {
            x: -10,
            y: 10,
            z: 0,
        },
        target: {
            x: 0,
            y: 0,
            z: 0,
        }
    },
    point: {
        on: false,
        color: 0xffffff,
        intensity: 3,
        x: 2,
        y: 2,
        z: 2,
    },
};

// ==== lighting ===

// we're using globals for the lights, for the GUI
var ambLight;
var dirLight;
var dirLightHelper;
var pointLight;
var pointLightHelper;

function makeLights() {

    const p = parameters;

    ambLight = new THREE.AmbientLight( p.ambient.color,
                                       p.ambient.intensity );
    ambLight.visible = p.ambient.on;
    scene.add(ambLight);

    dirLight = new THREE.DirectionalLight( p.directional.color,
                                           p.directional.intensity);
    dirLight.position.copy(p.directional.from);
    dirLight.visible = p.directional.on;
    scene.add(dirLight);
    const target = new THREE.Mesh( new THREE.SphereGeometry(0.1),
                                   new THREE.MeshLambertMaterial({color: "yellow"}));
    target.position.copy(p.directional.target);
    dirLight.target = target;
    scene.add(target);
    dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 3);
    dirLight.target.visible = p.directional.on;
    dirLightHelper.visible = p.directional.on;
    scene.add(dirLightHelper);

    pointLight = new THREE.PointLight( p.point.color,
                                       p.point.intensity,
                                       // setting the following is
                                       // important to get
                                       // behavior closer to the
                                       // old Phong model
                                       pointLightDistance,
                                       pointLightDecay);
    pointLight.position.copy( p.point );
    pointLight.visible = p.point.on;
    scene.add(pointLight);
    pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    pointLightHelper.visible = p.point.on;
    scene.add(pointLightHelper);
}
makeLights();

/* this function sets all the parameters. It would be more efficient
   to just adjust the one that changed, but I like showing all the
   adjustment code in one function. */

function adjustLights(val) {
    const p = parameters;

    ambLight.visible = p.ambient.on;
    ambLight.intensity = p.ambient.intensity;
    ambLight.color.set(p.ambient.color);

    dirLight.visible = p.directional.on;
    dirLight.intensity = p.directional.intensity;
    dirLight.color.set(p.directional.color);
    dirLight.position.copy(p.directional.from);
    dirLight.target.position.copy(p.directional.target);
    dirLight.target.visible = p.directional.on;
    dirLightHelper.update();
    dirLightHelper.visible = p.directional.on;

    pointLight.intensity = p.point.intensity;
    pointLight.color.set(p.point.color);
    pointLight.position.copy(p.point);
    pointLight.visible = p.point.on;
    pointLightHelper.update();
    pointLightHelper.visible = p.point.on;
}

// ================ objects ================

const p = { mode: 'physical', intensity: 100, distance: 0, decay: 2 };

var material;

function remakeObjects() {
    if(parameters.material.kind == 'lambert') {
        material = new THREE.MeshLambertMaterial({color: parameters.material.color});
    } else {
        material = new THREE.MeshPhongMaterial({color: parameters.material.color,
                                                specular: parameters.material.specular,
                                                shininess: parameters.material.shininess});
    }

    function makeMesh(geom, xCoord, zCoord) {
        const m = new THREE.Mesh(geom, material);
        m.position.set(xCoord, 0, zCoord);
        scene.add(m);
        return m;
    }
    makeMesh(new THREE.BoxGeometry(1,2,3), 0, -3);
    makeMesh(new THREE.SphereGeometry(1, 32, 16), -2.5);
    makeMesh(new THREE.ConeGeometry(1, 3, 32), 2.5);
}
remakeObjects();
                                 

// ==== postlude === 

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
const mat = gui.addFolder('material').close();
mat.add(parameters.material, 'kind', ['lambert','phong']).onChange(remakeObjects);
mat.addColor(parameters.material, 'color')
    .onChange(v => material.color.set(v));
mat.addColor(parameters.material, 'specular')
    .onChange(v => material.specular.set(v));
mat.add(parameters.material, 'shininess')
    .onChange(v => material.shiniess = v);
    
const amb = gui.addFolder('ambient').close();
amb.add(parameters.ambient, 'on').onChange(adjustLights);
amb.add(parameters.ambient, 'intensity', 0, 10, 0.1).onChange(adjustLights);
amb.addColor(parameters.ambient, 'color').onChange(adjustLights);

const dir = gui.addFolder('directional').close();
dir.add(parameters.directional, 'on').onChange(adjustLights);
dir.add(parameters.directional, 'intensity', 0, 20, 1).onChange(adjustLights);
dir.addColor(parameters.directional, 'color').onChange(adjustLights);
const dirFrom = dir.addFolder('from').close();
dirFrom.add(parameters.directional.from, 'x', -15, 15).onChange(adjustLights);
dirFrom.add(parameters.directional.from, 'y', -15, 15).onChange(adjustLights);
dirFrom.add(parameters.directional.from, 'z', -15, 15).onChange(adjustLights);
const dirTarget = dir.addFolder('target').close();
dirTarget.add(parameters.directional.target, 'x', -5, 5).onChange(adjustLights);
dirTarget.add(parameters.directional.target, 'y', -5, 5).onChange(adjustLights);
dirTarget.add(parameters.directional.target, 'z', -5, 5).onChange(adjustLights);


const point = gui.addFolder('pointLight').close();
point.add(parameters.point, 'on').onChange(adjustLights);
point.add(parameters.point, 'intensity', 0, 20, 1).onChange(adjustLights);
point.addColor(parameters.point, 'color').onChange(adjustLights);
point.add(parameters.point, 'x', -10, 10).onChange(adjustLights);
point.add(parameters.point, 'y', -10, 10).onChange(adjustLights);
point.add(parameters.point, 'z', -10, 10).onChange(adjustLights);

// Set up a camera for the scene
TW.cameraSetup(renderer,
               scene,
               {minx: -5, maxx: 5,
                miny: -3, maxy: 3,
                minz: -3, maxz: 3});
