import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default function ball(scene, world) {
    const myBallPhysics = ballPhysics(world)
    const myBallMesh = ballVisuals(scene)

    return {
        physics: myBallPhysics,
        mesh: myBallMesh,
        update: function() {
            myBallMesh.position.copy(myBallPhysics.position)
            myBallMesh.quaternion.copy(myBallPhysics.quaternion)

        }
    }

}

export function ballPhysics(world) {
    const sphereShape = new CANNON.Sphere(1)
    const sphereBody = new CANNON.Body({ mass: 1 })
    sphereBody.addShape(sphereShape)
    sphereBody.position.set(2 * 2, 2 + 1, 2 * 2)
    world.addBody(sphereBody)
    return sphereBody;

}

export function ballVisuals(scene) {
    const ballGeo = new THREE.SphereGeometry(1)
    const ballMat = new THREE.MeshPhongMaterial({color: "gray"})
    const ballMesh = new THREE.Mesh(ballGeo,ballMat)
    scene.add(ballMesh)
    return ballMesh;

}