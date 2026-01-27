// Build the chess board + all the pieces required for a simple scene

import * as THREE from 'three';
import { TW } from 'tw';


const colors = {
    whiteColor: 0xeeeeee,
    blackColor: 0x222222,
}


const params = {
    planeColor1: 0xffffff,
    planeColor2: 0x013220,
    whiteMaterial: new THREE.MeshBasicMaterial({color: colors.whiteColor}),
    blackMaterial: new THREE.MeshBasicMaterial({color: colors.blackColor}),
    pawnBaseBottomRadius: 1,
    pawnBaseTopRadius: 0.8,
    pawnBaseHeight: 0.5,
    pawnBodyBottomRadius: 0.6,
    pawnBodyTopRadius: 0.4,
    pawnBodyHeight: 1.5,
}


export function makeBoard() {
    const size = 3
    const offset = (8 * size) / 2 - size / 2; // Math to center the board
    let plane;



    for (let i = 0; i < 8; i++ ) {
        for (let j = 0; j < 8; j++) {
            const geo = new THREE.PlaneGeometry(size, size);

            const boardColor = (i + j) % 2 == 0 ? params.planeColor1 : params.planeColor2;

            const mat = new THREE.MeshBasicMaterial( {color: boardColor, side: THREE.DoubleSide});

            const plane = new THREE.Mesh( geo, mat );

            plane.rotateX(-Math.PI/2);
            
            plane.position.x = (i * size) - offset
            plane.position.z = (j * size) - offset

            scene.add( plane );

        }
        

    }
    
    
    return plane;



}

const pawnBaseGeo = new THREE.CylinderGeometry(params.pawnBaseTopRadius, params.pawnBaseBottomRadius, params.pawnBaseHeight);
const pawnBodyGeo = new THREE.CylinderGeometry(params.pawnBodyTopRadius / 2, params.pawnBodyBottomRadius, params.pawnBodyHeight);
const pawnHeadGeo = new THREE.SphereGeometry(params.pawnBodyTopRadius, 32, 32);





export function makePawn(x,y,z, color) {
    
    const pawn = new THREE.Group();
    const radBot = params.pawnBaseBottomRadius;
    const radTop = params.pawnBaseTopRadius;
    const height = params.pawnBaseHeight;

    let mat;

    if (color == 1) {
        mat = params.whiteMaterial;
    } else {
        mat = params.blackMaterial;
        
    }

    // base
    const baseMesh = new THREE.Mesh(pawnBaseGeo, mat);
    baseMesh.position.y = height / 2;

    pawn.add(baseMesh);


    // body
    const bodyMesh = new THREE.Mesh(pawnBodyGeo, mat);
    bodyMesh.position.y = height + (params.pawnBodyHeight / 2);
    pawn.add(bodyMesh);

    // head
    const headMesh = new THREE.Mesh(pawnHeadGeo, mat);
    headMesh.position.y = height + params.pawnBodyHeight + (params.pawnBodyTopRadius / 2);
    pawn.add(headMesh);


    scene.add(pawn);
    pawn.position.set(x, y, z);
    return pawn;

}

export function makeKnight(x, y, z, color) {

    const knight = new THREE.Group();
    

    let mat;

    if (color == 1) {
        mat = params.whiteMaterial;
    } else {
        mat = params.blackMaterial;
        
    }

    // base
    const baseGeo = new THREE.CylinderGeometry(radTop,radBot, height)
    const baseMesh = new THREE.Mesh(baseGeo, mat);
    baseMesh.position.y = height / 2;

    pawn.add(baseMesh);


    // body
    const bodyGeo = new THREE.CylinderGeometry(params.pawnBodyTopRadius / 2, params.pawnBodyBottomRadius, params.pawnBodyHeight)
    const bodyMesh = new THREE.Mesh(bodyGeo, mat);
    bodyMesh.position.y = height + (params.pawnBodyHeight / 2);
    pawn.add(bodyMesh);

    // head
    const headGeo = new THREE.SphereGeometry(params.pawnBodyTopRadius, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, mat);
    headMesh.position.y = height + params.pawnBodyHeight + (params.pawnBodyTopRadius / 2);
    pawn.add(headMesh);


    scene.add(pawn);
    pawn.position.set(x, y, z);
    return pawn;

}

export function makeBishop(x, y, z, color) {
}

export function makeRook() {

}

export function makeQueen() {

}

export function makeKing() {

}