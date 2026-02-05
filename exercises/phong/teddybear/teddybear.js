import * as THREE from 'three';
import { TW } from 'tw';

// For brevity, we'll use headColor for limbs as well
const bodyColor = 0xD08050;
const headColor = 0xB07040;   // like body but slightly darker
const eyeColor = 0x000;       // black
const noseColor = 0x000;      // black

// These are exactly the same as in main.js
// Main.js is extra verbose because we want to allow the GUI to adjust everything

const defaultParameters = {
    // basic
    wireframe: false,
    sphereDetail: 10,
    cylinderDetail: 10,
    bodyRadius: 5,
    bodyScaleY: 2,
    // head
    head: true,
    headRadius: 2,
    nose: true,
    noseRadius: 0.5,
    noseRotation: TW.degrees2radians(10),
    ears: true,
    earRadius: 0.6,
    earScale: 0.5,
    earAngle: Math.PI/4,
    eyes: true,
    eyeRadius: 0.3,
    eyeAngleX: -Math.PI/6,
    eyeAngleY: +Math.PI/6,
    // arms
    arms: true,
    armLength: 7,
    armRadiusTop: 1.5,
    armRadiusBottom: 1.2,
    shoulderWidth: 2.5,         // bodyRadius / 2;
    shoulderHeight: 7,          // bodyScaleY * radius * 0.7;
    // legs
    legs: true,
    legRadiusTop: 1.8,
    legRadiusBottom: 1.4,
    legLength: 9,
    legRotationX: -TW.degrees2radians(60),
    legRotationZ: TW.degrees2radians(20),
    hipWidth: 2.5,
    hipHeight: -7,
    // materials.
    bodyMaterial: new THREE.MeshBasicMaterial({color: bodyColor}),
    headMaterial:  new THREE.MeshBasicMaterial({color: headColor}),
    armMaterial:  new THREE.MeshBasicMaterial({color: headColor}),
    legMaterial:  new THREE.MeshBasicMaterial({color: headColor}),
    noseMaterial:  new THREE.MeshBasicMaterial({color: noseColor}),
    eyeMaterial:  new THREE.MeshBasicMaterial({color: eyeColor}),
};

// Helper functions. Exported in case they are useful, but not expected

export function makeNose(params) {
    const sd = params.sphereDetail;
    const radius = params.noseRadius;
    const noseGeometry = new THREE.SphereGeometry(radius,sd,sd);
    const noseMesh = new THREE.Mesh(noseGeometry, params.noseMaterial);
    return noseMesh;
}

/* adds a nose to the head. It's placed by creating a composite object
 * centered in the middle of the head, and positioning the nose at the
 * head radius on +Z, then rotating around X by a little. */

export function addNose(head,params) {
    const noseframe = new THREE.Group();
    const nose = makeNose(params);
    const radius = params.headRadius;
    nose.position.z = radius; // within the noseframe
    noseframe.add(nose);
    const angle = params.noseRotation;
    noseframe.rotation.x = angle;
    head.add(noseframe);
    return head;
}

export function makeEar(params) {
    // side is 1 (right) or -1 (left)
    const sd = params.sphereDetail;
    const radius = params.earRadius;
    const earGeometry = new THREE.SphereGeometry(radius,sd,sd);
    const ear = new THREE.Mesh(earGeometry, params.bodyMaterial);
    // Flattens the sphere to make it look more like a flat disk
    ear.scale.z = params.earScale;
    return ear;
}

/* adds an ear to the head on the right (side=1) or left
 * (side=-1). The center of the ear is flush with the surface of the
 * head by moving it out by the radius, and rotating it around the z
 * axis to get it to the desired height. */

export function addEar(head, params, side) {
    const earframe = new THREE.Group();
    const ear = makeEar(params); // a mesh
    const radius = params.headRadius;
    const angle = params.earAngle;
    ear.position.x = side * radius; // within the earframe
    earframe.rotation.z = side * angle;
    earframe.add(ear);
    head.add(earframe);
    return head;
}

export function makeEye(params) {
    const sd = params.sphereDetail;
    const radius = params.eyeRadius;
    const eyeGeometry = new THREE.SphereGeometry(radius,sd,sd);
    const eyeMesh = new THREE.Mesh(eyeGeometry, params.eyeMaterial);
    return eyeMesh;
}

/* adds an eye to the head on the right (side=1) or left
 * (side=-1). The center of the eye is flush with the surface of the
 * head by moving it out along the z axis by the radius, and rotating
 * it around the x and then y axes to get it to the desired height. */

