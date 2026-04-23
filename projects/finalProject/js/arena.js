/**
 * @luke-brous
 * @abstract This is the arena, the "field" where the car drives and hits the ball into goals.
 * It integrates Three.js for rendering and Cannon-es for physics simulation, creating a cohesive 3D environment.
 * Three.js and Cannon-es are both used in this file.
 */

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

const PHYSICS_TUNING = {
    ballArenaContact: {
        restitution: 0.82,
        friction: 0.16,
        contactEquationStiffness: 1e7,
        contactEquationRelaxation: 3
    }
};

const VISUALS_CONFIG = {
    stands: {
        edgeOffset: 16,
        levels: 6,
        levelHeight: 4.5,
        sideSpan: ARENA_CONFIG.cageLength * 0.95,
        endSpan: ARENA_CONFIG.cageWidth * 0.95,
        baseDepth: 48,
        spacing: 2.8
    },
    crowd: {
        cols: 34,
        rows: 8,
        sideJitter: 0.6,
        endJitter: 0.6
    },
    skyboxSize: 3000
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
    // ambient light for general lighting
    const ambLight = new THREE.AmbientLight("white", 0.6);
    scene.add(ambLight);

    const sunLight = new THREE.DirectionalLight("#fff6df", 2.0);
    sunLight.position.set(100, 200, 100);
    sunLight.castShadow = true;
    
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    sunLight.shadow.camera.far = 1000;
    
    sunLight.shadow.bias = -0.001; 
    sunLight.shadow.mapSize.set(2048, 2048);
    scene.add(sunLight);

    const centerTarget = new THREE.Object3D();
    centerTarget.position.set(0, 0, 0);
    scene.add(centerTarget);
    sunLight.target = centerTarget;

    const cornerX = ARENA_CONFIG.cageWidth / 2;
    const cornerY = ARENA_CONFIG.cageHeight + 20; 
    const cornerZ = ARENA_CONFIG.cageLength / 2;

    const cornerPositions = [
        [cornerX, cornerY, cornerZ],
        [-cornerX, cornerY, cornerZ],
        [cornerX, cornerY, -cornerZ],
        [-cornerX, cornerY, -cornerZ]
    ];

    cornerPositions.forEach(([x, y, z]) => {
        const light = new THREE.SpotLight("#fff6df", 60000); 
        light.position.set(x, y, z);
        light.angle = Math.PI / 4;
        light.penumbra = 0.5;
        light.decay = 2;
        light.distance = 500;
        light.target = centerTarget;

        light.castShadow = false; 

        scene.add(light);
    });
}

/**
 * @function arenaPhysics, which creates the physics bodies for the arena (floor, walls, goals, ramps) and adds them to the Cannon-es world.
 * It also sets up collision detection for goal scoring.
 * @param {CANNON.World} world - The Cannon-es physics world.
 * @param {number} width - The width of the arena.
 * @param {number} height - The height of the arena.
 * @param {function(string): void} onGoalScored - Callback function invoked when a goal is scored, receiving the scoring team as an argument.
 * @returns {object} An object containing references to the created physics bodies.
 */
