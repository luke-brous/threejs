import * as THREE from 'three';
import { TW } from 'tw';

/* Creates a mesh representing a Luxo lamp. The origin is at the
 center of the base, and the y-axis goes up through the center of the
 base, so the lamp sits on the xz plane.

 The arms are all in the xy plane, as is the axis of the shade.

 The shade is pointing in the positive x direction.

 The lamp has the following parameters and defaults:

export const lamp1Defaults = {
    baseMaterial: new THREE.MeshBasicMaterial({color: "brown"}),
    armMaterial: new THREE.MeshBasicMaterial({color: "black"}),
    shadeMaterial: new THREE.MeshBasicMaterial({color: "#cfd8e8", side: THREE.DoubleSide}),
    bulbMaterial: new THREE.MeshBasicMaterial({color: "white"}),
    baseHeight: 1,
    baseRadius: 4,
    shadeRadius: 3,
    shadeHeight: 5
};

*/

// Let's use something like inches for the units, so the lamp is about a foot tall
// divide by 3 to get something like meters

export const lamp1Defaults = {
    baseMaterial: new THREE.MeshPhongMaterial({color: "brown"}),
    armMaterial: new THREE.MeshPhongMaterial({color: "black"}),
    shadeMaterial: new THREE.MeshPhongMaterial({color: "#afc8d8", side: THREE.DoubleSide}),
    bulbMaterial: new THREE.MeshPhongMaterial({color: "white"}),
    baseHeight: 1,
    baseRadius: 4,
    shadeRadius: 3,
    shadeHeight: 5,
    armRadius: 0.3,
    armLength: 6,
    shadeAngle: 90,
    elbowAngle: -90,
    baseAngle: 45,
};
    
export function makeShade(paramsDic) {
    const p = TW.combineDictionaries(paramsDic, lamp1Defaults);

    const shade = new THREE.Group();

    // Point of the cone is at the origin of the shade group
    const coneGeom = new THREE.ConeGeometry(p.shadeRadius, p.shadeHeight,16,1,true);
    const coneMesh = new THREE.Mesh(coneGeom, p.shadeMaterial);
    coneMesh.position.set(0,-p.shadeHeight/2,0);
    shade.add(coneMesh);

    // build the bulb and put it in the center of the cone
    const bulbGeom = new THREE.SphereGeometry(1);
    const bulbMesh = new THREE.Mesh(bulbGeom, p.bulbMaterial);
    bulbMesh.position.setY(-p.shadeHeight/2);
    shade.add(bulbMesh);

    // allows caller to find this obj for adjustments
    shade.name = "shade";
    return shade;
}


export function makeUpperArm(paramsDic) {
    const p = TW.combineDictionaries(paramsDic, lamp1Defaults);
    const len = p.armLength;

    // shade is at far end, cylinder connects.
    const upper = new THREE.Group();

    const shade = makeShade(paramsDic);
    shade.position.setY(len);
    shade.rotation.z = TW.degrees2radians(p.shadeAngle);
    upper.add(shade);

    const armGeom = new THREE.CylinderGeometry(p.armRadius, p.armRadius, len);
    const armMesh1 = new THREE.Mesh(armGeom, p.armMaterial);
    armMesh1.position.setY(len/2);
    upper.add(armMesh1);

    return upper;
}

export function makeLowerArm(paramsDic) {
    const p = TW.combineDictionaries(paramsDic, lamp1Defaults);

    // Lower arm
    const lower = new THREE.Group();

    const len = p.armLength;
    const armGeom = new THREE.CylinderGeometry(p.armRadius, p.armRadius, len);
    const armMesh2 = new THREE.Mesh(armGeom, p.armMaterial);
    armMesh2.position.setY(len/2);
    lower.add(armMesh2);

    const upper = makeUpperArm(paramsDic);
    upper.position.y = len;
    upper.name = "elbow";
    upper.rotation.z = TW.degrees2radians(p.elbowAngle);
    lower.add(upper);
    return lower;
}


export function makeLamp(paramsDic) {
    const p = TW.combineDictionaries(paramsDic, lamp1Defaults);

    // Finally the base, which is added to the whole lamp.
    const lamp = new THREE.Group();

    const lower = makeLowerArm(paramsDic);
    lower.name = "base";
    lower.position.setY(p.baseHeight);
    lower.rotation.z = TW.degrees2radians(p.baseAngle);

    const baseGeom = new THREE.CylinderGeometry(p.baseRadius,p.baseRadius,p.baseHeight,16);
    const baseMesh = new THREE.Mesh(baseGeom, p.baseMaterial);
    baseMesh.position.setY(p.baseHeight/2);
    lamp.add(baseMesh);
    lamp.add(lower);
    return lamp;
}
