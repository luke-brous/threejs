
import * as THREE from 'three';
import { TW } from 'tw';


const colors = {
    neonGreen: 0x39ff14,
    brightPink: 0xff13f0,
    yellow: 0xffff00,
    neonBlue: 0x04D9FF

}

const params = {
    originColor: colors.yellow,
    // legs
    legLength: 4,
    legRadius: .3,
    legMat: new THREE.MeshBasicMaterial({ color: colors.brightPink }),
    feetRadius: 1,
    feetMat: new THREE.MeshBasicMaterial({ color: colors.neonGreen }),
    // body
    bodyMat: new THREE.MeshBasicMaterial({ color: colors.neonBlue }),
    bodyRadius: 2.3,
};



export function originPoint() {
    const geo = new THREE.SphereGeometry(.4);
    const sphere = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: params.originColor }));
    sphere.position.set(0, 0, 0);
    scene.add(sphere);
    return sphere;
}
export function makeLeg(side) {
    const leg = new THREE.Group();
    const legGeo = new THREE.CylinderGeometry(params.legRadius, params.legRadius, params.legLength);
    const legMesh = new THREE.Mesh(legGeo, params.legMat);
    legMesh.position.set(0, params.legLength / 2, 0);
    leg.add(legMesh);
    leg.position.set(params.feetRadius * side,0,0);
    scene.add(leg);

    const feetGeo = new THREE.SphereGeometry(params.feetRadius,16,16,0,Math.PI*2,0,Math.PI/2);
    const feetMesh = new THREE.Mesh(feetGeo, params.feetMat);
    feetMesh.position.set(0, 0, 0);
    leg.add(feetMesh);

    return leg;


}
export function makeArm(x, y, z) {
    const arm = new THREE.Group();

    return arm;
}
export function makeBody(x, y, z) {
    const body = new THREE.Group();
    
    const bodyGeo = new THREE.SphereGeometry(params.bodyRadius,16,16);
    const bodyMesh = new THREE.Mesh(bodyGeo, params.bodyMat);
    bodyMesh.position.y = params.legLength + params.bodyRadius;
    bodyMesh.scale.set(1,1.3,1);
    body.add(bodyMesh);
    scene.add(body);


    return body;
}

export function makeHead(x, y, z) {}


export function makeClown(x, y, z) {}