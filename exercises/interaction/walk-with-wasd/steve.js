
/* Code to make "Steve" from Minecraft
   based on work by Kelsey Reiman

   This creates  a steve character that the user can move around the scene using the
   WASD keys. I used this tutorial:  http://webmaestro.fr/character-controls-three-js/
   to create the functions that update steve's position. 
*/

import * as THREE from 'three';

export function makeSteve(width=20, height=40, depth=10, container) {
    const w = width;
    const h = height;
    const d = depth;
    
    /** the following four variables are like containers to hold a
        collection of objects that make up Steve. legs hold the left leg
        and the right leg, torso holds the arms and the chest, and the
        upper body holds the head and and torso. Steve holds the upper
        body and the legs. Organizing Steve into a hierarchical
        collection of objects makes it easier to animate him or duplicate
        him within the scene. */

    const steve = new THREE.Group();
    const upperBody = new THREE.Group();
    const torso = new THREE.Group();
    const legs = new THREE.Group(); 

    //use the same material for all of steve except the head
    const steveMat = new THREE.MeshNormalMaterial();
    
    /* The height of the head is 2/8 the total height, while the length of
       the torso (chest + arms) and legs are each 3/8 of the height. So
       2/8 + 3/8 + 3/8 = 8/8. You could easily change this if you want to
       change steve's proportions. */
    const limbH = (3.0/8.0) * h;
    const headH = (2.0/8.0) * h; 
    
    /* The width of the limbs is 1/4 the total width while the widths of the head
       and chest are 1/2 the total width */
    
    const limbW = (1.0/4.0) * w;
    const chestW = (1.0/2.0) * w;
    const headW = (1.0/2.0) * w;
    
    /* the depth of the head is the same as the total depth, while the depth of 
       the limbs and chest is just 1/2 the total depth. */
    
    const limbD = (1.0/2.0) * d;
    const headD = d;
    
    /**The arms and legs all have the same geometry, so we can just create it 
       once and reuse it for each mesh **/
    const limbG = new THREE.BoxGeometry(limbW,limbH,limbD);
    limbG.translate(0, -(limbH * 0.5), 0);
    
    //draw the legs
    
    /**create the left leg and translate half the width and height of the leg
       so that the origin of Steve is between his feet at the bottom **/
    const legL = new THREE.Mesh(limbG,steveMat);
    legL.translateX(-0.5 * limbW);
    legL.translateY(limbH);
    //translate so that the origin is at the end of the box instead of in the middle


    /**create the right leg and translate to the correct position plus a little 
       extra so that you can see where on leg begins and the other one ends **/
    const legR = new THREE.Mesh(limbG,steveMat);
    
    legR.translateX((0.5 * limbW)+.1);
    legR.translateY(limbH);
    //legR.rotation.x = -rotationX;
    
    /*add each left leg and the right leg to the legs container */
    legs.add(legR);
    legs.add(legL);
    
    /*add the legs to the steve container */
    steve.add(legs);
    
    /* Now we are going to create the torso, starting with the chest. The
       origin of the chest is in the center of the box, so that is the origin that
       we will work from to translate the arms and head to the correct position*/
    const chestG = new THREE.BoxGeometry(chestW,limbH,limbD);
    const chest = new THREE.Mesh(chestG,steveMat);
    torso.add(chest);    
    
    /* add the left arm to the torso and move it 1/2 the width of the chest +1/2 
       the width of the arm plus a little breathing room to see where one box begins 
       and where the other ends. */
    const armL = new THREE.Mesh(limbG,steveMat);
    armL.translateX( (-0.5 * chestW) + (-0.5 * limbW) + -0.1);
    armL.translateY( 0.5 * limbH);
    torso.add(armL);


    /*add the right arm and translate it the same way but in the opposite direction*/
    const armR = new THREE.Mesh(limbG,steveMat);
    torso.add(armR);
    armR.translateX((0.5 * chestW) + (0.5 * limbW) + 0.1);
    armR.translateY( 0.5 * limbH);    
    
    upperBody.add(torso);
    
    /*after we draw the torso we need to translate halfway up from the center of the
      chest to halfway up the head to be in the right spot to draw the head. */
    
    
    //add a new material for steve's head so that one of the faces has 
    //an image mapped on it to differentiate the front
    const loader = new THREE.TextureLoader();
    loader.load('lil-bub.jpg',
                function (texture) {
                    const tex = new THREE.MeshBasicMaterial({ map: texture });
                    const norm = new THREE.MeshNormalMaterial();
                    
                    const materials = [norm,norm,norm,norm,tex,norm];
                    
                    const headG = new THREE.BoxGeometry( headW, headH, headD);
                    const head = new THREE.Mesh(headG, materials );
                    head.translateY((limbH * 0.5) + (headH * 0.5) + 0.1);
                    upperBody.add(head);
                })


    /*translate up the length of the legs plus half the height of the chest to draw
      the upper body */
    
    upperBody.translateY(limbH + (0.5 * limbH) + 0.1); 
    steve.add(upperBody);
    
    // This instance variable says where he is pointed.
    
    steve.directionVec = new THREE.Vector3(0.0, 0.0, 0.0);
    steve.swingDirection = 1;   // positive limb rotation direction
    steve.limbRotationX = 0;    // current rotation around X

    // ================================================================
    // Define some methods

    /* this method rotates steve's arms and legs as he is walking. The
     * "direction" instance variable is so that we can reverse
     * direction when the limb reaches the maximum rotation. Here, we
     * have hard-coded the maximum swing as 1 radian or about 57
     * degrees and the delta at 0.07 radians, which is about 14 frames
     * until we swing back. This method needs to be defined where it
     * can see the limb variables: legL, legR, armL and armR.
     */

    const dr = .07;             // delta swing of limbs

    steve.walk = function () {
        // all angles in radians!
        let r = this.limbRotationX;
        if(this.swingDirection == 1) {
            r += dr;
        } else {
            r -= dr;
        }
        if( r >= 1 || r <= -1 ) {
            // max swing; reverse direction
            this.swingDirection = this.swingDirection * -1; 
        }
        legL.rotation.x = r;
        legR.rotation.x = -r;
        armR.rotation.x = r;
        armL .rotation.x = -r;
        // store it back
        this.limbRotationX = r;
    }

    // Move Steve forward proportional to his direction vector
    steve.move = function() {
        // We update our Object3D's position from our "direction" vector
        const dv = this.directionVec;
        this.position.x += dv.x * ((dv.z === 0) ? 2 : Math.sqrt(6));
        this.position.z += dv.z * ((dv.x === 0) ? 2 : Math.sqrt(6));
    }

    // If the new direction differs from the prior direction, turn step by step in that direction.
    // Rotate the character

    steve.rotate = function() {
        // Set the direction's angle, and the difference between it and our Object3D's current rotation
        const dv = this.directionVec;
        const angle = Math.atan2(dv.x, dv.z);
        let difference = angle - this.rotation.y;
        const absdiff = Math.abs(difference);
        if(absdiff < 0.0001) return; 
        // If we're doing more than a 180°
        if (absdiff > Math.PI) {
            // We proceed to a direct 360° rotation in the opposite way
            if (difference > 0) {
                this.rotation.y += 2 * Math.PI;
            } else {
                this.rotation.y -= 2 * Math.PI;
            }
            // And we set a new smarter (because shorter) difference
            difference = angle - this.rotation.y;
            // In short : we make sure not to turn "left" to go "right"
        }
        // Now if we haven't reached our target angle
        if (difference !== 0) {
            // We slightly get closer to it
            this.rotation.y += difference / 4;
        }
    }

    return steve;
}
