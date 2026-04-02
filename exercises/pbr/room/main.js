/* This scene demonstrates lighting and standard material. It shows a
 * "room" lit by either two candles or an overhead light.
 * The room has a table (block) which is rough, plates which are smooth.
*/

//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'gui';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here

const params = {
    room: {
        width: 4,               // meters
        height: 2.5,
        depth: 4,
        color: 0xF6E8B1,    // some color picker called this "banana mania"
        roughness: 0.3,
        metalness: 0,
    },
    table: {
        width: 2,               // meters
        height: 0.02,           // 2cm
        depth: 0.75,
        color: 0xb92222,
        roughness: 0.9,
        metalness: 0,
    },
    plates: {
        radius: 0.15,
        height: 0.01,
        color: 0xcccccc,        // light gray
        roughness: 0.1,         // very smooth
        metalness: 0,
    },
    candles: {
        height: 0.16,
        radius: 0.01,
        color: 0xffffaa,        // yellowish
        roughness: 0.3,         // smooth wax
        flame: 1,               // intensity
        visible: false,
    },
    light: {
        ambient: 0x404040,
        bulb: 50,
    },
};
globalThis.params = params;

// ================================================================
// Lights

const ambLight = new THREE.AmbientLight( params.light.ambient );
scene.add( ambLight );

function overheadLight() {
    const lightBulb = new THREE.PointLight( 0xffffff, params.light.bulb );
    lightBulb.position.set( params.room.width/2, params.room.height-0.05, params.room.depth/2 );
    lightBulb.name = "lightBulb";
    scene.add( lightBulb );
    const sphereSize = 0.04;
    const pointLightHelper = new THREE.PointLightHelper( lightBulb, sphereSize );
    scene.add( pointLightHelper );
    return lightBulb;
}
const lightBulb = overheadLight();

// ================================================================
// Objects

// candles: thin cylinders with an elogated sphere atop
var flames = [];                // point light objects

function makeCandle() {
    const p = params.candles;
    const candle = new THREE.Group();
    const canGeo = new THREE.CylinderGeometry(p.radius, p.radius, p.height);
    const canMat = new THREE.MeshStandardMaterial({color: p.color,
                                                   roughness: p.roughness});
    const can = new THREE.Mesh(canGeo, canMat);
    can.position.set(0,p.height/2,0);
    candle.add(can);
    
    const flameGeo = new THREE.SphereGeometry(p.radius);
    const flameMat = new THREE.MeshBasicMaterial({color: "orange"});
    const flameMesh = new THREE.Mesh( flameGeo, flameMat );
    flameMesh.position.set(0, p.height+p.radius*2, 0);
    flameMesh.scale.set(1, 2, 1);
    candle.add(flameMesh);

    // add the light
    const flame = new THREE.PointLight( 0xffffcc, p.flame );
    flame.position.copy(flameMesh.position);
    candle.add(flame);
    flames.push(flame);

    return candle;
}

var tableMaterial = new THREE.MeshStandardMaterial(
    {color: params.table.color,
     roughness: params.table.roughness,
     metalness: params.table.metalness});

var plateMaterial = new THREE.MeshStandardMaterial(
    {color: params.plates.color,
     roughness: params.plates.roughness,
     metalness: params.plates.metalness});


function makeTable() {
    scene.remove(scene.getObjectByName("table"));
    const table = new THREE.Group();
    table.name = "table";
    const tp = params.table;
    // this is just the tabletop. TODO: add legs
    const tableTop = new THREE.Mesh( new THREE.BoxGeometry(tp.width, tp.height, tp.depth),
                                     tableMaterial);
    // it's all in positive x values
    tableTop.position.set(tp.width/2, tp.height/2, tp.depth/2);
    table.add(tableTop);

    const pp = params.plates;
    const spacing = pp.radius*2.2
    const numPlates = Math.floor(tp.width/spacing);
    const plateGeom = new THREE.CylinderGeometry(pp.radius, pp.radius, pp.height);
    for(let i=0; i<numPlates; ++i ) {
        const plate = new THREE.Mesh( plateGeom, plateMaterial );
        plate.position.set(i*spacing+pp.radius, tp.height+pp.height/2, tp.depth-pp.radius);
        table.add(plate);
    }

    const can1 = makeCandle();
    can1.position.set( tp.width*0.25, tp.height, tp.depth/2 );
    table.add(can1);
    const can2 = makeCandle();
    can2.position.set( tp.width*0.75, tp.height, tp.depth/2 ); 
    table.add(can2);

    // move the table above the floor
    table.position.y = 1;
    scene.add(table);
}

makeTable();

const wallMaterial = new THREE.MeshStandardMaterial(
    {color: params.room.color,
     roughness: params.room.roughness,
     metalness: params.room.metalness,
     side: THREE.BackSide});

function makeRoom() {
    scene.remove(scene.getObjectByName("room"));
    const p = params.room;
    const geo = new THREE.BoxGeometry(p.width, p.height, p.depth);
    const w = wallMaterial;
    const floor = new THREE.MeshStandardMaterial(
        {color: 0xC9A782, roughness: 0.9, metalness: 0, side: THREE.BackSide });
    const room = new THREE.Mesh(geo, [w, w, w, floor, w, w]);
    room.position.set(p.width/2, p.height/2, p.depth/2);
    room.name = "room";
    scene.add(room);
}
makeRoom();
    

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer,scene);

const gui = new GUI();
const guiRoom = gui.addFolder('room');
guiRoom.addColor(params.room, 'color').onChange(val => wallMaterial.color.set(val) );
guiRoom.add(params.room, 'roughness',0,1).onChange(val => wallMaterial.roughness = val );
guiRoom.add(params.room, 'metalness',0,1).onChange(val => wallMaterial.metalness = val );

const guiTable = gui.addFolder('table');
guiTable.add(params.table, 'width', 1.5, 3).onChange(makeTable);
guiTable.addColor(params.table, 'color').onChange(val => tableMaterial.color.set(val) );
guiTable.add(params.table, 'roughness',0,1).onChange(val => tableMaterial.roughness = val );
guiTable.add(params.table, 'metalness',0,1).onChange(val => tableMaterial.metalness = val );

const guiPlates = gui.addFolder('plates');
guiPlates.addColor(params.plates, 'color').onChange(val => plateMaterial.color.set(val) );
guiPlates.add(params.plates, 'roughness',0,1).onChange(val => plateMaterial.roughness = val );
guiPlates.add(params.plates, 'metalness',0,1).onChange(val => plateMaterial.metalness = val );


const guiLight = gui.addFolder('lights');
guiLight.add(params.light, 'bulb', 0, 150).onChange(val => lightBulb.intensity = val );
guiLight.add(params.candles, 'flame', 0, 5).onChange(val => flames.forEach(f => f.intensity = val) );

// Set up a camera for the scene
var state = TW.cameraSetup(renderer,
                           scene,
                           {minx: 0, maxx: params.table.width,
                            miny: 1, maxy: 2,
                            minz: 0, maxz: params.table.depth});

