/**
 * @luke-brous
 * @abstract This is the ball which will be the "ball" for the car to drive around and hit into the goal. 
 * It meshes three.js and cannon-es.js together to create a sphere in both the physics world and the rendering world.
 * Three.js, Cannon-es, and GLTFLoader are all used in this file.
 */


import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// uses the GLTFLoader to load a .glb file of a ball, which is a sphere with a texture on it.
const loader = new GLTFLoader();

/**
 * @function ball, which creates the ball in both the physics world and the rendering world, 
 * and returns an object with both the physics body and the visual mesh, as well as an update function to sync the two together.
 * The ball has a mass of 1, and a radius of 2.
 * @param {*} scene 
 * @param {*} world 
 * @returns 
 */
export default function ball(scene, world) {
    const myBallPhysics = ballPhysics(world)
    const myBallMesh = ballVisuals(scene)
    myBallPhysics.name = 'ball'; 

    return {
        physics: myBallPhysics,
        mesh: myBallMesh,
        update: function() {
            myBallMesh.position.copy(myBallPhysics.position)
            myBallMesh.quaternion.copy(myBallPhysics.quaternion)

        }
    }

}

/**
 * @function ballPhysics, which creates the physics body for the ball, and adds it to the world.
 * @param {*} world 
 * @returns 
 */
export function ballPhysics(world) {
    const sphereShape = new CANNON.Sphere(2)
    const sphereBody = new CANNON.Body({ mass: 1 })
    sphereBody.addShape(sphereShape)
    sphereBody.position.set(0, 5, 5)

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

/**
 * @function ballVisuals, which creates the visual mesh for the ball and adds it to the scene.
 * @param {*} scene 
 * @returns 
 */
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
