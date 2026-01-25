# Exercise:  Build a Town

Build a town with three "houses" in it. This grid is 12x12:

![](./images/town-layout-grid.png)

Recall how to create a barn:

```js
const house1 = TW.createMesh( TW.barnGeometry(20,30,40) );
scene.add(house1);
```

Hints:
- decide what units you will use
- adjust the bounding box's dimensions for the "ground" (the xz plane)
- the "g" key will toggle the green "ground" on/off

Your finished town might look like:

![](./images/townOne.png)

## Add a Tree
Next, add a tree, using [THREE.ConeGeometry](https://threejs.org/docs/#api/en/geometries/ConeGeometry) and [THREE.CylinderGeometry](https://threejs.org/docs/#api/en/geometries/CylinderGeometry)

- figure out what (X,Z) coordinates the cone and cylinder will have
- decide on a height and radius for the parts
- figure out the Y coordinate for the cylinder (trunk) and cone (foliage) so that they *stack*; that will depend on the heights of the parts

Your solution might look like

![](./images/townTree.png)

## Add Some Snowy Ground
Now, add some whitish ground to look snowy, using [THREE.PlaneGeometry](https://threejs.org/docs/index.html?q=plane#api/en/geometries/PlaneGeometry)

![](./images/townSnow1.png)
![](./images/townSnow2.png)