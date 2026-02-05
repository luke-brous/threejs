# Synthetic Camera API

There are two aspects to the camera API: the placement of the camera,
and the *shape* of the camera. To understand the latter, we need to
understand how cameras work, so we'll start with some history of
cameras and the math of a real-life pinhole camera, and a matrix
representation of how projection works. Finally, we'll look at some
Threejs code.

## The Pinhole Camera

Historically, long before we had film cameras, there was the [camera
obscura](https://en.wikipedia.org/wiki/Camera_obscura) (Latin for
"dark room). It was a real space, a windowless room with just a tiny
hole in one wall. The image would appear on the opposite wall. Picture
it like this

![a box on the left side of the origin, the origin is located at a small hole in the right side, and the Z axis points to the right, out into the scene.](images/pinhole.png)

This is a cutaway side view of a pinhole camera. The z axis is
imaginary, but the box on the left part of the picture is a real box:
solid on all six sides. There is a tiny pinhole in the front of the
box, where the circle is on the picture. The origin is placed at the
pinhole, the y axis goes straight up through the front of the box, and
the z axis points out into the scene. The location of the pinhole is
also referred to as the *focal point*. The depth of the box is d, and
the height of the box is h. We also might care about the width of the
box, but that's not visible in this picture, since we've eliminated
that dimension.

Let's imagine a scene with a tree in it:

![the same as the previous picture, but with a tree out on the Z axis and an upside-down tree on the left wall of the box](images/pinhole-and-tree2.png)

Rays of light from the outside go through the hole and land on the
image plane, which is the entire back of the box. For example, a ray
of light from the top of the tree lands on the back of the box as
shown. Because the hole is so tiny, only light from along a single ray
can land on any spot on the back of the camera. So, in this example,
only light from the top of the tree can land at that spot. This is why
pinhole camera pictures are so sharp. Theoretically, they can provide
infinite clarity, though in practice other issues arise (diffraction
of light rays and the lack of enough photons). However in computer
graphics, we only need the theoretical camera.

Pinhole cameras are simple and work really well. They're standard equipment
for viewing solar eclipses. We only use lenses so that we can gather more
light. A perfect pinhole camera only really allows one ray of light from each
place in the scene, and that would make for a really dark image, or require
very sensitive film (or retinas). Since the need to gather enough light is not
important in computer graphics, the OpenGL model is of a pinhole camera.

Points to notice:

- The **projection** of an image (such as the tree) can be computed
  using similar triangles, as described in the next section.
- The effects of perspective are manifest, such as objects getting
  smaller in the image with distance from the camera.
- Parallel lines seem to converge at a "vanishing point" (imagine
  looking down railroad tracks).
- One disadvantage of a pinhole camera is that the image is *upside
  down* on the film. (An SLR camera has "through the lens" viewing, but
  uses additional mirrors to flip the image right side up.) We'll see
  how to address this soon.

## Computing Projection by Similar Triangles

Suppose we want to compute the projection of the top of the tree. Let the
coordinates of the top of the tree be $(X,Y,Z)$. We want to know the
coordinates of the projection, let them be $(x,y,z)$. We can do this by
similar triangles, using the two yellow triangles in the following figure:

![the similar triangles used to compute the projection of the
tree](images/pinhole-and-tree3.png)

The height and base of the big triangle are just $Y$ and $Z$. The
height and base of the little triangle are $y$ and $z$. The base of
the little triangle is **known**, because that's determined by the
shape and size of our pinhole camera. In the figure, it's notated as
"d." By similar triangles, we know:

$$
y/d = Y/Z \\
y = d*Y/Z \\
y = Y/(Z/d)
$$

Everything on the right hand side is known, so we can compute the
projection of any point simply by knowing the depth of our pinhole
camera ($d$) and the location of the point. Projecting the $X$
coordinate works the same way.

By the way, the reason we do this last algebraic step of dividing by
$Z/d$ is because of the way we will use this in our projection matrix.

The *field of view* of a camera is, essentially, how much of the world
ends up on the film: is it a lot of stuff (a wide-angle view that
pictures the whole forest) or a narrow, zoom lens view that pictures
just a single tree? How can we compute the field of view of the
pinhole camera, denoted by the angle $\theta$¸ in the diagram below?

![](images/pinFOV.png)

Note that we are looking at the pinhole camera from the side (from the
$X$-axis) so the angle $\theta$ that we are seeing for the field of
view (FOV) is an angle where the side of the triangle opposite to the
angle is the $Y$-axis. So this is called the **FOVY**: Field of View
Y. OpenGL uses the FOVY to define the camera shape.

You should convince yourself that the FOVY can be computed as shown below:

$$ \mathrm(FOVY) = \theta = 2 \tan^{-1}\left( \frac{h/2}{d} \right) $$

because

$$ \tan(\theta/2) = \frac{h/2}{d} $$

So:

$$ \theta = 2 \tan^{-1} \left(\frac{h/2}{d}\right) $$

## The Synthetic Camera

There's a hassle with signs in the pinhole camera, such as whether the $z$
value for the tree is negative. Also, the image ends up being upside down. In
CG, since we're really only interested in the mathematics of projection, we
use a **synthetic** camera, in which the image plane is placed on the same
side of the origin as the scene.

![the synthetic camera has the image plane between the focal point and the
scene](images/synthetic-and-tree.png)

- In CG, we can put the image plane *in front* of the focal
  point. This means the image is right side up.
- Mathematically, we'll make the origin be the focal point, with the
  camera pointing down the negative z axis.
- The image plane is the top of a **frustum** (a truncated
  pyramid). See the demo below.
- The frustum is also our **view volume**. Anything outside the view
  volume is "clipped" away and not visible in the rendered image.
- Note that this also means that the CG system can't see infinitely
  far. That's because it needs to calculate relative depth, and it
  can't make infinitely fine distinctions.
- The projection is computed using a **projection matrix**. We'll talk
  about that below.
- Note that there is also an option of doing **parallel projection**
  rather than **perspective projection**. In parallel projection, the
  rays of light from the scene to the image are drawn in parallel,
  rather than converging at a focal point. Parallel projection is
  useful in architectural drawings and the like. We will rarely use
  it.

## Demo: Camera

It's easier to understand the power of the camera parameters when we can
compare the geometry of the frustum with the resulting rendering of the scene.
In the following demo, we see a scene with a teddy bear and a camera, and the
rendered result:

[Visualization of the Camera
API](https://cs.wellesley.edu/~cs307/threejs/demos-s21-r95/Camera/camera-api.shtml)

## Perspective Matrices and Perspective Division

For the same reason that we want to perform all of our affine transformations
using matrix multiplication, we want to perform projection using matrix
multiplication.

There are two kinds of projection available in OpenGL and Three.js,
orthographic and perspective:

## Orthographic (Parallel)

With orthographic projection, the view volume is a rectangular box,
and we project just by squeezing out one dimension. This means that
rays from the scene onto the image plane are *parallel* instead of
converging on the origin. As we mentioned earlier, this kind of
projection is useful for architectural drawings and situations where
there really isn't any perspective. If we align the direction of
projection (DOP) with the Z axis, this kind of projection amounts to
setting the Z coordinate of all points to zero. If we again let the
scene coordinates be $(X,Y,Z)$ and projected coordinates be $(x,y,z)$,
here's how orthographic projection can be expressed as multiplication
by a projection matrix:

$$
\begin{pmatrix} x \\ y \\ z \\ 1 \end{pmatrix}
=
\begin{pmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix} X \\ Y \\ Z \\ 1 \end{pmatrix}
$$

In this case, $x=X$, $y=Y$, and the $z$ coordinate is $0$ for all
points.

## Perspective Projection

With perspective projection, if we set up a frame (coordinate system)
where the origin is the center of projection (COP) and the image plane
is parallel to the Z $=0$ plane (the XY plane), we can compute the
projection of each point using the similar triangles calculation,
dividing each $Y$ and $X$ coordinate by $Z/d$.

The matrix for perspective projection isn't obvious. It involves using
homogeneous coordinates and leaving part of the calculation undone.

The part of the calculation that is left undone is called **perspective
division**. The idea is that the homogeneous coordinate $(x, y, z, w)$ is the
same as $(x/w, y/w, z/w, 1)$, that is, we divide through by $w$. If $w=1$,
this is a null operation that doesn't change our ordinary vertices. If,
however, $w$ has the value $Z/d$, this perspective division accomplishes what
we did earlier in our similar triangles, namely:

$$ y = Y/(Z/d) $$

Therefore the perspective matrix is a matrix that accomplishes setting $w=Z/d$
and leaves the other coordinates unchanged. Since the last row of the matrix
computes $w$, all we need to do is put $1/d$ in the Z column of the last row.
The perspective projection matrix, then, is just the following matrix:

$$
\left[ \begin{array}{rrrr}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 1/d & 0
\end{array} \right] 
$$

Let's consider how this matrix transforms an arbitrary point, $(X,Y,Z)$:

$$
\begin{pmatrix} x \\ y \\ z \\ w \end{pmatrix}
=
\begin{pmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 1/d & 0
\end{pmatrix}
\begin{pmatrix} X \\ Y \\ Z \\ 1 \end{pmatrix}
$$


In this case, $x=X$, $y=Y$, $z=Z$, and $w=Z/d$. To transform the result into a
vector with $ w=1 $, we do the perspective division step, namely we divide
all the components by $ Z/d $, yielding:

$$
\begin{pmatrix}
x/(Z/d) \\
y/(Z/d) \\
z/(Z/d) \\
1
\end{pmatrix}
=
\frac{1}{Z/d}
\begin{pmatrix}
x \\
y \\
z \\
Z/d
\end{pmatrix}
$$

This is exactly the point we want, namely the projection of the original point
onto an image plane at a distance of \( d \).

## The Role of the Projection Matrix

In the reading on nested transformations, we discussed how the scene
graph gives a sequence of transformations from object coordinates to
world coordinates. We talked about how we can convert a vertex from
object space to world space with a single matrix multiplication.

We can now add another matrix to that computation. Let $P$ be the projection matrix. We can now have:

$$ v' = P \cdot M \cdot v $$

The $v'$ vertex is *after* projecting to 2D. It's in a new space
called "clip space" because the next step is to clip off vertices that
fall outside the frustum. We'll talk about clipping some other
time. Just remember that there is a *projection matrix* that depends
on the shape of the camera.

## Perspective Cameras in Three.js

In Three.js, we can set up a perspective camera like this:

```js
const camera = new THREE.PerspectiveCamera(fovy,aspectRatio,near,far);
```

The arguments are:

- `fovy` which is the *field of view y*, like we calculated above. The
  larger it is, the larger the view volume (the frustum), so the more
  scene stuff will fall onto the image plane, but the smaller the
  projection of each thing will be. In other words: you'll see more
  trees, but they will be smaller.
- `aspectRatio` which is the ratio of the width of the image plane to
  its height. Think of when you turn your phone to the side to take a
  picture in *landscape mode* versus *portrait mode*: that's changing
  the aspect ratio. And some phones have different aspect ratios than
  others. In Threejs, we will almost always want the aspect ratio to
  match the aspect ratio of the *canvas* (the HTML element on our web
  page), and the aspect ratio of that is typically the same as our web
  browser window. So, we'll see how to use those values.
- `near` this is the distance of the image plane (the top of the
  frustum) from the focal point. Nothing closer than that is in the
  view volume and therefore is not shown.
- `far` this is the distance of the farther plane of the
  frustum. Nothing beyond that is in the view volume and therefore is
  not shown.

We'll think of this API as setting up the camera *shape* (the geometry of the
frustum).

## Placing and Aiming the Camera

As we saw above, the perspective and orthographic projections work when the
axis is aligned with the Z axis. This is actually the same as the initial
coordinate system in OpenGL. But what if we don't want our scene/camera set up
this way?

The earlier demo also illustrated how we can *locate* and *point* the
camera. The fustrum demo, for example, included the following
`setupCamera()` function:

```js
function setupCamera() {
    const cp = cameraParams;      // just a shorthand for this function
    frustumCamera = new THREE.PerspectiveCamera(cp.fov,
                                                cp.aspectRatio,
                                                cp.near,
                                                cp.far);
    // set location
    frustumCamera.position.set(cp.eyeX, cp.eyeY, cp.eyeZ);
    // Cameras inherit an "up" vector from Object3D.
    frustumCamera.up.set(cp.upX, cp.upY, cp.upZ);
    // The lookAt method computes the camera direction and orientation
    // from its position and up parameters, and the input arguments
    // specifying the location of the 'at' point
    frustumCamera.lookAt(cp.atX, cp.atY, cp.atZ);
}
```

This function sets up three additional components of the camera projection
geometry:

- The "eye" point is the location of the focal point (also known as
  the "center of projection" or COP), as a point in space. Yet another
  standard term for this is the VRP: view reference point.
- The "at" point is the location of some point in the direction we
  want the camera to face. It doesn't even need to be in the view
  volume. It's only used to figure out where the camera is pointed. A
  standard term for the direction the camera is pointed is the VPN:
  view plane normal (a vector in OpenGL). This point is actually a
  very convenient concept, because it makes it easy to aim our camera
  at some location that should project to the center of the
  picture. For example, if we want to take a picture of a person, the
  "at" point might be the tip of their nose, or between their eyes.
- The "up" vector indicates which direction, projected onto the image
  plane, is the same as the vertical direction on the monitor
  (parallel with the left edge of the canvas). Note that it is a
  **vector,** not a point. It captures, for example, landscape versus
  portrait. A standard term for this is the VUP: view up.

In other words, the camera is positioned at a point called the *eye* ,
`(eyeX,eyeY,eyeZ)`, facing a point called *at* , `(atX,atY,atZ)`, and
oriented in a direction defined by the *up* vector, `(upX,upY,upZ)`.

In Three.js, a `Camera` is just a subclass of `Object3D`, so its
position can be set with `position.set()` (or with other means of
positioning objects that we learned about earlier), and it can be
rotated as well. (I have yet to need to scale a camera.)

All instances of `Object3D()` also have an `up` attribute that can be
set for a camera as well, as shown in `setupCamera()` above.

Finally, there's a useful *method* called `lookAt()`, which points an
object to face a particular point specified by its arguments. This
method also uses the `up` vector to orient the object
appropriately. You should use this method *last* , after setting the
location and up vector for the camera.

## Rendering

There's a bit more work we need to do to create a canvas and to have Three.js
render our scene on that canvas using our camera. We'll look at two ways to do
this, using TW and without using TW. It's your choice whether to use TW when
setting up your own camera.

## Renderer Object

We will always need a `THREE.Renderer` object. This object has a method,
called `render()`, that takes a scene and a camera and renders the scene using
the camera. Any time you adjust your scene or your camera, you'll want to re-
invoke this function. If you have globals holding your camera and your scene,
you might just define a simpler wrapper function to do the rendering:

```js
function render() {
     renderer.render( scene, camera );
}
```

Creating a renderer object causes an HTML `canvas` object to be
created with a default size of 300 x 150, which is quite
small. However, the canvas is *not* added to the document; you need to
do this yourself, or get TW to do this for you.

First, because the default canvas is so small, we'll use CSS to set up
a policy for the size of the canvas. Here, I'll use 800 x 500, and so
I'll use 800/500 for the aspect ratio of my camera (the top of the
frustum).

```js
canvas {
    display: block;
    width: 800px;
    height: 500px;
    margin: 10px auto;
}
```

You can also consider using a canvas of size 100% x 100%, covering the
whole browser. If you do that, use
`canvasElt.clienthWidth/canvasElt.clientHeight` as the camera's aspect
ratio, where `canvasElt` is a variable defined below.

Let's put all these ideas together, without using TW. Here's the
JavaScript:

```js
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const canvasElt = renderer.domElement;
document.body.appendChild(canvasElt);
renderer.setSize(canvasElt.clientWidth,canvasElt.clientHeight);
renderer.setClearColor( 0xdddddd, 1);
```

## One and Done Camera

The simplest way to use a custom camera in rendering a scene is to set
it up once, render the scene once and be done. I'll call this "one and
done". You can see a minimal example of setting up a Perspective
Camera using only built-in Threejs functions in this demo:

[cameraAPI/box-min](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/401741/View)

That's the shortest, simplest working example I could come up with
(with a little help from ChatGPT). The JS code is less than 30 lines!
Let's look at it:

```js
import * as THREE from 'three';

// 1. Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Scene
const scene = new THREE.Scene();

// 3. Camera
const fov = 70;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);

// 4. Box
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

renderer.render(scene, camera);
```

The first part sets up the render object:

```js
// 1. Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

Here, we are using `window.innerWidth` and `innerHeight` to set the
size of the canvas, committing to taking the entire window. Or you
could omit that, and size the canvas using CSS.

The `setPixelRatio` avoids blurring for some high-resolution
devices. For example, omitting that line on my laptop results in lots
of blurring and jagginess.

Second, we create the scene object.

Third, we create the camera. None of this should surprise you now

```js
const fov = 70;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);
```

Next, we add stuff to the scene.

Finally, we render the scene:

```js
renderer.render(scene, camera);
```

There's no animation, no adjustment of the scene or the camera, just
one and done.

## Camera with a GUI

Here's a demo that allows you to adjust the camera's shape and
orientation via a GUI. It's a bit trickier than the previous example

[cameraAPI/box-gui](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/401741/View)

Again, the code is not too long (less than 100 lines of JS) but I
won't repeat sections that are essentially the same as `box-min`, the
one-and-done example from the last section.

Here are the initial parameters the demo uses:

```js
const params = {
    eye: {x: 2, y: 2, z: 5},
    at: {x: 0, y: 0, z: 0},
    up: {x: 0, y: 1, z: 0},
    fovy: 50, // degrees
    aspectRatio: window.innerWidth / window.innerHeight,
    near: 1,
    far: 20,
};
```

Note that I have used `eye` to name the location of the camera (the COP:
the center of projection), which is the tip of the pyramid of which
the frustum is truncated. That's a pretty traditional name.

Here's the code that sets up the camera:

```js
const camera = new THREE.PerspectiveCamera(params.fovy, 
                                           params.aspectRatio, 
                                           params.near, 
                                           params.far);
