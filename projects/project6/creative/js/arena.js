import * as CANNON from 'cannon-es';
import * as THREE from 'three';

/**
 * @luke-brous 
 * @abstract This is the arena which will be the "field" for the car to drive around in.
 * It meshes three.js and cannon-es.js together to create a plane in both the physics world and the rendering world.
 * @param {*} scene 
 * @param {*} world 
 * @param {*} width 
 * @param {*} height 
 * @returns 
 */

export default function arena(scene, world, width, height) {
    // --- VISUAL MESH ---
    const planeGeo = new THREE.PlaneGeometry(width, height, 16, 16);
    const planeMesh = new THREE.Mesh(
        planeGeo, 
        new THREE.MeshPhongMaterial({ color: "green", side: THREE.DoubleSide })
    );
    planeMesh.rotation.x = -Math.PI / 2;
    scene.add(planeMesh);

    // --- PHYSICS BODY ---
    const floorShape = new CANNON.Box(new CANNON.Vec3(width / 2, 5, height / 2));
    const planeBody = new CANNON.Body({ mass: 0, shape: floorShape });
    
    // Shift the box down to math y=0
    planeBody.position.y = -5;
    
    world.addBody(planeBody);

    testArena(scene)
    addLatheObject(scene)

    // --- LIGHTS ---
    lights(scene)

    return {
        mesh: planeMesh,
        body: planeBody,
        update: function() {}
    };
}

function lights(scene) {
    // lights here for now 
    const ambLight = new THREE.AmbientLight("white", 2);
    scene.add(ambLight);

    const pointLight = new THREE.PointLight("white", 10, 0, 0);
    pointLight.position.set(0, 30, 0);
    scene.add(pointLight);
}

function testArena(scene) {
    const cornerGeo = new THREE.CylinderGeometry(5,5,50)
    const cornerMat = new THREE.MeshPhongMaterial({color: "grey"})
    const cornerPos = [
        [30,20,30],
        [-30,20,30],
        [30,20,-30],
        [-30,20,-30]
    ]
    cornerPos.forEach(pos => {
        const cornerMesh = new THREE.Mesh(cornerGeo, cornerMat)
        cornerMesh.position.set(...pos)
        scene.add(cornerMesh)

        
    });

    
}

function addLatheObject(scene) {
    const points = [];
    points.push(new THREE.Vector2(2, 0));
    points.push(new THREE.Vector2(4, 0.5));
    points.push(new THREE.Vector2(4, 10));
    points.push(new THREE.Vector2(3.5, 11.5));
    points.push(new THREE.Vector2(2.6, 12));

    const latheGeo = new THREE.LatheGeometry(points, 48);
    const latheMat = new THREE.MeshPhongMaterial({ color: "gold" });
    const latheMesh = new THREE.Mesh(latheGeo, latheMat);
    latheMesh.position.set(0, 5, -20);
    scene.add(latheMesh);
    return latheMesh;
}
