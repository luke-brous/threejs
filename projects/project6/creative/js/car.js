import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// "Fennec - Rocket League Car" (https://skfb.ly/oopFH) by Jako is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

const loader = new GLTFLoader();

export default function car(scene, world) {

    // 
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

    const cabinShape = new CANNON.Box(new CANNON.Vec3(-1, 0.25, 0.9));

    // 3. Add it to the SAME body, but shift it UP and slightly BACK
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

    wheelParams.chassisConnectionPointLocal.set(-1.5, 0, 1.2)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(-1.5, 0, -1.2)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(1.5, 0, 1.2)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(1.5, 0, -1.2)
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
  
  loadFennec(scene)


  const chassisGeo = new THREE.BoxGeometry(4,1,2)
  const chassisMesh = new THREE.Mesh(chassisGeo, new THREE.MeshBasicMaterial({color: "blue"}))
  scene.add(chassisMesh)

  // const windowMaterial = new THREE.MeshBasicMaterial({color: "lightblue", transparent: true, opacity: 0.7})

  // 2. Create the visual cabin/roof
  const cabinGeo = new THREE.BoxGeometry(2, 0.5, 1.8);
  const cabinMat = new THREE.MeshBasicMaterial({color: "blue"})
  const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);

  // 3. Position the cabin RELATIVE to the center of the base chassis
  cabinMesh.position.set(1, 0.75, 0); // Matches the Cannon offset above

  // 4. CRITICAL: Add the cabin TO the chassis, NOT the scene
  chassisMesh.add(cabinMesh);

  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16)
  wheelGeo.rotateX(Math.PI / 2)
  const wheelMat = new THREE.MeshBasicMaterial({color: "black"})
  const wheelPositions = [
    [-1.5, 0.2, 1.2],
    [-1.5, 0.2, -1.2],
    [1.5, 0.2, 1.2],
    [1.5, 0.2, -1.2]
  ]


  const meshesArray = []
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

// async function loadModel(scene) {
//   const gltf = await loader.loadAsync('fennec.glb')
//   scene.add(gltf.scene)
  

// } 
// async function loadFennec() {
//     const fennecData = await loader.loadAsync('fennec.glb');
//     console.log('Vroom', fennecData);
//     const fennec = parrotData.scene; // this is actually a Group()
//     globalThis.fennec = fennec;
//     const box = new THREE.Box3().setFromObject(fennec);
//     console.log(box);
//     scene.add(parrot);
//     // TW.cameraSetup(renderer,
//                   //  scene,
//                   //  TW.objectBoundingBox(parrot));
// }


async function loadFennec(scene) {
  try {
    const fennecUrl = new URL('./fennec.glb', import.meta.url).href;
    const fennecData = await loader.loadAsync(fennecUrl);
    const fennec = fennecData.scene;
    scene.add(fennec);
  } catch (error) {
    console.error('Failed to load fennec model:', error);
  }
}