camera.position.copy(params.eye);
camera.up.copy(params.up);
// lookAt requires either 3 args or a THREE Vector3() object
camera.lookAt(params.at.x, params.at.y, params.at.z);
```

This code should make sense.

The next section adds stuff to the scene; that's the same and isn't
interesting.

After that, the one-and-done code rendered the scene and that was
it. In this version, we will want to be able to succinctly re-render
the scene, so let's define a short function to do that:

```js
// 5. function to re-render the scene
function render() {
    renderer.render(scene, camera);
}
render();
```

Next, we have some code to update the camera when the GUI changes the
parameters. This is mostly re-setting the camera properties from the
parameters, but one important thing to notice is that if we change any
properties of the camera's *shape*, we have to re-compute the
projection matrix, which we do with the method
`.updateProjectionMatrix()`. Finally, we have to re-render the scene,
using the `render` function we just defined:

```js
// 6. Update Camera and re-render
function updateCam(v) {
    // shape
    camera.fov = params.fovy,   // Note that Threejs says "fov", but I use fovy
    camera.aspect = params.aspectRatio,
    camera.near = params.near;
    camera.far = params.far;
    camera.updateProjectionMatrix();
    // location and direction
    camera.position.copy(params.eye);
    camera.up.copy(params.up);
    // lookAt requires either 3 args or a THREE Vector3() object
    camera.lookAt(params.at.x, params.at.y, params.at.z);
    // No effect unless we re-render the scene
    render();
}
```

The code in the GUI is mostly uninteresting, except that the
`onChange` function now calls the `updateCam` function to adjust the
camera and re-render the scene. For example:

```js
const shapeGui =  gui.addFolder('shape');
shapeGui.add(params, 'fovy', 1, 180).onChange(updateCam);
```

Changing the FOVY will entail updating the projection matrix, so it's
good that `updateCam` does that.

Play with the demo a bit. Below are some
things to try and to observe.

- Moving the AT point should be very intuitive: we point the camera
  different places.
- Moving the EYE left/right or up/down, while keeping the AT the same
  should be pretty intuitive: the scene moves the opposite way,
  because the scene is staying in place while we move the
  camera. We'll return to this duality later.
- Modifying the UP vector is not obvious, but try to imagine how that
  vector would be drawn in the scene. You should find that the UP
  vector always points UP in the rendered scene.
- Increasing the FOV makes everything smaller, because the larger
  frustum has more space in it, but is projected onto the same size
  canvas, so everything has to get smaller.
- Decreasing the FOV zooms in, so we see less stuff, but it's bigger
  in the rendering.
- Changing near/far has no effect unless something gets cut off.

## Object Demo

The earlier demos had a very simple scene, which let us focus on the
camera code. The following demo has a wider choice of scenes:

- box (same as before)
- tracks: this has railroad tracks receding into the distance. Notice
  the perspective effect and the vanishing point.
  - try moving the eye back; does the result make sense?
  - try moving the eye up/down; does the result make sense?
- forest: This has a rectangular arrangement of cones in forest green,
  so it's more of a tree farm than a forest.
  - try changing the FOV.
  - A bigger FOV sees more trees, but they are smaller.
  - A smaller FOV sees fewer trees, but larger

[cameraAPI/obj-gui](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/401741/View)

## Other Terminology

The following terms are commonly used for different kinds of motions for
cameras and such.

- pan: rotating a fixed camera around a vertical axis
- tilt: rotating a fixed camera around a horizontal axis
- zoom: adjusting the lens to zoom in or out (this adjusts the frustum)
- roll: rotating a camera or a ship around a longitudinal axis
- pitch: same as tilt, but for ships and airplanes
- yaw: same as pan, but for ships and airplanes
- strafe: moving a camera along a horizontal axis; this terminology is used in video games I believe.

## FOV Considerations

From ChatGPT, which is consistent with my experience. Here's what happens with high FOV values:

- Distortion: At very high FOVs (above ~100°), you'll start seeing
  heavy fisheye lens-like distortion.
- Rendering issues: Close to 180, the view frustum becomes almost a
  flat plane, and objects can pop in and out or vanish entirely due to
  floating point precision problems.
- Weird perspectives: The scene may feel "flattened" or warped, and
  user interaction (like orbit controls) can become awkward.

Reasonable Limits and most typical FOV values:

- 45-75: Good for general use.
- 90: Wide-angle, often used for FPS games.
- Above 100: Getting into VR / stylized territory.
- Above 120: Use with caution -- mostly for stylization or experimentation.

The default FOV in Threejs is 50 degrees.

## Practical Checklist

The demos above are your go-to examples if you have trouble
remembering how to set up a camera. 

Here's a bit of checklist:

1. Create a renderer object
2. Create a scene with stuff in it
3. Create the camera object with fov, aspect ratio, near and far
4. Place and aim it. (It doesn't have to be added to the scene, but
   it doesn't hurt to do so.)
5. Set `up` if necessary
6. Use `lookAt` to point it where you want
7. Last, but critically, *render* the scene, using `renderer.render(scene, camera)`

If you revise the scene or the camera, you will have to render again,
so we often define a `render` function and call it after making our
revisions.

There are limits on the values for the camera shape.

- fov must to be less than 180, and in practice should be less than 100. 
- aspect ratio is a positive number and is probably between 1/4 and 4, unless you have a very odd-sized canvas.
- near has to be greater than 0.
- far has to be greater than near and shouldn't be too large.

TW has a function to check those for you. It's in TW if you want to use it.

```js
function checkShapeParameters(fov, ar, near, far) {
    if(fov < 0 || fov > 180)
        throw new error('fov must be between 0 and 180', fov);
    if(fov > 180)
        throw new error('are you sure? that is a very large fov', fov);
    if(ar < 0.1 || ar > 10)
        throw new error('are you sure? that is a weird aspect ratio: ', ar);
    if(near <= 0 )
        throw new error('near must be positive: ', near);
    if(far <= near) 
        throw new error('far must be greater than near: ', near, far);
```

You can just invoke `TW.checkCameraShapeParameters` with the appropriate arguments.

## Summary

- Computer Graphics, including Threejs, uses a synthetic camera based on the geometry of the *pinhole camera*.
- The *view volume* is the part of the scene that will be rendered onto the image plane.
- The *shape* of the *view volume* is called a *frustum*, which is a truncated pyramid.
- The top of the pyramid, if it existed, would be at the origin.
- The axis of the pyramid is aligned with the Z axis of the scene.
- The *top* of the frustum is the *image plane*
- Nothing outside the view volume is displayed
- One angle of the frustum, lying in the ZY plane, is the *field of view Y*
- The other angle is determined by the *aspect ratio* of the top of the frustum.
- The distance of the top of the frustum from the origin is called *near*
- The distance of the bottom of the frustum from the origin is called *far*
- A camera of a particular shape can be defined as `cam = new THREE.PerspectiveCamera(fovy,aspectRatio,near,far)`
- The camera object can be placed using `cam.position.set(...)`
- The camera can be aimed using the `cam.lookAt()` method
- The camera can be oriented using `cam.up.set(...)`

Sample code:

```js
const camera = new THREE.PerspectiveCamera(params.fovy, params.aspectRatio, params.near, params.far);
camera.position.copy(params.eye);
camera.up.copy(params.up);
camera.lookAt(params.at.x, params.at.y, params.at.z);

// 5. function to re-render the scene
function render() {
    renderer.render(scene, camera);
}
render();

// 6. Update Camera and re-render
function updateCam(v) {
    // shape
    camera.fov = params.fovy,   // Note that Threejs says "fov", but I use fovy
    camera.aspect = params.aspectRatio,
    camera.near = params.near;
    camera.far = params.far;
    camera.updateProjectionMatrix();
    // location and direction
    camera.position.copy(params.eye);
    camera.up.copy(params.up);
    // lookAt requires either 3 args or a THREE Vector3() object
    camera.lookAt(params.at.x, params.at.y, params.at.z);
    // No effect unless we re-render the scene
    render();
}
```

Advice:

- the aspect ratio should match the aspect ratio of your canvas, or it'll look distorted
- you are welcome to use TW camera for convenience, unless you need something it can't do

---

# Appendices

## Cool Effects

By balancing zoom and dolly at the same time, you can keep one central
element the same size while changing the size of other elements.

[Wikipedia article on Dolly Zoom](https://en.wikipedia.org/wiki/Dolly_zoom)

## Forced Perspective

Since apparent size depends on distance from the camera, by
manipulating this, you can make the audience think something is
bigger/smaller than it really is. For example, making Frodo, played by
Elijah Wood, seem much smaller than Gandalf, played by Ian McKellan.

[Wikipedia article on Forced Perspective](https://en.wikipedia.org/wiki/Forced_perspective)

## Forced Perspective with a Moving Camera

Typically, if you move the camera, the forced perspective effect
disappears, but if you carefully maintain the relative distances, you
can maintain the effect.

[Clip from DVD extras of Lord of the Rings](https://youtu.be/QWMFpxkGO_s?si=qGzh9sluewKJkZMC)