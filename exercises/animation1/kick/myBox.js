// Example of a separate module
// Must begin with the imports;
import * as THREE from 'three';
import { TW } from 'tw';

// Create a 3D rectangular box of a given width, height, depth
// Uses THREE.MeshNormalMaterial.

export function myBox(width, height, depth) {
    if( ! (Number.isFinite(width) &&
           Number.isFinite(height) &&
           Number.isFinite(depth) ) ) 
        throw Error('You have to specify 3 numbers as arguments to myBox');
    const geom = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshNormalMaterial();
    return new THREE.Mesh( geom, mat );
}


