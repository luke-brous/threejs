/*-----------------------------------------------------------------
 * Piece of Cake Exercise
 * 
 * Let's texture map some designs on cylinders to create the layer 
 * cake in cake-goal.png.
 * 
 * What you'll have to do:
 *   - figure out the mirror/repeat/clamping for the textures
 *   - figure out the repitions in s and t
 *   - figure out the colors
 *   - build two other meshes
 *   - I suggest holding them all in a group:  new THREE.Group()
 *   - comment out the three planes
 *---------------------------------------------------------------*/

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

// Data Textures

/*
  makeTexture() returns a Texture object with a 16x16 texture pattern
  using the input color object on a white background. The input design
  is an integer that specifies the desired pattern, which can be 1
  (arc), 2 (dot), or 3 (triangle). The pattern is repeated with the
  input wrap styles and numbers of repeats in the horizontal and
  vertical directions. flipY should be true or false.
*/

function makeTexture (design, color, wrapS, wrapT, repS, repT, flipY) {
    // create an array of colors to use for the texture
    var data = new Uint8Array(4*16*16);
    var i, j, n=0;
    console.log(color.r,color.g,color.b);
    var red = 255*color.r;      // red, green, blue on a 0-255 scale
    var green = 255*color.g;
    var blue = 255*color.b;
    var alpha = 255;
    if (design == 1) {                // arc texture pattern
       for (i = 0; i < 16; ++i) {
           for (j = 0; j < 16; ++j) {
               let dist = Math.sqrt(i*i + j*j);
               if ((dist >= 11) && (dist < 14)) {
                   data[n++] = red;
                   data[n++] = green;
                   data[n++] = blue;
               } else {
                   data[n++] = 255;
                   data[n++] = 255;
                   data[n++] = 255;
               }
               data[n++] = alpha;
           }
       }
    } else if (design == 2) {        // dot texture pattern
       for (i = 0; i < 16; ++i) {
           for (j = 0; j < 16; ++j) {
               let dist = Math.sqrt((i-7.5)*(i-7.5) + (j-7.5)*(j-7.5));
               if (dist <= 5) {
                   data[n++] = red;
                   data[n++] = green;
                   data[n++] = blue;
               } else {
                   data[n++] = 255;
                   data[n++] = 255;
                   data[n++] = 255;
               }
               data[n++] = alpha;
           }
       }
    } else {                         // triangle texture pattern
       for (i = 0; i < 16; ++i) {
          for (j = 0; j < 16; ++j) {
             if ((Math.abs(j-7.5) < (i/2)) && (i < 15)) {
                data[n++] = red;
                data[n++] = green;
                data[n++] = blue;
             } else {
                data[n++] = 255;
                data[n++] = 255;
                data[n++] = 255;
             }
              data[n++] = alpha;
          }
       }
    }

    // create a new texture object from the data array
    var textureObj = new THREE.DataTexture(data, 16, 16);

    // set the wrapping methods, numbers of repeats, and flipY property
    textureObj.wrapS = wrapS;
    textureObj.wrapT = wrapT;
    textureObj.repeat.set(repS,repT);
    textureObj.flipY = flipY;

    // when mapping the texture onto a face in the Geometry, use the nearest 
    // texture pixel as the color to be rendered
    textureObj.minFilter = THREE.NearestFilter;
    textureObj.magFilter = THREE.NearestFilter;
    textureObj.needsUpdate = true;

    return textureObj;     
};

// ================================================================

function texplane(pattern, color, xPos) {
    let geom = new THREE.PlaneGeometry(1,1);
    let tex = makeTexture(pattern, new THREE.Color(color),
                          THREE.RepeatWrapping,
                          THREE.RepeatWrapping,
                          1,
                          1,
                          false);
    let mat = new THREE.MeshBasicMaterial({map: tex});
    let mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(xPos,2,0);
    scene.add(mesh);
}

texplane(1, "blue", -2);
texplane(2, "red", 0);
texplane(3, "cyan", +2);

// The following builds only a single layer cake.

function cake() {
    let geom = new THREE.CylinderGeometry(3,3,1);
    let tex = makeTexture(2, new THREE.Color("green"),
                          THREE.RepeatWrapping,
                          THREE.RepeatWrapping,
                          1,
                          1,
                          false);
    let mat = new THREE.MeshBasicMaterial({map: tex});
    let mesh = new THREE.Mesh(geom, mat);
    return mesh;
}

scene.add(cake());

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -3, maxx: 3,
                            miny: -3, maxy: 3,
                            minz: -3, maxz: 3});

