import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// "Fennec - Rocket League Car" (https://skfb.ly/oopFH) by Jako is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

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

    const cabinOffset = new CANNON.Vec3(1, 0.75, 0); 
    chassisBody.addShape(cabinShape, cabinOffset);

    
    chassisBody.addShape(chassisShape)
    chassisBody.position.set(0, 4, -5)
    chassisBody.angularVelocity.set(0, 0, 0)

    world.addBody(chassisBody)

    const vehicle = new CANNON.RaycastVehicle({
        chassisBody
    })

    const wheelParams = {
        radius: 0.5,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        axleLocal: new CANNON.Vec3(0, 0, 1),
        chassisConnectionPointLocal: new CANNON.Vec3(-1.5, 0, 1.2),
        suspensionStiffness: 100,
        suspensionRestLength: 0.4,
        maxSuspensionForce: 10000,
        maxSuspensionTravel: 1.0,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        rollInfluence: 0.01,
        frictionSlip: 10.0

    }

    wheelParams.chassisConnectionPointLocal.set(-1.4, 0, 1.0)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(-1.4, 0, -1.0)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(1.4, 0, 1.0)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(1.4, 0, -1.0)
    vehicle.addWheel(wheelParams)

    // const jumpForce = new CANNON.Vec3(0, 1000, 0)

    window.addEventListener('keydown', (event) => {
        // event.preventDefault()
        const maxSteerVal = 0.5
        const maxForce = 500
        const brakeForce = 1000000
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


  loadFennec(chassisMesh, scene)

  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16)
  wheelGeo.rotateX(Math.PI / 2)
  const wheelMat = new THREE.MeshBasicMaterial({color: "black", visible: false})
  const wheelPositions = [
    [-1.5, 0.2, 1.2],
    [-1.5, 0.2, -1.2],
    [1.5, 0.2, 1.2],
    [1.5, 0.2, -1.2]
  ]


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

async function loadFennec(group, scene) {
  try {
    const fennecUrl = new URL('../images/fennec.glb', import.meta.url).href;
    const fennecData = await loader.loadAsync(fennecUrl);
    const fennec = fennecData.scene;

    // 1. Create the empty groups BEFORE the loop
    const wheelFL = new THREE.Group();
    const wheelFR = new THREE.Group();
    const wheelBL = new THREE.Group();
    const wheelBR = new THREE.Group();

    // 1. Create a safe temporary array
    const partsToExtract = [];

    // 2. Loop safely: ONLY push to the array, DO NOT use .add() here
    fennec.traverse((child) => {
        if (child.isMesh) {
            if (child.name.includes("FL") || 
                child.name.includes("FR") || 
                child.name.includes("BL") || 
                child.name.includes("BR")) {
                partsToExtract.push(child);
            }
        }
    });

    partsToExtract.forEach((child) => {
        
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

    const carScale = 0.033;
    wheelFL.scale.set(carScale, carScale, carScale);
    wheelFR.scale.set(carScale, carScale, carScale);
    wheelBL.scale.set(carScale, carScale, carScale);
    wheelBR.scale.set(carScale, carScale, carScale);
    
    const wheelScale = 3.0; 
    wheelFL.scale.set(wheelScale, wheelScale, wheelScale);
    wheelFR.scale.set(wheelScale, wheelScale, wheelScale);
    wheelBL.scale.set(wheelScale, wheelScale, wheelScale);
    wheelBR.scale.set(wheelScale, wheelScale, wheelScale);

    
    // After the loop finishes sorting the pieces, add the groups to scene and array
    scene.add(wheelFL, wheelFR, wheelBL, wheelBR);
    meshesArray[0] = wheelBL;
    meshesArray[1] = wheelBR;
    meshesArray[2] = wheelFL;
    meshesArray[3] = wheelFR;
    fennecData.scene.scale.set(0.033,0.033,0.033)

    fennec.rotation.y = Math.PI;
    fennec.position.set(0.1, -0.75, 0);

    group.add(fennec);
  } catch (error) {
    console.error('Failed to load fennec model:', error);
  }
}