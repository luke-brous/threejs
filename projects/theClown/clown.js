/* Luke Broussard
2/9/2026
A clown made of spheres and cylinders, with a hat and a smile.

*/
import * as THREE from 'three';

const colors = {
    neonGreen: 0x39ff14,
    brightPink: 0xff13f0,
    yellow: 0xffff00,
    neonBlue: 0x04D9FF, 
    lightTeal: 0xd2fdfe,
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
    // arms
    armLength: 4,
    armRadius: .3,
    shoulderRadius: .7,
    shoulderTheta: 2.8,
    handRadius: .5,
    // head 
    headRadius: 2,
    headMat: new THREE.MeshBasicMaterial({ color: colors.lightTeal }),
    smileRadius: 1.2,
    eyeRadius: .2,
    noseRadius: .2,
    earRadius: .7,
    brimRadius: 2.5,
    hatRadius: 1.5,
    hatHeight: 3,

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

export function makeArm(side) {
    const arm = new THREE.Group();

    const shoulderY = params.legLength + (params.bodyRadius * 1.8); 
    arm.position.set(params.bodyRadius * side, shoulderY, 0);

    // shoulder joint
    const shoulderGeo = new THREE.SphereGeometry(params.shoulderRadius,16,16,0,Math.PI*2,0,params.shoulderTheta);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, new THREE.MeshBasicMaterial({ color: colors.brightPink }));
    arm.add(shoulderMesh);

    // arm
    const armGeo = new THREE.CylinderGeometry(params.armRadius, params.armRadius, params.armLength);
    const armMesh = new THREE.Mesh(armGeo, new THREE.MeshBasicMaterial({ color: colors.neonBlue }));
    armMesh.position.y = -params.armLength / 2;
    arm.add(armMesh);

    // hand
    const handGeo = new THREE.SphereGeometry(params.handRadius,16,16,0,Math.PI*2,0,2.8);
    const handMesh = new THREE.Mesh(handGeo, new THREE.MeshBasicMaterial({ color: colors.neonGreen }));
    handMesh.position.y = -params.armLength;
    arm.add(handMesh);

    arm.rotation.z = side * Math.PI / 8; // Rotate arm downwards

    scene.add(arm);
    return arm;
}

export function makeBody() {
    const body = new THREE.Group();
    
    const bodyGeo = new THREE.SphereGeometry(params.bodyRadius,16,16);
    const bodyMesh = new THREE.Mesh(bodyGeo, params.bodyMat);
    bodyMesh.position.y = params.legLength + params.bodyRadius;
    bodyMesh.scale.set(1,1.3,1);
    body.add(bodyMesh);
    scene.add(body);


    return body;
}

export function makeHead() {
    const head = new THREE.Group();

    head.position.set(0, params.legLength + (params.bodyRadius * 3), 0);

    const headGeo = new THREE.SphereGeometry(params.headRadius,16,16);
    const headMesh = new THREE.Mesh(headGeo, params.headMat);
    head.add(headMesh);

    // smile 
    const smileGeo = new THREE.TorusGeometry(params.smileRadius, 0.1, 50, 100, Math.PI/3);
    const smileMat = new THREE.MeshBasicMaterial({ color: colors.brightPink });
    const smileMesh = new THREE.Mesh(smileGeo, smileMat);
    smileMesh.position.z = params.headRadius - 0.2;
    smileMesh.rotation.x = Math.PI;
    smileMesh.rotation.z = Math.PI / 4;
    head.add(smileMesh);

    // eyes
    const eyeGeo = new THREE.SphereGeometry(params.eyeRadius,16,16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.6, 0.5, params.headRadius - 0.1);
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.6, 0.5, params.headRadius - 0.1);
    head.add(rightEye);

    // nose 
    const noseGeo = new THREE.SphereGeometry(params.noseRadius,16,16);
    const noseMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.position.z = params.headRadius - 0.1;
    head.add(noseMesh);

    // ears
    const earGeo = new THREE.SphereGeometry(params.earRadius,16,16);    
    const earMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.x = -params.headRadius;
    leftEar.position.y = 0.5;
    head.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.x = params.headRadius;
    rightEar.position.y = 0.5;
    head.add(rightEar);

    const hatGroup = new THREE.Group();
    
    hatGroup.position.y = params.headRadius * 0.9; // slightly embedded
    
    // Tilt the whole hat here
    hatGroup.rotation.z = -Math.PI / 10; 
    hatGroup.rotation.x = -Math.PI / 12; // Optional: tilt back slightly too

    // The Brim
    const brimGeo = new THREE.CylinderGeometry(params.brimRadius, params.brimRadius, 0.2, 16);
    const brimMat = new THREE.MeshBasicMaterial({ color: colors.neonBlue });
    const brimMesh = new THREE.Mesh(brimGeo, brimMat);
    hatGroup.add(brimMesh);

    // The Top 
    const hatGeo = new THREE.CylinderGeometry(params.hatRadius * 1.2, params.hatRadius, params.hatHeight, 16);
    const hatMat = new THREE.MeshBasicMaterial({ color: colors.neonBlue });
    const hatMesh = new THREE.Mesh(hatGeo, hatMat);
    
    hatMesh.position.y = params.hatHeight / 2;
    hatGroup.add(hatMesh);

    // Add the whole hat to the head
    head.add(hatGroup);


    scene.add(head);
    return head;
}

