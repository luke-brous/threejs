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


# Texture Mapping

Texture mapping was one of the major innovations in CG in the 1990s. It allows
us to add a lot of surface detail without adding a lot of geometric primitives
(lines, vertices, faces). See how interesting the scene below is with
all the texture-mapping.

![demo with textures](images/loadedDemo.png)


With textures


![demo without textures](images/loadedDemo-wo-textures.png)


Without textures

The only difference between these two pictures is the textures. The
lighting and material is all the same. In most cases, the material is
a shade of gray, because we are only using it to lighten/darken the
pixels from the textures (called *texels*, for *texture elements*).

In this reading, we'll begin with mapping a single image onto a plane, and
then map multiple images onto the sides of a cube.

Finally, we'll look at some practical programming issues that arise:

- asynchronous loading of texture files
- CORS (Cross-Origin Resource Sharing) restrictions

## Simple Image Mappings

Texture mapping paints a picture onto a polygon. Although the name is
*texture* -mapping, the general approach simply takes an array of
pixels (referred to as *texels* when used as a texture) and paints
them onto the surface. An array of pixels is just a picture, which
might be a texture like cloth or brick or grass, or it could be a
picture of, say, Homer Simpson. It might be something your program
computes and uses, but more likely, it will be something that you load
from an image file, such as a JPEG.

Consider this example of a floral scene mapped onto a plane:

[texture1/flower-plane](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/402770/View)

Here is the code to create the textured plane:

```js
var plane;

function displayPlane (texture) {
    // The flower0 is 256x256, so we need a square plane to map it onto.
    const planeGeom = new THREE.PlaneGeometry(params.width, params.height);
    const planeMat = new THREE.MeshBasicMaterial({color: 0xffffff,
                                                  map: texture});
    scene.remove(plane);
    plane = new THREE.Mesh(planeGeom, planeMat);
    scene.add(plane);
}
```

The key change is the `map` attribute of the (white) basic material,
where the value is a *texture* object. That texture object is the
argument to the function. Now let's see how to get one of those.

## Loading Textures

Unlike geometry and material, where our JS code can compute the
required coordinates and other properties, textures are stored in
image files that are not already loaded into the browser. So, we have
to do that. Fortunately, Threejs makes it pretty easy.

