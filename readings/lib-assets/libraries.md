# Libraries

This reading is about two different topics, that are related in that
they are about using assets provided by others and sharing assets with
others. The two kinds of assets are:

- Threejs code, and
- 3D Models

Let's start with sharing code.

## Loading Code from a Library

Since the beginning of the course, we've had a `main.html` that we
mostly ignored, and a `main.js` (loaded by `main.html`) that did all
the real work. Let's look at a slightly updated `main.html`:

```js
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Some title here</title>
</head>

<body>
<script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/",
            "gui": "https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm",
            "tw": "https://cs.wellesley.edu/~cs307/threejs/libs/tw-fa25.js",
            "cs360/": "https://cdn.jsdelivr.net/gh/rsowell/cs-360-lib/"
        }
    }
</script>
<script type="module" src="main.js"></script>
</body>
</html>
```

We need to talk a bit about that `importmap`. The contents of an
importmap are a JSON (JavaScript Object Notation) object that
basically sets up some symbols that stand for the corresponding
URLs. (For more information, you can read the [MDN documentation on
importing modules using import
maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_modules_using_import_maps).)
Then, in our JS files, we can import, say, functions from the core
Threejs library by just saying:

```js
import * as THREE from 'three';
```

That `'three'` at the end of the line is a symbol that is then
replaced by the long URL in the import map.

This technique has two important advantages:

1. it's succinct and easier to type and remember
2. it means that we can update the version of threejs used throughout
   a large project just by modifying the one URL in the importmap,
   instead of editing all the files where we import the Threejs code.

That second feature is quite useful. When/if Threejs is updated (it's
already been updated since the beginning of this semester), you can
change the version in just this one place.

(Of course, if your code then breaks, you can either revert or update
your code.)

You'll notice there are two kinds of URLs in the importmap. Some end in particular files, like the one that holds Threejs:

<https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js>

You can click on that link to see the complete uncompressed threejs module.

Others URLS in the importmap end in slashes and denote *directories*
where you can load things *from*. For example:

<https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/>

You can click on that link to see the folder that has the various
add-ons.

We use these links differently. As we've seen, we can load threejs just by specifying that file:

```js
import * as THREE from 'three';
```

But with the folders, we have to specify what file, within that folder, we want to load. For example:

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

What happens is that string after the `from` above is combined with
the URL in the importmap to yield a final URL.

That is, *this*:

```js
 "three/addons/controls/OrbitControls.js";
```

plus this

```js
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/",
```

equals:

<https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/controls/OrbitControls.js>

Click on that to try it!

## Our Own Library

With this in mind, we can start creating libraries of resources of our
own.  An easy way to do this is to put your JS files in a public GitHub repository:

<https://github.com/rsowell/cs-360-lib/>

One folder that is in there is `town`. It has some objects
we've seen many times before, but packaged in a way that should make
them easy to use in our scenes. Let's first see how we might use
it. Here's a demo:

