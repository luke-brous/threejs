import * as THREE from 'three';
import * as CANNON from 'cannon-es';


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
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2,0.25,1))
    const chassisBody = new CANNON.Body({ mass: 100 })


    
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
  

  const chassisGeo = new THREE.BoxGeometry(4,0.5,2)
  const chassisMesh = new THREE.Mesh(chassisGeo, new THREE.MeshBasicMaterial({color: "blue"}))
  scene.add(chassisMesh)

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