A
[`THREE.TextureLoader()`](https://threejs.org/docs/index.html#api/en/loaders/TextureLoader)
object is used to load an image texture. The `load()` method loads the
image with the specified URL (the `flower0.jpg` image is stored in the
same folder as the code file), and *when the image load is complete* ,
this method invokes the callback function provided, with the texture
as input.

First, we create the loader:

```js
// create a TextureLoader for loading the image file
var loader = new THREE.TextureLoader();
```

Next, we invoke this loader, giving it two arguments:

1. The file to load
2. The function to run when the file is loaded

```js
loader.load("flower0.jpg",
            function (texture) {
                // the following line isn't necessary; it's just for inspection
                globalThis.theTexture = theTexture = texture;
                // you don't need this, either
                reportTextureSize(texture);
                // this call does the real work
                displayPlane(texture);
            } );
```

Notice that the second argument is a *function*. In this case, it is
an *anonymous function*, that does a couple of optional steps, and
finally invokes the `displayPlane()` function that we looked at
earlier, with the loaded texture as its argument.

If you skipped those optional things, so that you only want to invoke
`displayPlane` afterwards, the code could be simplified to just:

```js
loader.load("flower0.jpg", displayPlane);
```

Much better!

Aside: the `load()` method uses an *event handler* that waits for an
`onLoad` event indicating the completion of the image load, before
invoking the given function. *Why is this necessary?* It takes time
to load images, and if the code to render the scene were executed
immediately after initiating the image load, the scene could be
rendered before the image is done loading. As a consequence, the image
texture would not appear on object surfaces in the graphics
display. In this example, the flower image loads very quickly, but if
the browser needs to load a lot of large texture files, you can
sometimes see that it takes several seconds to fully load textures and
render the scene.

By the way, the `reportTextureSize` function is just this:

```js
function reportTextureSize(texture) {
    const image = texture.image;
    const width = image.width;
    const height = image.height;
    console.log(`Texture dimensions: ${width}x${height}`);
}
```

## Aspect Ratio

An image has a natural *aspect ratio* , which is the width divided by
the height. If you force it into a different ratio, the results will
look distorted. The flower-plane demo doesn't look too bad at
different aspect ratios, but other images will look terrible.

Here are two images: the one on the left is allowed to be its natural
dimensions (300x220 or an aspect ratio of 1.36). The one on the right
is forced to be square, 220x220:

![Buffy Summers](images/buffy.gif)
<img height="220" width="220" src="images/buffy.gif" alt="Buffy Summers">

Similarly, if the image is not the same aspect ratio as the rectangle it's
being texture-mapped onto, there can be distortion. In the following demo, we
map the 300x220 image of Buffy onto a square plane.

[texture1/buffy-plane](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/402770/View)

Humans have strong aesthetics when it comes to human faces, less with
many other things. But a square U.S. flag would look weird. The
official [aspect ratio of the
U.S. flag](https://en.wikipedia.org/wiki/Flag_of_the_United_States#Design)
should be 1.9, though other sizes are sold. Conversely, the [flag of
Switzerland](https://en.wikipedia.org/wiki/Flag_of_Switzerland#Design)
is square, which is pretty rare for world flags.

Here's a demo of the US flag texture-mapped onto a plane:

[texture1/flag-plane](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/402770/View)

In general, if the aspect ratios of your image and object surface are
different (e.g. you map a square image onto an oblong plane), the
image will be distorted along one of the dimensions. We'll return to
this idea in the context of *texture coordinates* later.

## Multiple Images

Suppose you want to use multiple image textures in your scene? While
you can use the Threejs loader multiple times, the TW package provides
a handy and efficient shortcut, `TW.loadTextures()` that loads
multiple images, creates a texture for each one and stores the
textures in an array. It then calls a function of your choosing with
the array of textures. So the code looks like this:

```js
TW.loadTextures(["file1.jpg", "file2.png", "file3.gif"], displayObj);
```

The following demo loads six images and puts each one on the side of a
box (a cube). There are actually a selection of image collections, and
you can choose among them with the keyboard:

- 1: Shows colors (not textures)
- 2: Shows faces of characters from *Buffy the Vampire Slayer*
- 3: Shows die (dice) faces

Try all three!

[texture1/box](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/402770/View)

Let's look at how the code works. First, the code will make a lot of
use of a JS feature: the `.map` method on JS arrays. The method takes
a *function* (often an arrow function but could be a normal function)
and returns a *new* array with the value of invoking that function on
each element of the original array. This is almost exactly what
Python's list comprehensions do, so if you understand [Python list
comprehensions](https://www.w3schools.com/python/python_lists_comprehension.asp)
you are almost there.

Here's an example where the method creates a new array of the squares
of the original array:

```js
const nums = [1, 2, 3, 4, 5];
const sqs = nums.map( x => x*x );
```

Try copy/pasting that into the JS console and make sure you understand
it.

Okay, given that, recall that we can create a box with a different
material on each side by supplying an array of materials as the second
argument to `THREE.Mesh`:

```js
const box = new THREE.Mesh( boxGeom, [mat0, mat1, mat2, mat3, mat4, mat5 ]);
```

With that in mind, let's see the code for the color cube (no texture
mapping but 6 different materials, one for each color):

```js
const colorsArray = [
    "red",
    "green",
    "blue",
    "cyan",
    "magenta",
    "yellow"];

function colorsBox() {
    scene.remove(boxMesh);
    const matArray = colorsArray.map((c) => new THREE.MeshBasicMaterial({color: c}));
    boxMesh = new THREE.Mesh( boxGeom, matArray );
    scene.add(boxMesh);
}
colorsBox();
```

The key is the `matArray` which is an array of six materials, created
from an array of six color names.

Now, let's look at the faces example:

```js
const faceFiles = [
    "images/giles.gif",
    "images/willow.gif",
    "images/xander.gif",
    "images/angel.gif",
    "images/buffy.gif",
    "images/dawn.gif"];

async function faces() {
    scene.remove(boxMesh);
    console.log('adding faces', faceFiles);
    TW.loadTextures(
        faceFiles,
        function (texArray) {
            console.log("done loading face textures");
            const matArray = texArray.map(ta => new THREE.MeshBasicMaterial({map: ta}));
            boxMesh = new THREE.Mesh(boxGeom, matArray);
            scene.add(boxMesh);
        });
}
```

The `faceFiles` array is the first argument to
`TW.loadTextures()`. The second argument is a function that will be
called once all six files are loaded. That function gets an array as
its argument, maps along the array to create an array of materials,
and creates the box. Very similar to the colors box.

Note that we have omitted the color for `MeshBasicMaterial`, because
it defaults to white, which is what we want.

The `dice` function is nearly identical, so I won't show the code here.

## Asynchronous Programming

The previous section had some new programming techniques, namely a *callback*
function that executes *after* an image is loaded. This is a kind of programming
that deals with asynchronous events, so we'll call it *asynchronous
programming*.

JavaScript has some (relatively) new features to support asynchronous
programming. We will discuss those in class. But here's some
information to get you started.

The `faces` function is *asynchronous*. That means that:

1. its execution begins, then
2. is suspended while the browser waits for the texture files to load, then
3. is continued after they are all loaded.

This fact is signaled by a necessary keyword `async` that precedes the
function definition.

If you're curious about what's under the covers, here's the
`TW.loadTextures()` function:

```js
TW.loadTextures = async function(filenameArray, callback) {
    if( ! filenameArray instanceof Array) {
        throw new Error('first argument must be an array (of strings)');
    }
    const loader = new THREE.TextureLoader();
    // Note that we use loadAsync() here, not load().
    // loadAsync() returns a promise
    const promises = filenameArray.map(a => loader.loadAsync(a));
    const textures = await Promise.all(promises);
    console.log('all textures loaded', textures);
    callback(textures);
}
```

The really interesting part are these two lines:

```js
    const promises = filenameArray.map(a => loader.loadAsync(a));
    const textures = await Promise.all(promises);
```

The `loader.loadAsync` method is also *asynchronous*. It initiates a
network request, but returns (immediately) a *promise*. A promise is a
special new kind of object in JS (and other languages) that is
*fulfilled* when the I/O operation completes. We can `await` for the
fulfillment of the promise, and the function can then proceed.

In fact, we use `.map` because we are going to have an *array* of
promises, and the function will *wait* for them *all* to be fulfilled.

This is extra cool, because all six network requests are issued
*concurrently*, so we have *parallelism* in their fulfillment. That
is, instead of waiting for the first file to be fetched before
requesting the second one, and so forth, one at a time, we request all
six and wait for all six to be received.

## Loading Images and Same Origin Policy

The web protocols have a security policy called [Same Origin
Policy](https://en.wikipedia.org/wiki/Same-origin_policy). You can
read more at the Wikipedia page, but in a nutshell, Javascript running
in web page "A" can request resources that are available in another
web page, "B", *if and only if* the two web pages have the same
*origin*. The "origin" is the protocol (e.g. HTTPS), server
(e.g., warren.sewanee.edu) and port (e.g., 443). If all three of those
match, then access is allowed; otherwise it is refused.

There is a way to loosen that requirement called [CORS] for
[Cross-origin resource
sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing),
but that requires that the second server (for page "B") to permit those
cross-origin requests. Sometimes that's the case, but sometimes not.

What this means for your graphics projects is that it's best for the
image you are loading *to be on the same server* as your `main.js`. So,
download the image and
copy it to your project folder.

If you download an image from the web that you use in your code, it
would be good to include a comment in the code file with the source. I
gave credit to the source of the dice faces in my code. 

## Summary

Here are the key ideas on texture mapping:

- At its most basic level, a texture is an array of pixels, similar to an image.
- When loading an image to use for texture mapping, we need to
  consider that it takes a non-negligible amount of time for the image
  to load, so we need to write *event handlers* for the *after load*
  event that renders the scene after all images are loaded. Or we have
  to use async/await and promises.
- When accessing images hosted on a different domain, our JavaScript
  code bumps up against the *Same-Origin Policy*.
- Usually, it's easier to copy the file to your local folder and load
  it from there.