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
// build your scene here

//this function is a slightly modified version of a function taken from the fence demo

/* Makes a fence, with the left end at the origin and proceeding down
   the x axis. The pickets are made from barn objects, scaled to be unit
   height (at the shoulder) and very thin. */
function makeFence(numPickets) {
    const fence = new THREE.Group();
            
    const picketG = TW.barnGeometry(.09, 1, 0.1);
    const picketM = new THREE.MeshNormalMaterial();
    let picket = new THREE.Mesh(picketG,picketM);   
            
    for( let i = 0; i < numPickets; ++i ) {
        picket = picket.clone(false);
        picket.translateX(0.1);
        fence.add(picket);
    }
    return fence;
}
        
//create a barn, fence and ground
var barn = new TW.createMesh(TW.barnGeometry(5,5,10));
scene.add(barn);
        
let fence = makeFence(40);
//fence.rotation.y = Math.PI/2;
fence.translateX(5);
        
let fence2 = fence.clone();
fence2.translateZ(-10);
        
let fence3 = makeFence(100);
fence3.translateX(9.2);
fence3.rotation.y = Math.PI/2;
        
scene.add(fence);
scene.add(fence2);
scene.add(fence3);
        
// ground will go from -10 to +10 in X and Z
// This is important in giving you your bearings on the scene
var ground = new THREE.Mesh(new THREE.PlaneGeometry(20,20),
                            new THREE.MeshBasicMaterial({color:THREE.Color.NAMES.darkgreen}));
ground.rotation.x = -Math.PI/2;
        
scene.add(ground);

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();
// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);


const aspectRatio = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);


function render() {
    renderer.render(scene, camera);
}

function updateCamera(fov, eyeX, eyeY, eyeZ, atX, atY, atZ, upX = 0, upY = 1, upZ = 0) {
    camera.fov = fov;
    camera.updateProjectionMatrix(); // then add this line
    
    camera.position.set(eyeX, eyeY, eyeZ);
    camera.up.set(upX, upY, upZ);
    camera.lookAt(new THREE.Vector3(atX, atY, atZ)); // do this last
    
    render();
}



function slide1() {
    document.getElementById("slidename").innerHTML = "Slide 1";
    updateCamera(80, 0, 70, 60, 0, 0, 0, 0, 1, 0);
};
function slide2() {
    document.getElementById("slidename").innerHTML = "Slide 2";
    updateCamera(79, 0, 62, 55, 0, 0, 0, 0, 1, 0);
};
function slide3() {
    document.getElementById("slidename").innerHTML = "Slide 3";
    updateCamera(78, 0, 54, 50, 0, 0, 0, 0, 1, 0);

};
function slide4() {
    document.getElementById("slidename").innerHTML = "Slide 4";
    updateCamera(77, 0, 48, 45, 0, 0, 0, 0, 1, 0);
};
function slide5() {
    document.getElementById("slidename").innerHTML = "Slide 5";
    updateCamera(76, 0, 40, 40, 0, 0, 0, 0, 1, 0);
};
function slide6() {
    document.getElementById("slidename").innerHTML = "Slide 6";
    updateCamera(75, 0, 32, 35, 0, 0, 0, 0, 1, 0);
};
function slide7() {
    document.getElementById("slidename").innerHTML = "Slide 7";
    updateCamera(74, 0, 24, 30, 0, 0, 0, 0, 1, 0);

};
function slide8() {
    document.getElementById("slidename").innerHTML = "Slide 8";
    updateCamera(73, 0, 16, 25, 0, 0, 0, 0, 1, 0);

};
function slide9() {
    document.getElementById("slidename").innerHTML = "Slide 9";
    updateCamera(72, 0, 10, 20, 0, 0, 0, 0, 1, 0);

};
function slide10() {
    document.getElementById("slidename").innerHTML = "Slide 10";
    updateCamera(71, 0, 7, 15, 0, 0, 0, 0, 1, 0);
}



TW.setKeyboardCallback('1', slide1, "Slide 1");
TW.setKeyboardCallback('2', slide2, "Slide 2");
TW.setKeyboardCallback('3', slide3, "Slide 3");
TW.setKeyboardCallback('4', slide4, "Slide 4");
TW.setKeyboardCallback('5', slide5, "Slide 5");
TW.setKeyboardCallback('6', slide6, "Slide 6");
TW.setKeyboardCallback('7', slide7, "Slide 7");
TW.setKeyboardCallback('8', slide8, "Slide 8");
TW.setKeyboardCallback('9', slide9, "Slide 9");
TW.setKeyboardCallback('0', slide10, "Slide 10");

slide1();


