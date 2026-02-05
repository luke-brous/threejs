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

# Material and Lighting: The Phong Model

In this reading, you'll learn how to create objects with different
surface materials, such as dull or shiny surfaces, and how to add
simple light sources to the scene. In order to render realistic
looking graphical images of such scenes, we need to understand how
surfaces reflect light. This process is captured in the Lambert and
Phong Models.

## Lighting Models

You'll notice that when we color objects directly using RGB, there is no
shading or other realistic effects. They're just "cartoon" objects. In fact,
since there is no shading, it's impossible to see where two faces meet unless
they are different colors.

Lighting models are a replacement for "direct color" (where we directly
specify what color something is using RGB). Instead, the actual RGB values are
*computed* based on properties of the object, the lights in the scene, and so
forth.

There are several kinds of lighting models used in Computer Graphics,
and within those kinds, there are many algorithms. Let's first lay out
the landscape, and then explore part of what is available in
Three.js. The two primary categories of lighting are

- Global: take into account properties of the whole scene
- Local: take into account only
  - material
  - surface geometry
  - lights (location, kind, and color)

*Global* lighting models take into account interactions of light with objects
in the room. For example:

- light will bounce off one object and onto another, lighting it
- objects may block light from a source
- shadows may be cast
- reflections may be cast
- diffraction may occur

Global lighting algorithms fall into two basic categories, ray-tracing and
radiosity algorithms:

