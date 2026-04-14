# Arena Construction Goals

## 1. Visual Geometry (Three.js)
* **Wall Ramps (Quarter-Pipes):** Use `THREE.CylinderGeometry` rotated horizontally. Set `thetaLength` to `Math.PI / 2` (90 degrees) to sweep perfectly from the floor up to the vertical wall. Keep `radialSegments` relatively low (e.g., 8 or 16) for physics performance.
* **Corners (The Bowl):** Use `THREE.SphereGeometry`. Adjust `phiLength` and `thetaLength` to slice the sphere into exactly one-eighth. This will plug the gap between the cylindrical wall ramps.

## 2. Physics & Collision (Cannon-es)
* **Trimesh Generation:** Extract the vertices from the Three.js Cylinder and Sphere geometries and pass them directly into `new CANNON.Trimesh()`. This creates an invisible, 1-to-1 physical ramp that perfectly matches the visuals.
* **High-Friction Grip:** Create a `CANNON.Material` for the wheels and one for the arena. Link them via `CANNON.ContactMaterial` and set the friction high so the car's momentum carries it up the wall without sliding.

## 3. Recessed Goal Construction
* **The Doorway:** Instead of one solid back wall, build it using three separate `THREE.BoxGeometry` pieces (a left block, a right block, and a top crossbar) to leave a driveable hole in the center.
* **The Net Box:** Build a 5-sided recessed structure (floor, back wall, two side walls, ceiling) and place it directly behind the doorway hole.
* **The Sensor:** Place an invisible `CANNON.Box` inside the net's volume and set it to `isTrigger = true`. This acts as the sensor to detect when the ball crosses the line.

In the original engine, the field is roughly 86 times longer than the average car. Since your car's total length is 4 units (based on your CANNON.Box half-extent of 2), here are the recommended dimensions for your arena.js:

Length: 344 units (Goal-to-Goal).

Width: 276 units (Sidewall-to-Sidewall).

Height: 70 units (Floor-to-Ceiling).

Goal Width: 62 units (Allows ~15 cars to sit side-by-side).

Goal Height: 22 units (Slightly taller than a double-jump height).

Goal Depth: 18 units (The "recessed" area where the ball is caught).