import * as THREE from 'three';
import { TW } from 'tw';

export function boxGeometryWithMaterialGroups (xsize, ysize, zsize) {
    const x2 = xsize/2, y2 = ysize/2, z2 = zsize/2;
    // eight locations. The first four are given long-winded names, to
    // make the code easier to read, and corresponding to the names in
    // the reading.
    const v0_upper_left = [ -x2, +y2, z2 ];
    const v1_lower_left = [ -x2, -y2, z2 ];
    const v2_lower_right = [ x2, -y2, z2 ];
    const v3_upper_right = [ x2, +y2, z2 ];
    // array of 8 locations/points
    const p = [ v0_upper_left,
                v1_lower_left,
                v2_lower_right,
                v3_upper_right,
                // the ones in the back
                [ +x2, +y2, -z2 ],
                [ +x2, -y2, -z2 ],
                [ -x2, -y2, -z2 ],
                [ -x2, +y2, -z2 ]];

    // We'll fill these arrays with our helpers
    const vertices = [];
    const indices = [];

    // group code modeled on BoxGeometry
    // https://github.com/mrdoob/three.js/blob/master/src/geometries/BoxGeometry.js
    // Each group corresponds to a "face" (flat surface of the
    // object), which consists of a set of triangles.  We need to
    // count the number of triangles in each group, and then do
    // addGroup() at the end of a face.  Each face/group will have its
    // own normal and materialIndex

    let bg = new THREE.BufferGeometry();
    bg.type = 'BarnGeometry';

    let groupStart = 0; 

    // let's use quad with the corners starting at the upper left of
    // the texture and going counterclockwise
    function quad(i1, i2, i3, i4, normal, materialIndex) {
        let v1 = { pos: p[i1], norm: normal, uv: [0, 0] };
        let v2 = { pos: p[i2], norm: normal, uv: [0, 1] };
        let v3 = { pos: p[i3], norm: normal, uv: [1, 1] };
        let v4 = { pos: p[i4], norm: normal, uv: [1, 0] };
        let n = vertices.length; // index of v1
        vertices.push(v1, v2, v3, v4);
        // these are the two triangles
        indices.push(n, n+1, n+2);
        indices.push(n, n+2, n+3);
        let numVertices = 6;
        bg.addGroup(groupStart, numVertices, materialIndex);
        groupStart += numVertices;
    }
        
    quad(0, 1, 2, 3, [0,0,1], 0); // front side (+z side)
    quad(3, 2, 5, 4, [+1,0,0], 1); // +x side
    quad(0, 3, 4, 7, [0,+1,0], 2); // top (+y side)
    quad(7, 6, 1, 0, [-1,0,0], 3); // -x side
    quad(4, 5, 6, 7, [0,0,-1], 4); // back
    quad(6, 5, 2, 1, [0,-1,0], 5) // bottom -y side


    // Whew! Now, build the rest
    TW.setBufferGeometryFromVertices(bg, vertices);
    bg.setIndex(indices);
    return bg;
}
