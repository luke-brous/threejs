import * as CANNON from 'cannon-es';
import * as THREE from 'three';

/**
 * @luke-brous 
 * @abstract This is the arena which will be the "field" for the car to drive around in.
 * It meshes three.js and cannon-es.js together to create a plane in both the physics world and the rendering world.
 * @param {*} scene 
 * @param {*} world 
 * @param {*} width 
 * @param {*} height 
 * @returns 
 */
export default function arena(scene, world, width, height) {
    const planeGeo = new THREE.PlaneGeometry(width, height, 16, 16);
    const planeMesh = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({color: "grey", side: THREE.DoubleSide}))
    planeMesh.rotation.x = -Math.PI/2

    scene.add(planeMesh)

    const planeBody = new CANNON.Body({
        mass: 0, // makes the body static
        shape: new CANNON.Plane(),
        material: new CANNON.Material('ground')
    })
    planeBody.quaternion.setFromEuler(-Math.PI/2, 0, 0)
    world.addBody(planeBody)


    return {
        mesh: planeMesh,
        body: planeBody,
        update: function() {}
    }
}
