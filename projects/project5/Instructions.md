# Project 5: Textured Barn

The emphasis in this assignment is working with textures. It's not
primarily about geometry. You may decide to modify the texture
coordinates, which live in the geometry, or you might not. (I did
not.) Also, it uses material and lighting, but keep this part
simple. It's also not about cameras, so feel free to use
`TW.cameraSetup()`.

Here's the goal, a barn with siding and roofing, which I'm calling a
textured barn.

[solution](https://rtsowell.sewanee.edu/courses/cs360/threejs/demos/texbarn/main.html)

Note the modes that the GUI makes available:

- `uv` helps to explain how the default texture coordinates are assigned.
- `lighting` puts white Phong material on the barn, so you can see the lighting effects. Definitely pay attention to this.
- `final` is, of course, the desired product

These modes will help you understand where the faces are and how the textures
are arranged (at least initially), though you have control of the texture
coordinates. You only need to implement the last two modes.

## Getting Started

Create the following geometry, using a function that is defined for you in TW:

```js
// This has 9 faces. Here's the documentation in TW; feel free
// to look at the code as well.

/* The resulting geometry has these sides/material groups:

     0 front quad
     1 east or +x quad
     2 west -x quad
     3 east roof quad
     4 west roof quad
     5 bottom quad
     6 back quad
     7 front upper triangle
     8 back upper triangle
     */

    const barnGeometry = TW.barnGeometryWithMaterialGroups(30, 40, 50);

    // replace this with a mesh that has material with lighting and textures.
    const barnMesh = TW.createMesh(barnGeometry);
```

You will need to use this `TW.barnGeometryWithMaterialGroups` function
that is defined for you in the TW library.

Most of your work will be setting up the material and lighting and
then applying the textures, which is all in the material part of the
mesh.

If you want to fiddle with the texture coordinates, you are welcome to do so.
To do that, you can copy the definition of `TW.barnGeometryWithMaterialGroups`
into your `main.js` and then modify the copy. But that is not required.

## Stuff to Know

Older versions of Threejs said that texture repetition works best if
the dimensions of the texture image are powers of two. You don't get
an error if the dimensions are not powers of two (although you'll see
a warning in the JS console), but the effect is as if you used
"clamp." It's easy enough to use [Adobe Express](https://www.adobe.com/express/feature/image/resize) or
Photoshop (or even just Preview on a Mac) to resize an image to have
power-of-two dimensions. However, that seems no longer to be the case.

## What You Need to Do

Write your own program that mimicks this object:

- Use material and lighting throughout; no `THREE.MeshBasicColor`,
  though of course you can use them when debugging.
- You'll need an ambient light and a directional light.
- Make your best guess at the material colors.
- Texture-map some textures on the walls and roof of the barn. Use
  wood or brick or some kind of reasonable "wall-like" material for
  the sides, and similarly for the roof. You don't need to use
  textures exactly like the ones used in the model solution; make it
  look nice.
- Note that the top of the front and back aren't triangles that are
  part of quads. You'll need to figure out the best way to deal with
  this.
- There's a GUI with a menu. You need not implement the UV option,
  but implement some way to turn off the material so that we can see
  the lighting. This will help you in your debugging, too, so it's
  not a waste of time.
- You *must* use repetition in your texture-mapping: find an image
  that looks nice as *part* of the barn's sides or roof, and then
  "tile" it across the surface. That's much of what texture-mapping
  is about.
- Feel free to ask questions!