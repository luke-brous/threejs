import * as THREE from 'three';

/* Function to make a figure consisting of a stretched sphere, a box, and a cone.

I've called it "figure" because it's supposed to begin to suggest a
figure, in having a oval "body", box "head" and conical "hat".

My current design uses the following default parameters:

const params = {hatHeight: 4,
                hatAngle: Math.PI/10,
                headDim: 2,
                bodyHeight: 16,
                bodyWidth: 8,
                bodyColor: 0x228b22, // forestGreen
                headColor: 0x000000, // black
                faceColor: 0xd2b28c, // tan
                hatColor: 0x008080, // teal
               };

The figure has a forest green sphere, stretched to height of 6, width and depth of 2, 
with the long axis lying on the y-axis and the bottom touching the origin. 
Above it is a cube with 5 sides black and the front face tan. Above that is 
a conical "hat" of teal.

The parts are added to a parent object, which might be the global scene. 

Returns the parent.
*/

function makeFigureParams(parent, params) {
    // build the body
    const bodyGeom = new THREE.SphereGeometry(1);
    const bodyMat = new THREE.MeshBasicMaterial({color: params.bodyColor});
    const body = new THREE.Mesh( bodyGeom, bodyMat );
    // for brevity, define some constants
    const bh2 = params.bodyHeight/2;
    const bw2 = params.bodyWidth/2;
    /* 
       sphere of radius 1, so width of 2, from -1 to +1
       scale so that height is H and width is W
       that means center is at Y=H/2.
    */
    body.translateY(bh2);
    body.scale.set(bw2, bh2, bw2);
    body.name = "body";  // for help identifying it in the scene in the debugger
    parent.add(body);

    // build the head
    const hd = params.headDim;
    const headGeom = new THREE.BoxGeometry(hd,hd,hd);
    const headColor = new THREE.MeshBasicMaterial({color: params.headColor});
    const faceColor = new THREE.MeshBasicMaterial({color: params.faceColor});
    // index 4 is the "front" (+Z) according to GPT
    const headMat = [headColor,headColor,headColor,headColor,faceColor,headColor];
    const head = new THREE.Mesh(headGeom, headMat);
    // size is 2, so from -1 to +1. put it on top of the body
    head.translateY(params.bodyHeight + hd/2);
    head.name = "head";
    parent.add(head);

    // build the hat
    const hh = params.hatHeight;
    const hatGeom = new THREE.ConeGeometry(hd, hh);
    const hatMat = new THREE.MeshBasicMaterial({color: params.hatColor});
    const hat = new THREE.Mesh(hatGeom, hatMat);
    hat.translateY(params.bodyHeight + hd + hh/2);
    hat.rotateZ(params.hatAngle);
    hat.name = "hat";
    parent.add(hat);
    // return the parent, though this isn't necessary, since the caller already has it
    return parent;
}

export { makeFigureParams };