[libraries/town](https://learn.sewanee.edu/d2l/le/content/43027/viewContent/407415/View)

The scene shows four trees and a snowman (maybe "town" is not a good
name for this demo...), but both of these objects were loaded from our
"cs-360-lib" library.

The `main.html` file of the demo has this importmap:

```js
<script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/",
            "gui": "https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm",
            "tw": "https://cs.wellesley.edu/~cs307/threejs/libs/tw-fa25.js",
            "cs360/": "https://cdn.jsdelivr.net/gh/rsowell/cs-360-lib/"
        }
    }
</script>
```

As you can see, we've added a folder called
`cs360/` to the importmap, and jsDelivr automatically serves the code we placed in our public GitHub repo.  

Then the JS code can load two things from that folder:

```js
import { createTree } from 'cs360/town/tree.js';
import { createSnowPerson } from 'cs360/town/snowperson.js';
```

Those imported functions are used in the usual way.

I am hoping that each of you will consider making some of your contributions available to others as a public library. 

## Contributed Folders

Let's talk about the contents of the
[cs360/town](https://github.com/rsowell/cs-360-lib/tree/main/town) folder. It has pairs of
files in it:

```
snowperson.html
snowperson.js
town.html
town.js
tree.html
tree.js
```

Let's take `tree` as an example. The `tree.js` file is the JS file that you will import. It looks like this:

```js
import * as THREE from 'three';

/* Returns an Object3D for an evergreen tree, as a cylinder (the trunk) and a cone.
 The inits allow you to specify:
  ... 
*/

export function createTree(inits) {

...
}
```

The file starts with `import` statement(s) as usual. It then has your
threejs code in it, including exported functions. All of that is
exactly as you've been doing all semester, only now the imports might
include code from your own library. For example, the
`town.js` file starts like this:

```js
import * as THREE from 'three';
import { TW } from 'tw';
import { createTree } from 'cs360/town/tree.js';
import { createSnowPerson } from 'cs360/town/snowperson.js';
```

Notice that it *could* import `createTree` and `createSnowPerson` from
`./tree.js` and `./snowperson.js` (since they are in the same
directory), but the idea is to make it easy for the user to copy/paste
the `import` statements into their own code.

## Demo of your Object

Now, someone thinking about using this tree, snowman or town might
want to see what they look like before importing them. That's what the
companion HTML file should do: demo the object.

Let's start with `tree.html`. Much of it you have seen before:
[tree.html](https://github.com/rsowell/cs-360-lib/blob/main/town/tree.html) has (1) the
usual header, and (2) the usual importmap, then it has a script tag
that instead of being:

```js
<script type="module" src="main.js"></script>
```

has

```js
<script type="module">
// JS code here

</script>
```

This change is solely to reduce the number of files. I usually don't
like putting JS code in an HTML file because the editor gets confused
about the syntax and gets the indentation all wrong. But in this case,
we're going to keep the JS code very concise, so maybe it's an
acceptable tradeoff. If you don't like this tradeoff, by all means,
create and load a `tree-main.js` file that has the JS code in it.

The JS code (which would be in `tree-main.js` if we created that file) is the following:

```js
import * as THREE from 'three';
import { TW } from 'tw';
import { createTree } from 'cs360/town/tree.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

TW.clearColor = 0;
TW.mainInit(renderer, scene);

const tree = createTree({});
scene.add(tree);

TW.cameraSetup(renderer,
               scene,
               TW.objectBoundingBox(tree));
```

It's really only about a dozen lines of code, but it does have a few
tricks. The main one is at the end, namely the function
`TW.objectBoundingBox(tree)`. That function takes a Threejs object,
computes its bounding box using Threejs methods, and then creates the
bounding box (in a different format) that `TW.cameraSetup()` wants. If
you are curious, the code for that function is almost trivial:

```js
TW.objectBoundingBox = function (object) {
    const box = new THREE.Box3().setFromObject(object);
    const min = box.min;
    const max = box.max;
    const bb = {minx: min.x, maxx: max.x,
                miny: min.y, maxy: max.y,
                minz: min.z, maxz: max.z};
    // print it two different ways
    console.log('object bounding box', box, bb);
    return bb;
};
```

(Basically, Threejs represents bounding boxes as nested dictionaries
and TW uses a single flat dictionary for the bounding boxes.)

One useful thing that the `objectBoundingBox` function does is print
the bounding boxes (the same information, two different ways) to the
JS console. So if you want to know the exact dimensions of the demo
tree, you can open the JS console and the information is right there.

So, in a nutshell, this demo code does the following:

- imports what it needs, including the object-creating function
- creates a `scene` and a `renderer`
- calls `TW.mainInit(renderer, scene)`
- creates the object and adds it to the scene
- creates a camera that looks at that object

The demo file for snowman is nearly identical, so I won't show it. The
demo file for the town is a little different because there isn't a
single object (though in fact there is a `Group` that has the town,
which we could have used). For the `town.html`, the relevant code is:

```js
import * as THREE from 'three';
import { TW } from 'tw';
import * as TOWN from './town.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

TW.clearColor = 0xffffff;
TW.mainInit(renderer, scene);

TOWN.makeTown(scene);

const sceneBB = {
    minx: -10, maxx: 10,
    miny:   0, maxy: 10,
    minz: -10, maxz: 10};

TW.cameraSetup(renderer,
               scene,
               sceneBB);
```

There is barely any difference at all. So, you can use code like that
if you have a collection of objects that you want to demo together.

## glTF Assets

We've spent a lot of work this semester building objects out of
primitive geometry, like my lame trees and snowpeople, and we could
continue to do so. But there are 3D modeling programs with elaborate
and powerful GUIs that are designed to create amazing objects. Two
such programs are:

- [Blender](https://www.blender.org/), which is free and open source, and
- [Maya](https://www.autodesk.com/products/maya/overview) which has a hefty fee (though Autodesk offers [free access for students](https://www.autodesk.com/education/home))

But suppose someone has already built something using modeling software and
you'd like to include in your scene. That brings us to **loading
models**.

There are many formats, but the most commonly recommended format
nowadays is glTF. If you want to learn more (optional), try these links:

- [glTF from Khronos.org](https://www.khronos.org/gltf/)
- [glTF from Wikipedia](https://en.wikipedia.org/wiki/GlTF)

## Loading glTF

There are several articles on loading glTF into Threejs. Please read
at least one of these:

- [loading 3D Models](https://threejs.org/manual/#en/loading-3d-models)
- [load models](https://discoverthreejs.com/book/first-steps/load-models/)
- [load glTF](https://threejs.org/manual/#en/load-gltf)

We'll look at a demo in class.