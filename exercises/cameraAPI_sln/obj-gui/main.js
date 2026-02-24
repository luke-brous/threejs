import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

// for debugging
globalThis.THREE = THREE;

// 1. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Scene
const scene = new THREE.Scene();
globalThis.scene = scene;

const params = {
    eye: {x: 2, y: 2, z: 5},
    at: {x: 0, y: 0, z: 0},
    up: {x: 0, y: 1, z: 0},
    fovy: 50, // degrees
    aspectRatio: window.innerWidth / window.innerHeight,
    near: 1,
    far: 20,
    // the object we are looking at:
    wire: false,
    obj: 'box',
};

// 3. Camera
const camera = new THREE.PerspectiveCamera(params.fovy, params.aspectRatio, params.near, params.far);
globalThis.camera = camera;
camera.position.copy(params.eye);
camera.up.copy(params.up);
// lookAt requires either 3 args or a THREE Vector3() object
camera.lookAt(params.at.x, params.at.y, params.at.z);

// 4. Objects

var obj;

function makeBox() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshNormalMaterial();
    obj = new THREE.Mesh(geometry, material);
    scene.add(obj);
}
makeBox();

/* railroad tracks. Each tie is 1 unit long, 0.05 unit in other
 * dims. They are 1 unit apart. Rails parallel to the -Z axis, one at
 * X=0 and the other at X=1, both at Y=1. All in Y=0 plane, with
 * Z<0. */

function makeTracks() {
    const mat = new THREE.MeshNormalMaterial();
    const tracks = new THREE.Group();
    const len = 20;             // length of a rail, along Z
    const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,len));
    railLeft.position.set(0,0,-len/2.0);
    const railRight = new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,len));
    tracks.add(railLeft);
    railRight.position.set(1,0,-len/2.0);
    tracks.add(railRight);
    for(let i=0; i<(len+1); i++ ) {
        const tie = new THREE.Mesh(new THREE.BoxGeometry(1,0.05,0.05),mat);
        tie.position.set(0.5,0,-1*i);
        tracks.add(tie);
    }
    obj = tracks;
    scene.add(obj);
}

/* A forest (really, a tree farm) is just a rectangular array of
 * cones. The point is to see the effects of a wide-angle versus a
 * zoom lens. The front row is all at Z=0, symmetrical around X=0. */

function makeForest() {
    const mat = new THREE.MeshBasicMaterial({color: "forestgreen"});
    const forest = new THREE.Group();
    // 3 meter trees, 5 meters apart
    const radius = 1;
    const height = 3;
    const dist = 5;
    const nrows = 4;
    const ncols = 10;
    const xOffset = Math.floor(ncols-1)/2;
    for(let r = 0; r<nrows; r++ ) {
        for(let c = 0; c<ncols; c++ ) {
            const geom = new THREE.ConeGeometry(radius, height);
            const tree = new THREE.Mesh(geom, mat);
            tree.position.set(dist*(xOffset-c),
                              height/2,
                              -dist*r);
            forest.add(tree);
        }
    }
    obj = forest;
    scene.add(forest);
}

        

// 5. Camera

function render() {
    renderer.render(scene, camera);
}
render();
    
// Update Camera
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

// GUI
const gui = new GUI();

const shapeGui =  gui.addFolder('shape');
shapeGui.add(params, 'fovy', 1, 180).onChange(updateCam);
shapeGui.add(params, 'aspectRatio', 1/10.0, 10.0).onChange(updateCam);
shapeGui.add(params, 'near', 1, 10).onChange(updateCam);
shapeGui.add(params, 'far', 1, 100).onChange(updateCam);

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
objGui.add(params, 'obj', ['box', 'tracks', 'forest'])
    .onChange(function (v) {
        scene.remove(obj);
        switch (v) {
        case 'box':
            makeBox();
            break;
        case 'tracks':
            makeTracks();
            break;
        case 'forest':
            makeForest();
            break;
        }
        render();
    });

        
