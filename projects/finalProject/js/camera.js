/**
 * @luke-brous
 * @abstract This is the unified camera system. It keeps the camera anchored behind the 
 * car's spoiler regardless of the mode, but smoothly pivots the "eyes" of the camera 
 * between the ball and the car's hood.
 */

import * as THREE from 'three';

const idealPosition = new THREE.Vector3();
const lookAtTarget = new THREE.Vector3();
const relativeOffset = new THREE.Vector3();

/**
 * @function updateCarCamera
 * Calculates one anchor point behind the car and lerps the rotation target 
 * based on the isBallCam toggle.
 */
export function updateCarCamera(camera, chassisMesh, ballMesh, isBallCam) {
    const distance = 14;   // Distance behind the car
    const height = 5;     // Height above the car
    const posLerp = 0.1;  // Smoothness of movement
    const rotLerp = 0.15; // Smoothness of the "look" (higher = snappier)

    // Calculate the ideal camera position based on the car's orientation
    relativeOffset.set(distance, height, 0); 
    
    idealPosition.copy(relativeOffset)
        .applyQuaternion(chassisMesh.quaternion)
        .add(chassisMesh.position);

    // Key feature
    // the lerp method is used to smoothly transition the camera's position and
    //  lookAt target between the car and the ball    
    camera.position.lerp(idealPosition, posLerp);


    if (isBallCam && ballMesh) {
        // Aim the lens at the ball for ball cam
        lookAtTarget.lerp(ballMesh.position, rotLerp);
    } else {
        // Aim the lens slightly in front of the car for car cam
        const carFront = new THREE.Vector3().copy(chassisMesh.position);
        carFront.y += 1.5; // Give a little shift upwards to prevent the camera from aiming at the car's hood
        lookAtTarget.lerp(carFront, rotLerp);
    }

    camera.lookAt(lookAtTarget);
}