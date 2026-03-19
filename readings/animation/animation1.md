$$
\newcommand{\vecIII}[3]{\left[\begin{array}{c} #1\\\\#2\\\\#3 \end{array}\right]}
\newcommand{\vecIV}[4]{\left[\begin{array}{c} #1\\\\#2\\\\#3\\\\#4 \end{array}\right]}
\newcommand{\Choose}[2]{ { { #1 }\choose{ #2 } } }
\newcommand{\vecII}[2]{\left[\begin{array}{c} #1\\\\#2 \end{array}\right]}
\renewcommand{\vecIII}[3]{\left[\begin{array}{c} #1\\\\#2\\\\#3 \end{array}\right]}
\renewcommand{\vecIV}[4]{\left[\begin{array}{c} #1\\\\#2\\\\#3\\\\#4 \end{array}\right]}
\newcommand{\matIIxII}[4]{\left[
\begin{array}{cc}
#1 & #2 \\\\ #3 & #4
\end{array}\right]}
\newcommand{\matIIIxIII}[9]{\left[
\begin{array}{ccc}
#1 & #2 & #3 \\\\ #4 & #5 & #6 \\\\ #7 & #8 & #9
\end{array}\right]}
$$

# Animation

With animation, we change the scene dynamically, so instead of a still
scene (even if the user moves the camera), the scene changes over
time. Of course, we can also animate the motion of the camera (think
about the Flythrough assignment).

## Animation Basics

Animation of simple motion is fairly straightforward. Instead of producing one
frame, we produce several. The way this is usually done in a modern web
browser is with

> [`requestAnimationFrame(func)`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame)

This function asks the browser "when you have time, please invoke this
function". This is a kind of *idle callback*. This is similar to other
callbacks: we register it and the browser calls it. This callback,
however, is called when the graphics system has nothing better to do --
it's *idle* (and the browser window or tab is exposed, and so forth) --
the browser will be smart about not invoking your function when it's
unnecessary.

If the idle callback does the following:

- adjusts some global variables or other parameters of the graphics program,
- re-renders the scene, and
- requests another animation frame

then the effect will be to continually adjust the variables and
redisplay your scene, thereby producing an animation. If you think
back to the *flythrough* part of the *camera* homework, if that
program adjusted the camera parameters and redrew the scene, that
could easily be turned into an animation.

Here's an animation of a simple bouncing ball:

- [animation1/bouncing-ball](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/405599/View)

But you didn't think it was that easy, did you? It's not. The hard
part is always in modeling the physics of the situation. That bouncing
ball uses a cosine function, which is easy to program and looks pretty
good, but isn't physically accurate (it should be a parabola).

## Organizing your Code

Animations can sometimes be hard to debug, because the state of variables is
changing so quickly, often 60 times per second. Consequently, I strongly
suggest setting up your code to make it easy to

- reset the animation to the initial state
- advance the animation by one step
- start the animation going (continuously "looping")
- stop the animation (freezing it at the current state).

We can see all of these in the bouncing ball demo:

- [animation1/bouncing-ball](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/405599/View)

But before we take on the bouncing ball, let's look at a demo that is a lot
easier:

- [animation1/spinning-cube](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/405599/View)

Let's review the code for the spinning cube in two chunks. The first
chunk is things you are familiar with from past examples.

```js
// parameters of the scene and animation:
const guiParams = {
    vx: 0.01,       // x rotation velocity
    vy: 0.02,       // y rotation velocity 
    vz: 0.04,       // z rotation velocity 
};

// state variables of the animation
var animationState;

// sets the animationState to its initial setting
function resetAnimationState() {
    animationState = {
        time: 0,
        // rotation angles
        rx: 0,
        ry: 0,
        rz: 0
    };
}
resetAnimationState();

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene, 
               {minx: -5, maxx: 5,
                miny: -5, maxy: 5,
                minz: -5, maxz: 5});

// needs to be a global so we can update its position
var cube;

function makeScene() {
    scene.remove(cube);
    cube = new THREE.Mesh(new THREE.BoxGeometry(2,2,2),
                          new THREE.MeshNormalMaterial());
    const as = animationState;  // just a shorthand
    // set the initial state of the cube
    scene.add(cube);
}
makeScene();
```

That code should be reasonably clear. One somewhat new piece is
`resetAnimationState()` which sets a global variable back to a bunch
of initial values. We will keep the collection of values that comprise
the state of the animation in a JS object named `animationState`. Here
it doesn't have a lot in it, but for more complicated animations, it
would have a lot more. (Or, we can look at a *distributed*
representation of state.) We'll have one property for each value that
changes with time, plus, of course, `time` itself.

Those values are used in setting the initial rotation of the cube.

Now, read over the rest of the code of the demo, figuring out what you
can, then we'll pick it apart one piece at a time.

```js
function updateState() {
    animationState.time += 1;
    // increase the total rotations by the user-specified velocity
    animationState.rx += guiParams.vx;
    animationState.ry += guiParams.vy;
    animationState.rz += guiParams.vz;
    // rotate the cube around the x,y,z axes
    cube.rotateX(guiParams.vx);
    cube.rotateY(guiParams.vy);
    cube.rotateZ(guiParams.vz);
}

function firstState() {
    resetAnimationState();
    makeScene();
    TW.render();
}

function oneStep() {
    updateState();
    TW.render();
}

// stored so that we can cancel the animation if we want
var animationId = null;                

function animationLoop(timestamp) {
    oneStep();
    animationId = requestAnimationFrame(animationLoop);
}

function startAnimation() {
    // stop any existing animation
    stopAnimation();
    animationLoop();
}

function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
        console.log("Cancelled animation using "+animationId);
    }
}

TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",startAnimation,"go:  start animation");
TW.setKeyboardCallback("q",stopAnimation,"quit: stop animation");

var gui = new GUI();
gui.add(guiParams,"vx",0,0.5);
gui.add(guiParams,"vy",0,0.5);
gui.add(guiParams,"vz",0,0.5);
```

Next, we need to look at how to advance the simulation by one step. We'll
advance time, set the cube's rotation around all the axes, and redraw. Note,
below, that we've separated the updating from the rendering.

```js
function updateState() {
    animationState.time += 1;
    // increase the total rotations by the user-specified velocity
    animationState.rx += guiParams.vx;
    animationState.ry += guiParams.vy;
    animationState.rz += guiParams.vz;
    // rotate the cube around the x,y,z axes
    cube.rotateX(guiParams.vx);
    cube.rotateY(guiParams.vy);
    cube.rotateZ(guiParams.vz);
}

function oneStep() {
    updateState();
    TW.render();
}
```

Next, let's look at how to start the animation. The function below is named
`animationLoop`, but of course it doesn't have a loop in it. What the function
does is advance the animation by `oneStep`, and then invoke
`requestAnimationFrame` with itself as an argument, so that as soon as the
browser is done drawing this frame, it will call the `animationLoop` function
again to draw the *next* frame.

Note that the `requestAnimationFrame` function returns a value that can be
used to cancel a request. We store that in a global variable so that it's
available to another function. We'll see that in a moment.

```js
// stored so that we can cancel the animation if we want
var animationId = null;                

function animationLoop(timestamp) {
    oneStep();
    animationId = requestAnimationFrame(animationLoop);
}
```

Finally, we need to be able to stop the animation. The
`requestAnimationFrame()` function (defined by the browser, not by
Three.js or even by WebGL; you can use it with 2D canvas drawing)
returns an integer that is meaningless by itself, but can be given as
an argument to `cancelAnimationFrame()` to cancel the request:

```js
function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
        console.log("Cancelled animation using "+animationId);
    }
}
```

It's good to bind each of these to keys, so that we can control the animation
from the keyboard, without cluttering the visual interface. These are the
assignments I use, but of course these are arbitrary. Choose any mapping you
like.

```js
TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",startAnimation,"go:  start animation");
TW.setKeyboardCallback("q",stopAnimation,"quit: stop animation");
```

## Animation Techniques

We can break animation techniques down into two broad categories, roughly:

- derivative or delta: how does the scene change from frame to frame?
- positional: where are things supposed to be at a given time?

As far as I know, these names are not standard; they are just how I
organize the techniques.

Drawing on a concept from calculus, you can see that the first
technique gets its name because it is the derivative of the position
function. We first describe derivative techniques, and then (next
time) positional techniques.

## Derivative Techniques

Often the simplest technique is just to adjust the scene in some
straightforward way, ignoring time. That's what we did with the spinning cube.

Essentially, all our animation loop computations are based on something like:

```js
function updateState() {
    // both of these are globals
    position += velocity;
    updateScene();
    TW.render();
    requestAnimationFrame(updateState);
}
```

We named the variable on the right `velocity` because by definition,
velocity is the change in position. If the velocity is large, there
will be a big change in position; if the velocity is small, there will
be a small change. Note also that velocity can be either positive or
negative, so position can increase or decrease. (In practice, these
variables would probably not be global, but we've omitted those
details here.)

You'll notice that time does not appear in the computation
above. Essentially, each frame of our animation is one time step,
which means we can think of the above computation as the following:

```js
function updateState() {
    var deltaT = 1;
    position += velocity * deltaT;
    TW.render();
    requestAnimationFrame(updateState);
}
```

where `deltaT` is our time step (not necessarily real time), and it has the
value 1 by the way we are building the animation. As you probably remember
from high-school physics, if an object is moving at 10 meters per second, and
deltaT is 5 seconds, the object moves 50 meters. That's exactly what we're
doing above.

If your model is based on real-world objects with real-world positions and
speeds (say, meters and meters per second), you need to understand that each
frame of the animation is one time unit (say, one second or one millisecond).

The time unit and speeds are also crucial for determining the *smoothness* of
your animation. If your object jumps by a whole bunch from one frame to the
next, the animation may look jerky. To fix this, you'd need to reduce your
`deltaT`, say from one second to half a second, or even a tenth of a second.
Thus, your computations become:

```js
function updateState() {
    const deltaT = 0.1;
    position += velocity * deltaT;
    TW.render();
    requestAnimationFrame(updateState);
}
```

For a slightly more complex motion, still based on the derivative
approach, consider the [animation1/mass-spring](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/405599/View) demo. This is a classic example from physics, where the
mass moves due to a force exerted on it by the spring. The spring
exerts a force that depends on the amount that the spring is stretched
or compressed and hence on the position of the mass. The force yields
an acceleration that depends on the mass (more mass, less
acceleration). Acceleration, of course, results in a changing
velocity, and velocity results in changing position. Thus, at each
time step, the idle callback computes:

```js
function updateState() {
    // all of these are globals
    massA = - springK / mass * massX;
    massV += massA * DeltaT;
    massX += massV * DeltaT;
    TW.render();
    requestAnimationFrame(updateState);
}
```

The nature of this particular model is such that the velocity is
sometimes negative and sometimes positive, so the mass moves back and
forth, oscillating endlessly.

There are variant mass-spring models with damping (friction) that
slows the mass down based on its velocity. A google search for
"mass-spring" yields many results, so feel free to investigate if you
like.

Here's one I did some time ago. It doesn't draw a real spring, only a
line, so I called is "mass-string":

- [animation1/mass-string](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/405599/View)

The key part of that code is how the positions are updated:

```js
function updateState() {
    // changes the time and everything in the state that depends on it
    animationState.time += guiParams.deltaT;
    var x = animationState.massX;
    var v = animationState.massV;
    var a = animationState.massA;
    var dt = guiParams.deltaT;

    // by diff eq
    a = -1 * guiParams.springK / guiParams.mass * x;
    v += a * dt;
    x += v * dt;

    // copy back into state
    animationState.massX = x;
    animationState.massV = v;
    animationState.massA = a;

    // update the scene:
    massObj.position.x = x;
    scene.remove(springObj);
    springObj = line(new THREE.Vector3(-guiParams.sceneWidth/2, guiParams.massSize/2, 0),
                     new THREE.Vector3(x,                       guiParams.massSize/2, 0));
    scene.add(springObj);
}
```

In more complex animations, there are round-off errors that can
accumulate, so there's a whole field of study for numeric solutions to
differential equations. For example, the
[Runge-Kutta](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods)
methods. Those are very cool, but bring us outside the scope of CS
360.

## Summary

- Animation requires redrawing the scene after modifying the state
- We use the `requestAnimationFrame(func)` function to do so.
- We supply a function that
  - updates the state, and
  - renders the scene
- Our function gets invoked whenever the browser is *idle*, so the
  animation runs as fast as possible.

I suggest having functions that:

- resets the state to initial conditions
- advances the state by some *delta*
- starts the animation
- stops the animation

Binding each of these to keys makes for a good UI for debugging and
running your animation. I use the following keys:

- 0: go to initial conditions
- 1: advance by one step
- g: "go" — start the animation
- q: "quit" — stop the animation
