import * as THREE from 'three';
import { TW } from 'tw';

/* Function to make a "snow person" consisting of three spheres and a
 * cone (carrot nose).

See the snowPersonDefaults for a dictionary of the default values.

Returns the snowPerson object
*/

// Note that the sizes are radiuses, so the default snowperson is
// 2*(3+2+1) = 12 units high.

export const snowParameters = {
    wireFrame: true,
    snowColor: 0xffffff,        // white
    noseColor: 0xff8c00,        // orange
    botSize: 3,                 // bottom ball
    midSize: 2,                 // middle ball
    topSize: 1,                 // top ball
    noseSize: 0.5,              // length of nose
};
    

/* Simple snowperson with three spheres and a conical nose. Y-axis
   goes through the three spheres. Nose points parallel to the X-axis,
   with its base on the surface of the sphere. Sphere sizes are
   parameters, as is nose length. */

export function makeSnowPerson(params) {
    const p = TW.combineDictionaries(params, snowParameters);
    const snowMat = new THREE.MeshBasicMaterial({color: p.snowColor,
                                                 wireframe: p.wireFrame});
    const noseMat = new THREE.MeshBasicMaterial({color: p.noseColor,
                                                 wireframe: p.wireFrame});
    // details for the geometries.
    // Bumped them down a bit, so we can see through the wireframe
    const ballDetail = 10;
    const noseDetail = 10;

    // Helper function that can access those values above
    // Adds a sphere of given radius to the container, at y=ypos. 
    
    function addSphere(container, radius, ypos) {
        const geom = new THREE.SphereGeometry(radius, ballDetail, ballDetail);
        var mesh = new THREE.Mesh(geom, snowMat);
        mesh.position.y = ypos;
        container.add(mesh);
    }

    // the container for the whole snowperson
    const snowPerson = new THREE.Group();
    // build the body from the bottom up, keeping track of ypos as we go up
    let ypos = p.botSize;       // location of center of ball
    addSphere(snowPerson, p.botSize, ypos);
    ypos += p.botSize + p.midSize;
    addSphere(snowPerson, p.midSize, ypos);
    ypos += p.midSize + p.topSize;
    addSphere(snowPerson, p.topSize, ypos);

    /* create and add the nose. Base is always 1/5 of the head size
       and noseLength (nl) is a parameter.
       The base is located on the surface of the top sphere, which is
       at x=topSize, so we have to position the code at nl/2+topSize.
    */
    const rtop = p.topSize;
    const nl = p.noseSize;
    const noseGeom = new THREE.ConeGeometry(rtop/5, nl, noseDetail);
    const noseMesh = new THREE.Mesh(noseGeom, noseMat);
    // position nose cone along Y and Z axes
    noseMesh.position.set(rtop+nl/2,ypos,0);
    // rotate cone -90 deg around Z axis to point horizontally
    noseMesh.rotateZ(-0.5*Math.PI);
    snowPerson.add(noseMesh);

    return snowPerson;
}