export function addEye(head,params,side) {
    const eyeframe = new THREE.Group();
    const eye = makeEye(params);
    eye.position.z = params.headRadius; // within the eyeframe
    eyeframe.rotation.x = params.eyeAngleX;
    eyeframe.rotation.y = side * params.eyeAngleY;
    eyeframe.add(eye);
    head.add(eyeframe);
    return head;
}

/* Returns a teddy bear head object, with origin in the center, and
 * eyes on the +Z side of the head, and ears on the left (-X) and
 * right (+X) sides. */

export function makeHead(params) {
    const head = new THREE.Group();

    const sd = params.sphereDetail;
    const radius = params.headRadius;
    const headGeometry = new THREE.SphereGeometry(radius, sd, sd);
    const headMesh = new THREE.Mesh(headGeometry, params.headMaterial);
    head.add(headMesh);
    if(params.nose) {
        addNose(head,params);
    }
    if(params.ears) {
        addEar(head,params,1);
        addEar(head,params,-1);
    }
    if(params.eyes) {
        addEye(head,params,1);
        addEye(head,params,-1);
    }
    return head;
}

export function makeArm(params) {
    /* returns an Object with the center at the shoulder and the negative
     * Y axis running down the center. */
    const arm = new THREE.Group();
    const top = params.armRadiusTop;
    const bot = params.armRadiusBottom;
    const len = params.armLength;
    // Turns out there's an error in Three.js if cylinder detail is a non-integer
    const cd  = Math.floor(params.cylinderDetail);
    const armGeom = new THREE.CylinderGeometry(top,bot,len,cd);
    const armMesh = new THREE.Mesh( armGeom, params.bodyMaterial );
    armMesh.position.y = -len/2;
    arm.add(armMesh);
    return arm;
}

export function addArm(bear,params,side) {
    /* adds an arm to the bear on the right (side=1) or left (side=-1). */
    const arm = makeArm(params);
    const sx = params.shoulderWidth;
    const sy = params.shoulderHeight;
    // console.log("adding arms at "+sx+","+sy);
    arm.position.set( side * sx, sy, 0 );
    arm.rotation.z = side * Math.PI/2;
    bear.add(arm);
}
    
export function makeLimb(radiusTop, radiusBottom, length, params) {
    /* returns an Object with the center at the top and the negative Y
     * axis running down the center. */
    const limb = new THREE.Group();
    // Turns out there's an error in Three.js if cylinder detail is a non-integer
    const cd  = Math.floor(params.cylinderDetail);
    const limbGeom = new THREE.CylinderGeometry(radiusTop,radiusBottom,length,cd);
    const limbMesh = new THREE.Mesh( limbGeom, params.bodyMaterial );
    limbMesh.position.y = -length/2;
    limb.add(limbMesh);
    return limb;
}

/* adds a leg to the bear on the right (side=1) or left (side=-1). */

export function addLeg(bear,params,side) {
    const top = params.legRadiusTop;
    const bot = params.legRadiusBottom;
    const len = params.legLength;
    const leg = makeLimb(top,bot,len,params);
    leg.name = (side == 1 ? "right leg" : "left leg");
    const radius = params.bodyRadius;
    const scale = params.bodyScaleY; 
    const hx = side * params.hipWidth;
    const hy = params.hipHeight;
    // console.log("adding "+leg.name+" at "+hx+","+hy);
    leg.position.set( hx, hy, 0 );
    // console.log("rotating to "+params.legRotationZ);
    leg.rotation.x = params.legRotationX;
    leg.rotation.z = side * params.legRotationZ;
    bear.add(leg);
}

export function makeBody(params) {
    const body = new THREE.Group();
    const radius = params.bodyRadius;
    const sd = params.sphereDetail;
    const bodyGeom = new THREE.SphereGeometry(radius,sd,sd);
    const bodyMesh = new THREE.Mesh(bodyGeom, params.bodyMaterial);
    const scale = params.bodyScaleY;
    bodyMesh.scale.y = scale;
    body.add(bodyMesh);
    if(params.arms) {
        addArm(body,params,1);
        addArm(body,params,-1);
    }
    if(params.legs) {
        // console.log("adding legs");
        addLeg(body,params,1);
        addLeg(body,params,-1);
    }
    return body;
}

export function makeTeddyBear(params) {
    params = TW.combineDictionaries(params, defaultParameters);
    params.bodyMaterial.wireframe = params.wireframe;
    params.headMaterial.wireframe = params.wireframe;
    
    const bear = new THREE.Group();
    const body = makeBody(params);
    bear.add(body);
    // a boolean to say whether to make the head
    if(params.head) {
        const head = makeHead(params);
        const bs = params.bodyScaleY;
        const br = params.bodyRadius;
        const hr = params.headRadius;
        // calculate position for the center of the head
        head.position.y = bs*br+hr;
        bear.add(head);
    }
    return bear;
}
