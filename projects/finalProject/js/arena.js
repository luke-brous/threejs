import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const ARENA_CONFIG = {
    // Ratios are tuned to match rocket league
    cageWidth: 227,   
    cageLength: 284,  
    cageHeight: 56,   
    wallThickness: 2, 

    rampRadius: 10,

    //  Goal Dimensions
    goalWidth: 50,
    goalHeight: 18,
    goalDepth: 34,    

    // World Floor 
    worldWidth: 1000,
    worldLength: 1000
};

/**
 * @abstract This is the arena which will be the "field" for the car to drive around in.
 * It meshes three.js and cannon-es.js together to create a plane in both the physics world and the rendering world.
 */
export default function arena(scene, world, width, height, onGoalScored) {
    
    const arenaBody = arenaPhysics(world, width, height, onGoalScored);
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

function arenaPhysics(world, width, height, onGoalScored) {

    // --- WORLD FLOOR PHYSICS ---
    const floorShape = new CANNON.Box(new CANNON.Vec3(width / 2, 5, height / 2));
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape });
    floorBody.position.y = -5; // Shift down to match y=0
    world.addBody(floorBody);

    const ballMaterial = new CANNON.Material('ball');
    const floorMaterial = new CANNON.Material('floor');
    
    // Rocket League is bouncy but has grip
    const ballFloorContact = new CANNON.ContactMaterial(ballMaterial, floorMaterial, {
        restitution: 0.9, // High bounciness (0 to 1)
        friction: 0.2,    // Just enough so it doesn't slide forever
        contactEquationStiffness: 1e7, // Makes the surface feel "hard"
        contactEquationRelaxation: 3   // Prevents jitter
    });
