import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

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
    const sphereShape = new CANNON.Sphere(2)
    const sphereBody = new CANNON.Body({ mass: 1 })
    sphereBody.addShape(sphereShape)
    sphereBody.position.set(2 * 2, 2 + 1, 2 * 2)

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'r':
                sphereBody.position.set(0,5,0)
                break;
        }
    })


    world.addBody(sphereBody)
    return sphereBody;

}

export function ballVisuals(scene) {
    
    const ballMesh1 = new THREE.Group()
    scene.add(ballMesh1)

    loadBall(ballMesh1)

    
    return ballMesh1;

}

// "Ball - Rocket League" (https://skfb.ly/os8yB) by Jako is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
async function loadBall(group) {
  try {
    const ballUrl = new URL('../images/ball.glb', import.meta.url).href;
    const ballData = await loader.loadAsync(ballUrl);
    const ball = ballData.scene;

    ballData.scene.scale.set(2.1,2.1,2.1)

    group.add(ball);
  } catch (error) {
    console.error('Failed to load ball model:', error);
  }
}