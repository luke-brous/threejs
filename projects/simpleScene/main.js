

import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as piece from './pieces.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Scene

let pawn1; // pawn that gui can manipulate

// create the initial position of the chess pieces
function makeInitialPosition() {
    piece.makeBoard();

    for (let i = 0; i < 8; i++ ) {
        piece.makePawn(-10.5 + i * 3, 0.025, -7.5, 0);
        piece.makePawn(-10.5 + i * 3, 0.025, 7.5, 1);
    }


    piece.makeBishop(-4.5, 0.025, -10.5, 0);
    piece.makeBishop(4.5, 0.025, -10.5, 0);
    piece.makeBishop(-4.5, 0.025, 10.5, 1);
    piece.makeBishop(4.5, 0.025, 10.5, 1);

    piece.makeRook(-10.5, 0.025, -10.5, 0);
    piece.makeRook(10.5, 0.025, -10.5, 0);
    piece.makeRook(-10.5, 0.025, 10.5, 1);
    piece.makeRook(10.5, 0.025, 10.5, 1);

    piece.makeKnight(-7.5, 0.025, -10.5, 0);
    piece.makeKnight(7.5, 0.025, -10.5, 0);
    piece.makeKnight(-7.5, 0.025, 10.5, 1);
    piece.makeKnight(7.5, 0.025, 10.5, 1);

    piece.makeQueen(-1.5, 0.025, -10.5, 0);
    piece.makeQueen(-1.5, 0.025, 10.5, 1);

    piece.makeKing(1.5, 0.025, -10.5, 0);
    piece.makeKing(1.5, 0.025, 10.5, 1);

    // pawn that gui can manipulate
    pawn1 = piece.makePawn(-1.5, 0.025, -1.5, 0);

}


makeInitialPosition();


// ===============================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();

// GUI controls for moving pawn1
const guiControls = {
    pawn1X: -1.5,
    pawn1Z: -1.5,
    // saw this was common practice in other gui examples
    reset: function() {
        this.pawn1X = -1.5;
        this.pawn1Z = -1.5;
        pawn1.position.set(this.pawn1X, 0.025, this.pawn1Z);
    }
}

// create a folder in the GUI and add the controls
const guiFolder = gui.addFolder('Pawn Position');

guiFolder.add(guiControls, 'pawn1X', -10.5, 10.5).name('Move X').onChange((value) => {
    pawn1.position.x = value;
});

guiFolder.add(guiControls, 'pawn1Z', -10.5, 10.5).name('Move Z').onChange((value) => {
    pawn1.position.z = value;
});

guiFolder.add(guiControls, 'reset').name('Reset Position');



// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: -10, maxx: 10,
                            miny: 0, maxy: 12,
                            minz: -10, maxz: 10});