world.addContactMaterial(ballFloorContact);

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
    const backWallShape = new CANNON.Box(
        new CANNON.Vec3(
            postWidth / 2,
            ARENA_CONFIG.cageHeight / 2,
            ARENA_CONFIG.wallThickness / 2
        )
    );

    const backWall1 = new CANNON.Body({ mass: 0, shape: backWallShape });
    backWall1.position.set(ARENA_CONFIG.goalWidth / 2 + postWidth / 2, ARENA_CONFIG.cageHeight / 2, ARENA_CONFIG.cageLength / 2);
    world.addBody(backWall1);

    const backWall2 = new CANNON.Body({ mass: 0, shape: backWallShape });
    backWall2.position.set(-(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), ARENA_CONFIG.cageHeight / 2, ARENA_CONFIG.cageLength / 2);
    world.addBody(backWall2);

    const backWall3 = new CANNON.Body({ mass: 0, shape: backWallShape });
    backWall3.position.set(ARENA_CONFIG.goalWidth / 2 + postWidth / 2, ARENA_CONFIG.cageHeight / 2, -ARENA_CONFIG.cageLength / 2);
    world.addBody(backWall3);

    const backWall4 = new CANNON.Body({ mass: 0, shape: backWallShape });
    backWall4.position.set(-(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), ARENA_CONFIG.cageHeight / 2, -ARENA_CONFIG.cageLength / 2);
    world.addBody(backWall4);

    // --- Back Wall Pieces ---
    const topGoalHeight = ARENA_CONFIG.cageHeight - ARENA_CONFIG.goalHeight;
    const topGoalWallShape = new CANNON.Box(
        new CANNON.Vec3(
            ARENA_CONFIG.goalWidth / 2,
            topGoalHeight / 2,
            ARENA_CONFIG.wallThickness / 2
        )
    );
    
    const topGoalYPos = ARENA_CONFIG.goalHeight + (topGoalHeight / 2);

    const topGoalWall1 = new CANNON.Body({ mass: 0, shape: topGoalWallShape });
    topGoalWall1.position.set(0, topGoalYPos, ARENA_CONFIG.cageLength / 2);
    world.addBody(topGoalWall1);

    const topGoalWall2 = new CANNON.Body({ mass: 0, shape: topGoalWallShape });
    topGoalWall2.position.set(0, topGoalYPos, -ARENA_CONFIG.cageLength / 2);
    world.addBody(topGoalWall2);

    // --- Ceiling ---
    const ceilingShape = new CANNON.Box(new CANNON.Vec3(ARENA_CONFIG.cageWidth / 2, ARENA_CONFIG.wallThickness, ARENA_CONFIG.cageLength / 2));
    const ceilingBody = new CANNON.Body({ mass: 0, shape: ceilingShape });
    ceilingBody.position.set(0, ARENA_CONFIG.cageHeight + (ARENA_CONFIG.wallThickness / 2), 0);
    world.addBody(ceilingBody);


    // --- Goal Pieces --- 
    const backGoalShape = new CANNON.Box(
        new CANNON.Vec3(
            ARENA_CONFIG.goalWidth / 2,
            ARENA_CONFIG.goalHeight / 2,
            ARENA_CONFIG.wallThickness / 2
        )
    );

    const topGoalShape = new CANNON.Box(
        new CANNON.Vec3(
            ARENA_CONFIG.goalWidth / 2,
            ARENA_CONFIG.wallThickness / 2,
            ARENA_CONFIG.goalDepth / 4
        )
    );

    const sideGoalShape = new CANNON.Box(
        new CANNON.Vec3(
            ARENA_CONFIG.wallThickness / 2,
            ARENA_CONFIG.goalHeight / 2,
            ARENA_CONFIG.goalDepth / 4
        )
    );

    const sideGoalWall1 = new CANNON.Body({ mass: 0, shape: sideGoalShape });
    sideGoalWall1.position.set(
        ARENA_CONFIG.goalWidth / 2 + ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.goalHeight / 2, 
        ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.goalDepth / 4);
    world.addBody(sideGoalWall1);

    const sideGoalWall2 = new CANNON.Body({ mass: 0, shape: sideGoalShape });
    sideGoalWall2.position.set(
        -ARENA_CONFIG.goalWidth / 2 - ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.goalHeight / 2, 
        ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.goalDepth / 4);
    world.addBody(sideGoalWall2);

    const sideGoalWall3 = new CANNON.Body({ mass: 0, shape: sideGoalShape });
    sideGoalWall3.position.set(
        ARENA_CONFIG.goalWidth / 2 + ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.goalHeight / 2, 
        -ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.goalDepth / 4);
    world.addBody(sideGoalWall3);

    const sideGoalWall4 = new CANNON.Body({ mass: 0, shape: sideGoalShape });
    sideGoalWall4.position.set(
        -ARENA_CONFIG.goalWidth / 2 - ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.goalHeight / 2, 
        -ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.goalDepth / 4);
    world.addBody(sideGoalWall4);

    const topGoalBody1 = new CANNON.Body({ mass: 0, shape: topGoalShape });
    topGoalBody1.position.set(
        0, 
        ARENA_CONFIG.goalHeight + ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.cageLength / 2 + (ARENA_CONFIG.goalDepth / 4));
    world.addBody(topGoalBody1);

    const topGoalBody2 = new CANNON.Body({ mass: 0, shape: topGoalShape });
    topGoalBody2.position.set(
        0, 
        ARENA_CONFIG.goalHeight + (ARENA_CONFIG.wallThickness / 2), 
        -ARENA_CONFIG.cageLength / 2 - (ARENA_CONFIG.goalDepth / 4));
    world.addBody(topGoalBody2);


    const backGoalBody1 = new CANNON.Body({ mass: 0, shape: backGoalShape });
    backGoalBody1.position.set(0, ARENA_CONFIG.goalHeight / 2, ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.goalDepth / 2);
    world.addBody(backGoalBody1);


    const backGoalBody2 = new CANNON.Body({ mass: 0, shape: backGoalShape });
    backGoalBody2.position.set(0, ARENA_CONFIG.goalHeight / 2, -ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.goalDepth / 2);
    world.addBody(backGoalBody2);

    // --- Goal Sensor ---
    const goalSensorShape = new CANNON.Box(
        new CANNON.Vec3(
            ARENA_CONFIG.goalWidth / 2,
            ARENA_CONFIG.goalHeight / 2,
            ARENA_CONFIG.goalDepth / 4
        )
    );
    const goalSensorBody1 = new CANNON.Body({ mass: 0, shape: goalSensorShape, type: CANNON.Body.KINEMATIC });
    goalSensorBody1.position.set(0, ARENA_CONFIG.goalHeight / 2, ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.goalDepth / 4);
    goalSensorBody1.collisionResponse = false; // Blocks collision and triggers event only
    world.addBody(goalSensorBody1);

    const goalSensorBody2 = new CANNON.Body({ mass: 0, shape: goalSensorShape, type: CANNON.Body.KINEMATIC });
    goalSensorBody2.position.set(0, ARENA_CONFIG.goalHeight / 2, -ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.goalDepth / 4);
    goalSensorBody2.collisionResponse = false;
    world.addBody(goalSensorBody2);

    const goalSensors = [goalSensorBody1, goalSensorBody2];

    // Event listeners for goal scoring for both teams
    goalSensorBody2.addEventListener('collide', (event) => {
        if (event.body.name === 'ball') { 
            console.log("GOAL SCORED!");
            if (onGoalScored) {
                onGoalScored('blue'); // Call the function w the scoring team
            }

        }
    });

    goalSensorBody1.addEventListener('collide', (event) => {
        if (event.body.name === 'ball') { 
            console.log("GOAL SCORED!");
            if (onGoalScored) {   
                onGoalScored('orange'); 
            }
        }
    });

    return {
        floor: floorBody,
        sidewall1: sidewallBody1,
        sidewall2: sidewallBody2,
        goalWalls: [backWall1, backWall2, backWall3, backWall4, topGoalWall1, topGoalWall2],
        ceiling: ceilingBody,
        goalSensors: [goalSensorBody1, goalSensorBody2]

    };
}

