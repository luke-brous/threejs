/**
 * @luke-brous
 * @abstract This is the drivable car, modeled after the Fennec from Rocket League. It integrates Three.js for rendering and Cannon-es for physics simulation,
 * allowing for a physics-driven driving experience. Three.js, Cannon-es, and GLTFLoader are all used in this file.
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let meshesArray;

export default function car(scene, world) {

    const myCar = physics(world)
    const carMesh = visual(scene)
    
    return{
        physics: myCar,
        mesh: carMesh,
        update: function() {
            // update car mesh position and rotation based on physics
            carMesh.chassisMesh.position.copy(myCar.chassisBody.position)
            carMesh.chassisMesh.quaternion.copy(myCar.chassisBody.quaternion)
            
            // update wheel meshes based on physics
            myCar.wheelInfos.forEach((wheel, index) => {
                const wheelMesh = carMesh.wheelMeshes[index]
                myCar.updateWheelTransform(index)
                const transform = myCar.wheelInfos[index].worldTransform
                wheelMesh.position.copy(transform.position)
                wheelMesh.quaternion.copy(transform.quaternion)
            })
        }
    } 
}

/**
 * @function physics, which creates the Cannon-es RaycastVehicle for the car, including its chassis and wheels, and adds it to the physics world.
 * It also sets up event listeners for car controls.
 * @param {CANNON.World} world - The Cannon-es physics world.
 * @returns {CANNON.RaycastVehicle} The configured Cannon-es RaycastVehicle.
 */
