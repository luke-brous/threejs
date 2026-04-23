Luke Broussard
4/15/2026
Final Project
CS360
Dr. Sowell

# Final Project: Rocket League lite

For my final project I built a small physics-driven driving playground built with Three.js for rendering and Cannon-es for the physics engine. You control a Rocket League-style car on a large arena floor, with a ball object for collisions.

# Project Draft

I have added the arena to my project. A full three.js + cannon-es physics arena with goals that detect
when the ball has been scored. Transparency has been added to the outside for ease of viewing.
Most of the ramps and curves have been added in threejs but still working on the physics side.

## Files In the irectory

- `main.html`: Standard html setup for three.js, added cannon-es and the debbuger for it.
- `js/main.js`: Initializes scene, camera, renderer, controls, physics world, instances, and animation loop.
- `js/arena.js`: Arena geometry, floor collision body, decorative structures, and scene lighting.
- `js/car.js`: Vehicle physics (raycast vehicle + controls) and GLTF-based car/wheel visuals (fennec).
- `js/ball.js`: Dynamic sphere body and synced GLTF ball visual (rocket league ball).
- `images/fennec.glb`: Car model.
- `images/ball.glb`: Ball model.
- `images/fennec_stock.png`: Car reference image/asset.
- `styles.css`: Basic typography and key overlay styling.

## Core Features

- Drivable 4-wheel vehicle with acceleration, reverse, steering, braking, and jump impulse.
- Real-time rigid-body simulation with gravity and fixed-step world updates.
- Dynamic physics ball that collides with the car and floor.
- Large arena bounded with physics all around
- Interactive goals that process when the ball
is scored
- Orbit camera controls for free viewing during gameplay.
- Optional physics debug visualization (`cannon-es-debugger`) for collision shape inspection.
    - Can be seen as the green wire frime around some of the physics objects

## Physics System

### Engine and Update Model

- Physics uses `cannon-es` with gravity set to `(0, -9.82, 0)` in `js/main.js`.
- Simulation advances using `world.fixedStep()` each animation frame.
- Visual meshes are explicitly synced to physics transforms every frame using copies of the (`position` + `quaternion`).

Why this matters:
- Fixed-step integration keeps vehicle behavior more stable than variable frame-based stepping.
- Decoupled visual/physics state makes collisions authoritative in Cannon while Three.js mirrors results.

### Vehicle Physics (`js/car.js`)

The car is implemented with `CANNON.RaycastVehicle`:

- Chassis body:
	- Main box collider + raised cabin box collider.
	- Mass: `100`.
- Wheels:
	- 4 raycast wheels, radius `0.5`.
	- Suspension stiffness, damping, travel, and max force are configured for arcade-like response.
	- Steering is applied to front wheels; engine force is applied to rear wheels.
 	- **Suspension Rays:** The chassis shoots four invisible "lasers" (rays) downward.
	- **Spring Simulation:** The engine calculates the distance to the floor and applies a counter-force to the chassis to simulate springs and shocks.
	- **Impulse Logic:** The **Jump** is handled via an `applyImpulse` command, which provides an instantaneous burst of momentum to the center of the `chassisBody`.
- Controls:
	- `W` / `ArrowUp`: forward engine force.
	- `S` / `ArrowDown`: reverse engine force.
	- `A` / `ArrowLeft` and `D` / `ArrowRight`: steering left and right respectively.
	- `B`: braking force on all wheels.
	- `Space`: upward impulse jump on chassis.

- Wheel Parameters:
| Parameter | Function | Effect |
| :--- | :--- | :--- |
| **`radius`** | Physical radius of the wheel | Determines the car's ride height. |
| **`suspensionStiffness`** | Spring tension | High = Race car handling; Low = Bouncy truck. |
| **`suspensionRestLength`** | Natural spring state | How high the car sits when stationary. |
| **`maxSuspensionTravel`** | Compression limit | How far the wheel can move up before hitting the frame. |
| **`dampingRelaxation`** | Rebound resistance | Prevents the car from oscillating after a jump. |
| **`dampingCompression`** | Compression resistance | Absorbs the initial impact of a heavy landing. |
| **`frictionSlip`** | Tire grip | Controls traction; lower values allow for drifting. |
| **`rollInfluence`** | Body lean | Set low to prevent the car from flipping during turns. |
### Ball Physics (`js/ball.js`)


Physics behavior highlights:
- The ball acts as a lightweight collision target to test momentum transfer and impact response with the car.
- The ball carries the same proportions to the car
as in Rocket League

### Arena Collision (`js/arena.js`)

- Visual floor: `THREE.PlaneGeometry(width, height)` rotated flat.
- Physics floor: static `CANNON.Box(width/2, 5, height/2)` with mass `0`, shifted to `y = -5` so top surface aligns near world `y = 0`.
- Floor has no mass in order to stay static

Physics behavior highlights:
- Thick static floor volume avoids tunneling edge cases better than a mathematically thin plane in many beginner setups.

## Three.js parts

- Scene setup: sky-blue background, optional axis helper toggle (`X`).
- Camera: `PerspectiveCamera(80, aspect, 0.1, 10000)` with `OrbitControls`.
- Renderer: antialiased `WebGLRenderer`, responsive resize handling.
- Lighting: ambient + point light in `arena.js` for model visibility.
- Models: GLTF assets loaded asynchronously and attached to grouped meshes.
- Added meshes to the arena to visualize it as well
as adding transperency for a better scene

## Controls

- `W A S D`: drive + steer
- `Arrow keys`: alternate drive + steer
- `Space`: jump
- `B`: brake
- `R`: reset ball
- `X`: toggle axis helper

## Known Limitations

- Jump has no grounded-state check, so repeated midair impulses may be possible (double jumps should be possible however).
- Car rotations needs to be possible, rotating itself on an axis.
- Other issues are listed at the top of main.js



Running on https://threejs-mocha.vercel.app/