function arenaVisual(scene, width, height) {
    const arenaGroup = new THREE.Group();
    const wallMat = new THREE.MeshPhongMaterial({ color: "#444", side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

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
    const rampMat = new THREE.MeshPhongMaterial({ color: "#444", side: THREE.DoubleSide, transparent: true, opacity: 0.8 });

    // Right Wall Ramp (+X direction)
    const rightRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageLength, 
        16, 1, true, 
        0, Math.PI / 2 // Theta sweeps from the floor to the wall
    );
    const rightRamp = new THREE.Mesh(rightRampGeo, rampMat);
    rightRamp.rotation.x = Math.PI / 2;
    rightRamp.position.set(
        ARENA_CONFIG.cageWidth / 2 - ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        0
    );
    arenaGroup.add(rightRamp);

    const topRightRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageLength, 
        16, 1, true, 
        Math.PI / 2, Math.PI / 2 // sweeps from Right Wall to Ceiling
    );
    const topRightRamp = new THREE.Mesh(topRightRampGeo, rampMat);
    topRightRamp.rotation.x = Math.PI / 2;
    topRightRamp.position.set(
        ARENA_CONFIG.cageWidth / 2 - ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageHeight - ARENA_CONFIG.rampRadius, 
        0
    );
    arenaGroup.add(topRightRamp);

    // Left Wall Ramp (+X direction)
    const leftRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageLength, 
        16, 1, true, 
        Math.PI * 1.5, Math.PI / 2 // sweeps from floor to left wall
    );
    const leftRamp = new THREE.Mesh(leftRampGeo, rampMat);
    leftRamp.rotation.x = Math.PI / 2;
    leftRamp.position.set(
        -ARENA_CONFIG.cageWidth / 2 + ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        0
    );
    arenaGroup.add(leftRamp);

    const topLeftRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageLength, 
        16, 1, true, 
        -Math.PI / 2, -Math.PI / 2 // Sweeps from Right Wall to Ceiling
    );

    const topLeftRamp = new THREE.Mesh(topLeftRampGeo, rampMat);
    topLeftRamp.rotation.x = Math.PI / 2;
    topLeftRamp.position.set(
        -ARENA_CONFIG.cageWidth / 2 + ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageHeight - ARENA_CONFIG.rampRadius, 
        0
    );
    arenaGroup.add(topLeftRamp);

    // --- CORNER RAMP VISUALS (Vertical Cylinders) ---
    const cornerRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageHeight, 
        16, 1, true, 
        0, Math.PI / 2 // Sweeps 90 degrees
    );
    
    // Front-Right Corner Ramp (+X, +Z)
    const frCornerRamp = new THREE.Mesh(cornerRampGeo, rampMat);
    frCornerRamp.rotation.y = 0; // Sweeps from Right Wall (+X) to Front Wall (+Z)
    frCornerRamp.position.set(
        ARENA_CONFIG.cageWidth / 2 - ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageHeight / 2, 
        ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.rampRadius
    );
    frCornerRamp.frustumCulled = false; // Prevents disappearing when close
    arenaGroup.add(frCornerRamp);
    
    // Front-Left Corner Ramp (-X, +Z)
    const flCornerRamp = new THREE.Mesh(cornerRampGeo, rampMat);
    flCornerRamp.rotation.y = Math.PI / 2; // Sweeps from Front Wall (+Z) to Left Wall (-X)
    flCornerRamp.position.set(
        -ARENA_CONFIG.cageWidth / 2 + ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageHeight / 2, 
        ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.rampRadius
    );
    flCornerRamp.frustumCulled = false;
    arenaGroup.add(flCornerRamp);
    
    // Back-Left Corner Ramp (-X, -Z)
    const blCornerRamp = new THREE.Mesh(cornerRampGeo, rampMat);
    blCornerRamp.rotation.y = Math.PI; // Sweeps from Left Wall (-X) to Back Wall (-Z)
    blCornerRamp.position.set(
        -ARENA_CONFIG.cageWidth / 2 + ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageHeight / 2, 
        -ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.rampRadius
    );
    blCornerRamp.frustumCulled = false;
    arenaGroup.add(blCornerRamp);
    
    // Back-Right Corner Ramp (+X, -Z)
    const brCornerRamp = new THREE.Mesh(cornerRampGeo, rampMat);
    brCornerRamp.rotation.y = Math.PI * 1.5; // Sweeps from Back Wall (-Z) to Right Wall (+X)
    brCornerRamp.position.set(
        ARENA_CONFIG.cageWidth / 2 - ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageHeight / 2, 
        -ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.rampRadius
    );
    brCornerRamp.frustumCulled = false;
    arenaGroup.add(brCornerRamp);


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

    // --- Back Wall visuals ---
    
    const backWallRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, ARENA_CONFIG.rampRadius, postWidth, 
        16, 1, true, 
        0, Math.PI / 2 
    );

    const frontWallRampGeo = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, ARENA_CONFIG.rampRadius, postWidth, 
        16, 1, true, 
        Math.PI / 2, Math.PI / 2 
    );

    // Right side of Positive z Wall
    const goalRamp1 = new THREE.Mesh(backWallRampGeo, rampMat);
    goalRamp1.rotation.z = -Math.PI / 2; // Lay it flat
    goalRamp1.position.set(
        ARENA_CONFIG.goalWidth / 2 + postWidth / 2, 
        ARENA_CONFIG.rampRadius,                    
        ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.rampRadius 
    );
    arenaGroup.add(goalRamp1);

    // Left side of Positive z Wall
    const goalRamp2 = new THREE.Mesh(backWallRampGeo, rampMat);
    goalRamp2.rotation.z = -Math.PI / 2;
    goalRamp2.position.set(
        -(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), 
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.rampRadius
    );
    arenaGroup.add(goalRamp2);

    // Right side of Negative z Wall
    const goalRamp3 = new THREE.Mesh(frontWallRampGeo, rampMat);
    goalRamp3.rotation.z = -Math.PI / 2;
    goalRamp3.position.set(
        ARENA_CONFIG.goalWidth / 2 + postWidth / 2, 
        ARENA_CONFIG.rampRadius, 
        -ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.rampRadius
    );
    arenaGroup.add(goalRamp3);

    // Left side of Negative z Wall
    const goalRamp4 = new THREE.Mesh(frontWallRampGeo, rampMat);
    goalRamp4.rotation.z = -Math.PI / 2;
    goalRamp4.position.set(
        -(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), 
        ARENA_CONFIG.rampRadius, 
        -ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.rampRadius
    );
    arenaGroup.add(goalRamp4);

    const topGoalWallRampGeo1 = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius,
        ARENA_CONFIG.cageWidth,
        16, 1, true,
        0, Math.PI / 2 
    );

    const topGoalWallRamp1 = new THREE.Mesh(topGoalWallRampGeo1, rampMat);
    topGoalWallRamp1.rotation.z = Math.PI / 2;
    topGoalWallRamp1.position.set(
        0, 
        ARENA_CONFIG.cageHeight - ARENA_CONFIG.rampRadius,
        ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.rampRadius 

    );
    arenaGroup.add(topGoalWallRamp1);

    const topGoalWallRampGeo2 = new THREE.CylinderGeometry(
        ARENA_CONFIG.rampRadius, 
        ARENA_CONFIG.rampRadius,
        ARENA_CONFIG.cageWidth,
        16, 1, true,
        Math.PI / 2, Math.PI / 2 
    );

    const topGoalWallRamp2 = new THREE.Mesh(topGoalWallRampGeo2, rampMat);
    topGoalWallRamp2.rotation.z = Math.PI / 2;
    topGoalWallRamp2.position.set(
        0, 
        ARENA_CONFIG.cageHeight - ARENA_CONFIG.rampRadius,
        -ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.rampRadius
    );
    arenaGroup.add(topGoalWallRamp2);


    // --- crossbar visuals (piece right above the goal) ---
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

    // --- Goal Meshes (matching the physics again) ---
    const orangeNetMat = new THREE.MeshPhongMaterial({ color: "orange" });
    const blueNetMat = new THREE.MeshPhongMaterial({ color: "blue" });

    // Geometries matching the physics shapes exactly (using full dimensions, not half-extents like the physics)
    const sideGoalGeo = new THREE.BoxGeometry(
        ARENA_CONFIG.wallThickness,
        ARENA_CONFIG.goalHeight,
        ARENA_CONFIG.goalDepth / 2
    );

    const topGoalGeo = new THREE.BoxGeometry(
        ARENA_CONFIG.goalWidth,
        ARENA_CONFIG.wallThickness,
        ARENA_CONFIG.goalDepth / 2 
    );

    const backGoalGeo = new THREE.BoxGeometry(
        ARENA_CONFIG.goalWidth,
        ARENA_CONFIG.goalHeight,
        ARENA_CONFIG.wallThickness 
    );

    // Use the depth and width from the physics
    const depthOffset = ARENA_CONFIG.goalDepth / 4;
    const widthOffset = ARENA_CONFIG.goalWidth / 2 + ARENA_CONFIG.wallThickness / 2;

    // --- Positive Z Goal (Blue Side) ---
    const posZ = ARENA_CONFIG.cageLength / 2;

    const netSide1 = new THREE.Mesh(sideGoalGeo, blueNetMat);
    netSide1.position.set(widthOffset, ARENA_CONFIG.goalHeight / 2, posZ + depthOffset);
    arenaGroup.add(netSide1);

    const netSide2 = new THREE.Mesh(sideGoalGeo, blueNetMat);
    netSide2.position.set(-widthOffset, ARENA_CONFIG.goalHeight / 2, posZ + depthOffset);
    arenaGroup.add(netSide2);

    const netTop1 = new THREE.Mesh(topGoalGeo, blueNetMat);
    netTop1.position.set(0, ARENA_CONFIG.goalHeight + ARENA_CONFIG.wallThickness / 2, posZ + depthOffset);
    arenaGroup.add(netTop1);

    const netBack1 = new THREE.Mesh(backGoalGeo, blueNetMat);
    netBack1.position.set(0, ARENA_CONFIG.goalHeight / 2, posZ + ARENA_CONFIG.goalDepth / 2);
    arenaGroup.add(netBack1);

    // --- Negative Z Goal (Orange Side) ---
    const negZ = -ARENA_CONFIG.cageLength / 2;

    const netSide3 = new THREE.Mesh(sideGoalGeo, orangeNetMat);
    netSide3.position.set(widthOffset, ARENA_CONFIG.goalHeight / 2, negZ - depthOffset);
    arenaGroup.add(netSide3);

    const netSide4 = new THREE.Mesh(sideGoalGeo, orangeNetMat);
    netSide4.position.set(-widthOffset, ARENA_CONFIG.goalHeight / 2, negZ - depthOffset);
    arenaGroup.add(netSide4);

    const netTop2 = new THREE.Mesh(topGoalGeo, orangeNetMat);
    netTop2.position.set(0, ARENA_CONFIG.goalHeight + ARENA_CONFIG.wallThickness / 2, negZ - depthOffset);
    arenaGroup.add(netTop2);

    const netBack2 = new THREE.Mesh(backGoalGeo, orangeNetMat);
    netBack2.position.set(0, ARENA_CONFIG.goalHeight / 2, negZ - ARENA_CONFIG.goalDepth / 2);
    arenaGroup.add(netBack2);

    scene.add(arenaGroup);

    return arenaGroup;
}

