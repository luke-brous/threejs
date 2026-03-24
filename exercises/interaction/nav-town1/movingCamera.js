import * as THREE from 'three';
import { TW } from 'tw';

/* This camera is put outside the scene, just like the TW camera. It
 * has instance variables of VUP, VPN, and AT. It has methods to move
 * the camera forward or backwards (by moveStep) and to turn
 * left/right (by turnStep). Finally, it has a method to turn by a
 * particular angle (around Y). */

export function makeMovingCamera(renderer, scene_bb, fovy, moveStep, turnStep) {
    const camParams = TW.cameraSetupParams(scene_bb, fovy);
    const canvas = renderer.domElement;
    const ar = canvas.clientWidth/canvas.clientHeight;
    console.log("ar: "+ar);
    const camera = new THREE.PerspectiveCamera(fovy, ar, camParams.near, camParams.far);

    // basic setup. Start at cameraRadius from the center of the scene
    const center = camParams.center;
    camera.position.set(center.x, center.y, center.z + camParams.cameraRadius);
    camera.up.set(0,1,0);
    camera.lookAt(center);

    // getting ready to move
    camera.moveStep = moveStep;
    camera.turnStep = THREE.MathUtils.degToRad(turnStep);
    camera.vpn = new THREE.Vector3(0,0,-1);
    camera.at = new THREE.Vector3(0,0,0);
    camera.at.addVectors( camera.position, camera.vpn );
    camera.vright = new THREE.Vector3(0,0,1);
    camera.forward = function (dist) {
        this.position.addScaledVector( this.vpn, dist );
        this.at.addScaledVector( this.vpn, dist );
        this.lookAt(this.at);
    };
    camera.backward = function (dist) {
        this.position.addScaledVector( this.vpn, -1 * dist );
        this.at.addScaledVector( this.vpn, -1 * dist );
        this.lookAt(this.at);
    };
    const yaxis = new THREE.Vector3(0,1,0);
    camera.rotateBy = function (angle) {
        // change the coordinates of VPN. Awesome that THREE.js has this method
        this.vpn.applyAxisAngle( yaxis, angle );
        this.at.addVectors( this.position, this.vpn );
        this.lookAt(this.at);
    }
        
    camera.left = function (deg) {
        this.rotateBy( THREE.MathUtils.degToRad(deg) );
    };
    camera.right = function (deg) {
        this.rotateBy( -1 * THREE.MathUtils.degToRad(deg) );
    };
    return camera;
}

function rotateTo(event, camera) {
    var click_info = TW.convertMousePositionToNDC(event);
    var to = new THREE.Vector3(click_info.x, click_info.y, 0);
    to.unproject(camera);
    // console.log('to unprojected is '+JSON.stringify(to));
    var v = new THREE.Vector3();
    v.subVectors(to, camera.position);
    // console.log('vector to TO is '+JSON.stringify(v));
    to.y = v.y;                 // flatten the TO vector into the same Y plane as the VPN
    var angle = v.angleTo(camera.vpn);
    // console.log('angle is '+THREE.Math.radToDeg(angle));
    angle = angle/10;           // to decrease the velocity a bit
    camera.rotateBy( click_info.x > 0 ?
                     -1 * angle :
                     angle );
}