function physics(world) {
    // use cannon-es raycastVehicle to build car
    // First demo I ever looked at and drew inspiration from - https://github.com/pmndrs/cannon-es/blob/master/examples/raycast_vehicle.html
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2,0.3,1))
    const chassisBody = new CANNON.Body({ mass: 150 })

    const cabinShape = new CANNON.Box(new CANNON.Vec3(1, 0.25, 0.9));

    const topOffset = new CANNON.Vec3(1, 0.55, 0); 
    chassisBody.addShape(cabinShape, topOffset);

    
    chassisBody.addShape(chassisShape)
    chassisBody.position.set(0, 4, -5)
    chassisBody.angularVelocity.set(0, 0, 0)

    world.addBody(chassisBody)

    const vehicle = new CANNON.RaycastVehicle({
        chassisBody
    })

    const wheelParams = {
        radius: 0.5, // size of the wheels
        directionLocal: new CANNON.Vec3(0, -1, 0), // direction of suspension
        axleLocal: new CANNON.Vec3(0, 0, 1), // point where the wheel is attached to the chassis, relative to the center of mass
        chassisConnectionPointLocal: new CANNON.Vec3(-1.5, 0, 1.2), // position of the wheel relative to the chassis
        suspensionStiffness: 150, // how stiff the suspension is
        suspensionRestLength: 0.4 , // how long the suspension is when it's not compressed
        maxSuspensionForce: 10000, // maximum force the suspension can apply
        maxSuspensionTravel: 1.0, // maximum distance the suspension can compress
        dampingRelaxation: 8, // how much the suspension resists compression
        dampingCompression: 10, // how much the suspension resists extension
        rollInfluence: 0.01, // how much the vehicle rolls when turning
        frictionSlip: 18.0 // how much the wheel slips when it loses traction

    }

    // add the four wheels at the appropriate positions relative to the chassis

    wheelParams.chassisConnectionPointLocal.set(-1.4, -0.1, 1.0);
    vehicle.addWheel(wheelParams);

    wheelParams.chassisConnectionPointLocal.set(-1.4, -0.1, -1.0);
    vehicle.addWheel(wheelParams);

    wheelParams.chassisConnectionPointLocal.set(1.4, -0.1, 1.0);
    vehicle.addWheel(wheelParams);

    wheelParams.chassisConnectionPointLocal.set(1.4, -0.1, -1.0);
    vehicle.addWheel(wheelParams);


    let lastRecoveryTime = 0; // for recovery flip cooldown
    window.addEventListener('keydown', (event) => {
        if (event.repeat) return;

        const maxSteerVal = 0.7
        const maxForce = 600
        const brakeForce = 100000
        switch (event.key) {
          // drive forward
          case 'w':
          case 'ArrowUp':
            vehicle.applyEngineForce(-maxForce, 2)
            vehicle.applyEngineForce(-maxForce, 3)
            break
          // reverse
          case 's':
          case 'ArrowDown':
            vehicle.applyEngineForce(maxForce, 2)
            vehicle.applyEngineForce(maxForce, 3)
            break
          // steer left
          case 'a':
          case 'ArrowLeft':
            vehicle.setSteeringValue(maxSteerVal, 0)
            vehicle.setSteeringValue(maxSteerVal, 1)
            break
          //steer right
          case 'd':
          case 'ArrowRight':
            vehicle.setSteeringValue(-maxSteerVal, 0)
            vehicle.setSteeringValue(-maxSteerVal, 1)
            break
          case ' ':
            // Only allow jumping if at least 2 wheels are on the ground to prevent mid-air jumps
            const groundedWheels = vehicle.wheelInfos.filter(w => w.raycastResult.hasHit).length;

            if (groundedWheels >= 2) {
              chassisBody.applyImpulse(new CANNON.Vec3(0, 1100, 0), new CANNON.Vec3(0, 0, 0))
            } else {
              console.log(`Jump failed: only ${groundedWheels} wheels on ground`)
            }
            break;
          // Recovery flip for when car is turtled
          case 't':
            const now = Date.now();

            // Only run if 3 seconds have passed
            if (now - lastRecoveryTime > 3000) {
                // Reset the car upright
                const hopForce = 700; 
                chassisBody.applyImpulse(new CANNON.Vec3(0, hopForce, 0), new CANNON.Vec3(0, 0, 0));
            
                const euler = new CANNON.Vec3();
                chassisBody.quaternion.toEuler(euler);

                chassisBody.quaternion.setFromEuler(0, euler.y, 0);
                chassisBody.angularVelocity.set(0, 0, 0);
            
                // Update the timer
                lastRecoveryTime = now;
            }
            break;
          case 'b':
            vehicle.setBrake(brakeForce, 0)
            vehicle.setBrake(brakeForce, 1)
            vehicle.setBrake(brakeForce, 2)
            vehicle.setBrake(brakeForce, 3)
            break
          
        }
      })
      // Reset force on keyup
      window.addEventListener('keyup', (event) => {
        // event.preventDefault()
        switch (event.key) {
          case 'w':
          case 'ArrowUp':
            vehicle.applyEngineForce(0, 2)
            vehicle.applyEngineForce(0, 3)
            break
          case 's':
          case 'ArrowDown':
            vehicle.applyEngineForce(0, 2)
            vehicle.applyEngineForce(0, 3)
            break
          case 'a':
          case 'ArrowLeft':
            vehicle.setSteeringValue(0, 0)
            vehicle.setSteeringValue(0, 1)
            break
          case 'd':
          case 'ArrowRight':
            vehicle.setSteeringValue(0, 0)
            vehicle.setSteeringValue(0, 1)
            break
          case 'b':
            vehicle.setBrake(0, 0)
            vehicle.setBrake(0, 1)
            vehicle.setBrake(0, 2)
            vehicle.setBrake(0, 3)
            break
        }
      })
    
    
    vehicle.addToWorld(world)
    return vehicle;
}

/**
 * @function visual, which creates the visual meshes for the car, including loading the Fennec GLB model and creating placeholder wheel meshes, and adds them to the Three.js scene.
 * @param {THREE.Scene} scene - The Three.js scene.
 * @returns {object} An object containing the chassis mesh and an array of wheel meshes.
 */
