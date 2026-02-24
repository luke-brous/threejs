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



# Project 3: Camera Views

This assignment provides practice with setting up and modifying a camera to
view a scene from a desired viewpoint. There are two parts involving
programming and a third part with some math exercises. None of the programs
should use `TW.setupCamera()`; you need to set up your own camera using
Three.js. (A consequence of this is that the mouse doesn't work for either
program, because this was set up by `TW.setupCamera()` in past examples.) You
will also implement keyboard callbacks for each of the two programming parts.


## Setting up and Modifying a Camera

We've discussed setting up a camera. To modify a camera, you could delete it
from the scene, create a new one, and render using the new one. Or, you could
modify the old one.

If you modify the FOV (which you will do for some of these), you will
need to update the projection matrix. That's just one extra step,
calling the `updateProjectionMatrix()` method:

```js
camera.fov = fov;
camera.updateProjectionMatrix();                // then add this line
// camera location
camera.position.set(eyex,eyey,eyez);
camera.up.set(upx,upy,upz);
camera.lookAt(new THREE.Vector3(atx,aty,atz));  // do this last
render();
```

(The `render()` function must be defined, as described in the reading.)

## Part 1, Barnviews

Here's the goal:

[barnviews solution](https://rtsowell.sewanee.edu/courses/cs360/threejs/demos/barnviews/barnviews-solution.html)

When viewing this page, type any of the keys numbered 1 to 5, and a
new view of the barn will appear. For this part of the assignment, use
the wire barn constructed with the `TW.wireBarnMesh(width, depth,
height)` function defined in TW. (This makes the projection easier to
see). You should create a barn that is 10 units wide, 10 units high
and 20 units deep, with the reference point (lower left front corner)
at the origin. Note that the *height* is the height at the "shoulders"
(the height of the vertical walls), not the height at the peak of the
roof. The reference point is marked in white on the wire barn.

More info on `TW.wireBarnMesh()`:

```js
// Returns a Mesh object that shows a wireframe barn of given width
// (along the X), height (along the Y) and depth (along the Z), ready
// to add to the scene. The origin is at the front, left, bottom
// vertex. The height is the height at the "shoulders" of the barn,
// not the peak.

TW.wireBarnMesh = function (width, height, depth) {
     ...
}
```

I want you to try to duplicate my camera shape and location as closely as
possible. In other words, try to analyze how things are projecting to see if
you can reverse-engineer to set up a similar camera. This will help you when
you are trying to achieve a particular look in your own scenes.

I'll make you some guarantees: all my numbers are nice integers, or simple
calculations from nice integers. So if you get close, you'll likely be exactly
on. I also didn't modify the aspect ratio, and the distance to the near and
far planes are such that everything is visible. You only have to worry about
the FOVY (field of view in the Y direction) and the arguments to position the
camera.

The FOVY may change from scene to scene!

As noted earlier, my program defines the following keyboard callbacks and
scenes; yours must too (i.e. you should determine what the camera settings are
when you enter each of the integers from 1 to 5, and try to duplicate this as
closely as possible in your own code).

Plan to use `TW.wireBarnMesh(10,10,20)` to make your barn and add it to the
scene. That's in the starter code.

Note that in the demo above, the text at the top of the page changes
as different keys are typed. The HTML element for this text has an
`id` of "slidename". That is, the `main.html` file has the following
code, preceding the `<script>` tag that loads your `main.js`.

```html
<h2 id="slidename">Slide</h2>
```

You can alter the text in this element with a JavaScript
statement like this:

```js
document.getElementById('slidename').innerHTML = "Slide 1";
```

Doing that will make your program just a little more clear.


### Wirebarn

I've implemented a wire barn using TW. You can see it in action in the starter code:

[barnviews starter](./barnviews/main.js)

You'll notice that I changed the background color to black; I think
it's easier to see the lines against a black background. When I have
time, I'll update the solution to match.

I've also added the `h2` html element that can be used to display the slide
number to the wirebarn.

## Part 2, Flythrough

Here's the goal:

[flythrough solution](https://rtsowell.sewanee.edu/courses/cs360/threejs/demos/flythrough/flythrough-solution.html)

The idea is that you'll create N frames of an animation of a plane
landing near the barn. I used a field of view of 90 degrees. Here I
used N=10, assigned to keys 0-9, but if you find a pattern, you'll see
that you can easily generate as many frames as you like.

A good starter code is the house-fence scene:

[flythrough starter](./flythrough/main.js)


## TW.setKeyboardCallback()

You should plan to use `TW.setKeyboardCallback()` for both Part 1 and Part 2.
This function takes three arguments, like this:

```
TW.setKeyboardCallback("1", fred, "camera setup 1");
```

- The first argument is a one-character string that defines the key you want to bind.
- The second argument is a function object. The system will invoke
  that function when the key is pressed. Remember that if you give the
  name of a function, like `fred`, you will *omit* the parentheses,
  because you are not invoking `fred` now; the system will be invoking
  it later.
- The third argument is the documentation string that is displayed if
  the user presses the question mark key (`?`) to show the available
  keyboard callbacks.
- There is an optional fourth argument that is a boolean that
  indicates whether to set this callback in a master list of shared
  callbacks, or set it in a local list just for this canvas. The
  default is false, which is just for this canvas, which is what
  you'll want for this assignment.

You should set up keyboard callbacks after the canvas exists, which is done by
`TW.mainInit()`. So, do these at the *end* of `main.js`

## Math

Solve the problems in [Math
3](./math/math3.pdf).

## Submission

To submit your project, create a zip file of the entire project folder.  Be sure to include your completed code for both barnviews and flythrough and your solutions to the math problems.  Then, upload your zip file to Brightspace.
