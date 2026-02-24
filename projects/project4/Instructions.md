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



# Project 4:  Lit Scene (Sconce) 

This assignment has two parts: programming and math problems. Please do both.

The emphasis in this assignment is working with material and lighting. It's
not primarily about geometry, though there are some new things here, such as
using the inside of a cube. It's also not about cameras, so feel free to use
`TW.cameraSetup()`.

Here's the goal, a room with a light fixture in it that I'm calling a
"sconce":

[sconce scene](https://rtsowell.sewanee.edu/courses/cs360/threejs/demos/sconce/sconce-solution.html)

Write your own program that mimics this scene:

- Use material and lighting throughout; no `THREE.MeshBasicColor`.
- Make your best guess at the material colors.
- In the above solution, the `specular` colors are all shades of gray.
- The solution used 3 lights, and they were all gray lights (that is, no hue). You can adjust the brightness, but you don't need to worry that the light is colored.
- The material of all four walls is the same. The material of the floor and ceiling is different, as is the material of the ball and the sconce.
- Notice that the walls are different shades, despite their equal material.
- Notice that the underside of the ball is darkened.
- Notice that you can see both the inside and outside of the sconce, but only the inside of the walls, floor and ceiling.
- There's a GUI with three boolean values to toggle the lights. This will help you understand the contribution of each light. You must implement a GUI like this, too. You will not need to rebuild the scene when a value is toggled. (**Hint:** the general `Light` class is a subclass of the `Object3D` class, which has a property named `visible` that is a boolean that controls whether or not an object is rendered.)
- Feel free to ask questions!

A reasonable starting point is the box-inside demo:

[sconce starter](./sconce/main.js)

## Math

Solve the problems in [Math
4](./math/math4.pdf).

## Submission

To submit your project, create a zip file of the entire project folder.  Be sure to include your completed code and your solutions to the math problems.  Then, upload your zip file to Brightspace.
