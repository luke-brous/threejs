import * as THREE from 'three';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

// for debugging
globalThis.THREE = THREE;

// 1. Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Scene
const scene = new THREE.Scene();
globalThis.scene = scene;

// 3. Camera
const params = {
    eye: {x: 2, y: 2, z: 5},
    at: {x: 0, y: 0, z: 0},
    up: {x: 0, y: 1, z: 0},
    fovy: 50, // degrees
    aspectRatio: window.innerWidth / window.innerHeight,
    near: 1,
    far: 20,
    // properties of the object we are looking at
    wire: false,
};

const camera = new THREE.PerspectiveCamera(params.fovy, params.aspectRatio, params.near, params.far);
globalThis.camera = camera;
camera.position.copy(params.eye);
camera.up.copy(params.up);
// lookAt requires either 3 args or a THREE Vector3() object
camera.lookAt(params.at.x, params.at.y, params.at.z);

// 4. Box
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. function to re-render the scene
function render() {
    renderer.render(scene, camera);
}
render();
    
// 6. Update Camera and re-render
function updateCam(v) {
    // shape
    camera.fov = params.fovy,   // Note that Threejs says "fov", but I use fovy
    camera.aspect = params.aspectRatio,
    camera.near = params.near;
    camera.far = params.far;
    camera.updateProjectionMatrix();
    // location and direction
    camera.position.copy(params.eye);
    camera.up.copy(params.up);
    // lookAt requires either 3 args or a THREE Vector3() object
    camera.lookAt(params.at.x, params.at.y, params.at.z);
    // No effect unless we re-render the scene
    render();
}

// 7. GUI
const gui = new GUI();

const shapeGui =  gui.addFolder('shape');
shapeGui.add(params, 'fovy', 1, 180).onChange(updateCam);
shapeGui.add(params, 'aspectRatio', 1/10.0, 10.0).onChange(updateCam);
shapeGui.add(params, 'near', 1, 10).onChange(updateCam);
shapeGui.add(params, 'far', 1, 10).onChange(updateCam);

const eyeGui = gui.addFolder('eye');    
eyeGui.add(params.eye, 'x', -10, +10).onChange(updateCam);
eyeGui.add(params.eye, 'y', -10, +10).onChange(updateCam);
eyeGui.add(params.eye, 'z', +1, +20).onChange(updateCam);

const atGui = gui.addFolder('at');    
atGui.add(params.at, 'x', -10, +10).onChange(updateCam);
atGui.add(params.at, 'y', -10, +10).onChange(updateCam);
atGui.add(params.at, 'z', -10, +10).onChange(updateCam);

const upGui = gui.addFolder('up');    
upGui.add(params.up, 'x', -10, +10).onChange(updateCam);
upGui.add(params.up, 'y', -10, +10).onChange(updateCam);
upGui.add(params.up, 'z', -10, +10).onChange(updateCam);

const objGui = gui.addFolder('obj');
objGui.add(params, 'wire').onChange(v => { cube.material.wireframe = v; render(); });
