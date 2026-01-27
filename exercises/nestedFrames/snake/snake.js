import * as THREE from 'three';
import { TW } from 'tw';

/* Makes a "snake" with these parameters: numSegments, where each
 * segment is the same length, segmentLength. Finally, there is an
 * array of jointAngles. Returns the Group.  */

export function makeSnake(parameters) {
    const p = parameters;

    const snake = new THREE.Group();
    let prevseg = snake;
    for( let i = 0; i < p.numSegments; i++ ) {
        const seg = new THREE.Group();
        const geo = new THREE.CylinderGeometry(1,1, p.segmentLength);
        const mesh = TW.createMesh(geo);
        seg.add(mesh)
        mesh.position.y = -1 * p.segmentLength/2;
        seg.rotation.z = p.jointAngles[i];
        seg.position.y = -1.2 * p.segmentLength;
        prevseg.add(seg);
        prevseg = seg;
    }
    return snake;
}

/* Makes a snake using the same parameters, but a recursive algorithm
 * internally. Returns the group. */

export function makeSnakeRec(parameters) {
    const p = parameters;
    const n = p.numSegments;

    function rec(i) {
        const seg = new THREE.Group();
        const geo = new THREE.CylinderGeometry(1,1, p.segmentLength);
        const mesh = TW.createMesh(geo);
        seg.add(mesh);
        mesh.position.y = -1 * p.segmentLength/2;
        seg.rotation.z = p.jointAngles[i];
        if(i < n-1) {
            const rest = rec(i+1);
            rest.position.y = -1.2 *p.segmentLength;
            seg.add(rest);
        }
        return seg;
    }
    return rec(0);
}
