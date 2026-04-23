import * as THREE from 'three';
/**
 * @luke-brous
 * @abstract This file manages the gameplay camera behavior. The camera can follow the car or lock onto the ball,
 * and it uses lerp smoothing so camera movement feels stable during quick physics changes.
 * Three.js is used in this file.
 */

// Reuse vectors each frame to avoid creating temporary objects.
const idealPosition = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();
const relativeOffset = new THREE.Vector3();

/**
 * @function updateCamera, which updates the camera position and aim each frame.
 * It follows the car from behind by default, and can switch to looking at the ball.
 * @param {THREE.Camera} camera
 * @param {THREE.Mesh} chassisMesh
 * @param {THREE.Mesh} ballMesh
 * @param {boolean} isBallCam
 * @returns {void}
 */
export function updateCamera(camera, chassisMesh, ballMesh, isBallCam) {
    const distance = 12;
    const height = 4;
    const lookAtOffset = 2;
    const lerpFactor = 0.1;

    // The car model points forward on local +X, so local +X is the rear follow side.
    relativeOffset.set(distance, height, 0);

    idealPosition.copy(relativeOffset)
        .applyQuaternion(chassisMesh.quaternion)
        .add(chassisMesh.position);

    camera.position.lerp(idealPosition, lerpFactor);

    if (isBallCam && ballMesh) {
        camera.lookAt(ballMesh.position);
    } else {
        // Keeps the car centered in the frame with a slight upward tilt
        cameraTarget.copy(chassisMesh.position);
        cameraTarget.y += lookAtOffset;
        camera.lookAt(cameraTarget);
    }
}