import * as THREE from 'three';
import { TW } from 'tw';

/* this file doesn't build anything per see, unlike the snake, but it
 * does provide useful functions. */

/* The TW barn has its origin at the lower left front, which is not
 * convenient for suspending it from a mobile, where we want the
 * origin at the middle of the roof ridge. This function returns such
 * a barn, using mesh normal material . */

export function barn(width, height, depth) {
    const geo = TW.barnGeometry(width, height, depth);
    const mesh = TW.createMesh(geo);

    const grp = new THREE.Group();
    const top = height + width/2;
    mesh.position.set(-width/2, -top, depth/2);
    grp.add(mesh);
    return grp;
}

/* The built-in functions for boxes and octohedrons have the origin in
 * the center. These functions return a group where the origin is at
 * the center of the top, suitable for hanging from a mobile.

 */

export function box(width, height, depth) {
    const geom = new THREE.BoxGeometry(width, height, depth);
    const mesh = TW.createMesh(geom);
    mesh.position.set(0,height/2,0);
    const grp = new THREE.Group();
    grp.add(mesh);
    return grp;
}

export function octahedron(radius) {
    const geom = new THREE.OctahedronGeometry(radius);
    const mesh = TW.createMesh(geom);
    mesh.position.set(0,radius/2,0);
    const grp = new THREE.Group();
    grp.add(mesh);
    return grp;
}

// ================================================================
// These functions take a part of the mobile as an argument and return
// a group containing that part.

/* returns a group with a black line (a cylinder) of given length
 * connecting the origin of the group to the object (an argument). */

export function string(length, obj) {
    const radius = 0.04;
    const geo = new THREE.CylinderGeometry(radius, radius, length);
    // default color is white
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
    const grp = new THREE.Group();
    mesh.position.set(0,-length/2,0);
    grp.add(mesh);
    obj.position.set(0,-length,0);
    grp.add(obj);
    return grp;
}

/* This function creates a horizonal bar with given color and places
 * the two objects at each end. Returns a string to the bar. */

export function branch(color, length, leftObj, rightObj) {
    const radius = 0.2;
    const geo = new THREE.CylinderGeometry(radius, radius, length);
    const mat = new THREE.MeshBasicMaterial({color: color});
    const mesh = new THREE.Mesh(geo, mat);

    const grp = new THREE.Group();
    mesh.rotation.z = Math.PI/2;
    grp.add(mesh);

    leftObj.position.x = -1 * length/2;
    rightObj.position.x = 1 * length/2;
    grp.add(leftObj);
    grp.add(rightObj);
    return grp;
}
