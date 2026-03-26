/* Returns an Object3D for an evergreen tree, as a cylinder (the trunk) and a cone.
 The inits allow you to specify:
 trunkRadius (default 1)
 trunkHeight (default 3)
 coneRadius  (default 4)
 coneHeight  (default 10)
 trunkMaterial (default basic brown)
 coneMaterial  (default basic darkgreen)
*/
export function createTree(inits) {
    const trunkRadius = inits.trunkRadius || 1;
    const trunkHeight = inits.trunkHeight || 3;
    const coneRadius  = inits.coneRadius || 4;
    const coneHeight  = inits.coneHeight || 10;
    const trunkMaterial = inits.trunkMaterial || 
          (new THREE.MeshBasicMaterial( { color: "brown" } ));
    const coneMaterial = inits.coneMaterial || 
          (new THREE.MeshBasicMaterial( { color: "darkgreen" } ));
    // whew, inits over
    const tree = new THREE.Object3D();
    const cone = new THREE.Mesh( new THREE.CylinderGeometry(0,coneRadius,coneHeight),
                               coneMaterial );
    cone.position.y = coneHeight/2+trunkHeight;
    tree.add(cone);
    const trunk = new THREE.Mesh( new THREE.CylinderGeometry(trunkRadius,trunkRadius,trunkHeight),
                                trunkMaterial );
    trunk.position.y = trunkHeight/2;
    tree.add(trunk);
    return tree;
}