function arenaPhysics(world, width, height, onGoalScored) {

    // --- WORLD FLOOR PHYSICS ---
    const ballMaterial = new CANNON.Material('ball');
    const arenaMaterial = new CANNON.Material('arena');
    world.ballMaterial = ballMaterial;

    const ballArenaContact = new CANNON.ContactMaterial(ballMaterial, arenaMaterial, PHYSICS_TUNING.ballArenaContact);
    world.addContactMaterial(ballArenaContact);

    const floorShape = new CANNON.Box(new CANNON.Vec3(width / 2, 5, height / 2));
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape });
    floorBody.material = arenaMaterial;
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
    sidewallBody1.material = arenaMaterial;
    sidewallBody1.position.set(ARENA_CONFIG.cageWidth / 2, ARENA_CONFIG.cageHeight / 2, 0);
    world.addBody(sidewallBody1);

    const sidewallBody2 = new CANNON.Body({ mass: 0, shape: sideWallShape });
    sidewallBody2.material = arenaMaterial;
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
    backWall1.material = arenaMaterial;
    backWall1.position.set(ARENA_CONFIG.goalWidth / 2 + postWidth / 2, ARENA_CONFIG.cageHeight / 2, ARENA_CONFIG.cageLength / 2);
    world.addBody(backWall1);

    const backWall2 = new CANNON.Body({ mass: 0, shape: backWallShape });
    backWall2.material = arenaMaterial;
    backWall2.position.set(-(ARENA_CONFIG.goalWidth / 2 + postWidth / 2), ARENA_CONFIG.cageHeight / 2, ARENA_CONFIG.cageLength / 2);
    world.addBody(backWall2);

    const backWall3 = new CANNON.Body({ mass: 0, shape: backWallShape });
    backWall3.material = arenaMaterial;
    backWall3.position.set(ARENA_CONFIG.goalWidth / 2 + postWidth / 2, ARENA_CONFIG.cageHeight / 2, -ARENA_CONFIG.cageLength / 2);
    world.addBody(backWall3);

    const backWall4 = new CANNON.Body({ mass: 0, shape: backWallShape });
    backWall4.material = arenaMaterial;
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
    topGoalWall1.material = arenaMaterial;
    topGoalWall1.position.set(0, topGoalYPos, ARENA_CONFIG.cageLength / 2);
    world.addBody(topGoalWall1);

    const topGoalWall2 = new CANNON.Body({ mass: 0, shape: topGoalWallShape });
    topGoalWall2.material = arenaMaterial;
    topGoalWall2.position.set(0, topGoalYPos, -ARENA_CONFIG.cageLength / 2);
    world.addBody(topGoalWall2);

    // --- Ceiling ---
    const ceilingShape = new CANNON.Box(new CANNON.Vec3(ARENA_CONFIG.cageWidth / 2, ARENA_CONFIG.wallThickness, ARENA_CONFIG.cageLength / 2));
    const ceilingBody = new CANNON.Body({ mass: 0, shape: ceilingShape });
    ceilingBody.material = arenaMaterial;
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
    sideGoalWall1.material = arenaMaterial;
    sideGoalWall1.position.set(
        ARENA_CONFIG.goalWidth / 2 + ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.goalHeight / 2, 
        ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.goalDepth / 4);
    world.addBody(sideGoalWall1);

    const sideGoalWall2 = new CANNON.Body({ mass: 0, shape: sideGoalShape });
    sideGoalWall2.material = arenaMaterial;
    sideGoalWall2.position.set(
        -ARENA_CONFIG.goalWidth / 2 - ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.goalHeight / 2, 
        ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.goalDepth / 4);
    world.addBody(sideGoalWall2);

    const sideGoalWall3 = new CANNON.Body({ mass: 0, shape: sideGoalShape });
    sideGoalWall3.material = arenaMaterial;
    sideGoalWall3.position.set(
        ARENA_CONFIG.goalWidth / 2 + ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.goalHeight / 2, 
        -ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.goalDepth / 4);
    world.addBody(sideGoalWall3);

    const sideGoalWall4 = new CANNON.Body({ mass: 0, shape: sideGoalShape });
    sideGoalWall4.material = arenaMaterial;
    sideGoalWall4.position.set(
        -ARENA_CONFIG.goalWidth / 2 - ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.goalHeight / 2, 
        -ARENA_CONFIG.cageLength / 2 - ARENA_CONFIG.goalDepth / 4);
    world.addBody(sideGoalWall4);

    const topGoalBody1 = new CANNON.Body({ mass: 0, shape: topGoalShape });
    topGoalBody1.material = arenaMaterial;
    topGoalBody1.position.set(
        0, 
        ARENA_CONFIG.goalHeight + ARENA_CONFIG.wallThickness / 2, 
        ARENA_CONFIG.cageLength / 2 + (ARENA_CONFIG.goalDepth / 4));
    world.addBody(topGoalBody1);

    const topGoalBody2 = new CANNON.Body({ mass: 0, shape: topGoalShape });
    topGoalBody2.material = arenaMaterial;
    topGoalBody2.position.set(
        0, 
        ARENA_CONFIG.goalHeight + (ARENA_CONFIG.wallThickness / 2), 
        -ARENA_CONFIG.cageLength / 2 - (ARENA_CONFIG.goalDepth / 4));
    world.addBody(topGoalBody2);


    const backGoalBody1 = new CANNON.Body({ mass: 0, shape: backGoalShape });
    backGoalBody1.material = arenaMaterial;
    backGoalBody1.position.set(0, ARENA_CONFIG.goalHeight / 2, ARENA_CONFIG.cageLength / 2 + ARENA_CONFIG.goalDepth / 2);
    world.addBody(backGoalBody1);


    const backGoalBody2 = new CANNON.Body({ mass: 0, shape: backGoalShape });
    backGoalBody2.material = arenaMaterial;
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
    goalSensorBody2.collisionResponse = false; // Blocks collision and triggers event only
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

