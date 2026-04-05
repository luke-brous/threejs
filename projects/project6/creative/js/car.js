import * as THREE from 'three';
import * as CANNON from 'cannon-es';


export default function car(scene, world) {

    // 
    const myCar = physics(world)
    visual(scene)

    
    return{
        physics: myCar,
        update: function() {}
    } 
}

function physics(world) {
    // use cannon-es raycastVehicle to build car
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2,0.5,1))
    const chassisBody = new CANNON.Body({ mass: 100 })

    chassisBody.addShape(chassisShape)
    chassisBody.position.set(0, 4, 0)
    chassisBody.angularVelocity.set(0, 0.5, 0)

    const vehicle = new CANNON.RaycastVehicle({
        chassisBody
    })

    const wheelParams = {
        radius: 0.5,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        axleLocal: new CANNON.Vec3(0, 0, 1),
        chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        maxSuspensionForce: 100000,
        maxSuspensionTravel: 0.3,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        rollInfluence: 0.01,
        frictionSlip: 1.5

    }

    wheelParams.chassisConnectionPointLocal.set(-1, 0, 1)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(-1, 0, -1)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(1, 0, 1)
    vehicle.addWheel(wheelParams)

    wheelParams.chassisConnectionPointLocal.set(1, 0, -1)
    vehicle.addWheel(wheelParams)

    window.addEventListener('keydown', (event) => {
        event.preventDefault()
        const maxSteerVal = 0.5
        const maxForce = 1000
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
        event.preventDefault()
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

}