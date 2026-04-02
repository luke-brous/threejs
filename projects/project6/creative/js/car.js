import * as THREE from 'three';
export * as CANNON from 'cannon-es';


export default function car(scene, world) {

    // 

    
    return 
}

function physics(world) {
    // use cannon-es raycastVehicle to build car
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2,0.5,1))
    const chassisBody = new CANNNON.Body({ mass: 100 })

    chassisBody.addShape(chassisShape)
    chassisBody.position.set(0, 4, 0)
    chassisBody.angularVelocity.set(0, 0.5, 0)
    

}

function visual(scene) {

}