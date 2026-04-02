// Written with chatgpt after a conversation about environment maps

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'gui';

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set( 0, 2, 5 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const params = {
    envmapOn: true,
    lightOn: true,
};


// Add a ground plane and some objects
const planeGeo   = new THREE.PlaneGeometry(10, 10);
const planeMat   = new THREE.MeshStandardMaterial({ color: 0x808000 }); // yellowish
const plane      = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI/2;
scene.add(plane);

const boxGeo     = new THREE.BoxGeometry(1,1,1);
const boxMat     = new THREE.MeshStandardMaterial({ color: 0x4444ff }); // blueish
const boxMesh    = new THREE.Mesh(boxGeo, boxMat);
boxMesh.position.set(2, 0.5, 0);
scene.add(boxMesh);


const amb = new THREE.AmbientLight(0xffffff);
scene.add(amb);

const light      = new THREE.PointLight(0xffffff, 100);
light.position.set(5,5,5);
scene.add(light);

// Create the cube render target & cube camera
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter
});
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);

// **Set the position** of the cube camera to where you want the env‑map capture to be from
cubeCamera.position.set(-2, 1, 0);
scene.add(cubeCamera);

// Create a reflective sphere using the cubeCamera texture
const sphereGeo    = new THREE.SphereGeometry(1, 32, 32);
const sphereMat    = new THREE.MeshStandardMaterial({
  envMap: cubeRenderTarget.texture,
  metalness: 1,
  roughness: 0
});
const sphereMesh   = new THREE.Mesh(sphereGeo, sphereMat);
sphereMesh.position.set(-2, 1, 0);
scene.add(sphereMesh);

function animate() {
  requestAnimationFrame(animate);

  // temporarily hide the sphere so it doesn't capture itself in the reflection
  sphereMesh.visible = false;
  cubeCamera.update(renderer, scene);
  sphereMesh.visible = true;

  controls.update();
  renderer.render(scene, camera);
}

animate();

const gui = new GUI();
gui.add(params, 'envmapOn').onChange(val => { sphereMat.envMap = val ? cubeRenderTarget.texture : null });
gui.add(params, 'lightOn').onChange(val => light.visible = val);

