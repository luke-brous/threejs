/**
 * @luke-brous
 * @abstract This is the ball which will be the "ball" for the car to drive around and hit into the goal. 
 * It meshes three.js and cannon-es.js together to create a sphere in both the physics world and the rendering world.
 * Three.js, Cannon-es, and GLTFLoader are all used in this file.
 */


import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const BALL_DYNAMICS = {
    mass: 15,
    radius: 2,
    linearDamping: 0.03,
    angularDamping: 0.05
};

// uses the GLTFLoader to load a .glb file of a ball, which is a sphere with a texture on it.
const loader = new GLTFLoader();

/**
 * @function ball, which creates the ball in both the physics world and the rendering world, 
 * and returns an object with both the physics body and the visual mesh, as well as an update function to sync the two together.
 * The ball has a mass of 15, and a radius of 2.
 * @param {*} scene 
 * @param {*} world 
 * @returns 
 */
export default function ball(scene, world) {
    const ballBody = ballPhysics(world)
    const ballMesh = ballVisuals(scene)
    ballBody.name = 'ball'; 

    return {
        physics: ballBody,
        mesh: ballMesh,
        update: function() {
            // Sync the position and rotation of the visual mesh with the physics body
            ballMesh.position.copy(ballBody.position)
            ballMesh.quaternion.copy(ballBody.quaternion)

        }
    }

}

/**
 * @function ballPhysics, which creates the physics body for the ball, and adds it to the world.
 * @param {*} world 
 * @returns 
 */
export function ballPhysics(world) {

    const radius = BALL_DYNAMICS.radius;


    const sphereShape = new CANNON.Sphere(radius)
    const sphereBody = new CANNON.Body({ 
        mass: BALL_DYNAMICS.mass 
        
    })
    sphereBody.addShape(sphereShape)
    if (world.ballMaterial) {
        sphereBody.material = world.ballMaterial;
    }
    sphereBody.linearDamping = BALL_DYNAMICS.linearDamping;
    sphereBody.angularDamping = BALL_DYNAMICS.angularDamping;
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
    
    const ballGroup = new THREE.Group()
    scene.add(ballGroup)

    loadBall(ballGroup)

    ballGroup.castShadow = true;
    ballGroup.receiveShadow = true;

    
    return ballGroup;

}

// "Ball - Rocket League" (https://skfb.ly/os8yB) by Jako is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
async function loadBall(group) {
  try {
    const ballUrl = new URL('../images/ball.glb', import.meta.url).href;
    const ballData = await loader.loadAsync(ballUrl);
    const ball = ballData.scene;

        ball.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

    ballData.scene.scale.set(2.1,2.1,2.1)

    group.add(ball);
  } catch (error) {
    console.error('Failed to load ball model:', error);
  }
}
