import * as THREE from 'three';


export function car() {
    const planeGeo = new THREE.PlaneGeometry(20,20,16,16);
    const planeMesh = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({color: "red", side: THREE.DoubleSide}))
    scene.add(planeMesh)
    return planeMesh
}

export default car