import * as THREE from 'three';
import { TW } from 'tw';

/* Makes a leg going down from the origin, with joints rotating around
 * z, so we are seeing the leg from its right side, and the foot is
 * roughly parallel to the x axis. Meshes are shoe, calf, and
 * thigh. Composite objects are 'foot', 'lowerleg', and 'leg' and are
 * named like that. Composite objects have the relevant joints: ankle,
 * knee and hip, respectively control.  */

// The naming isn't perfect, but it was the best I could think of.

export function makeLeg(parameters) {
    const p = parameters;
    const shoegeom = new THREE.CylinderGeometry(2, 1, p.footLength);
    const shoe = TW.createMesh(shoegeom);

    const foot = new THREE.Group();
    foot.name = "foot";
    foot.add(shoe);
    shoe.position.x = p.footLength/2;
    shoe.rotation.z = Math.PI/2;

    foot.rotation.z = parameters.ankleRotation;

    const calfgeom = new THREE.CylinderGeometry(3, 2, p.calfLength);
    const calf = TW.createMesh(calfgeom);

    const lowerleg = new THREE.Group();
    lowerleg.name = "lowerleg";
    lowerleg.add(calf);
    calf.position.y = -p.calfLength/2;
    foot.position.y = -p.calfLength;
    lowerleg.add(foot);

    lowerleg.rotation.z = p.kneeRotation;

    const thighgeom = new THREE.CylinderGeometry(5, 4, p.thighLength);
    const thigh = TW.createMesh(thighgeom);

    const leg = new THREE.Group();
    leg.name = "leg";
    leg.add(thigh);
    thigh.position.y = -parameters.thighLength/2;
    lowerleg.position.y = -parameters.thighLength;
    leg.add(lowerleg);

    leg.rotation.z = parameters.hipRotation;

    return leg;
}

/* If we just want to adjust the joint angles, we don't need to
 * discard and re-create the geometry. Just find the appropriate
 * joints and set their angles. */

export function adjustJointAngles(leg, params) {
    const foot = leg.getObjectByName('foot');
    const lleg = leg.getObjectByName('lowerleg');
    foot.rotation.z = params.ankleRotation;
    lleg.rotation.z = params.kneeRotation;
    leg.rotation.z = params.hipRotation;
}