function visual(scene) {
  
  const chassisMesh = new THREE.Group();
  scene.add(chassisMesh)
  
  loadFennec(chassisMesh, scene) // this loads the fennec model

  // create the wheel geometry and material, and define the positions for the four wheels.
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16)
  wheelGeo.rotateX(Math.PI / 2)
  const wheelMat = new THREE.MeshBasicMaterial({color: "black", visible: false})
  const wheelPositions = [
    [-1.5, 0.2, 1.2],
    [-1.5, 0.2, -1.2],
    [1.5, 0.2, 1.2],
    [1.5, 0.2, -1.2]
  ]

  // create an array to hold the wheel meshes, 
  // and loop through the wheel positions to create and position each wheel mesh,
  //  then add it to the scene and array.
  meshesArray = []
  wheelPositions.forEach(pos => {
    const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat)
    wheelMesh.castShadow = true
    wheelMesh.receiveShadow = true
    meshesArray.push(wheelMesh)
    wheelMesh.position.set(...pos)
    scene.add(wheelMesh)
  })

  return{
    chassisMesh: chassisMesh,
    wheelMeshes: meshesArray
  }
}

// "Fennec - Rocket League Car" (https://skfb.ly/oopFH) by Jako is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
async function loadFennec(group, scene) {
  try {
    const fennecUrl = new URL('../images/fennec.glb', import.meta.url).href;
    const fennecData = await loader.loadAsync(fennecUrl);
    const fennec = fennecData.scene;

    const wheelFL = new THREE.Group();
    const wheelFR = new THREE.Group();
    const wheelBL = new THREE.Group();
    const wheelBR = new THREE.Group();

    // In order to avoid issues with modifying the scene graph while traversing, we will first collect the relevant meshes in an array,
    //  then sort them into groups after the traversal is complete.
    const wheelsExtracted = [];

    // traverse the fennec model and extract the wheel meshes based on their names.
    fennec.traverse((child) => {
        if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
            if (child.name.includes("FL") || 
                child.name.includes("FR") || 
                child.name.includes("BL") || 
                child.name.includes("BR")) {
                wheelsExtracted.push(child);
            }
        }
    });

    // loop through each extracted wheel mesh, center the geometry, rotate it to the correct orientation, 
    // and add it to the appropriate group based on its name.
    wheelsExtracted.forEach((child) => {
        
        // Center the raw geometry, then snap the position to 0,0,0
        if (child.geometry) {
          child.geometry = child.geometry.clone();
          child.geometry.center();
          child.geometry.rotateX(Math.PI / 2);
        }
        child.position.set(0, 0, 0);

        if (child.name.includes("FL")) wheelFL.add(child);
        else if (child.name.includes("FR")) wheelFR.add(child);
        else if (child.name.includes("BL")) wheelBL.add(child);
        else if (child.name.includes("BR")) wheelBR.add(child);
    });

    // Apply the same scale to the wheel groups as the main car model, then apply an additional scale to make the wheels larger and more visible.
    const carScale = 0.033;
    wheelFL.scale.set(carScale, carScale, carScale);
    wheelFR.scale.set(carScale, carScale, carScale);
    wheelBL.scale.set(carScale, carScale, carScale);
    wheelBR.scale.set(carScale, carScale, carScale);
    
    // Apply an additional scale to make the wheels larger and more visible.
    const wheelScale = 3.0; 
    wheelFL.scale.set(wheelScale, wheelScale, wheelScale);
    wheelFR.scale.set(wheelScale, wheelScale, wheelScale);
    wheelBL.scale.set(wheelScale, wheelScale, wheelScale);
    wheelBR.scale.set(wheelScale, wheelScale, wheelScale);
    
    // After the loop finishes sorting the pieces, add the groups to scene and array
    scene.add(wheelFL, wheelFR, wheelBL, wheelBR);
    [wheelFL, wheelFR, wheelBL, wheelBR].forEach((wheelGroup) => {
      wheelGroup.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    });
    meshesArray[0] = wheelBL; // back left
    meshesArray[1] = wheelBR; // back right
    meshesArray[2] = wheelFL; // front left
    meshesArray[3] = wheelFR; // front right

    // fennec was really large, so scaling it back
    fennecData.scene.scale.set(0.033,0.033,0.033)

    fennec.rotation.y = Math.PI;
    fennec.position.set(0.1, -0.75, 0);

    group.add(fennec);

  } catch (error) {
    console.error('Failed to load fennec model:', error);
  }
}
