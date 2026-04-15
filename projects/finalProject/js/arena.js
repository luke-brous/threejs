import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const ARENA_CONFIG = {
    // Ratios are trued to match rocket league
    cageWidth: 227,   
    cageLength: 284,  
    cageHeight: 56,   
    wallThickness: 2, 

    rampRadius: 10,
    //  Goal Dimensions
    goalWidth: 50,
    goalHeight: 18,
    goalDepth: 10,    

    // World Floor (The grass outside)
    worldWidth: 1000,
    worldLength: 1000
};

/**
 * @abstract This is the arena which will be the "field" for the car to drive around in.
 * It meshes three.js and cannon-es.js together to create a plane in both the physics world and the rendering world.
 */
export default function arena(scene, world, width, height) {
    
    const arenaBody = arenaPhysics(world, width, height);
    const arenaMesh = arenaVisual(scene, width, height);

    // --- LIGHTS ---
    lights(scene);

    return {
        mesh: arenaMesh,
        body: arenaBody,
        update: function() {}
    };
}

function lights(scene) {
    const ambLight = new THREE.AmbientLight("white", 2);
    scene.add(ambLight);

    const pointLight = new THREE.PointLight("white", 10, 0, 0);
    pointLight.position.set(0, 30, 0);
    pointLight.castShadow = true;   
    scene.add(pointLight);
}

function arenaPhysics(world, width, height) {

    // --- WORLD FLOOR PHYSICS ---
    const floorShape = new CANNON.Box(new CANNON.Vec3(width / 2, 5, height / 2));
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape });
    floorBody.position.y = -5; // Shift down to match y=0
    world.addBody(floorBody);

    // --- LONG SIDE WALLS ---
    const sideWallShape = new CANNON.Box(
        new CANNON.Vec3(
            ARENA_CONFIG.wallThickness / 2,
            ARENA_CONFIG.cageHeight / 2,
            ARENA_CONFIG.cageLength / 2
        )
    );

    const sidewallBody1 = new CANNON.Body({ mass: 0, shape: sideWallShape });
    sidewallBody1.position.set(ARENA_CONFIG.cageWidth / 2, ARENA_CONFIG.cageHeight / 2, 0);
    world.addBody(sidewallBody1);

    const sidewallBody2 = new CANNON.Body({ mass: 0, shape: sideWallShape });
    sidewallBody2.position.set(-ARENA_CONFIG.cageWidth / 2, ARENA_CONFIG.cageHeight / 2, 0);
    world.addBody(sidewallBody2);

    // --- GOAL WALL SIDE POSTS ---
    const postWidth = (ARENA_CONFIG.cageWidth - ARENA_CONFIG.goalWidth) / 2;
    const goalWallShape = new CANNON.Box(
        new CANNON.Vec3(
            postWidth / 2,
            ARENA_CONFIG.cageHeight / 2,
            ARENA_CONFIG.wallThickness / 2
        )
    );

    const goalWall1 = new CANNON.Body({ mass: 0, shape: goalWallShape });
    goalWall1.position.set(ARENA_CONFIG.goalWidth / 2 + postWidth / 2, ARENA_CONFIG.cageHeight / 2, ARENA_CONFIG.cageLength / 2);
    world.addBody(goalWall1);

    const goalWall2 = new CANNON.Body({ mass: 0, shape: goalWallShape });
    goalWall2.position.set(-(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), ARENA_CONFIG.cageHeight / 2, ARENA_CONFIG.cageLength / 2);
    world.addBody(goalWall2);

    const goalWall3 = new CANNON.Body({ mass: 0, shape: goalWallShape });
    goalWall3.position.set(ARENA_CONFIG.goalWidth / 2 + postWidth / 2, ARENA_CONFIG.cageHeight / 2, -ARENA_CONFIG.cageLength / 2);
    world.addBody(goalWall3);

    const goalWall4 = new CANNON.Body({ mass: 0, shape: goalWallShape });
    goalWall4.position.set(-(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), ARENA_CONFIG.cageHeight / 2, -ARENA_CONFIG.cageLength / 2);
    world.addBody(goalWall4);

    // --- GOAL WALL CROSSBARS (Top Pieces) ---
    const topGoalHeight = ARENA_CONFIG.cageHeight - ARENA_CONFIG.goalHeight;
    const topGoalShape = new CANNON.Box(
        new CANNON.Vec3(
            ARENA_CONFIG.goalWidth / 2,
            topGoalHeight / 2,
            ARENA_CONFIG.wallThickness / 2
        )
    );
    
    const topGoalYPos = ARENA_CONFIG.goalHeight + (topGoalHeight / 2);

    const topGoalWall1 = new CANNON.Body({ mass: 0, shape: topGoalShape });
    topGoalWall1.position.set(0, topGoalYPos, ARENA_CONFIG.cageLength / 2);
    world.addBody(topGoalWall1);

    const topGoalWall2 = new CANNON.Body({ mass: 0, shape: topGoalShape });
    topGoalWall2.position.set(0, topGoalYPos, -ARENA_CONFIG.cageLength / 2);
    world.addBody(topGoalWall2);

    // Ceiling
    const ceilingShape = new CANNON.Box(new CANNON.Vec3(ARENA_CONFIG.cageWidth / 2, ARENA_CONFIG.wallThickness, ARENA_CONFIG.cageLength / 2));
    const ceilingBody = new CANNON.Body({ mass: 0, shape: ceilingShape });
    ceilingBody.position.set(0, ARENA_CONFIG.cageHeight + (ARENA_CONFIG.wallThickness / 2), 0);
    world.addBody(ceilingBody);

    return {
        floor: floorBody,
        sidewall1: sidewallBody1,
        sidewall2: sidewallBody2,
        goalWalls: [goalWall1, goalWall2, goalWall3, goalWall4, topGoalWall1, topGoalWall2],
        ceiling: ceilingBody
    };
}

