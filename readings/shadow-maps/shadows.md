# Shadows

We have light sources and objects that interact with light, but we
don't yet have *shadows*, which add a lot of realism to a scene. Let's
look at how that can be done.

Please read following article in its entirety:

[threejs.org on shadows](https://threejs.org/manual/#en/shadows)

## Demo

Play around with the following demo. If you adjust the coordinates of
the light, you can see the shadows move. Very cool!

[shadows/trees/spotlight.html](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/407679/View)

Let's look at the source code for that example. I will focus on the
changes from [libraries/town](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/407415/View).

The first change is to the renderer:

```js
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; // new for shadows
```

To have shadows, we have to use lights, of course, and I've chosen to
use a spotlight for this example. (More on that later.) We specify
that the light casts shadows.

```js
function makeSpotLight(intensity) {
    const light = new THREE.SpotLight(0xffffff, intensity);
    light.decay = 0;
    light.distance = 0;
    light.castShadow = true;
    const target = new THREE.Object3D();
    light.target = target;
    scene.add(light);
    const helper = new THREE.SpotLightHelper( light, "yellow" );
    scene.add( helper );
    light.helper = helper;
    return light;
}

const sun = makeSpotLight(lightParams.sunIntensity);
sun.position.copy(lightParams.pos);
sun.helper.visible = lightParams.showHelper;
sun.helper.update();
```

Next, let's start building the stuff in our scene. The original scene
used the TW ground plane that is a `MeshBasicMaterial` which is no
good for this demo. So, we need to create a ground plane. We'll have
it *receive* shadows, but not cast shadows.

```js
function makeGround() {
    const geo = new THREE.PlaneGeometry(20,20);
    const mat = new THREE.MeshStandardMaterial({color: 0x4F7942}); // aka ferngreen
    mat.roughness = 1;
    const mesh = new THREE.Mesh( geo, mat );
    mesh.name = "shadow ground";
    mesh.position.set(10,0,10);
    mesh.rotation.x = -Math.PI/2;
    // ground only receives shadow, doesn't cast it.
    mesh.receiveShadow = true;
    scene.add(mesh);
}

makeGround();
```

Next, we get to a painful learning experience I had. The original
imported two functions, `createTree` and `createSnowPerson`, and
created four instances of trees and one of snowperson. My early shadow
version specified properties of those objects to cast and receive
shadows. (In this particular forest, I don't think the trees will in
fact receive any shadows, but in a thicker forest or if the sun is
low, they might.) The code was something like this:

```js
// warning, this code does *not* work:
const tree1 = createTree({});
tree1.castShadow = true;
tree1.receiveShadow = true;
tree1.position.set(1,0,1);
```

(Another error I made was to misspell "receive" a zillion times, so
don't make that error either.)

Hours later, I learned to my chagrin that only *mesh* objects can cast
and receive shadows, so my code above was useless, because both the
tree and the snowperson are `Group` (or `Object3D`) objects. (The fact
that in JS you can add properties to any object willy nilly hurt me
here, because there was no error message that the properties did not
exist.)

I was then faced with a choice:

- modify the library object so that the API allowed the user
  to specify whether the cone or the trunk cast or received shadows.
- modify the returned object to specify those properties of its
  children.

I decided on the latter route, mostly out of laziness. Later, when I
realized that I had the identical problem with the snowperson, I
decide to write a generic "modify children" function. Namely this:

```js
function childrenShadows(group, cast, receive) {
    for( let c of group.children ) {
        c.castShadow = cast;    // new for shadows
        c.receiveShadow = receive; // new for shadows
    }
}
```

Note that this function only handles one layer of embedding. It
couldn't handle the leg or the mobile or any of our other heavily
embedded objects. Stay tuned for more thoughts on that.

Armed with this helper function, I can now create a better tree
function, though it hard-wires the materials.

```js
function createTreeWithShadow(inits) {
    const coneMaterial = new THREE.MeshStandardMaterial({color: "darkgreen"});
    coneMaterial.roughness = 1; // this is the default, but I wanted to be explicit
    const trunkMaterial = new THREE.MeshStandardMaterial({color: "brown"});
    trunkMaterial.roughness = 1;
    inits.coneMaterial = coneMaterial;
    inits.trunkMaterial = trunkMaterial;
    const tree = createTree(inits);
    tree.name = "tree with shadow";
    childrenShadows(tree, true, true);
    scene.add(tree);
    return tree;
}
```

Now, we can easily create the trees:

```js
const tree1 = createTreeWithShadow({});
tree1.position.set(1,0,1);

const tree2 = createTreeWithShadow({coneHeight: 12});
tree2.position.set(18,0,1);

const tree3 = createTreeWithShadow({coneHeight: 8, coneRadius: 3});
tree3.position.set(18,0,18);

const tree4 = createTreeWithShadow({trunkHeight: 5, coneRadius: 3});
tree4.position.set(1,0,18);
```

Whew! That wasn't too hard.

The snow person is nearly the same code, so I won't repeat it
here. Feel free to look at the source code for this demo:

[shadows/trees/spotlight.js](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/407679/View)

## Shadow Maps

How does this all work? Every light in three.js that can cast shadows
internally creates a *shadow camera*. This camera determines what part
of the scene is rendered into the shadow map. Recall that with normal
cameras, the *z-buffer* algorithm tells us whether a surface is
"visible" from the point of the view of the camera or whether it is
*occluded* (hidden) by some other object. The z-buffer is literally an
array that tells us the *depth* of each pixel of the scene from the
point of view of the camera.

This is almost exactly what we need to compute shadows. A fragment is
in shadow (for a particular light) if it's *occluded* (has a greater
depth) from that light by some other object that *casts shadows*.

The shadow map is essentially a *depth texture* (very much like the
z-buffer) as seen from the light's perspective. Here's a step-by-step
breakdown:

1. Render the depth texture ("shadow map")
   - Each shadow-casting light has an internal shadow.camera -- a fake camera that renders the scene from the light's point of view.
   - Instead of rendering colors, this camera renders depth to a texture (how far each surface point is from the light).
   - This is called the shadow map -- basically a depth image.
2. Render the scene from the camera's point of view
   - Now three.js renders the scene as seen by the main camera (your viewport).
   - For each pixel being drawn, three.js needs to check: "Is this point in shadow from the light?"
3. Shadow Comparison -- Am I in shadow?
   - For each fragment/pixel being shaded:
     - Transform its world position into the light's shadow camera space.
     - Convert it into shadow map UV coordinates (like a texture lookup).
     - Sample the depth from the shadow map.
     - `if` the fragment depth > depth in shadowmap `then` shadow `else` lit

You can see that this requires multiple renderings of the scene (one
for each shadow-casting light), plus the main rendering, which is much
more complicated and computationally intensive. Thus, we want to be
sparing of the number of shadow-casting lights and shadow
casting/receiving surfaces we have.

## Light Types

The computation of the shadowmap (step 1 above) depends on the *kind* of light source:

| Light Type | Shadow Camera Type | Description |
| --- | --- | --- |
| `DirectionalLight` | `OrthographicCamera` | Covers a box-shaped area, great for sunlight |
| `SpotLight` | `PerspectiveCamera` | Covers a cone area, like a flashlight |
| `PointLight` | 6 x `PerspectiveCamera` (cubemap) | Covers all directions in a cube from light position |

The demo above uses a spotlight. In fact, the light is *way* too close
to the scene to be called "sun." I originally had "sun" as a
directional light, but I couldn't get the orthographic camera set up
correctly. (I'll keep trying.) In the meantime, it would be sufficient
to make the spotlight quite a long way from the scene, which I didn't
do because I wanted to move the light source more easily.

I also tried a PointLight, and that worked fine:

[shadows/trees/pointlight.html](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/407679/View)

However, that's more computationally expensive because we have to
compute a cubemap instead of just a single shadowmap.

## Deeper Embedding

How could we handle adding `castShadow` and `receiveShadow` to heavily
embedded objects like the leg, the mobile and others? Clearly, a
recursive traversal of the object will do the trick. I will leave that as
an exercise for the reader, for now.

## Summary

- Shadows are expensive to compute:
  - scene rendered once for each light that casts shadows, plus final render
  - sometimes fake shadows are used (e.g., B&W plane with texture map under a sphere)
  - half the article reading was about fake shadows
- For "real" shadows, we have to:
  - create a shadowmap in the renderer
  - specify which lights cast shadows
  - for each *mesh* say whether it *receives* or *casts* shadows or both
  - only *meshes* receive or cast shadows, not instances of Group or Object3D
- Each light needs a *shadow camera*
  - Spotlight: perspective camera
  - Pointlight: cubemap (6x perspective camera)
  - DirectionalLight: orthographic camera