[Ray-tracing](http://en.wikipedia.org/wiki/Ray_tracing_(graphics)):
conceptually, the algorithm traces a ray from the light source onto an object
in the scene, where it bounces onto something else, then to something else,
..., until it finally hits the eye. Often the ray of light will split,
particularly at clear surfaces, such as glass or water, so you have to trace
two light rays from then on. Furthermore, most rays of light won't intersect
the eye. For efficiency, then, algorithms may trace the rays backwards, from
the eye into the scene, back towards light sources (either lights or lit
objects).

[Radiosity](http://en.wikipedia.org/wiki/Radiosity_(computer_graphics)): any
surface that is not completely black is treated as a light source, as if it
glows. Of course, the color that it emits depends on the color of light that
falls on it. The light falling on the surface is determined by direct lighting
from the light sources in the scene and also indirect lighting from the other
objects in the scene. Thus, every object's color is determined by every other
object's color. You can see the dilemma: how can you determine what an
object's color is if it depends on another object whose color is determined by
the first object's color? How to escape?

Radiosity algorithms typically work by iterative improvement (successive
approximation): first handling direct lighting, then primary effects (other
objects' direct lighting color), then secondary effects (other objects'
indirect lighting color) and so on, until there is no more change.

Global lighting models are very expensive to compute. According to
Tony DeRose, who was at Pixar at the time, rendering a single frame of
the Pixar movie *Finding Nemo* took *four hours*. For *The
Incredibles* (the next Pixar movie) rendering each frame took *ten
hours* , which means that the algorithms have gotten more expensive
even though the hardware is speeding up. Of course, it's many years
later, and hardware has continued to improve, but nevertheless, most
real-time computer graphics systems rely on *local* lighting, and
that's what we will stick to.

## Local Lighting

*Local* lighting models are perfect for a pipeline architecture like
OpenGL's, because very little information is taken into account in
computing the RGB values. This enhances speed at the price of
quality. To determine the color of a polygon, we need the following
information:

- material: what kind of stuff is the object made of? Blue silk is
  different from blue jeans. Blue jeans are different from black
  jeans.
- surface geometry: is the surface curved? How is it oriented? What
  direction is it facing? How would we even define the direction that
  a curved surface is facing?
- lights: what lights are in the scene? Are they colored? How bright
  are they? What directions does the light go?

Three.js manages to fall somewhere in between, because it can use the
Scene Graph data structure to compute shadows, but it doesn't do the
full ray-tracing or radiosity computation. We'll look at shadows
later in the course; Three.js makes them quite easy.

The rest of this reading describes two of the local lighting models,
as in Three.js, namely the "Lambert Model" and the "Phong Model." The
Phong Model is a superset of the Lambert Model, so we'll start with
the Lambert Model and then extend it to the Phong Model. We're going
to proceed in a "bottom-up" fashion, first explaining the conceptual
building blocks, before we see how they all fit together.

Later in the course, we'll look at a newer addition to Threejs, namely
the Standard Material.

## Local Lighting Demo

To see a demo of what we'll be able to accomplish with the Phong model
that we'll learn today, run the lit teddy bear demo:

[phong/teddybear](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/402056/View)

There are three lights whose intensity you can control: ambient light,
a point light and a directional light. We'll learn more about these in
a moment. Play around with the demo for a moment. Notice:

- the light is coming from above. (Trust me on this.)
- shading of the bear's material, lighter above because the light is
  coming from that direction
- the bear's material is not completely black even at surfaces facing
  away from the lights
- the nose and eyes have white dots because they are *shiny* and
  reflect light

What do you notice about the lighting that doesn't seem realistic?

We'll learn how to achieve these effects in this reading.

## Material Types

Because the Phong model is focussed on speed, a great many
simplifications are made. Many of these may seem overly simplistic or
even bizarre.

The first thing is to say that in the model, there are only two ways
that light can reflect off a surface, and we'll put surfaces into two
broad groups, which we'll call diffuse and specular:

- **Diffuse**: These are rough surfaces, where an incoming ray of light
  scatters in all directions. The result is that the direction from
  which the material is viewed doesn't matter much in determining its
  color and intensity. Examples:
  - carpet, cloth, fuzzy material like the teddy bear
  - dirt, rough rock
  - dry grass

Look at the lit bear from different angles and you'll see that the direction
from which you view a patch of brown doesn't affect the color (the brown is a
diffuse material).

- **Specular**: These are smooth, shiny surfaces, where an incoming
  ray of light might bounce, mirror-like, and proceed on. The result
  is that, if the camera is lined up with the reflected rays, we'll
  see a bright spot caused by that reflection. This is called a
  specular highlight. Examples:
  - plastic, like the bear's eyes
  - metal
  - polished leather

Look at the lit bear's eyes, which are made from a specular material
(let's imagine they are shiny glass or buttons), and you'll see a
specular highlight.

So, we really only need to understand *diffuse* and *specular*
surfaces. The modeling of diffuse reflection of light has the
brightness of the surface computed by *Lambert's cosine law*. See the
Wikipedia article on [Lambertian
reflectance](http://en.wikipedia.org/wiki/Lambertian_reflectance). The
modeling of specular reflection uses a model by Bui Tuong Phong and so
is called the [Phong reflection
model](http://en.wikipedia.org/wiki/Phong_reflection_model).

The following figure and caption is copied from the Wikipedia page on that Phong model:

![four pictures of a scene of a bulging 3D letter X lit from the right: the leftmost (ambient component) is dull purple all over, the next (diffuse component) is dark on the surfaces facing away from the light and brighter on the surfaces facing towards the light, the next (specular component) is black except for a few spots of white on the right-facing surfaces, and the fourth is the sum of all three.](images/960px-Phong_components_version_4.png)


Visual illustration of the Phong equation: here the light is white,
the ambient and diffuse colors are both blue, and the specular color
is white, reflecting a small part of the light hitting the surface,
but only in very narrow highlights. The intensity of the diffuse
component varies with the direction of the surface, and the ambient
component is uniform (independent of direction).

The Phong model includes Lambertian as a special case. Three.js calls
these materials `MeshLambertMaterial` and `MeshPhongMaterial`.

Important points on the math (but we'll see more below):

- Lambertian: we are very interested in how much the surface is
  *facing* the light: the more the surface is facing the light, the
  brighter it should be. Mathematically, we are interested in the *cosine*
  of the angle between two vectors:
  1. the surface normal (a vector that is perpendicular to the surface) and
  2. the light vector (a vector pointing towards the light)
- Phong: we are also interested in how much the vector towards the eye
  (the camera) lines up with the vector of perfect reflection. We will
  again use a *cosine* to compute that.

## Kinds of Light

In talking about kinds of material, we divided them into diffuse
(Lambert) and specular (Phong). Of course, most materials have some
of each: you get color from the diffuse properties of, say, leather,
but a shine of specular highlight at certain angles.

A major part of the Phong light model, then, is light interacting with
these two properties of material. The model, therefore, divides
*light* into different kinds, so that *diffuse* light interacts with
the *diffuse* material property and *specular* light interacts with
the *specular* material property. It seems weird to say there are
different kinds of light, but it's just to have a number corresponding
to the numbers describing the materials; these numbers get multiplied
together in the models.

The three kinds of light are:

- ambient
- diffuse
- specular

As we just said, the diffuse and specular light components interact
with the corresponding material properties.

What is "ambient" light? As you might guess from the name, it's the
light all around us. In most real-world scenes, there is lots of light
around, bouncing off objects and so forth. We can call this "ambient"
light: light that comes from nowhere in particular. Thus, ambient
light is *indirect* and *non-directional*. It's the local-lighting
equivalent of "radiosity."

Even though in local lighting, we don't trace ambient light rays back
to a specific light source, there is still a connection. This is
because, in the real world, when you turn on a light in a room, the
whole room becomes a bit brighter. (Therefore, for realism, when we
turn on a light source, we should probably increase the ambient light
a bit.)

That ambient light interacts with the "ambient" property of a material.
Because of the way it's used, a material's ambient property is often exactly
the same color as the diffuse property, but they need not be.

Thus, each material also has the three properties: ambient, diffuse, and
specular. We'll get into the exact mathematics later, but for now, you can
think of these properties as *colors*. For example, the ambient property of
brown leather is, well, brown, so that when white ambient light falls on it,
the leather looks brown. Similarly, the diffuse property is brown. The
specular property of the leather is probably gray (colorless), because when
white specular light reflects off shiny leather, the reflected light is white,
not brown.

## Light Sources

In Three.js, you create a light source as an object and add it to the scene.
Lights that are part of the scene contribute to the lighting of the objects in
the scene. The lights themselves are not visible, even if the camera is
staring straight at them. Lights only manifest themselves by illuminating
objects and interacting with the objects' materials. (You can of course, put a
sphere or something at the location of a light, if you want.) Three.js has
some "helper" objects that can do this for you.

## Ambient Lights

As we said above, ambient light is generalized, non-directional light that
illuminates all objects equally, regardless of their physical or geometrical
relationship to any light source. Thus, the location of an ambient light
source is irrelevant.

In Three.js, you can create an
[AmbientLight](https://threejs.org/docs/index.html#api/lights/AmbientLight)
like this:

```js
const color = 0xffffff; // white
const intensity = 0.25; // turned down to 25%
const ambLight = new THREE.AmbientLight( color, intensity );
```

Like many of the light types in Three.js, this light has an
*intensity*. This is just a factor that the color is multiplied by, so
you can use this to make a light brighter or dimmer. The default value
of intensity is 1, but I suggest using the first argument to specify
the *hue* of the ambient light (thinking of our HSL color space) and
use the second argument to turn it up or down (the *lightness* in our
HSL color space). Because we used an intensity of 0.25 above, that
ambient light is a dark gray, contributing just a little brightening
to the scene.

I suggest using white (0xffffff) as the ambient color, and setting up
a slider for intensity, and adjusting the slider until you are happy
with the resulting scene.

Usually, the ambient light is a shade of white or gray (in other
words, no *hue*), but if your scene has a lot of a particular color in
it (say, the walls of the room are mauve, so every object in the room
is getting a lot of mauve light falling on it), you might have your
ambient light contribute that color to every object. [The favourite room of Empress Alexandra Feodorovna in the Alexander Palace was the Mauve (aka Lilac) Boudoir.](https://tsarnicholas.org/2020/11/04/the-history-and-restoration-of-the-mauve-lilac-boudoir-in-the-alexander-palace/)

## Ambient Demo

We will use the following demo for the rest of this reading, because
it can be used to visualize many of the ideas and concepts we are
learning. It has a ton of parameters, but don't be intimidated. We'll
explore it bit by bit.

[phong/shapes](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/402056/View)

When you first open it, all three light sources are off, so the scene
is entirely black. There are three objects in the scene: a sphere, a
box, and a cone, all gathered around the origin. I suggest doing the
following:

- open the *material* folder and notice the sky blue lambert color
  that is applied to all the objects.
- open the *ambient* folder and toggle on the ambient light. You'll notice
  that all the objects are now dark blue.
- slide the intensity up and down to get a feel for its effect
- an intensity of about 3 will color the objects about the same as the
  material.
- usually, we'll use white as the ambient color, but try some
  alternatives, just to see the effect of mixing non-white light with
  the material color.

You probably noticed that we don't see any edges of the objects, just
as with `MeshBasicColor`. That's because every face interacts with
ambient light in the same way, so they all get the same effective
color. So far, it seems like the only advantage of ambient color is
the intensity slider, but hang in there. Ambient is only one component
of the Phong model.

Here's the code that set up the ambient light in our demo:

```js
ambLight = new THREE.AmbientLight( p.ambient.color,
                                   p.ambient.intensity );
ambLight.visible = p.ambient.on;
scene.add(ambLight);
```

Lights have a `.visible` property. When that value is false, they are
*off* and ignored. (Actually, *all* objects have the `.visible`
property, and setting it to false means they won't be rendered,
effectively removing them from the scene, though they are still
cluttering up the scene graph.) So, that's how we turn this light
on/off using the GUI. It would also work to just set the intensity to
zero.

## Point Sources

A common source of light in Three.js is a "point source." You can
think of it as a small light bulb, radiating light in all directions
around it. This is somewhat unrealistic, but it's easy to compute
with.

To do this in Three.js, we use a
[THREE.PointLight](http://threejs.org/docs/#api/lights/PointLight). Here's
how you can create one:

```js
const color = 0xffffff; // white light
const intensity = 2;    // brightness
const pointLightDistance = 0; // the default
const pointLightDecay = 0;    // default is 2, physical model
const pointLight = new THREE.PointLight( color,
                                         intensity,
                                         pointLightDistance,
                                         pointLightDecay);
pointLight.position.set(x,y,z);
scene.add(pointLight);
```

The *color* and *intensity* arguments are just as they were for
ambient lights.

The last argument deserves some discussion. The *decay* parameter
determines how point lights fall off (attenuates) with distance. In
other words, how much less light a surface gets from this point light
is based on how *far* the surface is from the light. The default is 2,
which says that the light falls off with the square of the distance.

The default decay of 2 corresponds with real physics. In the real
physical world, light attenuates inversely with the square of distance
(because the light energy is spread out over the surface of a
sphere). Thus, if there were a planet that were half the distance from
the sun as the earth is, it would get *four* times as much solar
energy. (Venus is 0.72au, so it gets almost twice the solar energy per
square meter as Earth does, because $1/(.72)^2\approx 2$)

However, for many scenes with point lights, this decay is very severe
and using the default of 2 means:

- having to greatly increase the intensity of the light
- having to fiddle with positioning a lot

For now, I suggest setting the decay to zero and using intensity
sliders from 0-10 or so. If I use the default decay of 2, I end up
using intensities well over 100, and some parts seem overly lit, while
others are in the dark. But maybe I'm just being lazy.

My demos of the Phong model use a decay of zero.

Later in the course, we'll discuss the *standard material* and
Physically Based Rendering, which is much closer to real physics.

## Positioning Lights

You'll notice that we positioned the light and added it to the scene:

```js
const pointLight = new THREE.PointLight( ... );
pointLight.position.set(x,y,z);
scene.add(pointLight);
```

## Point Light Demo

Let's return to the shapes demo.
This time, let's use it to explore point lights. Open it and try the following:

- toggle the "point" folder open and click the button to turn on the point light
- notice that the objects light up but they are *shaded* because of
  the *location* of the light.
- the demo marks the location of the light with a white wireframe
  object, but that's a helper that is entirely separate from the
  light. *Light sources are invisible*
- move the camera around so you can see the scene from different
  angles and confirm that the surfaces facing the light are brighter,
  and the brightness depends on how much they face the light.
- notice that surfaces facing away from the light (such as the bottom
  of the box) are entirely black. If you don't want them entirely
  black, you can turn on the ambient light; that's what it's for.
- play with the intensity of the light. If both the ambient and the
  point source are very bright, the surfaces can be driven all the way
  to white.
- The x,y,z sliders adjust the *location* of the point light. Try
  moving it around to see the effects.

Playing around with these sliders should give you some good intuition
about point lights and the Phong/Lambert model in general. We'll get
into the mathematics of the computation below.

Here's the code that set up that point light:

```js
const pointLightDistance = 0; // the default
const pointLightDecay = 0;    // default is 2, physical model

pointLight = new THREE.PointLight( p.point.color,
                                   p.point.intensity,
                                   pointLightDistance,
                                   pointLightDecay);
pointLight.position.copy( p.point );
pointLight.visible = p.point.on;
scene.add(pointLight);
```

Notice the toggling of the light using a boolean (controlled by the
GUI), just like we did for ambient lights.

As a brief aside on coding, there is a small trick here. The x,y,z
values for the position are all in a dictionary (allowing us to set up
GUI sliders), so rather than do:

```js
pointLight.position.set(p.point.x, p.point.y, p.point.z);
```

we do

```js
pointLight.position.copy( p.point );
```

Finally, we can add some code to set up the `PointLightHelper` object
(which takes the point light as an argument). We toggle its visibility
using the same boolean.

```js
pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
pointLightHelper.visible = p.point.on;
scene.add(pointLightHelper);
```

## Directional Lights

The last kind of light we will discuss in this reading is a
*directional light*. The threejs documentation is here:
[DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight)

You can think of a directional light as similar to a point light that
is infinitely far away, so that the light rays from the source into
the scene are parallel. A common example is the sun where the light
rays are all parallel. (That simplifies some of the calculations, so
directional lights are a little more efficient than point lights.)

With directional lights, there is no setting for distance or decay, so
that's easier.

What's a little trickier is positioning. Consider this setup:

```js
// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(-10,10,0);
scene.add( directionalLight );
```

Positioning the light at (-10,10,0) means that the light is coming in
from that direction. You can imagine a vector from the light's
position to the light's *target* (default is the origin) and all the
light rays are parallel with that vector. So the implicit vector in
our example is:

$$ \vec{v} = (0,0,0) - (-10,10,0) = (10,-10,0) $$

In other words, the light is coming down at a 45 degree angle in the
Z=0 plane, or from the upper left in our default camera view. Let's
turn to the demo to see this.

## Directional Light Demo

Return again to the shapes demo. Now toggle on just the directional light. This also turns on a helper
object, but I personally find this helper object less useful than the
point light helper. But we have it just in case. I've also marked the
*target* with a yellow sphere at the origin.

Here are some suggestions for exploring the demo:

- turn on the directional light
- notice that the left and top surfaces of the objects are lit.
- look particularly at the box. The top and left face are exactly the
  same color, because they are at exactly the same 45 degree angle
  with the light
- the front and back faces of the box are black because the light rays
  are parallel with those faces of the box.
- you can also infer the direction of the light from the sphere: the
  equator where the darkness starts is exactly perpendicular to the
  light direction. That's the most useful tip I can give.
- As always, you can play with the intensity and color of the light.
- Adjust the position of the light and notice how the scene lighting
  changes. This is very similar to point lights.
- Adjust the target location as well.

Try enabling all three lights and adjusting them so that the scene
looks *nice to you*.

The code to create a directional light is fairly straightforward,
given our earlier knowlege:

```js
dirLight = new THREE.DirectionalLight( p.directional.color,
                                       p.directional.intensity);
dirLight.position.copy(p.directional);
dirLight.visible = p.directional.on;
scene.add(dirLight);
```

I've omitted the code to add the helpers; you're welcome to click
through to the `main.js` file to take a look. When working with either
point or directional lights, I find it useful to put a big sphere into
the scene and use it to infer the location and direction of the
lights.

## Lambert Model

Now, let's turn to the mathematics behind these scenes. The material
our shapes demo has been using (so far) is *Lambertian*. That means it
only considers the ambient and diffuse components of the
lights. Phong's model adds a *specular* component to the computation,
but we'll start with the Lambertian part alone, since it explains what
we've seen so far.

First, we need some notational building blocks:

- $\vec{N}$: the normal vector for the surface. This is a vector that is
  *perpendicular* or *orthogonal* to the surface.
- $\vec{L}$: the vector towards the light source; that is, a vector from
  the point on the surface to the light source (not used for ambient
  light). For distant lights, this vector doesn't change from point to
  point.

Let's say a bit more about the normal vector. The normal vector is how
we define the "orientation" of a surface — the direction it's
"facing." The normal vector is the same over a whole flat face of a
geometry. For example, the entire top of the box has a normal vector
of (0,1,0), because it is facing "up" or parallel to the positive Y
axis. Similarly, the front of the box has a normal vector of
(0,0,1). Of course, the sphere has a normal vector that is different
at every vertex.

Notice that the vector (0,2,0) would work just as well to define the
orientation of the top of the box, but the computations assume that
the vectors all have unit length. Unfortunately, mathematicians use
the word "normalize" to mean "scale a vector to unit length," which
means that our normal vectors are normalized, which sounds redundant,
but uses the word "normal" in two different ways.

In the model, we will have parameters defined as $\vec{i}$ that
represent the intensity of the incoming light. We saw this in the
Three.js code above. Turn them up and the light gets brighter.

We also have to worry about how much of the incoming light gets
reflected. Let this be a number called **R**. This number is a
fraction, so if **R** =0.8, that means that 80 percent of the incoming
light is reflected.

As we discussed earlier, in general, **R** can depend on:

- material properties: cotton is different from leather
- orientation of the surface
- direction of the light source
- distance to the light source

The intensity of the rendered light, $I$, is computed as follows

$$ I = k * R * i $$

The $k$ is a constant depending on the color of the material, such as
the sky blue of our demo. The $i$ is the intensity of the incoming
light. The $R$ is the fraction that is reflected.

Note that the above equation is a shorthand for computing the red,
green and blue independently, so it's three equations in one. We'll
use that shorthand throughout this reading.

We have separate computations like that for the *ambient* and
*diffuse* light and material properties. Thus, we have our
abstract Lambert model:

$$ I =
k_a i_a +
k_d R_d i_d
$$

The $I$ is the intensity of a color channel for the rendered color of
the object. The $a$ subscripts are for *ambient* material and light
and the $d$ subscripts are for *diffuse* material and lights.

The above equation is our *abstract* Lambert Model. We'll look briefly
at the ambient part and then turn to see how to compute the amount of
diffuse reflection.

## Ambient

The effect of ambient light doesn't depend on direction or distance or
orientation, so it's solely based on two factors: the color of the
material and the intensity of the ambient light. The color of the
material is the sky blue in our shapes demo.

The ambient contribution to the rendered color is the product of the two:

$$ k_a i_a $$

The $k_a$ is a constant that depends on the color of the
material. This same equation is used for the red, green and blue
components of the RGB color. So, you can think of $k_a$ as the, say,
blue component of the material's color.

Note that $0 \leq k_a \leq 1$ for each component. Why?

## Diffuse/Lambertian

For Lambertian/diffuse surfaces, we assume that light scatters in all
directions. In lay person's vocabulary, such surfaces are often called
"matte".

However, as we saw in the demos, the *angle* of the light does matter,
because the energy (photons) is spread over a larger
area. Earlier, we let $R_d$ stand for that. We will now say that:

$$ R_d = \left(\vec{L}\cdot\vec{N}\right) $$

Recall that $\vec{L}$ is the light vector, the direction to the light
source, and $\vec{N}$ is the normal vector, the orientation of the
surface. The $\cdot$ operator is the *dot product* between the two
vectors, described in the companion reading on [geometry
math](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/401267/View). The dot product of two normalized vectors (unit
length) gives the cosine of the angle between them. Thus the meaning
of this equation is that the amount of light reflected from a diffuse
surface is the product of a constant, chosen by you the programmer,
multiplied by the cosine of the angle between $\vec{L}$ and
$\vec{N}$. As before, there are actually 3 such constants, one each
for red, green, and blue.

Now, we finally have our finished Lambert Model:

$$ I =
k_a i_a +
k_d \left(\vec{L}\cdot\vec{N}\right) i_d
$$

This is summed over all the light sources. There is only one ambient
for any scene, but there could be multiple point and directional
sources. Because they are all summed, the more lights you have, the
brighter the scene, and sometimes it gets driven to white, as we saw.

## Lambertian Materials in Three.js

We've looked at how to define lights in Threejs; now let's look at how
to define Lambertian materials. Here's how that skyblue material for
the demo scene was defined:

```js
const color = 0x88ccff;
material = new THREE.MeshLambertMaterial({color: color});
```

which couldn't be easier. Note that `MeshLambertMaterial` uses the
color for *both* the diffuse and ambient parts of the computation. (In
other implementations of OpenGL, it's possible to separate these, but
it was rarely used, so Threejs's API is very convenient.)

## Phong Model

Now, let's turn to the full Phong Model by adding in specular
reflections. With specular reflections, the material is (locally)
smooth and is acting like a mirror. The incoming light rays bounce off
the material and head off at an angle equal to their incoming
angle. Before we turn to the math, let's repeat that picture from
above, this time paying attention to the third component:

![four pictures of a scene of a bulging 3D letter X lit from the right: the leftmost (ambient component) is dull purple all over, the next (diffuse component) is dark on the surfaces facing away from the light and brighter on the surfaces facing towards the light, the next (specular component) is black except for a few spots of white on the right-facing surfaces, and the fourth is the sum of all three.](images/960px-Phong_components_version_4.png)


Visual illustration of the Phong equation: here the light is white,
the ambient and diffuse colors are both blue, and the specular color
is white, reflecting a small part of the light hitting the surface,
but only in very narrow highlights. The intensity of the diffuse
component varies with the direction of the surface, and the ambient
component is uniform (independent of direction).

Those little spots of white that give the composite picture its shiny
appearance are called *specular highlights*. The Phong model adds the
computation of specularity to the Lambert model.

## Phong Model Demo

Before digging into the mathematics, let's play with our shapes demo
again, this time using Phong material.

- In the top folder, switch from "lambert" to "phong" material
- turn on the lights
- Notice a specular highlight (actually, *two*) on the ball, one for
  the point light and one for the directional light
- There's also a broad specular highlight on the cone
- If you move the camera around, the specular highlights will move as
  well, because they depend on the angle between the light source and
  the eye/camera. This is particularly noticeable with the box: at
  some viewpoints, you get a strong highlight and from others you get
  nothing at all.
- try moving the lights; again, the specular highlights move
- try adjusting the color of the lights. You'll notice that it not
  only affects the Lambertian color (combining with the sky blue) but
  also it directly manifested in the specular highlight, because the
  surface is acting like a mirror there, and the reflected light is
  the same as the incoming light.
- Usually, we use white for the specular "color" of an object, meaning
  that the reflected color is the same as the incoming color. But you
  can adjust the "specular" color of the material and try alternatives.

## Phong Model Mathematics

Now let's see how this is computed. We first need some more notational
building blocks:

- $\vec{V}$: the vector towards the eye. If the
  surface faces away from the viewer, the surface is invisible and
  OpenGL can skip the calculation.
- $\vec{R}$: the reflection vector of the light. If the surface at
  that point were a shiny plane, like a mirror, $\vec{R}$ would be
  the exact direction that the light would bounce in.

The following figure illustrates these vectors (it's an older figure,
so replace $\vec{R}$ with RV and $\vec{V}$ with EV:

![a curved surface hit by a blue arrow coming in from the right and two arrows leaving to the left: a purple arrow (EV) going to the eye EV and a red arrow (RV)](images/specular-reflection.png)


The blue vector is the incoming light. The red vector is RV, the
reflection vector. The purple vector is EV, the vector from the
surface to the eye. If RV and EV are closely aligned, the specular highlight
will be visible.

If the direction of our view, $\vec{V} $, is closely aligned with the
reflection direction, $\vec{R}$, as in the above diagram, we should
see a lot of that reflected light. This is called a "specular
highlight". We will once again use the dot product to define what it
means for two vectors to be "closely aligned". The contribution to the
color is:

$$ \left(\vec{R}\cdot\vec{V}\right)^e $$

The dot product is large when the two vectors are "lined up." The $e$
exponent is a number that gives the "shininess." The higher the
shininess, the smaller the spotlight, because the dot product (which
is less than one), is raised to a higher power. OpenGL allows $e$ to
be between zero and 128; the Threejs default is 30. In addition to
$e$, the OpenGL programmer gets to choose the specularity coefficient,
$k_s$ for each of red, green, and blue. This is the "specular color"
that we saw in the demo.

## The Complete Phong Model

Adding this last part to the Lambert Model gives us the Phong Model:

$$ I =
k_a * i_a +
k_d * \left(\vec{L}\cdot\vec{N}\right) i_d +
k_s * \left(\vec{R}\cdot\vec{V}\right)^e i_s
$$

Again, the diffuse and specular parts are summed over all the lights
in the scene.

## Summary

- There are three kinds of light: ambient, diffuse and specular
- There are (in principle) the same three kinds of material
  properties, but Threejs combines ambient and diffuse color and just
  calls it `color`. The specular color is called `specular`.
- Ambient light is constant from all directions
- Diffuse light depends on the angle between the light and the surface
- Specular light depends on the angle between the reflected incoming
  light and the eye, and also depends on a scalar quantity called
  *shininess* (the exponent in the Phong equation).
- In Threejs, you can create a Lambertian material just by specifying
  its intrinsic color.
- In Three.js, the `color` attribute of a Phong material captures how
  it interacts with diffuse and ambient light, and the `specular` and
  `shininess` properties capture the specular reflection of the
  surface material
- In Three.js, you can have:
  - Ambient light
  - Point lights
  - Directional lights

# Appendices

The following sections are optional, but you might find them interesting.

## Toggling Lights

When you are adjusting lights you sometimes want to toggle them
on/off, to see their independent effects. According to ChatGPT, mining
contributions that real people have made 
(such as [Discover Threejs tips and tricks](https://discoverthreejs.com/tips-and-tricks/)), we have these options:

- `light.intensity=0` (smoothest UI)
  - Looks off, doesn't recompile shaders, so no hitch when you flip it repeatedly.
  - Still counted as a light in the shader loop, so it won't improve performance much if you have tons of lights
- `light.visible=false` (truly disables the light)
  - The renderer stops considering the light at all.
  - Toggling can trigger shader recompile because the number of
    active lights changes which can cause a small one-time
    hiccup. Fine if you toggle rarely.
- `scene.remove(light)` (hard off)
  - similar to setting `visible` to false, but also consumes memory.

So, it seems like the best option is to include zero in your intensity slider.

## Appendix on Intensity

In the section on ambient lights we used the
following example:

```js
const color = 0xffffff; // white
const intensity = 0.25; // turned down to 25%
const ambLight = new THREE.AmbientLight( color, intensity );
```

We said this is a dark gray. It is similar to the following:

```js
const color = 0x808080; // 50% gray
const intensity = 0.50; // turned down to 50%
const ambLight = new THREE.AmbientLight( color, intensity ); // also 25%?
```

You might think they are *exactly* the same (I did), but internally,
Threejs converts between some different color spaces. Specifically, it
converts the first argument from sRGB units to linear-sRGB, and that
is a *non-linear* calculation, so multiplying the converted `0x808080`
gray by 0.5 doesn't yield the same color as multiplying the converted
`0xffffff` white by 0.25. We won't go further into this difference in CS
360, and it will not affect our work.