function arenaVisual(scene, width, height) {
    const arenaGroup = new THREE.Group();
    const wallMat = new THREE.MeshPhongMaterial({ color: "#444" });

    // --- WORLD FLOOR VISUAL ---
    const planeGeo = new THREE.PlaneGeometry(width, height, 16, 16);
    const planeMesh = new THREE.Mesh(
        planeGeo, 
        new THREE.MeshPhongMaterial({ color: "green", side: THREE.DoubleSide })
    );
    planeMesh.rotation.x = -Math.PI / 2;
    arenaGroup.add(planeMesh);

    // --- SIDE WALL VISUALS ---
    const sideWallGeo = new THREE.BoxGeometry(
        ARENA_CONFIG.wallThickness, 
        ARENA_CONFIG.cageHeight, 
        ARENA_CONFIG.cageLength
    );

    const sideWall1 = new THREE.Mesh(sideWallGeo, wallMat);
    sideWall1.position.set(ARENA_CONFIG.cageWidth / 2, ARENA_CONFIG.cageHeight / 2, 0);
    arenaGroup.add(sideWall1);

    const sideWall2 = new THREE.Mesh(sideWallGeo, wallMat);
    sideWall2.position.set(-ARENA_CONFIG.cageWidth / 2, ARENA_CONFIG.cageHeight / 2, 0);
    arenaGroup.add(sideWall2);

    // --- SIDE RAMP VISUALS ---
    const rampMat = new THREE.MeshPhongMaterial({ color: "#444", side: THREE.DoubleSide });

    // Right Wall Ramp (Positive X)
    const rightRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageLength, 
        16, 1, true, 
        0, Math.PI / 2 // Sweeps from Floor to Right Wall
    );
    const rightRamp = new THREE.Mesh(rightRampGeo, rampMat);
    rightRamp.rotation.x = Math.PI / 2;
    // Hover the center of the cylinder so the edges touch the floor and wall
    rightRamp.position.set(
        ARENA_CONFIG.cageWidth / 2 - ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        0
    );
    arenaGroup.add(rightRamp);

    // Left Wall Ramp (Negative X)
    const leftRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageLength, 
        16, 1, true, 
        Math.PI * 1.5, Math.PI / 2 // Sweeps from Left Wall to Floor
    );
    const leftRamp = new THREE.Mesh(leftRampGeo, rampMat);
    leftRamp.rotation.x = Math.PI / 2;
    leftRamp.position.set(
        -ARENA_CONFIG.cageWidth / 2 + ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        0
    );
    arenaGroup.add(leftRamp);

    // --- GOAL POST VISUALS ---
    const postWidth = (ARENA_CONFIG.cageWidth - ARENA_CONFIG.goalWidth) / 2;
    const postGeo = new THREE.BoxGeometry(
        postWidth,
        ARENA_CONFIG.cageHeight,
        ARENA_CONFIG.wallThickness
    );

    const post1 = new THREE.Mesh(postGeo, wallMat);
    post1.position.set(ARENA_CONFIG.goalWidth / 2 + postWidth / 2, ARENA_CONFIG.cageHeight / 2, ARENA_CONFIG.cageLength / 2);
    arenaGroup.add(post1);

    const post2 = new THREE.Mesh(postGeo, wallMat);
    post2.position.set(-(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), ARENA_CONFIG.cageHeight / 2, ARENA_CONFIG.cageLength / 2);
    arenaGroup.add(post2);

    const post3 = new THREE.Mesh(postGeo, wallMat);
    post3.position.set(ARENA_CONFIG.goalWidth / 2 + postWidth / 2, ARENA_CONFIG.cageHeight / 2, -ARENA_CONFIG.cageLength / 2);
    arenaGroup.add(post3);

    const post4 = new THREE.Mesh(postGeo, wallMat);
    post4.position.set(-(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), ARENA_CONFIG.cageHeight / 2, -ARENA_CONFIG.cageLength / 2);
    arenaGroup.add(post4);

    // --- GOAL POST RAMPS VISUALS ---
    
    // 1. Geometry for the Positive Z wall (z = 142)
    // Sweeps from the Wall (0) down to the Floor (PI/2)
    const backWallRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, ARENA_CONFIG.rampRadius, postWidth, 
        16, 1, true, 
        0, Math.PI / 2 
    );

    // 2. Geometry for the Negative Z wall (z = -142)
    // Sweeps from the Floor (PI/2) back up to the Wall (PI)
    const frontWallRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, ARENA_CONFIG.rampRadius, postWidth, 
        16, 1, true, 
        Math.PI / 2, Math.PI / 2 
    );

    // Right side of Positive Z Wall
    const goalRamp1 = new THREE.Mesh(backWallRampGeo, rampMat);
    goalRamp1.rotation.z = -Math.PI / 2; // Lay it flat
    goalRamp1.position.set(
        ARENA_CONFIG.goalWidth / 2 + postWidth / 2, 
        ARENA_CONFIG.rampRadius,                    
        ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.rampRadius 
    );
    arenaGroup.add(goalRamp1);

    // Left side of Positive Z Wall
    const goalRamp2 = new THREE.Mesh(backWallRampGeo, rampMat);
    goalRamp2.rotation.z = -Math.PI / 2;
    goalRamp2.position.set(
        -(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.rampRadius
    );
    arenaGroup.add(goalRamp2);

    // Right side of Negative Z Wall
    const goalRamp3 = new THREE.Mesh(frontWallRampGeo, rampMat);
    goalRamp3.rotation.z = -Math.PI / 2;
    goalRamp3.position.set(
        ARENA_CONFIG.goalWidth / 2 + postWidth / 2, 
        ARENA_CONFIG.rampRadius, 
        -ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.rampRadius
    );
    arenaGroup.add(goalRamp3);

    // Left side of Negative Z Wall
    const goalRamp4 = new THREE.Mesh(frontWallRampGeo, rampMat);
    goalRamp4.rotation.z = -Math.PI / 2;
    goalRamp4.position.set(
        -(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), 
        ARENA_CONFIG.rampRadius, 
        -ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.rampRadius
    );
    arenaGroup.add(goalRamp4);


    // --- CROSSBAR VISUALS ---
    const topGoalHeight = ARENA_CONFIG.cageHeight - ARENA_CONFIG.goalHeight;
    const topGoalYPos = ARENA_CONFIG.goalHeight + (topGoalHeight / 2);
    const crossbarGeo = new THREE.BoxGeometry(
        ARENA_CONFIG.goalWidth,
        topGoalHeight,
        ARENA_CONFIG.wallThickness
    );

    const crossbar1 = new THREE.Mesh(crossbarGeo, wallMat);
    crossbar1.position.set(0, topGoalYPos, ARENA_CONFIG.cageLength / 2);
    arenaGroup.add(crossbar1);

    const crossbar2 = new THREE.Mesh(crossbarGeo, wallMat);
    crossbar2.position.set(0, topGoalYPos, -ARENA_CONFIG.cageLength / 2);
    arenaGroup.add(crossbar2);

    // --- CEILING VISUAL ---
    const ceilingGeo = new THREE.BoxGeometry(ARENA_CONFIG.cageWidth, ARENA_CONFIG.wallThickness, ARENA_CONFIG.cageLength);
    const ceilingMesh = new THREE.Mesh(ceilingGeo, wallMat);
    ceilingMesh.position.set(0, ARENA_CONFIG.cageHeight + (ARENA_CONFIG.wallThickness / 2), 0);
    arenaGroup.add(ceilingMesh);

    scene.add(arenaGroup);

    return arenaGroup;
}