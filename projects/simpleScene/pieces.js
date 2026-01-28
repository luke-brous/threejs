// Build the chess board + all the pieces required for a simple scene

import * as THREE from 'three';
import { TW } from 'tw';


const colors = {
    whiteColor: 0xeeeeee,
    blackColor: 0x222222,
}


const params = {
    // board parameters
    planeColor1: 0xffffff,
    planeColor2: 0x013220,
    // piece parameters
    whiteMaterial: new THREE.MeshBasicMaterial({color: colors.whiteColor}),
    blackMaterial: new THREE.MeshBasicMaterial({color: colors.blackColor}),
    // pawn parameters
    pawnBaseBottomRadius: 1,
    pawnBaseTopRadius: 0.8,
    pawnBaseHeight: 0.5,
    pawnBodyBottomRadius: 0.6,
    pawnBodyTopRadius: 0.4,
    pawnBodyHeight: 1.5,
    // knight parameters
    knightBodyWidth: .7,
    knightBodyHeight: 2,
    knightBodyDepth: .8,
    knightHeadWidth: .9,
    knightHeadHeight: .8,
    knightHeadDepth: 1.4,
    // rook parameters
    rookBaseBottomRadius: 1,
    rookBaseTopRadius: .9,
    rookBodyHeight: 1.8,
    rookBodyRadius: .6,
    rookHeadRadius: .8,
    // bishop parameters
    bishopBaseBottomRadius: 0.8,
    bishopBaseTopRadius: 0.7,
    bishopBodyBottomRadius: 0.5,
    bishopBodyTopRadius: 0.3,


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
    const height = params.pawnBaseHeight;

    if (color == 1) {
        mat = params.whiteMaterial;
    } else {
        mat = params.blackMaterial;
        
    }

    // base
    const baseGeo = new THREE.CylinderGeometry(params.pawnBaseTopRadius, params.pawnBaseBottomRadius, params.pawnBaseHeight);
    const baseMesh = new THREE.Mesh(baseGeo, mat);
    baseMesh.position.y = height / 2;

    knight.add(baseMesh);


    // body
    const bodyGeo = new THREE.BoxGeometry(params.knightBodyWidth, params.knightBodyHeight, params.knightBodyDepth);
    const bodyMesh = new THREE.Mesh(bodyGeo, mat);
    bodyMesh.position.y = height + (params.pawnBodyHeight / 2);
    bodyMesh.rotation.x = TW.degrees2radians(-10);
    bodyMesh.position.z = 0.2;
    knight.add(bodyMesh);

    // head
    const headGeo = new THREE.BoxGeometry(params.knightHeadWidth, params.knightHeadHeight, params.knightHeadDepth);
    const headMesh = new THREE.Mesh(headGeo, mat);
    headMesh.position.y = height + params.pawnBodyHeight + (params.pawnBodyTopRadius / 2);
    headMesh.rotation.x = TW.degrees2radians(-10);

    knight.add(headMesh);

    const earGeo = new THREE.ConeGeometry(0.2, 0.5, 32);
    const earMesh1 = new THREE.Mesh(earGeo, mat);
    earMesh1.position.y = height + params.pawnBodyHeight + params.knightHeadHeight - 0.1;
    earMesh1.position.z = 0.3;
    earMesh1.position.x = -0.2;
    earMesh1.rotation.x = TW.degrees2radians(-30);
    knight.add(earMesh1);

    const earMesh2 = new THREE.Mesh(earGeo, mat);
    earMesh2.position.y = height + params.pawnBodyHeight + params.knightHeadHeight - 0.1;
    earMesh2.position.z = 0.3;
    earMesh2.position.x = 0.2;
    earMesh2.rotation.x = TW.degrees2radians(-30);
    knight.add(earMesh2);



    scene.add(knight);
    knight.position.set(x, y, z);
    return knight;

}

export function makeBishop(x, y, z, color) {

    const bishop = new THREE.Group();
    const height = params.pawnBaseHeight;

    let mat;

    if (color == 1) {
        mat = params.whiteMaterial;
    } else {
        mat = params.blackMaterial;
        
    }

    // base
    const bishopBaseGeo = new THREE.CylinderGeometry(params.bishopBaseTopRadius, params.bishopBaseBottomRadius, params.pawnBaseHeight);

    const baseMesh = new THREE.Mesh(bishopBaseGeo, mat);
    baseMesh.position.y = height / 2;

    bishop.add(baseMesh);


    // body
    const bishopBodyGeo = new THREE.CylinderGeometry(params.bishopBodyTopRadius, params.bishopBodyBottomRadius, params.pawnBodyHeight);
    const bodyMesh = new THREE.Mesh(bishopBodyGeo, mat);
    bodyMesh.position.y = height + (params.pawnBodyHeight / 2);
    bishop.add(bodyMesh);

    // top
    const bishopHeadGeo = new THREE.SphereGeometry(params.pawnBodyTopRadius, 32, 32);
    const headMesh = new THREE.Mesh(bishopHeadGeo, mat);
    headMesh.position.y = height + params.pawnBodyHeight + (params.pawnBodyTopRadius / 2);
    headMesh.scale.set(1, 1.6, 1);
    bishop.add(headMesh);

    // very tippy top
    const topGeo = new THREE.ConeGeometry(0.4, 0.7, 32);
    const topMesh = new THREE.Mesh(topGeo, mat);
    topMesh.position.y = height + params.pawnBodyHeight + params.pawnBodyTopRadius + 0.25;
    bishop.add(topMesh);


    scene.add(bishop);
    bishop.position.set(x, y, z);
    return bishop;




}

export function makeRook(x, y, z, color) {

    const rook = new THREE.Group();
    const height = params.pawnBaseHeight;

    let mat;

    if (color == 1) {
        mat = params.whiteMaterial;
    } else {
        mat = params.blackMaterial;
        
    }

    // base
    const rookBaseGeo = new THREE.CylinderGeometry(params.rookBaseTopRadius, params.rookBaseBottomRadius, params.pawnBaseHeight);
    const baseMesh = new THREE.Mesh(rookBaseGeo, mat);
    baseMesh.position.y = height / 2;

    rook.add(baseMesh);

    // body
    const rookBodyGeo = new THREE.CylinderGeometry(params.rookBodyRadius, params.rookBodyRadius, params.rookBodyHeight);
    const bodyMesh = new THREE.Mesh(rookBodyGeo, mat);
    bodyMesh.position.y = height + (params.rookBodyHeight / 2);
    rook.add(bodyMesh);

    // head
    const rookHeadGeo = new THREE.CylinderGeometry(params.rookHeadRadius, params.rookHeadRadius, params.pawnBaseHeight);
    const headMesh = new THREE.Mesh(rookHeadGeo, mat);
    headMesh.position.y = height + params.rookBodyHeight + (height / 2);
    rook.add(headMesh);


    scene.add(rook);
    rook.position.set(x, y, z);
    return rook;


}

export function makeQueen(x, y, z, color) {
}

export function makeKing(x, y, z, color) {

}