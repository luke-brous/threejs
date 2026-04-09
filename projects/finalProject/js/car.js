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

function physics(world) {
    // use cannon-es raycastVehicle to build car
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2,0.5,1))
    const chassisBody = new CANNON.Body({ mass: 100 })

    const cabinShape = new CANNON.Box(new CANNON.Vec3(1, 0.25, 0.9));

    const topOffset = new CANNON.Vec3(1, 0.75, 0); 
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
        suspensionStiffness: 100, // how stiff the suspension is
        suspensionRestLength: 0.4, // how long the suspension is when it's not compressed
        maxSuspensionForce: 10000, // maximum force the suspension can apply
        maxSuspensionTravel: 1.0, // maximum distance the suspension can compress
        dampingRelaxation: 2.3, // how much the suspension resists compression
        dampingCompression: 4.4, // how much the suspension resists extension
        rollInfluence: 0.01, // how much the vehicle rolls when turning
        frictionSlip: 10.0 // how much the wheel slips when it loses traction

    }

    // add the four wheels at the appropriate positions relative to the chassis
    wheelParams.chassisConnectionPointLocal.set(-1.4, 0, 1.0)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(-1.4, 0, -1.0)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(1.4, 0, 1.0)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(1.4, 0, -1.0)
    vehicle.addWheel(wheelParams)

    window.addEventListener('keydown', (event) => {
        // event.preventDefault()
        const jumpForce = new CANNON.Vec3(0,700,0)
        const maxSteerVal = 0.5
        const maxForce = 500
        const brakeForce = 10000
        switch (event.key) {
          case 'w':
          case 'ArrowUp':
            vehicle.applyEngineForce(-maxForce, 2)
            vehicle.applyEngineForce(-maxForce, 3)
            break
          case 's':
          case 'ArrowDown':
            vehicle.applyEngineForce(maxForce, 2)
            vehicle.applyEngineForce(maxForce, 3)
            break
          case 'a':
          case 'ArrowLeft':
            vehicle.setSteeringValue(maxSteerVal, 0)
            vehicle.setSteeringValue(maxSteerVal, 1)
            break
          case 'd':
          case 'ArrowRight':
            vehicle.setSteeringValue(-maxSteerVal, 0)
            vehicle.setSteeringValue(-maxSteerVal, 1)
            break
          case ' ':
            // need to add code to ensure the wheels are on the ground
            // in order to jump.
            chassisBody.applyImpulse(jumpForce, new CANNON.Vec3(0,0,0))
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
    meshesArray[0] = wheelBL; // back left
    meshesArray[1] = wheelBR; // back right
    meshesArray[2] = wheelFL; // front left
    meshesArray[3] = wheelFR; // front right

    // fenne was really large, so scaling it back
    fennecData.scene.scale.set(0.033,0.033,0.033)

    fennec.rotation.y = Math.PI;
    fennec.position.set(0.1, -0.75, 0);

    group.add(fennec);

  } catch (error) {
    console.error('Failed to load fennec model:', error);
  }
}
