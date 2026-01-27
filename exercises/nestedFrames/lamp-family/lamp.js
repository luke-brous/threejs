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
    baseMaterial: new THREE.MeshBasicMaterial({color: "brown"}),
    armMaterial: new THREE.MeshBasicMaterial({color: "black"}),
    shadeMaterial: new THREE.MeshBasicMaterial({color: "#afc8d8", side: THREE.DoubleSide}),
    bulbMaterial: new THREE.MeshBasicMaterial({color: "white"}),
    baseHeight: 1,
    baseRadius: 4,
    shadeRadius: 3,
    shadeHeight: 5,
    armRadius: 0.3,
    armLength: 6,
    shadeAngle: 45,
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

    upper.name = 'elbow';
    return upper
}


export function makeFullLamp(paramsDic) {
    const p = TW.combineDictionaries(paramsDic, lamp1Defaults);
    const len = p.armLength;

    const full = new THREE.Group();

    const shade = makeShade(paramsDic);
    shade.position.setY(len);
    shade.rotation.z = TW.degrees2radians(p.shadeAngle);
    full.add(shade);

    const upperArm = makeUpperArm(paramsDic);
    upperArm.rotation.z = TW.degrees2radians(p.elbowAngle);
    full.add(upperArm);

    const armGeom1 = new THREE.CylinderGeometry(p.armRadius, p.armRadius, len);
    const armMesh2 = new THREE.Mesh(armGeom1, p.armMaterial);
    armMesh2.position.setY(-len);
    armMesh2.rotation.z = TW.degrees2radians(p.baseAngle); 
    full.add(armMesh2);

    full.name = 'base';
    return full;
    


}