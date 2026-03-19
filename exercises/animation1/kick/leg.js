// Example of a separate module
// Must begin with the imports;
import * as THREE from 'three';
import { TW } from 'tw';

/* Returns a leg mesh with the origin at the hip joint. All rotations
 * are around the Z axis, as if we are looking at the leg from the
 * side. If all the rotations are zero, the thigh and calf are
 * straight down the -Y axis, and the foot axis is parallel to the +X
 * axis. All rotations are counterclockwise from those initial
 * settings.

params are
   footLength
   calfLength
   ankleRotation
   thighLength
   kneeRotation
   hipRotation
   */

export function makeLeg(params) {
    // Meshes are shoe, calf, and thigh. Composite objects are foot, 
    // lowerleg, and leg

    const leg = new THREE.Group();
    const foot = new THREE.Group();
    const shoe = TW.createMesh(new THREE.CylinderGeometry(2, 1, params.footLength));
    shoe.position.x = params.footLength/2;
    shoe.rotation.z = Math.PI/2;
    foot.add(shoe);

    const lowerleg = new THREE.Group();
    const calf = TW.createMesh(new THREE.CylinderGeometry(3, 2, params.calfLength));
    calf.position.y = -params.calfLength/2;
    lowerleg.add(calf);
    foot.position.y = -params.calfLength;
    foot.rotation.z = params.ankleRotation;
    lowerleg.add(foot);

    const thigh = TW.createMesh(new THREE.CylinderGeometry(5, 4, params.thighLength));
    thigh.position.y = -params.thighLength/2;
    leg.add(thigh);
    lowerleg.position.y = -params.thighLength;
    lowerleg.rotation.z = params.kneeRotation;
    leg.add(lowerleg);

    leg.rotation.z = params.hipRotation;
    return leg;
}