/**
 * @function arenaVisual, which creates the visual meshes for the arena (floor, walls, goals, ramps, skybox, stands, crowd) and adds them to the Three.js scene.
 * @param {THREE.Scene} scene - The Three.js scene.
 * @param {number} width - The width of the arena.
 * @param {number} height - The height of the arena.
 * @returns {THREE.Group} A Three.js group containing all the visual components of the arena.
 */
function arenaVisual(scene, width, height) {
    const arenaGroup = new THREE.Group();
    const skybox = createSkybox();
    const wallMat = new THREE.MeshPhongMaterial({ color: "#444", side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    scene.add(skybox);

    // --- WORLD FLOOR VISUAL ---
    const planeGeo = new THREE.PlaneGeometry(width, height, 16, 16);
    const planeMesh = new THREE.Mesh(
        planeGeo, 
        new THREE.MeshPhongMaterial({ color: "green", side: THREE.DoubleSide })
    );
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.receiveShadow = true;
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

    addStandsAndCrowd(arenaGroup);

    scene.add(arenaGroup);

    return arenaGroup;
}

function createSkybox() {
    const size = VISUALS_CONFIG.skyboxSize;
    const skyGeo = new THREE.BoxGeometry(size, size, size);
    const skyMats = [
        new THREE.MeshBasicMaterial({ color: "#7fb2ff", side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: "#7fb2ff", side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: "#9fd2ff", side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: "#4f74c7", side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: "#6f97ec", side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: "#6f97ec", side: THREE.BackSide })
    ];
    const skybox = new THREE.Mesh(skyGeo, skyMats);
    skybox.name = 'skybox';
    return skybox;
}
function addStandsAndCrowd(scene) {
    const eggColors = [
        "#fff5d1", "#ffd7a8", "#f2f2f2",
        "#ff6b6b", "#4ecdc4", "#45b7d1",
        "#96ceb4", "#ffeead", "#d4a5a5"
    ];

    const distanceBuffer = 25; 
    const offsetW = ARENA_CONFIG.cageWidth / 2 + distanceBuffer;
    const offsetL = ARENA_CONFIG.cageLength / 2 + distanceBuffer;

    const standConfigs = [
        { x:  offsetW, z: 0, rot: -Math.PI / 2, length: ARENA_CONFIG.cageLength + 40 }, 
        { x: -offsetW, z: 0, rot:  Math.PI / 2, length: ARENA_CONFIG.cageLength + 40 }, 
        { x: 0, z:  offsetL, rot:  Math.PI,      length: ARENA_CONFIG.cageWidth + 40 },       
        { x: 0, z: -offsetL, rot:  0,            length: ARENA_CONFIG.cageWidth + 40 }            
    ];

    standConfigs.forEach(config => {
        const standGroup = createStands(config.length, "#4a4e59", eggColors);
        standGroup.position.set(config.x, 0, config.z);
        standGroup.rotation.y = config.rot;
        scene.add(standGroup);
    });
}

function createStands(width, standColor, eggColors) {
    const standGroup = new THREE.Group();

    const levels = 10;
    const stepDepth = 5;
    const stepHeight = 3.0;

    for (let i = 0; i < levels; i++) {
        const boxGeo = new THREE.BoxGeometry(width, stepHeight, stepDepth);
        const boxMat = new THREE.MeshPhongMaterial({ color: standColor });
        const step = new THREE.Mesh(boxGeo, boxMat);

        step.position.y = (i + 0.5) * stepHeight;
        step.position.z = -i * stepDepth;
        step.castShadow = true;
        step.receiveShadow = true;
        standGroup.add(step);


        const eggSpacing = 7;
        const eggCount = Math.floor(width / eggSpacing); 

        for (let j = 0; j < eggCount - 2; j++) {
            const randomColor = eggColors[Math.floor(Math.random() * eggColors.length)];
            const egg = createBasicEgg(randomColor);
            
            egg.position.x = (j * eggSpacing) - (width / 2) + 10;
            egg.position.y = step.position.y + (stepHeight / 2) + 1.5;
            egg.position.z = step.position.z;
            
            egg.rotation.y = (Math.random() - 0.5) * 0.5;
            
            standGroup.add(egg);
        }
    }
    return standGroup;
}

function createBasicEgg(color) {
    const geo = new THREE.SphereGeometry(0.8, 16, 16);
    const mat = new THREE.MeshPhongMaterial({ color: color });
    const egg = new THREE.Mesh(geo, mat);
    
    egg.scale.set(2, 2.5, 2); 
    egg.castShadow = true;
    return egg;
}