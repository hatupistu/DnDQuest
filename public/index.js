///////////////////////////////
/* TABLE OF CONTENTS         */
/*                           */
/*                           */
///////////////////////////////

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import {loadModels} from './loadModels.js'
import {setupCharacterMaterials, whichColor} from './setupCharacterMaterials.js'
import {TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import {setupFSVS } from './particleHelp.js'
import {LinearSpline, ParticleSystem, BBox} from './particleClass.js'

import {setupCubes} from './setupCubes.js';
const socket = io();
// Get the current URL
const url = window.location.href;
let timer = 0, flyBar = 0, flyOverHeat = false, mButton = 1, mButtonPressed = false, mbt = 0, windResist = 0, windy = false, jump;
let fogState = 2, fogS = 0, hang, onHang = false, ctrlElevator=false, hangT = 0,stopFlyT = 0, elevatorT = 0, elevatorT2 = 0, elevatorTouch = false, hangonDist, hangStatus = 0, pathGeo, pathMat, coordPath, coordinates, hangFreeze = false, jumpTimer = 0, stopFlyTimer = 0, stopFly = 0;
let freeMovement = false, interact = false, specialFall = false, howManyTouches = 0, whichTouch = 0, mobile = false, touching = false, touchstatus = 'none';
let dColor = document.getElementById('color-select');
let trueDiff = 0, loadOnce = 0, spin = 0.1, elevatorFree = true, eAction = 'none';
const joystickBackground = document.getElementById('joystickBackground'), dVic = document.getElementById('vic'), dLivic = document.getElementById('livic');
const joystickKnob = document.getElementById('joystickKnob'), button = document.getElementById('interactimg');
let startX2, startY2, knobX, knobY, originalKnobX, originalKnobY, knobDeltaX = 0, knobDeltaY = 0, fanBone;
// Define regular expressions for each segment
const ms15 = /nNn(.*?)6UY/;
// Raycasting for object selection
let pitZone = false, eBone;
let groundFloorY = -7.123;
let dInt = document.getElementById('interactimg');
const raycaster = new THREE.Raycaster();
let offsetDistance = 3, clearToClimb = false, clearToPassThru1, clearToPassThru2, holdClick = 0, ch2ClimbAction, ch4RunJumpAction, ch3RunJumpActionm ,ch3ClimbAction, ch4ClimbAction, ch4KOAction, ch3KOAction, ch4GetUpAction, ch3GetUpAction, ch3RunJumpAction;
let vic_kid, char1_kid, char2_kid, char3_kid, char4_kid, livic_kid, elevator_xspeed = 0, elevator_yspeed = 0, elevator_zspeed = 0
let charStepCube, downDiff =0, upDiff = 0, locked = false, walkCon = 'safe', firstLadderClimbDown = false, firstLadderClimbUp = false, onLad = false, onLadLock = 0, onLadLock2 = 0;
let selectedCube = null, selectedObject = '', cube, echina, livic = null, char1, char2, char3, char4, ch3animations = 'none', ch4animations = 'none', ch3RunAction, ch3JumpAction, ch3WalkBackAction, idleCh3StandAction, ch3StrafeLAction, ch3StrafeRAction, ch2StandToHangAction, ch3StandToHangAction, ch4StandToHangAction;
let ch1RunAction, ch1JumpAction, ch1WalkBackAction, idleCh1StandAction, ch1StrafeLAction, ch1StrafeRAction, ch1ClimbAction, ch1RunJumpAction, ch1KOAction;
let ch2RunAction, ch1FlyAction, ch2FlyAction, ch3FlyAction, ch4FlyAction,  ch2JumpAction, ch2RunJumpAction, ch2WalkBackAction, idleCh2StandAction, ch2StrafeLAction, ch2StrafeRAction, livicIdleAction, falldownAction, ch1GetUpAction;
let ch4RunAction, ch4JumpAction, ch4WalkBackAction, idleCh4StandAction, ch4StrafeLAction, ch4StrafeRAction, th2boneX = 0, th2boneY = 0, th2boneZ = 0, fallTimer = 0;
let ch1TypeAction, ch2TypeAction, ch3TypeAction, ch4TypeAction;
let mixch1, mixch2, mixch4, mixLi, mixlab, _FS, _VS, dumpsterEntryBox,dumpTimer = 0, dumpRdy = false, inDump = false, ceilingBeamClose = false, ceilingBeamTimer = 0;
let backdoorBone, bdbstatus = 0, sDoor1, sDStatus = 0, sDoor2, sDStatus2 = 0, sDoor3, sDoor4, sDStatus3 = 0, sDStatus4, lockerSlidingDoor, lsDStatus = 0, lock1status, lock2status, lock3status, lock4status, lock5status, lock6status;
let inWindow = false, koOnce = 0, yRot = 0, firstPassThru, secPassDist, lock1bone, lock2bone, lock3bone, lock4bone, lock5bone, lock6bone,loadX, loadY, loadZ;
let sLDStatus2 = 0, secondLadderBottom = false, secondLadderTop = false, adminTarget = 'none', plant, mage_1, mage_2, mage_3, mage_4, mage_5, mage_6, mage_7, mage_8, mage_9;
let trackKey = 'H', forKey ='KeyI', backKey = 'KeyK', downKey = 'Comma', flyKey = 'G', strafeLKey='KeyJ', strafeRKey = 'KeyL', npcload = false, spinBone, mixPl, plantIdleAction, plantBiteAction;
const tiamatDownDir = new THREE.Vector3(0,-1,0);
const rotationDuration = 1000; // Duration in milliseconds
let colorSelect = new Array(21);
[colorSelect] = setupCharacterMaterials();
[_FS, _VS] = setupFSVS();
let mesh = null, vic = null,  bounds = null, devType = 'unknown', ch1, setColorOnce = 0, saveGame=false, boundsBox, startMoving = false;
let npcs, adminDottedLine, highlighted, firstPassDist = 0, saveTime = 0, mixVic, vicIdleAction, directionX = 0, directionY = 0, ch1StandToHangAction;
const mouse = new THREE.Vector2();

let counter = 0, ct2 = 0,  mcOnce = 0,  ct3 = 0, ctChk = 0, textMesh1, tiamatH2Bone, dDistToPoint = document.getElementById('distance');
// Usage example:
let wP = document.getElementById('whichPlayer');
let names = ['','','',''];
let invis = [false, false, false, false];
let healths = [40,40,40,40];
let times = [0,0,0,0];
let xs = new Array(4);
let ys = new Array(4);
let zs = new Array(4);
let canfly = false;
let activeActions = [null, null, null, null];
let freeMove = new Array(4);
let color = [0,0,0,0];
let id = new Array(4);
let isLocked = new Array(4);
let freezeSpot;
let dGauge = document.getElementById('gauge-bar'), dContain = document.getElementById('gauge-container');
let isTurn = new Array(4);
let token = ['','','',''];
let actions = ["","","",""];
let direction = new Array(4);
let startX = "0"; 
let startY = "6";
let startZ = "0";
let x1 = 0, origX = startX, mcX = 0, bdAStatus = 0;
let y1 = 0, origY = startY, mcY = 0;
let z1 = 0, origZ = startZ;
// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace; 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
document.getElementById('controls').style.display = 'none';
// Set up scene and cameras
const scene = new THREE.Scene();
const rect = renderer.domElement.getBoundingClientRect();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);
camera.lookAt(0,0,0);
scene.add(camera);
const thirdPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
const firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
const adminCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
adminCamera.position.set(4, 5, 11);
adminCamera.lookAt(0,0,0);
scene.add(thirdPersonCamera);
scene.add(firstPersonCamera);
scene.add(adminCamera);
let activeCamera = camera;

const clock = new THREE.Clock();
let selectedColor, cube1, cube2, cube3, cube4, isTracking = false, targetRotationX =0, targetRotationY = 0;
for (let i=0;i<3;i++){ 
    xs[i]=startX;
    ys[i]=startY;

    freeMove[i] = 0;
    zs[i]=startZ;
    color[i]=0;
    id[i]=0;
    isLocked[i]=0;
    isTurn[i]=0; 
    direction[i]=0;

}

let grounded = 0;
let isDragging = false, backdooralarmBone;
let previousMousePosition = { x: 0, y: 0 };
let dX = document.getElementById('x-coord');
let dY = document.getElementById('y-coord');
let dZ = document.getElementById('z-coord');
let dName = document.getElementById('cube-name');
wP.disabled = false;
let checkThirdCamera = false;

let knobCenterX, knobCenterY;
let dragging = false;
let yspeed = 0, yaccel = 0.05;
let camYOffset = 0, content;
firstPassThru = {
    x: 7.40,
    y: -1.41,
    z: 8.69
};
let clickedObject, intersectPoint, clickedObject2, intersectPoint2, ch2GetUpAction, ch2KOAction;
let whichPlayer = 0, attached;
let a=0, b=1, pa, deltaX = 0, deltaY =0, ba, db, db_r, use_r, use, tkn, tkn_alp;
let mat1; let mat2; let mat3; let mat4, mixch3;
// Execute the regex on the URL

tkn_alp = url.match(ms15);
if (tkn_alp){
tkn = tkn_alp[1];
}
else
tkn = null;
//which device type
if (isMobileDevice()) {
    document.getElementById('devType').innerHTML = 'Mobile/Tablet';
    mobile = true;
  }
  else {
    document.getElementById('devType').innerHTML = 'Desktop';
  }
//load scene//


if (!mobile)
{
    dInt.style.display = 'none';
}
let overheadPath = [] // Initialize the path array
let overheadCurve = {curve: null} // Object to hold the curve


// Load and update the path
const firstFreeze = new BBox(18.15, 0.94, -7.116,1.2);
const narrowPathFreeze = new BBox(-25.94,5.489,60.71, 1.2);
const elevatorFreeze = new BBox(-27.25,-7.223, 151.65,1);






//load models//
const map = new GLTFLoader().setPath('/map/');
map.load('stage3.glb', (gltf) => {
    mesh = gltf.scene;
    mesh.traverse((child) => {
        if (child.isMesh) {
            child.name = 'stage 3';
            child.material.side = THREE.DoubleSide;
        }
    });
    fanBone = findBoneByName(mesh, 'fan');
    eBone = findBoneByName(mesh, 'elevator');

    if (npcs)
    eBone.position.set(npcs[0].x,npcs[0].y,npcs[0].z);

    mesh.position.set(0, 0, 0);
   // mesh.scale.set(0.5, 0.5, 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

}, undefined, function (error) {
    console.error(error);
});

const hangon = new GLTFLoader().setPath('/map/');
hangon.load('hangon.glb', (gltf) => {
    hang = gltf.scene;
    hang.traverse((child) => {
        if (child.isMesh) {
            child.name = 'hang';
            child.material.side = THREE.DoubleSide;
        }
    });
    hang.rotation.y+=120*Math.PI/180;
    hang.position.set(0, 0, 0);
   // mesh.scale.set(0.5, 0.5, 0.5);
    hang.castShadow = true;
    hang.receiveShadow = true;
    scene.add(hang);



    

}, undefined, function (error) {
    console.error(error);
});

let jumper = new GLTFLoader().setPath('/map/');
jumper.load('spring.glb',(gltf)=>{
    jump = gltf.scene;
    jump.traverse((child)=>{
        if (child.isMesh){
            child.name = 'jumper 2';
            
        }
    });
    jump.position.set(-17.773, 14.793,-10.617);
    scene.add(jump);
});


const outOfBounds = new GLTFLoader().setPath('/map/');
outOfBounds.load('outofbounds.glb', (gltf) => {
    bounds = gltf.scene;
    bounds.traverse((child) => {
        if (child.isMesh) {
            child.name = 'bounds';
            //child.visible = false;
        }
    });

    bounds.position.set(0,0,0);
//scene.add(bounds);
});






const vicModel = new GLTFLoader().setPath('/map/');
vicModel.load('vic.glb',(gltf)=>{
    vic = gltf.scene;
    vic.traverse((child)=>{
        if (child.isMesh){ child.name = 'vic'; child.material.transparent=true; vic_kid = child;}
    });
    if (npcs){
    vic.position.set(npcs[10].x,npcs[10].y,npcs[10].z);

    vic.rotation.y = npcs[10].direction;
    }
    const gltfAnimations = gltf.animations;
    mixVic = new THREE.AnimationMixer(vic);
    const vicIdle = THREE.AnimationClip.findByName(gltfAnimations,'idle');
    vicIdleAction = mixVic.clipAction(vicIdle);

    scene.add(vic);
    vicIdleAction.play();


});





initJoystick();



document.getElementById('hand').addEventListener('change', function() {
    if (document.getElementById('hand').checked) {
        document.getElementById('whichHand').textContent = 'Right handed';
        forKey = 'KeyW'; backKey = 'KeyS'; strafeLKey = 'KeyA'; strafeRKey = 'KeyD'; trackKey = 'KeyF'; downKey = 'KeyX';
    } else {
        document.getElementById('whichHand').textContent = 'Left handed';
        forKey = 'KeyI'; backKey = 'KeyK'; strafeLKey = 'KeyJ'; strafeRKey = 'KeyL'; trackKey = 'KeyH'; downKey = 'Comma';
    }
});
// const medusaModel = new GLTFLoader().setPath('/map/');
// medusaModel.load('medusa.glb', (gltf) => {
//     medusa = gltf.scene;
//     medusa.position.set(0,-10,5);
//     medusa.layers.set(0);
//     medusa.traverse((child) => {

//         if (child.isMesh) {
//             child.name = 'medusa';

//         }
//     });



// scene.add(medusa);

    
    
// }, undefined, function (error) {
//     console.error(error);
// });
const character1Model = new GLTFLoader().setPath('/map/');
character1Model.load('characterfly.glb', (gltf) => {
    char1 = gltf.scene;
    char1.traverse((child) => {

        if (child.isMesh) {
            child.name = 'character 1';
            child.castShadow = true;
            child.material.transparent = true;
            char1_kid = child;
        }
    });


    
    char1.position.set(xs[0],ys[0],zs[0]);

scene.add(char1);

    // Set up animation
    const gltfCh1Animations = gltf.animations;
    mixch1 = new THREE.AnimationMixer(char1);
    const idleCh1Standing = THREE.AnimationClip.findByName(gltfCh1Animations, 'standing_idle');
    const ch1RunJumpAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'running_jump');
    const ch1FlyAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'flight');
    idleCh1StandAction = mixch1.clipAction(idleCh1Standing);
    ch1RunJumpAction = mixch1.clipAction(ch1RunJumpAnim);
    ch1FlyAction = mixch1.clipAction(ch1FlyAnim);
    idleCh1StandAction.play();

    const ch1RunAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'running2');
     ch1RunAction = mixch1.clipAction(ch1RunAnim);
    const ch1TypeAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'typing');
    ch1TypeAction = mixch1.clipAction(ch1TypeAnim);
    const ch1ClimbAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'climbing ladder');
    ch1ClimbAction = mixch1.clipAction(ch1ClimbAnim);
    const ch1StandToHangAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'stand_to_hang');
    ch1StandToHangAction = mixch1.clipAction(ch1StandToHangAnim);
    ch1StandToHangAction.setLoop(THREE.LoopOnce, 1);
    ch1StandToHangAction.clampWhenFinished = true;
    const ch1JumpAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'jump2');
    ch1JumpAction = mixch1.clipAction(ch1JumpAnim);
    const ch1GetUpAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'get_up');
    ch1GetUpAction = mixch1.clipAction(ch1GetUpAnim);
    ch1GetUpAction.setLoop(THREE.LoopOnce, 1);
    ch1GetUpAction.clampWhenFinished = true;
    const ch1KOAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'ko');
    ch1KOAction = mixch1.clipAction(ch1KOAnim);
    ch1KOAction.setLoop(THREE.LoopOnce, 1);
    ch1KOAction.clampWhenFinished = true;
    const ch1WalkBackAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'walk_back');
    ch1WalkBackAction = mixch1.clipAction(ch1WalkBackAnim); 
    const ch1StrafeLAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'strafe_right');
    const ch1StrafeRAnim = THREE.AnimationClip.findByName(gltfCh1Animations, 'strafe_left');
    ch1StrafeLAction = mixch1.clipAction(ch1StrafeLAnim);
    ch1StrafeRAction = mixch1.clipAction(ch1StrafeRAnim);
    ch1RunAction.timeScale=1.5;
    ch1ClimbAction.timeScale = 2;
    ch1JumpAction.timeScale = 2;
    ch1WalkBackAction.timeScale = 2;
    ch1KOAction.timeScale = 1;
    ch1TypeAction.timeScale=0.25;
    ch1GetUpAction.timeScale = 2;


    
    if (!mobile)
    document.addEventListener('keydown', handleKeyPress);

}, undefined, function (error) {
    console.error(error);
});

const character2Model = new GLTFLoader().setPath('/map/');
character2Model.load('characterfly.glb', (gltf) => {
    char2 = gltf.scene;
    char2.traverse((child) => {

        if (child.isMesh) {
            child.name = 'character 2';
            child.castShadow = true;
            child.material.transparent = true;
            child.material.opacity = 1;
            char2_kid = child;
        }
    });
    char2.position.set(xs[1],ys[1],zs[1]);
scene.add(char2);

    // Set up animation
    const gltfCh2Animations = gltf.animations;
    mixch2 = new THREE.AnimationMixer(char2);
    const idleCh2Standing = THREE.AnimationClip.findByName(gltfCh2Animations, 'standing_idle');
    const ch2RunJumpAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'running_jump');
    const ch2FlyAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'flight');
    ch2FlyAction = mixch2.clipAction(ch2FlyAnim);
    idleCh2StandAction = mixch2.clipAction(idleCh2Standing);
    ch2RunJumpAction = mixch2.clipAction(ch2RunJumpAnim);
    idleCh2StandAction.play();
    const ch2RunAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'running2');
     ch2RunAction = mixch2.clipAction(ch2RunAnim);
    const ch2ClimbAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'climbing ladder');
    ch2ClimbAction = mixch2.clipAction(ch2ClimbAnim);
    const ch2JumpAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'jump2');
    ch2JumpAction = mixch2.clipAction(ch2JumpAnim);
    const ch2GetUpAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'get_up');
    ch2GetUpAction = mixch2.clipAction(ch2GetUpAnim);
    ch2GetUpAction.setLoop(THREE.LoopOnce, 1);
    ch2GetUpAction.clampWhenFinished = true;
    const ch2KOAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'ko');
    ch2KOAction = mixch2.clipAction(ch2KOAnim);
    ch2KOAction.setLoop(THREE.LoopOnce, 1);
    ch2KOAction.clampWhenFinished = true;
    const ch2TypeAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'typing');
    ch2TypeAction = mixch2.clipAction(ch2TypeAnim);
    const ch2WalkBackAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'walk_back');
    ch2WalkBackAction = mixch2.clipAction(ch2WalkBackAnim); 
    const ch2StrafeLAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'strafe_right');
    const ch2StrafeRAnim = THREE.AnimationClip.findByName(gltfCh2Animations, 'strafe_left');
    ch2StrafeLAction = mixch2.clipAction(ch2StrafeLAnim);
    ch2StrafeRAction = mixch2.clipAction(ch2StrafeRAnim);
    ch2RunAction.timeScale=2;
    ch2ClimbAction.timeScale = .5;
    ch2JumpAction.timeScale = 1;
    ch2WalkBackAction.timeScale = 2;
    ch2TypeAction.timeScale=0.25;
    if (!mobile)
    document.addEventListener('keydown', handleKeyPress);

}, undefined, function (error) {
    console.error(error);
});
const character4Model = new GLTFLoader().setPath('/map/');
character4Model.load('characterfly.glb', (gltf) => {
    char4 = gltf.scene;
    char4.traverse((child) => {

        if (child.isMesh) {
            child.name = 'character 4';
            child.castShadow = true;
            child.material.transparent = true;
            child.material.opacity = 1;
            char4_kid = child;
        }
    });
  
    char4.position.set(xs[3],ys[3],zs[3]);

scene.add(char4);

    // Set up animation
    const gltfCh4Animations = gltf.animations;
    mixch4 = new THREE.AnimationMixer(char4);
    const idleCh4Standing = THREE.AnimationClip.findByName(gltfCh4Animations, 'standing_idle');
    const ch4RunJumpAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'running_jump');
    idleCh4StandAction = mixch4.clipAction(idleCh4Standing);
    ch4RunJumpAction = mixch4.clipAction(ch4RunJumpAnim);
    idleCh4StandAction.play();
    const ch4FlyAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'flight');
    ch4FlyAction = mixch4.clipAction(ch4FlyAnim);
    const ch4RunAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'running2');
     ch4RunAction = mixch4.clipAction(ch4RunAnim);
    const ch4ClimbAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'climbing ladder');
    ch4ClimbAction = mixch4.clipAction(ch4ClimbAnim);
    const ch4JumpAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'jump2');
    ch4JumpAction = mixch4.clipAction(ch4JumpAnim);
    const ch4GetUpAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'get_up');
    ch4GetUpAction = mixch4.clipAction(ch4GetUpAnim);
    ch4GetUpAction.setLoop(THREE.LoopOnce, 1);
    ch4GetUpAction.clampWhenFinished = true;
    const ch4TypeAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'typing');
    ch4TypeAction = mixch4.clipAction(ch4TypeAnim);
    const ch4KOAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'ko');
    ch4KOAction = mixch4.clipAction(ch4KOAnim);
    ch4KOAction.setLoop(THREE.LoopOnce, 1);
    ch4KOAction.clampWhenFinished = true;
    const ch4WalkBackAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'walk_back');
    ch4WalkBackAction = mixch4.clipAction(ch4WalkBackAnim); 
    const ch4StrafeLAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'strafe_right');
    const ch4StrafeRAnim = THREE.AnimationClip.findByName(gltfCh4Animations, 'strafe_left');
    ch4StrafeLAction = mixch4.clipAction(ch4StrafeLAnim);
    ch4StrafeRAction = mixch4.clipAction(ch4StrafeRAnim);
    ch4RunAction.timeScale=2;
    ch4ClimbAction.timeScale = .5;
    ch4JumpAction.timeScale = 1;
    ch4WalkBackAction.timeScale = 2;
    ch4TypeAction.timeScale=0.25;
    if (!mobile)
    document.addEventListener('keydown', handleKeyPress);

}, undefined, function (error) {
    console.error(error);
});

const character3Model = new GLTFLoader().setPath('/map/');
character3Model.load('character.glb', (gltf) => {
    char3 = gltf.scene;
    char3.traverse((child) => {

        if (child.isMesh) {
            child.name = 'character 3';
            child.castShadow = true;
            child.material.transparent = true;
            child.material.opacity = 1;
            char3_kid = child;
        }
    });
    char3.position.set(xs[2],ys[2],zs[2]);
scene.add(char3);

    // Set up animation
    const gltfCh3Animations = gltf.animations;
    mixch3 = new THREE.AnimationMixer(char3);
    const idleCh3Standing = THREE.AnimationClip.findByName(gltfCh3Animations, 'standing_idle');
    const ch3RunJumpAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'running_jump');
    idleCh3StandAction = mixch3.clipAction(idleCh3Standing);
    ch3RunJumpAction = mixch3.clipAction(ch3RunJumpAnim);
    idleCh3StandAction.play();
    const ch3FlyAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'flight');
    ch3FlyAction = mixch3.clipAction(ch3FlyAnim);
    const ch3RunAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'running2');
     ch3RunAction = mixch3.clipAction(ch3RunAnim);
    const ch3ClimbAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'climbing ladder');
    ch3ClimbAction = mixch3.clipAction(ch3ClimbAnim);
    const ch3JumpAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'jump2');
    ch3JumpAction = mixch3.clipAction(ch3JumpAnim);
    const ch3GetUpAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'get_up');
    ch3GetUpAction = mixch3.clipAction(ch3GetUpAnim);
    ch3GetUpAction.setLoop(THREE.LoopOnce, 1);
    ch3GetUpAction.clampWhenFinished = true;
    const ch3KOAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'ko');
    ch3KOAction = mixch3.clipAction(ch3KOAnim);
    ch3KOAction.setLoop(THREE.LoopOnce, 1);
    ch3KOAction.clampWhenFinished = true;
    const ch3TypeAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'typing');
    ch3TypeAction = mixch3.clipAction(ch3TypeAnim);
    const ch3WalkBackAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'walk_back');
    ch3WalkBackAction = mixch3.clipAction(ch3WalkBackAnim); 
    const ch3StrafeLAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'strafe_right');
    const ch3StrafeRAnim = THREE.AnimationClip.findByName(gltfCh3Animations, 'strafe_left');
    ch3StrafeLAction = mixch3.clipAction(ch3StrafeLAnim);
    ch3StrafeRAction = mixch3.clipAction(ch3StrafeRAnim);
    ch3RunAction.timeScale=2;
    ch3ClimbAction.timeScale = .5;
    ch3JumpAction.timeScale = 1;
    ch3WalkBackAction.timeScale = 2;
    ch3TypeAction.timeScale=0.25;
    
    if (!mobile)
    document.addEventListener('keydown', handleKeyPress);

}, undefined, function (error) {
    console.error(error);
});



 cube = new THREE.Mesh(new THREE.SphereGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: "#ff0000", emissive: '#ff0000', emissiveIntensity: 1}));
cube.position.set(0, 0, 0);
cube.castShadow = true;
cube.receiveShadow = true;
cube.material.transparent = true;
cube.material.opacity = 0;
scene.add(cube);




  dX.value = 0; 
  dY.value = 10;
  dZ.value = 0;

// Log all events received by the client
document.addEventListener('DOMContentLoaded', () => {
    
    socket.on('connect', () => {

    
        // Request all players data when connected
        socket.emit('requestPlayerData');
        if (tkn) {
            socket.emit('compareToken', tkn);
        } else {
            whichPlayer = -1;
            wP.value = -1;


        }
    });

    socket.on('lockstatus',(data)=>{
        const status = data.status;
        const which = data.which;
        switch(which){
            case 1:
                lock1status = status;
                break;
            case 2:
                lock2status = status;
                break;
            case 3:
                lock3status = status;
                break;
             case 4:
                lock4status = status;
                break;
            case 5:
                lock5status = status;
                break;
            case 6:
                lock6status = status;
                break;
        }
    });

    socket.on('overheadpath', (data)=>{
        coordinates = data;

        const coordPoints = coordinates.points.map(point => new THREE.Vector3(point.x, point.y, point.z));
        coordPath = new THREE.CurvePath();

            for (let i = 0; i < coordPoints.length - 1; i++) {
                const lineCurve = new THREE.LineCurve3(coordPoints[i], coordPoints[i + 1]);
                coordPath.add(lineCurve);
                }

// If the path is closed, add a curve from the last point to the first
                if (coordinates.closed) {
                 const closingCurve = new THREE.LineCurve3(coordPoints[points.length - 1], coordPoints[0]);
                 coordPath.add(closingCurve);
                }

                pathGeo = new THREE.BufferGeometry().setFromPoints(coordPoints);
                pathMat = new THREE.LineBasicMaterial({ color: 0x000000 });
            const coordLine = new THREE.Line(pathGeo, pathMat);
            scene.add(coordLine);

    })

    socket.on('stopSavingAll',()=>{
        console.log('cant save');
        saveGame = false;
    });
    socket.on('saveAll',()=>{
        console.log('resume save');
        saveGame = true;
    });

    socket.on('freezecheck', (data)=>{
        if (whichPlayer==data.whichPlayer){
            
            freezeSpot[data.whichFreeze] = data.status;
   
        }
    });

    socket.on('playeraction',(data)=>{
   
        if (whichPlayer==data.wp) {
            console.log('changing action to '+data.action);
            ch3animations = data.action;
        }

    });

    socket.on('spinstatus',(data)=>{
        spinstatus = data;
    })
    socket.on('bdbstatus', (data)=>{
bdbstatus = data;
    });

    socket.on('sd1status', (data)=>{
        sDStatus = data;
    })

    socket.on('slidingdoor3status', (data)=>{
        sDStatus3 = data;
    })

    socket.on('updateAnimation',(data)=>{
        if (whichPlayer==data.which){
            ch3animations = data.action;
        }
        if (data!='climb'){
            onLad = false;
        }
    });
    socket.on('slidingdoor4status', (data)=>{
        sDStatus4 = data;
    })

    socket.on('bdalarmstatus',(data)=>{
        console.log('backdoorAlarm status'+ data);
        bdAStatus = data;
    });

    socket.on('lockerslidedoorstatus', (data)=>{
        console.log('setting locker door2');
        sLDStatus2 = data;
    })

    socket.on('windresist', (data)=>{
        if (whichPlayer == data.whichPlayer){
            windResist = data.value;
            console.log('set resist to '+data.value);
        }
    });
    socket.on('playerData', (data) => {

        const players = data.players;
        npcs = data.npcs;
     
        adminCamera.position.set(players["admin"].x, players["admin"].y, players["admin"].z);
        adminCamera.rotation.y = players["admin"].direction;

        for(let index=0;index<4;index++){

            healths[index] = players[index].health;
            xs[index] = players[index].x;
            ys[index] = players[index].y;
            zs[index] = players[index].z;
            saveGame = players[index].saveGame;
            color[index] = players[index].color;
            times[index] = players[index].time;

            isTurn[index] = players[index].isTurn;
            token[index] = players[index].token;
            windResist = players[index].windResist;
            actions[index] = players[index].action;
            invis[index] = players[index].invis;
            direction[index] = players[index].direction;
            freeMove[index] = players[index].freeMove;
            if (tkn==players[index].token)
            {
                
            whichPlayer = players[index].id;
            flyBar = players[index].flybar;
            canfly = players[index].canfly;
            origX = xs[index];
            origY = ys[index];
            origZ = zs[index];
            loadX = players[index].x;
            loadY = players[index].y;
            loadZ = players[index].z;
            freezeSpot = players[index].freezeSpot;
            loadOnce=1;

            wP.value = whichPlayer;
            selectedColor = color[index];
            ch3animations = players[index].action;
            document.getElementById('color-select').value = selectedColor;

            }}

            const whichPerson = whichPlayer;
            const status = invis[whichPlayer-1];
            switch (whichPerson){
                case 1:
                    invis[whichPerson-1] = status;
                    if (status){
                        colorSelect[selectedColor].opacity =0.25;
                    }
                    else
                    colorSelect[selectedColor].opacity  = 1;
                    break;
                case 2:
                    invis[whichPerson-1] = status;
                    if (status){
                        colorSelect[selectedColor].opacity =0.25;
                    }
                    else
                    colorSelect[selectedColor].opacity  = 1;
                    break;
                case 3:
                    invis[whichPerson-1] = status;
                    if (status){
                        colorSelect[selectedColor].opacity =0.25;
                    }
                    else
                    colorSelect[selectedColor].opacity  = 1;
                    break;
                case 4:
                    invis[whichPerson-1] = status;
                    if (status){
                        colorSelect[selectedColor].opacity =0.25;
                    }
                    else
                    colorSelect[selectedColor].opacity = 1;
                    break;
            }



            if (wP.value>0){
                if (whichPlayer!=5){
                document.getElementById('controls').disabled = true;
                if (whichPlayer==1)
                    selectedCube = char1;
                if (whichPlayer==2)
                    selectedCube = char2;
                if (whichPlayer==3){
                    selectedCube= char3;
                }
                if (whichPlayer==4)
                    selectedCube = char4;
            }

            }
            if (wP.value==0){

            }

            if (wP.value <0){
                document.getElementById('controls').style.display = "none";

            }

//set up cubes based on loaded data
[cube1, cube2, cube3, cube4] = setupCubes();
cube1.name = 'cube1';
cube2.name = 'cube2';
cube3.name = 'cube3';
cube4.name = 'cube4';
scene.add(cube1);
scene.add(cube2);
scene.add(cube3);
scene.add(cube4);


cube1.position.x = xs[0]; char1.position.x = xs[0];
cube1.position.y = ys[0]; char1.position.y = ys[0];
cube1.position.z = zs[0]; char1.position.z = zs[0];
cube1.material = colorSelect[parseInt(color[0])];
char1_kid.material = colorSelect[parseInt(color[0])];
cube2.position.x = xs[1];
cube2.position.y = ys[1];
cube2.position.z = zs[1];
char2.position.x = xs[1];
char2.position.y = ys[1];
char2.position.z = zs[1];
char2_kid.material = colorSelect[parseInt(color[1])];

cube3.position.x = xs[2];
cube3.position.y = ys[2];
cube3.position.z = zs[2];
char3.position.x = xs[2];
char3.position.y = ys[2];
char3.position.z = zs[2];
char3_kid.material = colorSelect[parseInt(color[2])];

cube4.position.x = xs[3];
cube4.position.y = ys[3];
cube4.position.z = zs[3];
char4.position.x = xs[3];
char4.position.y = ys[3];
char4.position.z = zs[3];
char4_kid.material = colorSelect[parseInt(color[3])];


    });
    
    socket.on('stopSavingPlayer',(data) =>{
        console.log('stop saving');
        if (whichPlayer == data)
            saveGame = false;
    })

    socket.on('savePlayer',(data) =>{
        console.log('resume saving');
        if (whichPlayer == data)
            saveGame = true;
    })
  
    
socket.on('playerLocked', (player) => {
        console.log(`Player ${player.id} locked`);
        // You can add additional logic here to update the UI based on which player is locked
    });
socket.on('tokenComparisonResult', (data) =>{
handleServerResponse(data);
});


socket.on('getup',(data)=>{
    if ((whichPlayer==data)&&(koOnce==1))
    {
        ch3animations=='getup';
        console.log('on your feet');
        if (whichPlayer==1)
        playAnimation(ch1GetUpAction);
        if (whichPlayer==2)
            playAnimation(ch2GetUpAction);
        if (whichPlayer==3)
            playAnimation(ch3GetUpAction);
        if (whichPlayer==4)
            playAnimation(ch4GetUpAction);
        koOnce=2;
    }
});

socket.on('canfly',(data)=>{
    if (whichPlayer==data.which)
    { console.log('your fly status set to '+data.fly); canfly = data.fly;}
});


socket.on('jumpToPos', (data) =>{
    const dat = data;
    console.log('moving player '+dat.whichPlay+' to position: '+dat.x+','+dat.y+','+dat.z);
    if (dat.whichPlay==1)
    {
        char1.position.x = dat.x;
        char1.position.y = dat.y;
        char1.position.z = dat.z;
    }
    if (dat.whichPlay==2)
        {
            char2.position.x = dat.x;
            char2.position.y = dat.y;
            char2.position.z = dat.z;
        }
        if (dat.whichPlay==3)
            {
                char3.position.x = dat.x;
                char3.position.y = dat.y;
                char3.position.z = dat.z;
            }
            if (dat.whichPlay==4)
                {
                    char4.position.x = dat.x;
                    char4.position.y = dat.y;
                    char4.position.z = dat.z;
                }
})

socket.on('whoseTurn', (data) => {
    const val = data;

   isTurn[val] = 1;
   if (val+1!=whichPlayer){
    isTurn[whichPlayer-1] = 0;
    freeMove[whichPlayer-1] = 1;
    console.log('not your turn');
   }
   else
   {
    console.log('your turn');
    origX = selectedCube.position.x;
    origY = selectedCube.position.y;
    origZ = selectedCube.position.z;
    freeMove[whichPlayer-1] = 0;
   }

});
socket.on('movelevator',(data)=>{
    console.log(data);

 eAction = data;

});
socket.on('makeInvis', (data)=>{
    const whichPerson = data.which;
    const status = data.invis;

    switch (whichPerson){
        case 1:
            invis[whichPerson-1] = status;
            if (status){
                colorSelect[selectedColor].opacity =0.25;
            }
            else
            colorSelect[selectedColor].opacity  = 1;
            break;
        case 2:
            invis[whichPerson-1] = status;
            if (status){
                colorSelect[selectedColor].opacity =0.25;
            }
            else
            colorSelect[selectedColor].opacity  = 1;
            break;
        case 3:
            invis[whichPerson-1] = status;

            if (status){
                colorSelect[selectedColor].opacity =0.25;
                console.log(colorSelect[selectedColor].opacity+','+colorSelect[selectedObject].transparent);
            }
            else
            colorSelect[selectedColor].opacity  = 1;
            break;
        case 4:
            invis[whichPerson-1] = status;
            if (status){
                colorSelect[selectedColor].opacity =0.25;
            }
            else
            colorSelect[selectedColor].opacity = 1;
            break;
        case 'vic':
        
            if (status){
                
                vic.material.opacity = 0.2;
                
            }
            else{
                vic.material.opacity=1;

            }
            break;
    }

});

socket.on('freeMove', (data) => {
    const whi = data.which-1;
    const val = data.val;
    const why = whi+1
   freeMove[whi] = val;
   if (val==1)
    console.log('player'+why+' cant move');
   else
   console.log('player'+why+' can move now');
});

socket.on('moveNPC',(data)=>{
    switch (data.which){    
        
        case 1:
            if (livic!=null)
            livic.position.set(data.x,data.y,data.z);
        break;
            case 10:
                vic.position.set(data.x,data.y,data.z);
            break;
    }
});
socket.on('freeMoveAll', (data) => {
    const val = data.val;

   freeMove[0] = val;
   freeMove[1] = val;
   freeMove[2] = val;
   freeMove[3] = val;
   if (val==1)
    console.log('no player can move');
   else
   console.log('players can move now');
});
});



let _previousRAF = null;


const destCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 })
  );
  destCube.name = 'destCube';
  scene.add(destCube);

const firstLadderTopBox = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshStandardMaterial({color: "#ff0000", transparent: true, opacity: 0,   depthWrite: false, depthTest: true,}),
);
firstLadderTopBox.position.set(.75,-1.65,16.3);
scene.add(firstLadderTopBox);

const firstLadderBotBox = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshStandardMaterial({color: "#ff0000", transparent: true, opacity: 0,   depthWrite: false, depthTest: true,}),
);
firstLadderBotBox.position.set(.75,-13,16.3);
scene.add(firstLadderBotBox);

dumpsterEntryBox = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshStandardMaterial({color: "#aa00ff", transparent: true, opacity: 0,   depthWrite: false, depthTest: true,}),
);
dumpsterEntryBox.position.set(5.38, -0.89, 2.25);
scene.add(dumpsterEntryBox);
const ceilingBeamBox = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshStandardMaterial({color: "#aa00ff", transparent: true, opacity: 0,   depthWrite: false, depthTest: true,}),
);
ceilingBeamBox.position.set(1.6,7.6,17);
scene.add(ceilingBeamBox);

//fog
const vertexShader = `
    varying vec3 vWorldPosition;

    void main() {
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    

    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    void main() {
        float fogFactor;
        
        if (cameraPosition.y > 2.0) {
            discard;  // Discard fragments where y > 2
        } else if (cameraPosition.y < 1.0) {
            fogFactor = 1.0;  // Apply full fog for y < 1
        } else {
            fogFactor = smoothstep(fogNear, fogFar, 2.0 - cameraPosition.y);
        }

        vec3 color = mix(vec3(1.0), fogColor, fogFactor);
        gl_FragColor = vec4(color, fogFactor);  // Set alpha based on fogFactor
    }
`;


const uniforms = {
    fogColor: { value: new THREE.Color(0xaaaaaa) },
    fogNear: { value: 0.0 },
    fogFar: { value: 10.0 },
    cameraPosition: { value: new THREE.Vector3() }  // Add camera position uniform
};

const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.DoubleSide,  // Ensures backface culling is enabled
    transparent: true  // Enables transparency
});

const eBoneSphere = new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI*2, 0,Math.PI );
const eBoneMesh = new THREE.Mesh(eBoneSphere, new THREE.MeshBasicMaterial());
scene.add(eBoneMesh);

const realFog = new THREE.Fog(0xDFE9F3,1,20);
scene.fog = realFog;

const landTex = new THREE.TextureLoader();
const texture = landTex.load('/map/birds_eye.jpg');
const landMat = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});

const landGeo = new THREE.PlaneGeometry(400,400);
const landPlane = new THREE.Mesh(landGeo, landMat);
landPlane.position.set(0,-100,0);
landPlane.rotation.x+=90*Math.PI/180;
scene.add(landPlane);
// Set up lights
const spotLight = new THREE.SpotLight(0xffffff, 1, 100, 1, -32);
spotLight.position.set(5.01, 5.998, 18.48);
spotLight.castShadow = true;
scene.add(spotLight);

const lastSpot = new THREE.SpotLight(0xffffff, 0.1, 500, 1, .1);
lastSpot.position.set(88.69,12.47,72.48);
lastSpot.castShadow = true;
scene.add(lastSpot);

const lastSpot2 = new THREE.SpotLight(0xffffff, 0.1, 500, 1, .1);
lastSpot2.position.set(116.5,4.7,78.26);
lastSpot2.castShadow = true;
scene.add(lastSpot2);

const spotLight2 = new THREE.SpotLight(0xffffff, .1, 1000, 1, 0.1);
spotLight2.position.set(-3.11, 4, 3.18);
spotLight2.castShadow = true;
scene.add(spotLight2);

const spotLight3 = new THREE.SpotLight(0xffffff, .1, 1000, 1, 0.1);
spotLight3.position.set(-32.39, -4, 159.5);
spotLight.castShadow = true;
scene.add(spotLight3);
// Add ambient light
const ambientLight = new THREE.AmbientLight(0xDFE9F3, 0.01); // Soft white light with intensity
scene.add(ambientLight);
scene.background = new THREE.Color(0xDFE9F3);




function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
if (!mobile){
window.addEventListener('mousedown', (event) => {
        isDragging = true;
        holdClick += 1;
        if (mcOnce==0)
        {
            mcX = event.clientX;
            mcY = event.clientY;
        }
        // Your logic for mouse down event
    });

window.addEventListener('mouseup', (event) => {
        isDragging = false;
        deltaX = 0;
        deltaY = 0;
        mcX = 0;
        mcY = 0;
        
        if ((inWindow)&&(holdClick<10))
            {
           
           mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
           mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
           raycaster.setFromCamera(mouse,activeCamera);
           let objectsNonIntersects = scene.children
         .filter(obj => obj !== destCube)
       
           const intersects = raycaster.intersectObjects(scene.children, true);
       
           if ((intersects.length > 0)&&(whichPlayer==5)){
       
               for (let i = 0; i<intersects.length; i++)
               {
                   if ((intersects[i].object.name!='stage 3') &&(intersects[i].object.name!='bounds')&&(intersects[i].object.name!=''))
                   {
       
                       
                       selectedObject = intersects[i].object;
                       highlighted = selectedObject;
                       adminTarget = highlighted.name;
                       
                   }
                   
               }
       if (whichPlayer==5){
                   intersectPoint = intersects[0].point;
                   destCube.position.x = intersectPoint.x;
                   destCube.position.y = intersectPoint.y;
                   destCube.position.z = intersectPoint.z;
                   dX.value = destCube.position.x;
                   dY.value = destCube.position.y;
                   dZ.value = destCube.position.z;
                   clickEnvObjects(destCube);
                   dName.value = adminTarget;

       }
               }
       }
        holdClick = 0;
    });

window.addEventListener('mousemove', onMouseMove);
}

window.addEventListener('resize', onWindowResize, false);


if (mobile){

button.addEventListener('touchstart',(e)=>{
    mButtonPressed = true;
    mbt++;
});

button.addEventListener('touchend',(e)=>{
    mButtonPressed = false;
    mbt=0;
});
 
joystickKnob.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    knobX = joystickKnob.offsetLeft;
    knobY = joystickKnob.offsetTop;
    whichTouch++;

    howManyTouches++;
    touching = true;


    
    
});

joystickKnob.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    knobDeltaX = deltaX;
    knobDeltaY = deltaY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 50; // Half of joystick background size

    if (distance < maxDistance) {
        joystickKnob.style.left = `${knobX + deltaX}px`;
        joystickKnob.style.top = `${knobY + deltaY}px`;
    } else {
        const angle = Math.atan2(deltaY, deltaX);
        joystickKnob.style.left = `${knobX + maxDistance * Math.cos(angle)}px`;
        joystickKnob.style.top = `${knobY + maxDistance * Math.sin(angle)}px`;
    }

    // Calculate movement direction
     directionX = (joystickKnob.offsetLeft - knobX) / maxDistance;
     directionY = (joystickKnob.offsetTop - knobY) / maxDistance;
    const data = {
        dX: directionX,
        dY: directionY,
        tS: touchstatus
    }
    socket.emit('show directions', data);
    // Convert to movement directions (12 o'clock is forward, etc.)

});

joystickKnob.addEventListener('touchend', () => {
    // Reset joystick knob to the center
    touching = false;
    mButtonPressed = false;
    joystickKnob.style.left = `${originalKnobX}px`;
    joystickKnob.style.top = `${originalKnobY}px`;
    
    if (whichTouch==0)
        touchstatus = 'none';
    knobDeltaX = 0;
    knobDeltaY = 0;
    directionX = 0;
    directionY = 0;
    // Optionally, stop movement when the touch is released
    if (selectedCube)
    handleMovement(0, 0);
});
}



const keyState = {};





//Ready to end their turn if its their turn


if (!mobile){

dVic.addEventListener('click',()=>{
    adminTarget = 'vic';
    dName.value = 'vic';
})
dLivic.addEventListener('click',()=>{
    adminTarget = 'livic';
    dName.value = 'livic';
})


document.getElementById('isTurn').addEventListener('click',()=>{
   
        if (isTurn[whichPlayer-1]==1)
        {
            let next = 0, from = 0;
            isTurn[whichPlayer-1]=0;
            freeMove[whichPlayer-1] = 1;
            if (whichPlayer==1){from = 1; next = 2; }
            if (whichPlayer==2){from = 2; next = 3;}
            if (whichPlayer==3){from = 3; next = 4;}
            if (whichPlayer==4){from = 4; next = 1;}
            console.log('passing turn to: '+next);
            socket.emit('nextTurn',{from, next});
        }
});  
    
document.getElementById('invis').addEventListener('click',()=>{
    if (whichPlayer==5){
        if (adminTarget=='vic'){
            socket.emit('makeVicInvis');
        }
    }
});
//using yes/no buttons
document.getElementById('yes-btn').addEventListener('click',()=>{
   if (whichPlayer==5){



    if (adminTarget=='livic'){
        if (livic!=null){
        livic.position.x = destCube.position.x;
        livic.position.y = destCube.position.y;
        livic.position.z = destCube.position.z;}
    }
    
   }
});

document.getElementById('open').addEventListener('click',()=>{
    if (whichPlayer==5){
        if (adminTarget =='backDoor'){
           
            socket.emit('dbdstatus', -1);
        }
        if (adminTarget=='slidingDoor1')
        {
            socket.emit('sdstatus1',1);
        }
        if (adminTarget=='slidingDoor2')
            {
                socket.emit('sldstatus',1);
            }
            if (adminTarget=='slidingDoor3')
                {
                    socket.emit('sld3status',1);
                }
                if (adminTarget=='slidingDoor4')
                    {
                        socket.emit('sld4status',1);
                    }
                if (adminTarget=='backdooralarm')
                {
                    socket.emit('bdastatus', 1);
                }
                if (adminTarget=='spinbone')
                    socket.emit('spinbonestatus', -1)
        if (adminTarget=='locker 1')
            socket.emit('lock1', 1);
        if (adminTarget=='locker 2')
            socket.emit('lock2', -1);
        if (adminTarget=='locker 3')
            socket.emit('lock3', 1);
        if (adminTarget=='locker 4')
            socket.emit('lock4', -1);
        if (adminTarget=='locker 5')
            socket.emit('lock5', 1);
        if (adminTarget=='locker 6')
            socket.emit('lock6', -1);
    }
});

document.getElementById('close').addEventListener('click',()=>{
    
        
});

document.getElementById('clear').addEventListener('click',()=>{

    if (whichPlayer ==5){
   document.getElementById('cube-name').value = '';
   adminTarget = null;
   dX.value = 0;
   dY.value = 0;
   dZ.value = 0;
   scene.remove(adminDottedLine);}
});

document.getElementById('P1').addEventListener('click',()=>{
    if (whichPlayer==5){

        adminTarget = char1_kid.name;
        dName.value = adminTarget;
    }
});
document.getElementById('P2').addEventListener('click',()=>{
    if (whichPlayer==5){
        adminTarget = char2_kid.name;
        dName.value = adminTarget;
    }
});

document.getElementById('P3').addEventListener('click',()=>{
    if (whichPlayer==5){
        adminTarget = char3_kid.name;
        dName.value = adminTarget;
    }
});
document.getElementById('P4').addEventListener('click',()=>{
    if (whichPlayer==5){
        adminTarget = char4_kid.name;
        dName.value = adminTarget;
    }
});

document.getElementById('attack').addEventListener('click',()=>{
    if ((whichPlayer==5)&&(adminTarget=='plant')){
        socket.emit('requestplantbite');
    }
})
document.getElementById('jump').addEventListener('click',()=>{
    if (whichPlayer==5){
        let data;
        const dYoffset = dY.value+5;
        switch (adminTarget){
        case 'character 1':          
         data = { which: 1, x: dX.value, y: dYoffset, z: dZ.value};

            socket.emit('playerMovePos', data);
        break;
        case 'character 2':          
         data = { which: 2, x: dX.value, y: dYoffset, z: dZ.value};

            socket.emit('playerMovePos', data);
        break;
        case 'character 3':          
         data = { which: 3, x: dX.value, y: dYoffset, z: dZ.value};

            socket.emit('playerMovePos', data);
        break;
        case 'character 4':          
         data = { which: 4, x: dX.value, y: dYoffset, z: dZ.value};

            socket.emit('playerMovePos', data);
        break;

            case 'vic':
                data = {which: 10, x: parseFloat(dX.value), y: parseFloat(dY.value), z: parseFloat(dZ.value), direction: vic.rotation.y }
                socket.emit('npcMovePos', data); 
                break;
            case 'livic':
                if (livic!=null){
                data = {which: 1, x: parseFloat(dX.value), y: parseFloat(dY.value), z: parseFloat(dZ.value), direction: livic.rotation.y }}
                socket.emit('npcMovePos', data); 
                break;
        }
    }
})

document.getElementById('pickup').addEventListener('click',()=>{
    if (whichPlayer==5){
    if (adminTarget=='character 1'){
        
        console.log('picking up the player');
        socket.emit('getup', 1);
    }
    if (adminTarget=='character 2'){
        
        console.log('picking up the player');
        socket.emit('getup', 2);
    }
    if (adminTarget=='character 3'){
        
        console.log('picking up the player');
        socket.emit('getup', 3);
    }
    if (adminTarget=='character 4'){
        
        console.log('picking up the player');
        socket.emit('getup', 4);
    }
}
});

window.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
    if (event.key === 'h' || event.key === 'H') {
        if (whichPlayer!=5){
        isTracking = true;
    
        document.body.requestPointerLock();
        document.getElementById('distanceOverlay').style.display = 'block';}
        
    }
    if ((keyState[downKey])&&(ch3animations=='flight')&&(stopFlyT==0)){

        if (stopFlyTimer==0) stopFlyTimer++;
        stopFly++;
        stopFlyT++;
        if (stopFly==2){
            grounded = 0;
            ch3animations ='jump';
        }

    }
    if (((mButtonPressed)||(keyState['Space']))&&(!elevatorTouch)&&(ch3animations=='elevator')) { elevatorT++; elevatorT2++; elevatorTouch = true; }
});

window.addEventListener('keyup', (event) => {
    
    keyState[event.code] = false;
    elevatorTouch = false;
    if (event.key === 'h' || event.key === 'H') {
        if (whichPlayer!=5){
        isTracking = false;
        document.exitPointerLock();
        document.getElementById('distanceOverlay').style.display = 'none';}
    }
    if ((ch3animations!='jump')&&(ch3animations!='elevator')&&(ch3animations!='flight')&&(!keyState[forKey])&&(!keyState[strafeLKey])&&(!keyState[backKey])&&(!keyState[strafeRKey])&&(!onLad)&&(ch3animations!='ko')&&(ch3animations!='hangon')){
        ch3animations = 'none';

    
    if (whichPlayer==1){
        playAnimation(idleCh1StandAction);
        }
    if (whichPlayer==2){
            char2.timeScale =1;
            playAnimation(idleCh2StandAction);
        }
    if (whichPlayer==3){
            char3.timeScale =1;
            playAnimation(idleCh3StandAction);
            }
    if (whichPlayer==4){
            char4.timeScale =1;

            playAnimation(idleCh4StandAction);
            }
        
    }

    if ((keyState[forKey])&&(!onLad)&&(!onHang)&&(grounded==1)&&(ch3animations!='ko')&&(ch3animations!='jump')&&(ch3animations!='flight')&&(ch3animations!='elevator')){

        ch3animations='run fwd';
        
        if (whichPlayer==1){
            if (!ch1RunAction.isRunning())
                playAnimation(ch1RunAction);
        }
        if (whichPlayer==2){
            if (!ch2RunAction.isRunning())
                playAnimation(ch2RunAction);
        }
        if (whichPlayer==3){
            if (!ch3RunAction.isRunning())
                playAnimation(ch3RunAction);
        }
        if (whichPlayer==4){
            if (!ch4RunAction.isRunning())
                playAnimation(ch4RunAction);
        }
    }
    if ((keyState[backKey])&&(!onLad)&&(!onHang)&&(grounded==1)&&(ch3animations!='ko')&&(ch3animations!='jump')&&(ch3animations!='flight')&&(ch3animations!='elevator')){
        ch3animations='run bck';
        if (whichPlayer==1){
            if (!ch1WalkBackAction.isRunning())
                playAnimation(ch1WalkBackAction);
        }
        if (whichPlayer==2){
            if (!ch2WalkBackAction.isRunning())
                playAnimation(ch2WalkBackAction);
        }
        if (whichPlayer==3){
            if (!ch3WalkBackAction.isRunning())
                playAnimation(ch3WalkBackAction);
        }
        if (whichPlayer==4){
            if (!ch4WalkBackAction.isRunning())
                playAnimation(ch4WalkBackAction);
        }
    }
    if ((keyState[strafeLKey])&&(!onLad)&&(!onHang)&&(grounded==1)&&(ch3animations!='ko')&&(ch3animations!='jump')&&(ch3animations!='flight')&&(ch3animations!='elevator')){
        ch3animations='strafe left';
        if (whichPlayer==1){
            if (!ch1StrafeRAction.isRunning())
                playAnimation(ch1StrafeRAction);
        }
        if (whichPlayer==2){
            if (!ch2StrafeRAction.isRunning())
                playAnimation(ch2StrafeRAction);
        }
        if (whichPlayer==3){
            if (!ch3StrafeRAction.isRunning())
                playAnimation(ch3StrafeRAction);
        }
        if (whichPlayer==4){
            if (!ch4StrafeRAction.isRunning())
                playAnimation(ch4StrafeRAction);
        }
    }
    if ((keyState[strafeRKey])&&(!onLad)&&(!onHang)&&(grounded==1)&&(ch3animations!='ko')&&(ch3animations!='jump')&&(ch3animations!='flight')&&(ch3animations!='elevator')){
        ch3animations='strafe right';
        if (whichPlayer==1){
            if (!ch1StrafeLAction.isRunning())
                playAnimation(ch1StrafeLAction);
        }
        if (whichPlayer==2){
            if (!ch2StrafeLAction.isRunning())
                playAnimation(ch2StrafeRAction);
        }
        if (whichPlayer==3){
            if (!ch3StrafeLAction.isRunning())
                playAnimation(ch3StrafeLAction);
        }
        if (whichPlayer==4){
            if (!ch4StrafeLAction.isRunning())
                playAnimation(ch4StrafeLAction);
        }
    }

});
}

if (mobile){
    document.getElementById('int-popup').addEventListener('touchstart', function(event){

        
        if ((dumpRdy)&&(dumpTimer==0)&&(!inDump)){
            dumpTimer = 1;
            inDump = true;
            selectedCube.position.x = 5.63;
            selectedCube.position.z = 2.27;
            yRot = -1.4;
    
        }
    
        if ((dumpRdy)&&(dumpTimer==0)&&(inDump)){
            dumpTimer = 1;
            inDump = false;
            selectedCube.position.x = 3.05;
            selectedCube.position.z = 2.26;
            yRot = -1.4;
    
        }
    
        if ((ceilingBeamClose)&&(ceilingBeamTimer==0)&&(selectedCube.position.y>4)&&(selectedCube.position.y<7)&&(onLad)&&(onLadLock2==0)){
            ceilingBeamTimer = 1;
    
            selectedCube.position.x = 2.2;
            selectedCube.position.z = 16.4;
            selectedCube.position.y = 11;
            yRot = 0;
            onLad = false;
            ch3animations = 'none';
            onLadLock2 = 0;
            onLadLock = false;
            grounded = 1;
    
        }
    
        if ((selectedCube.position.z<8.7)&&(firstPassDist<=2)){
            selectedCube.position.z+=2;
        }
    
    
        if ((selectedCube.position.x<4.2)&&(secPassDist<=2)){
            selectedCube.position.x+=3;
        }
        if ((ceilingBeamClose)&&(ceilingBeamTimer==0)&&(selectedCube.position.y>8)&&(!onLad)&&(onLadLock2==0)){
            ceilingBeamTimer = 1;
            selectedCube.position.x = 1.6;
            selectedCube.position.y = 6.4;
            selectedCube.position.z = 16.4;
            yRot = 0;
            onLadLock2=1;
            grounded = 0;
            ch3animations = 'climb';
            onLad = true;
    
        }
    
        if ((!onLad)&&(onLadLock2==0)&&(secondLadderBottom)){
       
            selectedCube.position.x = 7.74 ;
            selectedCube.position.y = -13;
            selectedCube.position.z = 61.26;
            yRot = 0;
            onLadLock2=1;
            grounded = 0;
            ch3animations = 'climb';
            onLad = true;
    
        }
    
        if ((firstLadderClimbDown)&&(!onLad)&&(onLadLock2==0)){
            onLad = true;
            selectedCube.position.x = 1.6;
            selectedCube.position.z = 16.4;
            yRot = 0;
            grounded = 0;
            onLadLock2=1;
            ch3animations = 'climb';
            }
        if ((firstLadderClimbUp)&&(onLad)&&(onLadLock2==0)){
            selectedCube.position.z+=3;
            grounded = 1;
            onLadLock2=1;
    
            ch3animations = 'none'
            onLad = false;
            onLadLock = false;
        }
    
        
        if ((firstLadderClimbUp)&&(!onLad)&&(onLadLock2==0)){
    
            selectedCube.position.x = 1.6;
            selectedCube.position.y = -12;
            selectedCube.position.z = 16.4;
            yRot = 0;
            onLadLock2=1;
            grounded = 0;
            ch3animations = 'climb';
            onLad = true;
            }
    
            if ((secondLadderTop)&&(!onLad)&&(onLadLock2==0)){
    
                selectedCube.position.x = 7.74;
                selectedCube.position.y = 6;
                selectedCube.position.z = 61.26;
                yRot = 0;
                onLadLock2=1;
                grounded = 0;
                ch3animations = 'climb';
                onLad = true;
                }
    
        if ((firstLadderClimbDown)&&(onLad)&&(onLadLock2==0)){
                 
                selectedCube.position.x = 0.3;
                selectedCube.position.y = -2.34;
                selectedCube.position.z = 16.4;
                yRot = 0;
                onLadLock2=1;
                grounded = 0;
                ch3animations = 'jump';
                onLad = false;
                onLadLock = 0;
    
                }
    
                if ((secondLadderTop)&&(onLad)&&(onLadLock2==0)){
                 
                    selectedCube.position.x = 9.04;
                    selectedCube.position.y = 6;
                    selectedCube.position.z = 61.56;
                    yRot = 0;
                    onLadLock2=1;
                    grounded = 0;
                    ch3animations = 'jump';
                    onLad = false;
                    onLadLock = 0;
        
                    }
    
                    if ((secondLadderBottom)&&(onLad)&&(onLadLock2==0)){
                 
                        selectedCube.position.x = 7.16;
                        selectedCube.position.y = -12;
                        selectedCube.position.z = 62;
                        yRot = 0;
                        onLadLock2=1;
                        grounded = 0;
                        ch3animations = 'jump';
                        onLad = false;
                        onLadLock = 0;
            
                        }


    })
}

animate();


function displayObjectInfo() {
    if (isMobileDevice()) {
        document.getElementById('joystickContainer').style.display = 'block';
    }



}
// Function to handle mouse move event
function onMouseMove(event) {

    if (event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom) {inWindow=true;}
else inWindow = false;

    if ((whichPlayer!=5)&&(isDragging))
    {
    // Update mouse position
    if (!isTracking){
        cube.material.opacity=0;
    deltaX = event.clientX - previousMousePosition.x;
    deltaY = event.clientY - previousMousePosition.y;
}
    else {
        cube.material.opacity = 1;
    deltaX = event.movementX || 0; /*event.mozMovementX || event.webkitMovementX;*/
    deltaY = event.movementY || 0; /*event.mozMovementY || event.webkitMovementY;*/
}
    if ((deltaX<=1) &&(deltaX>=-1)) deltaX = 0;
    if (deltaX<-10) deltaX = -10;
    if (deltaX>10) deltaX = 10;
    if ((deltaY<=1) &&(deltaY>=-1)) deltaY = 0;
    if (deltaY<-10) deltaY = -10;
    if (deltaY>10) deltaY = 10;
    // Update previous mouse position
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
     // Adjust rotation speed sensitivity if needed


    raycaster.setFromCamera(mouse, activeCamera);
        }
    if ((whichPlayer==5) || (whichPlayer<1)) {

        if (isDragging) {

            const newMouseX = event.clientX;
            const newMouseY = event.clientY;
            deltaX = newMouseX - mcX;
            deltaY = newMouseY - mcY;
            mcX = newMouseX;
            mcY = newMouseY;

            // Update adminCamera rotation based on deltaX and deltaY
            adminCamera.rotation.y -= deltaX * 0.005; // Adjust the sensitivity as needed
            adminCamera.rotation.x -= deltaY * 0.005; // Adjust the sensitivity as needed
        }
    }

}


function switchToThirdPersonCamera(clickedObject) {
    const offset = new THREE.Vector3(0, 2.5, -2);
    if (clickedObject){
    checkThirdCamera = true;
    const targetPosition = new THREE.Vector3();
    clickedObject.getWorldPosition(targetPosition);
    thirdPersonCamera.position.copy(targetPosition).add(offset);
    thirdPersonCamera.lookAt(targetPosition);
    activeCamera = thirdPersonCamera;}
}

function updateThirdPersonCamera() {
       

        if (selectedCube) {

        if (selectedCube==char1) switchToThirdPersonCamera(char1);
        if (selectedCube==char2) switchToThirdPersonCamera(char2);
        if (selectedCube==char3) switchToThirdPersonCamera(char3);
        if (selectedCube==char4) switchToThirdPersonCamera(char4);

        if ((ch3animations!='ko')&&(ch3animations!='hangon')&&(ch3animations!='elevator'))
            selectedCube.rotation.y = yRot;

        selectedCube.rotation.z=0;
        let offsetHeight = 2.5 + camYOffset;


        if (!mobile){
        if ((deltaX>2)||(deltaX<-2)){
        if ((!onLad))
        yRot -= deltaX * .01;
        else
        {yRot = 0;}

        }
        // Update camYOffset based on deltaY
        if ((deltaY>1)||(deltaY<-1))
        camYOffset += deltaY * 0.02;
    }
    if (mobile){
        if ((knobDeltaX>5)||(knobDeltaX<-5)){
            if ((!onLad)&&(touchstatus=='double')&&(ch3animations!='ko')&&(ch3animations!='hangon')&&(ch3animations!='elevator'))
            yRot -= knobDeltaX * .0025;
            if (onLad)
            {yRot = 0;}

            }
            // Update camYOffset based on deltaY
            if (((knobDeltaY>5)||(knobDeltaY<-5))&&(touchstatus=='double'))
            camYOffset += knobDeltaY * 0.0025;
    }


        if (camYOffset>2) camYOffset = 2;
        if (camYOffset<-2.75) camYOffset = -2.75
        if (offsetHeight>=5) {offsetHeight=5;}
        if (offsetHeight<-.25) {offsetHeight =-.25; camYOffset=-2.75}

        const offset = new THREE.Vector3(
            offsetDistance * Math.sin(yRot),
            offsetHeight,
            offsetDistance * Math.cos(yRot)
        ); 
        if (camYOffset<-0.5) {

            offsetDistance = 3; // Adjust the value as needed
        }
        else
        offsetDistance=3;
        const targetPosition = new THREE.Vector3();
        selectedCube.getWorldPosition(targetPosition);
        
        thirdPersonCamera.position.copy(targetPosition).add(offset);
        thirdPersonCamera.position.y += -.6; // Use dA.value to move the camera up or down

        const lookAtTarget = targetPosition.clone();
        lookAtTarget.y += 1.4; 



        thirdPersonCamera.lookAt(lookAtTarget);
        activeCamera = thirdPersonCamera;
    }
}

//set up key up and down events to window





function update() {

    if (whichPlayer==5){

            saveNPCData();
            const data = {
                x: adminCamera.position.x,
                y: adminCamera.position.y,
                z: adminCamera.position.z,
                direction: adminCamera.rotation.y
            }
            socket.emit('updateadminCamPos', data)
            
        
    }
    if (eBone)
        eBoneMesh.position.set(eBone.position.x, eBone.position.y,eBone.position.z);

if (mbt>0) mbt++;
if (mbt>10) {mbt = 0; mButtonPressed = false;}
if (keyState['ArrowUp']){ hangStatus=1}
if (keyState['ArrowDown']){ hangStatus=-1}
if (keyState['ArrowLeft']){ b-=1}
if (keyState['ArrowRight']){ b+=1;}

if (selectedCube){


if ((selectedCube.position.x<=-19) && (selectedCube.position.z>77)){ windy = true;}
if (selectedCube.position.x>-19) windy = false;
if ((selectedCube.position.x<=-30) && (selectedCube.position.z<=77)) windy = true;
if ((selectedCube.position.z>60)&&(selectedCube.position.z<=77)&&(selectedCube.position.x>-30)) windy = false;

if (windy){
    selectedCube.position.z-= 0.03 - windResist/100;
}
}
a+=5;
if (a>355) a = 0

if (fogS>0) fogS++;
if (fogS>10) fogS = 0;

if (fogState== 0){scene.fog.near = 0; scene.fog.far = 150;}
if (fogState== 1){scene.fog.near = 1; scene.fog.far = 100;}
if (fogState== 2){scene.fog.near = 5; scene.fog.far = 50;}
if (fogState== 3){scene.fog.near = 5; scene.fog.far = 25;}
if (freeMove[whichPlayer-1]==1){dColor.disabled = true;}
else dColor.disabled = false;

if (holdClick>0) holdClick+=1;

    ct2++;
    if (ct2>=200) 
    ct2 = 0;
counter++;
if (counter==10){
    counter = 0;
//set up thirdPersonCamera//
if (!checkThirdCamera){

if (whichPlayer==1){
    selectedCube = char1;
switchToThirdPersonCamera(char1);
checkThirdCamera = true;}

if (whichPlayer==2){
selectedCube=char2;
switchToThirdPersonCamera(char2);
checkThirdCamera = true;}
if (whichPlayer==3){
selectedCube = char3;
switchToThirdPersonCamera(char3);
checkThirdCamera = true;}
if (whichPlayer==4){
    selectedCube=char4
switchToThirdPersonCamera(char4);
checkThirdCamera = true;}
}

}

//Movement and ground collision
if (selectedCube) {
    selectedCube.position.x=parseFloat(selectedCube.position.x);
    selectedCube.position.y=parseFloat(selectedCube.position.y);
    selectedCube.position.z=parseFloat(selectedCube.position.z);



    
    // Initialize raycaster and direction vectors
    let moveSpeed = .1;
    const raycaster = new THREE.Raycaster();
    const elevatorRaycaster = new THREE.Raycaster();
    const directions = {
        forward: new THREE.Vector3(0, 0, -1),
        backward: new THREE.Vector3(0, 0, 1),
        left: new THREE.Vector3(-1, 0, 0),
        right: new THREE.Vector3(1, 0, 0),
        above: new THREE.Vector3(0,1,0),
        below: new THREE.Vector3(0,-1,0)
    };

    // Apply cube's quaternion to direction vectors
    for (let key in directions) {
        directions[key].applyQuaternion(selectedCube.quaternion);
    }
    const checkElevatorCollision = (direction) =>{
        let elevatorRayOrigin = eBone.position.clone();
        let ans = 0;

 
      if (direction == directions.above)
         elevatorRayOrigin.y+=1;
       if (direction == directions.below)
        elevatorRayOrigin.y-=0.5;
      if (direction == directions.backward)
        elevatorRayOrigin.z+=2;
     if (direction == directions.forward)
        elevatorRayOrigin.z-=2;
     if (direction == directions.left)
       elevatorRayOrigin.x-=2;
    if (direction == directions.right)
        elevatorRayOrigin.x+=2;

        elevatorRaycaster.set(elevatorRayOrigin, direction);

        const intersects = elevatorRaycaster.intersectObject(mesh);
        
        if (intersects.length>0){
            
        }
        
        if (intersects.length > 0 && intersects[0].distance > 1) {
            return true;
        }
        if (intersects.length == 0 && direction==directions.above) {
            return true;
        }
    
        return false;
    };
    // Function to check for collisions
    const checkCollision = (direction) => {
        const rayOrigin = selectedCube.position.clone()
        rayOrigin.y += 1; // Start the ray slightly above the character to detect slants
        
        raycaster.set(rayOrigin, direction);
    
        const intersects = raycaster.intersectObject(mesh);
 
        if (intersects.length > 0 && intersects[0].distance < 1) {
            return true;
        }
    
        return false;
    };
    
    const getTerrainHeightAhead = (direction) => {
        const rayOrigin = selectedCube.position.clone().addScaledVector(direction, 0.1);
        rayOrigin.y += 10; // Start the ray significantly above the character
    
        raycaster.set(rayOrigin, new THREE.Vector3(0, -1, 0)); // Cast ray downward
    
        const intersects = raycaster.intersectObject(terrainMesh);
        if (intersects.length > 0) {
            return intersects[0].point.y;
        }
    
        return selectedCube.position.y;
    };

    if ((freeMove[whichPlayer-1]==0)&&(ch3animations!='ko'))
{
    // Handle forward movement   
    if ((keyState[forKey]) && !checkCollision(directions.forward)&&(!onLad)&&(!onHang)&&(ch3animations!='elevator')) {
        selectedCube.position.addScaledVector(directions.forward, moveSpeed);

        if ((ch3animations!='jump')&&(ch3animations!='flight'))
        ch3animations = 'run fwd';
    }

    if ((keyState[forKey])&&(onLad)&&(selectedCube.position.y+.1<6)&&(!onHang)&&(ch3animations!='elevator')){
        const quickDist = calculateDistance3D(selectedCube.position.x, selectedCube.position.y, selectedCube.position.z, ceilingBeamBox.position.x, ceilingBeamBox.position.y, ceilingBeamBox.position.z);
        if ((clearToClimb)||((!clearToClimb)&&(quickDist>3)))
        selectedCube.position.y+=0.05;
    }
    if (ch3animations=='elevator'){
        selectedCube.position.y = groundFloorY;
        if (elevatorFree)
        {

    


    if ((keyState[forKey])&&(eBone.position.y<-7.1)&&(eAction!="up")){
        //eBone.position.z-=.1;
        const data = "up"
        socket.emit('elevatorMov', data);

    }
    if ((keyState[backKey])&&(eBone.position.y>-37)&&(eAction!='down')){
        //eBone.position.z+=.1;
        const data = "down"
        socket.emit('elevatorMov', data);

    }}

}
    if ((keyState[backKey])&&(onLad)&&(!onHang)&&(ch3animations!='elevator')){
        selectedCube.position.y-=0.05;
    }

    if (stopFlyTimer>0) stopFlyTimer++;
    if (stopFlyTimer>20) {stopFlyTimer = 0; stopFly = 0; stopFlyT = 0;}
    if (stopFlyT>0) stopFlyT++;
    if (stopFlyT>5) stopFlyT = 0;
    if ((ch3animations!='ko')&&(ch3animations!='flight')) {flyBar+=0.1;}
    if ((flyOverHeat)&&(flyBar>98)){ flyOverHeat = false;}
    if (flyBar>100) flyBar = 100;
    if (flyBar<0) flyBar = 0;
    updateGaugeBar(flyBar);
    if (ch3animations=='flight'){ 
        flyBar-=0.5;


        if (flyBar<=0.5){
            flyOverHeat = true;
            ch3animations ='jump';
        }
    }



    if (!canfly) {dGauge.style.display = 'none'; dContain.style.display = 'none'}
    else {dGauge.style.display = 'block'; dContain.style.display ='block'}

    //handle flight downward movement
    if (keyState[downKey]&&!checkCollision(directions.below)&&(ch3animations =='flight')){
        selectedCube.position.addScaledVector(directions.below, moveSpeed);
    }
    if (((mButtonPressed)||(keyState['Space']))&&!checkCollision(directions.above)&&(ch3animations =='flight')){
        selectedCube.position.addScaledVector(directions.above, moveSpeed);
    }
    // Handle backward movement
    if (keyState[backKey] && !checkCollision(directions.backward)&&(!onLad)&&(!onHang)&&(ch3animations!='elevator')) {
        selectedCube.position.addScaledVector(directions.backward, moveSpeed);

        if ((ch3animations!='jump')&&(ch3animations!='flight'))
        ch3animations = 'run bck';
    }

    // Handle strafing left
    if (keyState[strafeLKey] && !checkCollision(directions.left)&&(!onLad)&&(!onHang)&&(ch3animations!='elevator')) {
        selectedCube.position.addScaledVector(directions.left, moveSpeed);

        if ((ch3animations!='jump')&&(ch3animations!='flight'))
        ch3animations = 'strafe left';
    }

    // Handle strafing right
    if (keyState[strafeRKey] && !checkCollision(directions.right)&&(!onLad)&&(!onHang)&&(ch3animations!='elevator')) {
        selectedCube.position.addScaledVector(directions.right, moveSpeed);

        if ((ch3animations!='jump')&&(ch3animations!='flight'))
        ch3animations = 'strafe right';
    }
    

    if (((mButtonPressed)||(keyState['Space'])) && (grounded==1)&&(!firstLadderClimbDown)&&(!onHang)&&(hangonDist>1.5)&&(!elevatorFreeze.meet(selectedCube,grounded))&&(ch3animations!='elevator')){
    grounded = 0;
    yspeed+=.6;
    jumpTimer++;
    ch3animations='jump'
    }

    if (((mButtonPressed)||(keyState['Space']))&&(grounded==0)&&(ch3animations=='jump')&&(canfly)&&(jumpTimer==0)&&(ch3animations!='elevator')&&(!flyOverHeat)){
        ch3animations = 'flight';
        jumpTimer++;
    }

    if (((mButtonPressed)||(keyState['Space']))&&(grounded==1)&&(elevatorT==0)&&(elevatorFreeze.meet(selectedCube, grounded))&&(ch3animations!='elevator')){

        if (((whichPlayer==1)&&(actions[1]!='elevator')&&(actions[2]!='elevator')&&(actions[3]!='elevator'))||((whichPlayer==2)&&(actions[0]!='elevator')&&(actions[2]!='elevator')&&(actions[3]!='elevator'))||((whichPlayer==3)&&(actions[0]!='elevator')&&(actions[2]!='elevator')&&(actions[1]!='elevator'))||((whichPlayer==4)&&(actions[1]!='elevator')&&(actions[2]!='elevator')&&(actions[0]!='elevator'))){
        ch3animations = 'elevator';
        ctrlElevator = true;
        selectedCube.position.set(-27.25,-7.223, 151.65,1);
        selectedCube.rotation.y = -6.279999999999999;
        yRot = -6.279999999999999;
        elevatorT++;
        if (whichPlayer==1)
            playAnimation(ch1TypeAction)
        if (whichPlayer==2)
            playAnimation(ch2TypeAction)
        if (whichPlayer==3)
            playAnimation(ch3TypeAction)
        if (whichPlayer==4)
            playAnimation(ch4TypeAction)
    }
    }  
     if (((mButtonPressed)||(keyState['Space']))&&(ch3animations=='elevator')&&(elevatorT2==2)){
        ch3animations = 'none';
        elevatorT++;
        ctrlElevator = false;
        elevatorT2 = 0;
     }
   


    if (dumpTimer>0) dumpTimer++;
    if (dumpTimer>10) dumpTimer = 0;
    if (ceilingBeamTimer>0) ceilingBeamTimer++;
    if (ceilingBeamTimer>10) ceilingBeamTimer = 0;



    if (((mButtonPressed)||(keyState['Space']))&&(hangT==0)&&(hangonDist<=1.5)&&(!onHang)&&(timer==0)){
        onHang = true;
        hangT = 1;
        selectedCube.position.x = -22.1
        selectedCube.position.y += 1.5
        selectedCube.position.z = 27.9;
        yRot = 1.65;
        selectedCube.rotation.y = 1.65
        ch3animations = 'hangon';
        if (whichPlayer==1)
            playAnimation(ch1StandToHangAction);
        if (whichPlayer==2)
            playAnimation(ch2StandToHangAction);
        if (whichPlayer==3)
            playAnimation(ch3StandToHangAction);
        if (whichPlayer==4)
            playAnimation(ch4StandToHangAction);

    }

    if (((mButtonPressed)||(keyState['Space']))&&(hangT==0)&&(onHang)){
        onHang = false;
        hangT = 1;
        yRot = 1.65;
        selectedCube.rotation.y = 1.65
        ch3animations = 'jump';
        grounded = 0;
        yspeed+=0.6
        if (whichPlayer==1)
            playAnimation(ch1RunJumpAction);
        if (whichPlayer==2)
            playAnimation(ch2RunJumpAction);
        if (whichPlayer==3)
            playAnimation(ch3RunJumpAction);
        if (whichPlayer==4)
            playAnimation(ch4RunJumpAction);
    }


if (hangT>0) hangT++;
if (hangT>10) hangT=0;


}



// selectedCube.position.y=selectedCube.position.y+a;
//have y-grav do it's work
if ((grounded==0)&&(!onLad)&&(!onHang)&&(ch3animations!='flight')&&(ch3animations!='elevator')) {
if (yspeed>8) yspeed=8;
if (yspeed<-0.5) yspeed =-.5;
yspeed-=yaccel;
selectedCube.position.y+=yspeed;
}
else
{yspeed = 0;}


 
    // Check if the new position is within the land mesh boundaries
    const offset = new THREE.Vector3(0, 5, 0);
    thirdPersonCamera.position.copy(selectedCube.position).add(offset);
    thirdPersonCamera.lookAt(selectedCube.position);

    const cubeYDRaycaster = new THREE.Raycaster();
    const cubeYURaycaster = new THREE.Raycaster();
    const downYDirection = new THREE.Vector3(0, -1, 0);
    const upYDirection = new THREE.Vector3(0, 1, 0);
    const origin = new THREE.Vector3(selectedCube.position.x, selectedCube.position.y, selectedCube.position.z);
    cubeYURaycaster.set(origin, upYDirection);

    cubeYDRaycaster.set(origin, downYDirection);
    let cubeYDIntersects, cubeYOOBIntersects;
    let cubeYUIntersects, jumpYDIntersects;

    if (mesh){
    cubeYDIntersects = cubeYDRaycaster.intersectObject(mesh);
    cubeYUIntersects = cubeYURaycaster.intersectObject(mesh);
    }

    if (bounds)
    cubeYOOBIntersects = cubeYDRaycaster.intersectObject(bounds)
    if (jumper){

        jumpYDIntersects = cubeYDRaycaster.intersectObject(jump);
    }

    
    if ((cubeYDIntersects!=null)&&(cubeYDIntersects.length > 0) && (grounded==1)) {
                
        if (cubeYDIntersects[0].distance<=0.4)
            selectedCube.position.y = cubeYDIntersects[0].point.y+0.1;

        if ((cubeYDIntersects[0].distance>0.5)){
            grounded = 0;
            }
    }


    if ((cubeYUIntersects!=null)&&(cubeYUIntersects.length > 0)&&(!onHang)) {

//console.log(cubeYUIntersects[0].distance);
        if ((cubeYUIntersects[0].distance<=2)&&(grounded==1)){
            selectedCube.position.y = cubeYUIntersects[0].point.y+0.1;
        }
    }
    if (yspeed<0) fallTimer++;
    if (yspeed==0) fallTimer = 0;
    if ((selectedCube.position.y<groundFloorY+yspeed)&&(!pitZone)){selectedCube.position.y = groundFloorY+0.1}
    if (selectedCube.position.x<-20) pitZone = true;
    else pitZone = false;
    if (((cubeYDIntersects!=null)&&(cubeYDIntersects.length>0)&& (grounded==0)&&(yspeed<0))){ //if falling//
        
        if ((cubeYDIntersects[0].distance<Math.abs(yspeed)))
        {


            grounded = 1;
            selectedCube.position.y = cubeYDIntersects[0].point.y+0.1;
            yspeed = 0;     
            if ((fallTimer>24)&&(!specialFall)){
                ch3animations = 'ko';
                if ((koOnce==0)&&(whichPlayer==1)){
                    playAnimation(ch1KOAction);
                    koOnce = 1;
                }
                if ((koOnce==0)&&(whichPlayer==2)){
                    playAnimation(ch2KOAction);
                    koOnce = 1;
                }
                if ((koOnce==0)&&(whichPlayer==3)){
                    playAnimation(ch3KOAction);
                    koOnce = 1;
                }
                if ((koOnce==0)&&(whichPlayer==4)){
                    playAnimation(ch4KOAction);
                    koOnce = 1;
                }
            }
            fallTimer = 0;
            if ((!keyState[forKey])&&(!keyState[strafeLKey])&&(!keyState[backKey])&&(!keyState[strafeRKey])&&(!onLad)&&(ch3animations=='jump')
                &&(ch3animations!='ko'))
                {
        
                ch3animations = 'none';
                if (whichPlayer==3){
                    char3.timeScale =1;
                    playAnimation(idleCh3StandAction);
                    }
                    if (whichPlayer==1){
                        char1.timeScale =1;
                        playAnimation(idleCh1StandAction);
                        }
                    if (whichPlayer==2){
                            char2.timeScale =1;
                            playAnimation(idleCh2StandAction);
                        }
                    if (whichPlayer==4){
                            char4.timeScale =1;
                
                            playAnimation(idleCh4StandAction);
                            }
                }
                if ((keyState[forKey])&&(!onLad)&&(grounded==1)&&(ch3animations!='ko')){
                ch3animations = 'run fwd';
                
                if (whichPlayer==3)
                playAnimation(ch3RunAction);
                if (whichPlayer==1)
                playAnimation(ch1RunAction);
                if (whichPlayer==2)
                playAnimation(ch2RunAction);
                if (whichPlayer==4)
                playAnimation(ch4RunAction);
                }
                if ((keyState[strafeLKey])&&(!onLad)&&(grounded==1)&&(ch3animations!='ko')){
                ch3animations = 'strafe left';
               
                }
                else if ((keyState[strafeRKey])&&(!onLad)&&(grounded==1)&&(ch3animations!='ko')){
                ch3animations = 'strafe right';
        
                }
                else if ((keyState[backKey])&&(!onLad)&&(grounded==1)&&(ch3animations!='ko')){
        
                ch3animations = 'run bck';
                if (whichPlayer==3)
                playAnimation(ch3WalkBackAction);
                if (whichPlayer==1)
                    playAnimation(ch1WalkBackAction);
                if (whichPlayer==2)
                    playAnimation(ch2WalkBackAction);
                if (whichPlayer==4)
                    playAnimation(ch4WalkBackAction);
                }
            
     if (specialFall) specialFall = false;


        }
        
    }


    if (jumpYDIntersects!=null&& jumpYDIntersects.length>0 && grounded==0 && yspeed<0 && jumpYDIntersects[0].distance<1){ //if falling towards jumper
    specialFall = true;
    fallTimer = 0;
    yspeed += 1.65;
    }
    if ((cubeYOOBIntersects.length>0)&&(grounded==0)&&(yspeed<0)&&(cubeYOOBIntersects[0].distance<0.5)){

    
    }


}

//updating cube movements to database



if (((whichPlayer>0)/*&&(ct2%10==5)*/)||((whichPlayer<1)/*&&(ct2%30==5)*/)){//player
//grabbing other players' data
if (selectedCube)
addCube(parseFloat(dX.value),parseFloat(dY.value),parseFloat(dZ.value),whichPlayer, selectedCube.rotation.y,tkn);
 
    socket.on('sendingOtherPlayerData',(data)=>{
        const players = data.players;
        npcs = data.npcs;
        
        updateNPCMovemement();
        let otherPlayer = 0;
        if ((whichPlayer!=5) && (whichPlayer>0))
            otherPlayer = whichPlayer-1;
        if (whichPlayer==5){

        otherPlayer = 5;
    }
        for(let index=0;index<4;index++){

            color[index] = parseInt(players[index].color);
            times[index] = players[index].time;
            if (index!=otherPlayer){
            names[index] = players[index].name;
            healths[index] = players[index].health;
            xs[index] = players[index].x;
            ys[index] = players[index].y;
            zs[index] = players[index].z;
            invis[index] = players[index].invis;
            actions[index] = players[index].action;

            isTurn[index] = players[index].isTurn;
            token[index] = players[index].tkn;
            direction[index] = players[index].direction;

}

}

    


selectedColor = dColor.value;



if ((whichPlayer!=1)&&(char1)){
char1.position.x = xs[0];
char1.position.y = ys[0];
char1.position.z = zs[0];

char1_kid.material = colorSelect[color[0]];
char1.rotation.y = direction[0];
}
if ((whichPlayer!=2)&&(char2)){
char2.position.x = xs[1];
char2.position.y = ys[1];
char2.position.z = zs[1];
char2_kid.material = colorSelect[color[1]];
char2.rotation.y = direction[1];

}
if ((whichPlayer!=3)&&(char3)){
char3.position.x = xs[2];
char3.position.y = ys[2];
char3.position.z = zs[2];
char3_kid.material = colorSelect[color[2]];
char3.rotation.y = direction[2];
}
if ((whichPlayer!=4)&&(char4)){
char4.position.x = xs[3];
char4.position.y = ys[3];
char4.position.z = zs[3];
char4_kid.material = colorSelect[color[3]];
char4.rotation.y = direction[3];
}
    });
    // if user is player or admin, update cube positions
    if ((wP.value>0)||(whichPlayer<1)){
        console.log('grabbing')
        socket.emit('grabOtherPlayersData');
        }
        
    }

if (ct2==200) ct2 = 0;

  //function ending bracket
}


function animate() {

    bldgRigFunctions();
    updateOtherAnimations();
    requestAnimationFrame((t) => {
        if (_previousRAF === null) {
          _previousRAF = t;
        }
        animate();
        //_Step(t - _previousRAF);
        _previousRAF = t;
      });
      //objectDistChk();
updateJoystick();

    const delta = clock.getDelta();
    uniforms.cameraPosition.value.copy(activeCamera.position);
    if (mixch3) mixch3.update(delta);
    if (mixch1) mixch1.update(delta);
    if (mixch2) mixch2.update(delta);
    if (mixch4) mixch4.update(delta);
    if (mixPl) mixPl.update(delta);
    if (mixVic) mixVic.update(delta);
    
    
update();
    if (whichPlayer!=5){
    checkTurn();
    
    updateMovement();
     if (isTracking) {
        // Handle raycasting and distance calculation here
          updateFirstPersonCamera();
    } else if (isTracking==false){
        updateThirdPersonCamera();
    }}

    updateTouches()
    updateLivic()
    updateLadderBoxes();
    updateCharacter();
    displayObjectInfo();
    if ((whichPlayer==5) || (whichPlayer<1))
    {
            if (whichPlayer==5){
            document.getElementById('controls').style.display = 'block';

            }
            
            
        activeCamera = adminCamera;
        adminCameraCtrls();
    }
    renderer.render(scene, activeCamera);
}


function updateTouches(){

   if ((selectedCube)&&(mobile))
        handleMovement(directionX, directionY);

    if (whichTouch>0) whichTouch++;

 if (howManyTouches==1) touchstatus = 'single';
     if (howManyTouches==2) touchstatus = 'double';
     if (howManyTouches==3) touchstatus = 'triple';

     if ((whichTouch>10)&&(touching)) {

        // const data = {kdx: knobDeltaX, kdy: knobDeltaY, tS: howManyTouches}
        // socket.emit('howmanytouches', data);
        
    whichTouch = 0;
        howManyTouches = 0;
    }


}

function adminCameraCtrls(){

    if (whichPlayer==5){

        const adminDirections = {
            forward: new THREE.Vector3(0, 0, -1),
            backward: new THREE.Vector3(0, 0, 1),
            left: new THREE.Vector3(-1, 0, 0),
            right: new THREE.Vector3(1, 0, 0),
            above: new THREE.Vector3(0,1,0),
            below: new THREE.Vector3(0,-1,0)

        };
    
        // Apply cube's quaternion to direction vectors
        for (let key in adminDirections) {
            adminDirections[key].applyQuaternion(adminCamera.quaternion);
        }
        if (keyState['KeyI'])
            adminCamera.position.addScaledVector(adminDirections.forward, 0.5);
        if (keyState['KeyK'])
            adminCamera.position.addScaledVector(adminDirections.backward, 0.5);
        if ((keyState['KeyJ'])&&(adminTarget!='vic')&&(adminTarget!='livic'))
            adminCamera.position.addScaledVector(adminDirections.left, 0.5);
        if ((keyState['KeyL'])&&(adminTarget!='vic')&&(adminTarget!='livic'))
            adminCamera.position.addScaledVector(adminDirections.right, 0.5);
        if (keyState['Space'])
            adminCamera.position.addScaledVector(adminDirections.above, 0.5);
        if (keyState['Comma'])
            adminCamera.position.addScaledVector(adminDirections.below, 0.5);

    }
    
}


function updateLivic(){
    if (livic!=null){
    if ((keyState[strafeLKey])&&(whichPlayer==5)){
        if (adminTarget == 'livic')
        {
           
            livic.rotation.y+=0.1;
        }
    }

    if ((keyState[strafeRKey])&&(whichPlayer==5)){
        if (adminTarget== 'livic')
        {
            livic.rotation.y-=0.1;
        }
    }}
    if ((keyState[strafeLKey])&&(whichPlayer==5)){
        if (adminTarget == 'vic')
        {
           
            vic.rotation.y+=0.1;
        }
    }

    if ((keyState[strafeRKey])&&(whichPlayer==5)){
        if (adminTarget== 'vic')
        {
            vic.rotation.y-=0.1;
        }
    }
}
function updateMovement(){
 if (selectedCube!=null){
    dX.value = selectedCube.position.x;
    dY.value = selectedCube.position.y;
    dZ.value = selectedCube.position.z;
 }


}
function findObjectByName(name) {
    let foundObject;
    scene.traverse((child) => {
        if (child.name === name) {
            foundObject = child;
        }
    });
    return foundObject;
}

function updateLadderBoxes(){



if (selectedCube){

 hangonDist = calculateDistance3D(selectedCube.position.x, selectedCube.position.y, selectedCube.position.z, -22.31, 17.98, 27.59);

if ((hangonDist<=1.5)||(elevatorFreeze.meet(selectedCube, grounded))) interact = true;
if ((hangonDist>1.5)&&(!elevatorFreeze.meet(selectedCube, grounded))) interact = false;

toggleInteractPopup(interact);

}}

function moveTowardsPoint(object, x, y, z, speed) {
    const target = new THREE.Vector3(x, y, z);
    const direction = new THREE.Vector3().subVectors(target, object.position).normalize();
    const moveVector = direction.clone().multiplyScalar(speed);
       object.position.add(moveVector);
    // Use raycaster to check for obstacles
    const raycaster = new THREE.Raycaster(object.position, direction);
    
    // const intersects = raycaster.intersectObjects(obstacles);
    // if (intersects.length === 0 || intersects[0].distance > moveVector.length()) {
    //     // No obstacles in the way, or the closest obstacle is farther than the move distance
    // }
}


function addCube(x, y, z, whichPlayer, dir, tkn) {
    
    let climbFrame = 0;

    selectedColor = document.getElementById('color-select').value;
    // Emit event to update player data on server
    if (saveGame==true){


        switch(whichPlayer){
            case 1:
                climbFrame = ch1ClimbAction.time;
                saveTime = getPlayingActionsTimes(mixch1, climbFrame); 
            break;
            case 2:
                climbFrame = ch2ClimbAction.time;
                saveTime = getPlayingActionsTimes(mixch2, climbFrame); 
                break;
            case 3:
                climbFrame = ch3ClimbAction.time;
                saveTime = getPlayingActionsTimes(mixch3, climbFrame); 
                break;
            case 4:
                climbFrame = ch4ClimbAction.time;
                saveTime = getPlayingActionsTimes(mixch4, climbFrame); 
                break;
        }
        let truTime = 0;

        truTime = saveTime[0].time;
    
        const data =  {
            whichPlayer: whichPlayer,
            x: x,
            y: y,
            z: z,
            tkn: tkn,
            isTurn: isTurn[wP.value-1],
            color: parseInt(selectedColor),
            direction: dir,
            
            freeMove: freeMove[whichPlayer-1],
            freezeSpot: freezeSpot,
            token: tkn,
            canfly: canfly,
            flybar: parseFloat(flyBar),
            windResist: windResist,
            hang: hangFreeze,
            action: ch3animations, 
            time: parseFloat(truTime.toFixed(2)),
            saveGame: saveGame,
            invis: invis[whichPlayer-1]
        }
        
    socket.emit('updatePlayerData',(data));
    }

    switch (wP.value) {
        case 1:
            document.getElementById('character 1').material = colorSelect[selectedColor];
            char1.position.set(x, y - .1, z);
            if (checkThirdCamera == false)
                switchToThirdPersonCamera(char1);
            checkThirdCamera  = true;
            break;
        case 2:
            document.getElementById('character 2').material = colorSelect[selectedColor];;
            char2.position.set(x, y - .1, z);
            if (checkThirdCamera == false)
                switchToThirdPersonCamera(char2);
            checkThirdCamera= true;
            break;
        case 3:
            document.getElementById('character 3').material = colorSelect[selectedColor];
           char3.name = name;
           char3.position.set(x, y, z);
            if (checkThirdCamera == false)
                switchToThirdPersonCamera(char3);
            checkThirdCamera= true;
            break;
        case 4:
            document.getElementById('character 4').material = colorSelect[selectedColor];
            char4.position.set(x, y - .1, z);
            if (checkThirdCamera== false)
                switchToThirdPersonCamera(char4);
            checkThirdCamera = true;
            break;
    }

    document.getElementById('x-coord').disabled = true;
    document.getElementById('y-coord').disabled = true;
    document.getElementById('z-coord').disabled = true;
    document.getElementById('cube-name').disabled = true;
}
function updateCharacter(){

    if (jumpTimer>0) jumpTimer++;
    if (jumpTimer>10) jumpTimer = 0;
    if (elevatorT>0) elevatorT++;
    if (elevatorT>20) {elevatorT = 0; elevatorT2 = 0;}

    if ((timer>0.78)&&(ch3animations=='hangon')){
        onHang = false;
        hangT = 0;
        yRot = 1.65;
        selectedCube.rotation.y = 1.65
        ch3animations = 'jump';
        grounded = 0;
        if (whichPlayer==1)
            playAnimation(ch1RunJumpAction);
        if (whichPlayer==2)
            playAnimation(ch2RunJumpAction);
        if (whichPlayer==3)
            playAnimation(ch3RunJumpAction);
        if (whichPlayer==4)
            playAnimation(ch4RunJumpAction);


    }

    actions[whichPlayer-1] = ch3animations;
    //update colors



    if (loadOnce==1){
        if (selectedCube!=null){
            selectedCube.position.set(loadX, loadY+2, loadZ);
        }
        loadOnce=2;
    }
    if (ch3animations=='climb'){


        if ((whichPlayer==1)&&(onLadLock==0)){
            playAnimation(ch1ClimbAction);

            onLadLock = 1;
        }
        if ((whichPlayer==2)&&(onLadLock==0)){
            playAnimation(ch2ClimbAction);

            onLadLock = 1;
        }
        if ((whichPlayer==3)&&(onLadLock==0)){
            playAnimation(ch3ClimbAction);

            onLadLock = 1;
        }
        if ((whichPlayer==4)&&(onLadLock==0)){
            playAnimation(ch4ClimbAction);

            onLadLock = 1;
        }
 
        if ((keyState[forKey])||(keyState[backKey])){
            if (whichPlayer==1)
            ch1ClimbAction.timeScale = 1;
        }
        if ((!keyState[forKey])&&(!keyState[backKey])){
            if (whichPlayer==1)
                ch1ClimbAction.timeScale = 0.0;
        }
        if ((keyState[forKey])||(keyState[backKey])){
            if (whichPlayer==2)
            ch2ClimbAction.timeScale = 1;
        }
        if ((!keyState[forKey])&&(!keyState[backKey])){
            if (whichPlayer==2)
                ch2ClimbAction.timeScale = 0.0;
        }
        if ((keyState[forKey])||(keyState[backKey])){
            if (whichPlayer==3)
            ch3ClimbAction.timeScale = 1;
        }
        if ((!keyState[forKey])&&(!keyState[backKey])){
            if (whichPlayer==3)
                ch3ClimbAction.timeScale = 0.0;
        }
        if ((keyState[forKey])||(keyState[backKey])){
            if (whichPlayer==4)
            ch4ClimbAction.timeScale = 1;
        }
        if ((!keyState[forKey])&&(!keyState[backKey])){
            if (whichPlayer==4)
                ch4ClimbAction.timeScale = 0.0;
        }




    }

    if ((wP.value==1)&&(char1)){


        selectedCube=char1;

        direction[0] = char1.rotation.y;
        char1_kid.material = colorSelect[selectedColor];   
    }
    if ((wP.value==2)&&(char2)){
        selectedCube=char2;
        direction[1] = char2.rotation.y;
        char2_kid.material = colorSelect[selectedColor];


    }
    if ((wP.value==3)&&(char3)){
        selectedCube=char3;
        char3_kid.material = colorSelect[selectedColor];
        direction[2] = char3.rotation.y;

        }
    if ((wP.value==4)&&(char4)){
        selectedCube=char4;
        char4_kid.material = colorSelect[selectedColor];
        direction[3] = char3.rotation.y;


    }

    //Animations
    if (ch3animations=='ko'){
        if (whichPlayer==1){
        if ((ch1KOAction)&&(!ch1KOAction.isRunning()&&(koOnce==0))){
            playAnimation(ch1KOAction);
            koOnce = 1;
        }


        if (ch1GetUpAction.time>2.75)
        {
            ch3animations = 'none';
            ch1GetUpAction.stop();
            koOnce = 0;


            // Perform any additional actions here
        }}
        if (whichPlayer==2){
        if (!ch2KOAction.isRunning()&&(koOnce==0)){
            playAnimation(ch2KOAction);
            koOnce = 1;
        }


        if (ch2GetUpAction.time>2.754)
        {
            ch3animations = 'none';
            ch2GetUpAction.stop();
            koOnce = 0;


            // Perform any additional actions here
        }}
        if (whichPlayer==3){
            if (!ch3KOAction.isRunning()&&(koOnce==0)){
            playAnimation(ch3KOAction);
            koOnce = 1;
        }


        if (ch3GetUpAction.time>2.754)
        {
            ch3animations = 'none';
            ch3GetUpAction.stop();
            koOnce = 0;


            // Perform any additional actions here
        }}
        if (whichPlayer==4){
        if (!ch4KOAction.isRunning()&&(koOnce==0)){
            playAnimation(ch4KOAction);
            koOnce = 1;
        }


        if (ch4GetUpAction.time>2.754)
        {
            ch3animations = 'none';
            ch4GetUpAction.stop();
            koOnce = 0;


            // Perform any additional actions here
        }}

    }

    if (ch3animations=='hangon'){

        selectedCube.position.set(hang.position.x+.4*Math.sin(hang.rotation.y+170*Math.PI/180), hang.position.y-2.29, hang.position.z+0.4*Math.cos(hang.rotation.y+170*Math.PI/180));
        selectedCube.rotation.y =  hang.rotation.y+170*Math.PI/180;

        grounded = 0;
    }

    if (ch3animations=='flight'){
        yspeed = 0;
        if ((whichPlayer==1)&&(!ch1FlyAction.isRunning())){
            playAnimation(ch1FlyAction);
        }
        if ((whichPlayer==2)&&(!ch2FlyAction.isRunning())){
            playAnimation(ch2FlyAction);
        }
        if ((whichPlayer==3)&&(!ch3FlyAction.isRunning())){
            playAnimation(ch3FlyAction);
        }
        if ((whichPlayer==4)&&(!ch4FlyAction.isRunning())){
            playAnimation(ch4FlyAction);
        }
    }

    if (ch3animations=='elevator'){
        
        if ((whichPlayer==1)&&(!ch1TypeAction.isRunning())){
            playAnimation(ch1TypeAction);
        }
        if ((whichPlayer==2)&&(!ch2TypeAction.isRunning())){
            playAnimation(ch2TypeAction);
        }
        if ((whichPlayer==3)&&(!ch3TypeAction.isRunning())){
            playAnimation(ch3TypeAction);
        }
        if ((whichPlayer==4)&&(!ch4TypeAction.isRunning())){
            playAnimation(ch4TypeAction);
        }
    }
    if (ch3animations=='run fwd'){
        
        if ((whichPlayer==1)&&(!ch1RunAction.isRunning())){
            playAnimation(ch1RunAction);
        }
        if ((whichPlayer==2)&&(!ch2RunAction.isRunning())){
            playAnimation(ch2RunAction);
        }
        if ((whichPlayer==3)&&(!ch3RunAction.isRunning())){
            playAnimation(ch3RunAction);
        }
        if ((whichPlayer==4)&&(!ch4RunAction.isRunning())){
            playAnimation(ch4RunAction);
        }
    }
    if (ch3animations=='run back'){
        
        if ((whichPlayer==1)&&(!ch1WalkBackAction.isRunning())){
            playAnimation(ch1WalkBackAction);
        }
        if ((whichPlayer==2)&&(!ch2WalkBackAction.isRunning())){
            playAnimation(ch2WalkBackAction);
        }
        if ((whichPlayer==3)&&(!ch3WalkBackAction.isRunning())){
            playAnimation(ch3WalkBackAction);
        }
        if ((whichPlayer==4)&&(!ch4WalkBackAction.isRunning())){
            playAnimation(ch4WalkBackAction);
        }
    }
    if (ch3animations=='jump'){
        
        if ((whichPlayer==1)&&(!ch1RunJumpAction.isRunning())){
            playAnimation(ch1RunJumpAction);
        }
        if ((whichPlayer==2)&&(!ch2RunJumpAction.isRunning())){
            playAnimation(ch2RunJumpAction);
        }
        if ((whichPlayer==3)&&(!ch3RunJumpAction.isRunning())){
            playAnimation(ch1RunJumpAction);
        }
        if ((whichPlayer==4)&&(!ch4RunJumpAction.isRunning())){
            playAnimation(ch4RunJumpAction);
        }
    }
    if (ch3animations=='strafe left'){
        
        if ((whichPlayer==1)&&(!ch1StrafeRAction.isRunning())){
            playAnimation(ch1StrafeRAction);
        }
        if ((whichPlayer==2)&&(!ch2StrafeRAction.isRunning())){
            playAnimation(ch2StrafeRAction);
        }
        if ((whichPlayer==3)&&(!ch3StrafeRAction.isRunning())){
            playAnimation(ch3StrafeRAction);
        }
        if ((whichPlayer==4)&&(!ch4StrafeRAction.isRunning())){
            playAnimation(ch4StrafeRAction);
        }
    }
    if (ch3animations=='strafe right'){
        
        if ((whichPlayer==1)&&(!ch1StrafeLAction.isRunning())){
            playAnimation(ch1StrafeLAction);
        }
        if ((whichPlayer==2)&&(!ch2StrafeLAction.isRunning())){
            playAnimation(ch2StrafeLAction);
        }
        if ((whichPlayer==3)&&(!ch3StrafeLAction.isRunning())){
            playAnimation(ch3StrafeLAction);
        }
        if ((whichPlayer==4)&&(!ch4StrafeLAction.isRunning())){
            playAnimation(ch4StrafeLAction);
        }
    }
    if (ch3animations=='none'){
        if ((whichPlayer==1)&&(!idleCh1StandAction.isRunning())){
            playAnimation(idleCh1StandAction);
        }
        if ((whichPlayer==2)&&(!idleCh2StandAction.isRunning())){
            playAnimation(idleCh2StandAction);
        }
        if ((whichPlayer==3)&&(!idleCh3StandAction.isRunning())){
            playAnimation(idleCh3StandAction);
        }
        if ((whichPlayer==4)&&(!idleCh4StandAction.isRunning())){
            playAnimation(idleCh4StandAction);
        }  
    }
    
}
// Example function to handle server response
function handleServerResponse(data) {
    if (data.error)
    console.log('Server response:', data);
    else{
        
        if (data==5){ 
            document.getElementById('whichPlayer').value=5; 
        whichPlayer = 5; 

            document.getElementById('color-select').style.display='none';
 
        }
        else if (data!=5)
        {

           document.getElementById('clear').style.display = 'none';
            document.getElementById('jump').style.display = 'none';
            document.getElementById('P1').style.display='none';
            document.getElementById('P2').style.display = 'none';
            document.getElementById('P3').style.display = 'none';
            document.getElementById('P4').style.display = 'none';
        }
    }
    
    // Handle the coordinates or error message from the server
}
function toggleTurnPopup(show) {
    const popup = document.getElementById('popup');

    if (show) {

        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
}

function bldgRigFunctions(){

if (fanBone)
fanBone.rotation.y+=5 *Math.PI/180;
if (hangStatus==1){
if (timer<22/24)
timer+=0.00025;}
if (hangStatus==-1){

if (timer>0.005)
timer-=0.00025;
}

if (timer>.9) {timer = 0; hangStatus = 0;}
if (hang){
if (hang.rotation.y>359*Math.PI/180) hang.rotation.y = 0;
if (hang.rotation.y<0) hang.rotation.y = 359*Math.PI/180;
}
if (coordPath!=null){
let pt2 = coordPath.getPointAt(timer);

if (hang){
    hang.position.set(pt2.x,pt2.y,pt2.z);
    const tangent = coordPath.getTangentAt(timer).normalize();
    hang.lookAt(pt2.clone().add(tangent));
    }
}

//handling freezes (skill checks)
//first freezing point
if ((whichPlayer==1)&&(firstFreeze.meet(char1, grounded))&&(freezeSpot[1] == 0))
{
    console.log('freeze for Acrobatics check');
    freeMove[0] = 1;
}
if ((whichPlayer==2)&&(firstFreeze.meet(char2, grounded))&&(freezeSpot[1] == 0))
    {
        console.log('freeze for Acrobatics check');
        freeMove[1] = 1;
    }
    if ((whichPlayer==3)&&(firstFreeze.meet(char3, grounded))&&(freezeSpot[1] == 0))
        {
            console.log('freeze for Acrobatics check');
            freeMove[2] = 1;
        }
        if ((whichPlayer==4)&&(firstFreeze.meet(char4, grounded))&&(freezeSpot[1] == 0))
            {
                console.log('freeze for Acrobatics check');
                freeMove[3] = 1;
            }

//2nd freeze point
if ((whichPlayer==1)&&(narrowPathFreeze.meet(char1, grounded))&&(freezeSpot[2] == 0))
    {
        console.log('freeze for Acrobatics check');
        freeMove[0] = 1;
    }
    if ((whichPlayer==2)&&(narrowPathFreeze.meet(char2, grounded))&&(freezeSpot[2] == 0))
        {
            console.log('freeze for Acrobatics check');
            freeMove[1] = 1;
        }
        if ((whichPlayer==3)&&(narrowPathFreeze.meet(char3, grounded))&&(freezeSpot[2] == 0))
            {
                console.log('freeze for Acrobatics check');
                freeMove[2] = 1;
            }
            if ((whichPlayer==4)&&(narrowPathFreeze.meet(char4, grounded))&&(freezeSpot[2] == 0))
                {
                    console.log('freeze for Acrobatics check');
                    freeMove[3] = 1;
                }
    //3rd freeze point
    if ((whichPlayer==1)&&(elevatorFreeze.meet(char1, grounded))&&(freezeSpot[3] == 0))
        {
            console.log('freeze for History check');
            freeMove[0] = 1;
        }
        if ((whichPlayer==2)&&(elevatorFreeze.meet(char2, grounded))&&(freezeSpot[3] == 0))
            {
                console.log('freeze for History check');
                freeMove[1] = 1;
            }
            if ((whichPlayer==3)&&(elevatorFreeze.meet(char3, grounded))&&(freezeSpot[3] == 0))
                {
                    console.log('freeze for History check');
                    freeMove[2] = 1;
                }
                if ((whichPlayer==4)&&(elevatorFreeze.meet(char4, grounded))&&(freezeSpot[3] == 0))
                    {
                        console.log('freeze for History check');
                        freeMove[3] = 1;
                    }

//elevator freedom of movement

if ((Math.abs(elevator_yspeed>0))){
    if (eBone){
    eBone.position.y+=elevator_yspeed;
    console.log('move');
}
    if (selectedCube){
        if ((calculateDistance3D(selectedCube.position.x, selectedCube.position.y, selectedCube.position.z, eBone.position.x, eBone.position.y, eBone.position.z)<2)&&(grounded==1))
        {
            selectedCube.position.y+= elevator_yspeed;
        }
    }
}





}


function toggleInteractPopup(interact) {
    const intpopup = document.getElementById('int-popup');
    
    if ((interact)&&(!mobile)) {

        intpopup.style.display = 'block';
    } else if ((!interact)&&(!mobile)){
        intpopup.style.display = 'none';
    }

    if ((interact)&&(mobile)) {

        mButton = 2;
        dInt.src = '/map/button_Interact.png';
    } else if ((!interact)&&(mobile)){
        dInt.src = '/map/button_jump.png';
        mButton = 1;
    }


}

// Example usage: Update this logic based on your game's actual turn handling
function checkTurn() {

    if (isTurn[whichPlayer-1]) {
        toggleTurnPopup(true);
    } else {
        toggleTurnPopup(false);
    }
}

function playAnimation(action) {


    let currentMixer;
    let playerIndex = whichPlayer -1;
    if (whichPlayer == 1) currentMixer = mixch1;
    if (whichPlayer == 2) currentMixer = mixch2;
    if (whichPlayer == 3) currentMixer = mixch3;
    if (whichPlayer == 4) currentMixer = mixch4;


    if (currentMixer) {
        const previousAction = activeActions[playerIndex];

        if (previousAction) {
            // Blend from the previous action to the new action
            previousAction.crossFadeTo(action.reset(), 0.01, true).play();
        } else {
            // If no previous action, just fade in the new action
            action.reset().play();
        }

        // Update the active action for this player
        activeActions[playerIndex] = action;
    }

}



function saveNPCData(){


    const NPCData = {

    "10":{
        x: parseFloat(vic.position.x),
        y: parseFloat(vic.position.y),
        z: parseFloat(vic.position.z),
        action: 'idle',
        direction:  parseFloat(vic.rotation.y),
        saveGame: vic.saveGame,
        health:  120,
        invis: false,
        isTurn:  vic.isTurn,
        freeMove:  vic.freeMove 
    }
}

    socket.emit('updateNPCData', NPCData);
}
function handleKeyPress(event) {
    
  


    switch (event.code) {
        case forKey: // Forward
            if ((freeMove[whichPlayer-1]==0)&&(ch3animations !== 'run fwd')&&(ch3animations!='jump')&&(!onLad)&&(ch3animations!='ko')&&(ch3animations!='hangon')&&(ch3animations!='flight')&&(ch3animations!='elevator')) {
                ch3animations = 'run fwd';
                if (whichPlayer==3)
                playAnimation(ch3RunAction);
                if (whichPlayer==1)
                    playAnimation(ch1RunAction);
                if (whichPlayer==2)
                    playAnimation(ch2RunAction);
                if (whichPlayer==4)
                    playAnimation(ch4RunAction);
            }
            break;
        case backKey: // Backward
            if ((freeMove[whichPlayer-1]==0)&&(ch3animations!='elevator')&&(ch3animations !== 'run bck')&&(ch3animations!='jump')&&(!onLad)&&(ch3animations!='ko')&&(ch3animations!='hangon')&&(ch3animations!='flight')) {
                ch3animations = 'run bck';
                if (whichPlayer==3)
                playAnimation(ch3WalkBackAction);
                if (whichPlayer==1)
                    playAnimation(ch1WalkBackAction);
                if (whichPlayer==2)
                    playAnimation(ch2WalkBackAction);
                if (whichPlayer==4)
                    playAnimation(ch4WalkBackAction);
            }
            break;
        case strafeLKey: // Strafe left
            if ((freeMove[whichPlayer-1]==0)&&(ch3animations!='elevator')&&(ch3animations != 'strafe left')&&(ch3animations!='jump')&&(!onLad)&&(ch3animations!='ko')&&(ch3animations!='hangon')&&(ch3animations!='flight')) {
                ch3animations = 'strafe left';
                if (whichPlayer==3)
                playAnimation(ch3StrafeRAction);
                if (whichPlayer==1)
                    playAnimation(ch1StrafeRAction);
                if (whichPlayer==2)
                    playAnimation(ch2StrafeRAction);
                if (whichPlayer==4)
                    playAnimation(ch4StrafeRAction);
            }
            break;
        case strafeRKey: // Strafe right
            if ((freeMove[whichPlayer-1]==0)&&(ch3animations!='elevator')&&(ch3animations !== 'strafe right')&&(ch3animations!='jump')&&(!onLad)&&(ch3animations!='ko')&&(ch3animations!='hangon')&&(ch3animations!='flight')) {
                ch3animations = 'strafe right';
                if (whichPlayer==3)
                playAnimation(ch3StrafeLAction);
                if (whichPlayer==1)
                    playAnimation(ch1StrafeLAction);
                if (whichPlayer==2)
                    playAnimation(ch2StrafeLAction);
                if (whichPlayer==4)
                    playAnimation(ch4StrafeLAction);
            }
            break;
        case 'Space': // Jump

            if ((freeMove[whichPlayer-1]==0)&&(ch3animations!='elevator')&&(ch3animations!='flight')&&(ch3animations != 'jump')&&(!onLad)&&(!keyState[forKey])&&(!dumpRdy)&&(ch3animations!='ko')&&(hangonDist>1.5)&&(hangT==0)) {
                ch3animations = 'jump';

                if (whichPlayer==3)
                playAnimation(ch3JumpAction);
                if (whichPlayer==1)
                    playAnimation(ch1JumpAction);
                if (whichPlayer==2)
                    playAnimation(ch2JumpAction);
                if (whichPlayer==4)
                    playAnimation(ch4JumpAction);
            }
            else if ((freeMove[whichPlayer-1]==0)&&(ch3animations!='elevator')&&(ch3animations != 'jump')&&(!onLad)&&(keyState[forKey])&&(!dumpRdy)&&(ch3animations!='ko')&&(hangonDist>1.5)&&(hangT==0)&&(ch3animations!='flight')) {
                ch3animations = 'jump';

                if (whichPlayer==3)
                 playAnimation(ch3RunJumpAction);
                if (whichPlayer==1)
                    playAnimation(ch1RunJumpAction);
                 if (whichPlayer==2)
                    playAnimation(ch2RunJumpAction);
                 if (whichPlayer==4)
                     playAnimation(ch4RunJumpAction);
            }
            break;
        default:
            break;
    }
}

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent);
}

  function calculateDistance3D(x1, y1, z1, x2, y2, z2) {
    // Compute the differences in each dimension
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    // Calculate the Euclidean distance
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
return distance;
  }
  function calculate3DDistance(x1, y1, z1, x2, y2, z2) {
    // Compute the differences in each dimension
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    // Calculate the Euclidean distance
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)*2.5;
  
    document.getElementById('distance').innerHTML = parseFloat(distance).toFixed(2);
    document.getElementById('distance').value = parseFloat(distance).toFixed(2);
  }


  function switchToFirstPersonCamera() {
    if (selectedCube) {
        const offset = new THREE.Vector3(0, 1.5, 0.5); // Adjust this offset as needed
        const targetPosition = new THREE.Vector3();
        selectedCube.getWorldPosition(targetPosition);
        firstPersonCamera.position.copy(targetPosition).add(offset);
        firstPersonCamera.lookAt(targetPosition);
        activeCamera = firstPersonCamera;
    }
}

function updateFirstPersonCamera() {
    if ((isTracking) && (selectedCube)) {

        // Offset to place the camera in front of the cube
        const offset = new THREE.Vector3(0, 1, 0); // Adjust this offset as needed
        const targetPosition = new THREE.Vector3();
        selectedCube.getWorldPosition(targetPosition);

        // Calculate the position in front of the cube
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(targetPosition).add(offset);
        firstPersonCamera.position.copy(cameraPosition);
        raycaster.setFromCamera(mouse,firstPersonCamera);
        let objectsToIntersects = scene.children.filter(obj => obj!==cube);
        const intersects = raycaster.intersectObjects(objectsToIntersects, true);
    
        if (intersects.length > 0){
            

            clickedObject = intersects[0].object;
            intersectPoint = intersects[0].point;    
        }
    
        // Calculate look-at position based on selectedCube's rotation.y
        const lookAtPosition = new THREE.Vector3(
            Math.sin(yRot+180) * 5,
            Math.cos(selectedCube.rotation.z)*5,
            Math.cos(yRot+180) * 5
        ).add(targetPosition);

    
        firstPersonCamera.lookAt(lookAtPosition);
        yRot-=deltaX*0.015;
        selectedCube.rotation.z-=deltaY*0.015;
        // Set the camera to look at the target position
        //firstPersonCamera.lookAt(lookAtPosition);
        cube.position.set(intersectPoint.x,intersectPoint.y,intersectPoint.z);
        calculate3DDistance(firstPersonCamera.position.x,firstPersonCamera.position.y,firstPersonCamera.position.z, intersectPoint.x, intersectPoint.y, intersectPoint.z);
        //lineGeometry.setFromPoints([firstPersonCamera.position, intersectPoint]);
        // Set the active camera to first person camera
        activeCamera = firstPersonCamera;
    }
}

function checkAndFreezeAnimation(action, freezeFrame) {
    const duration = action.getClip().duration;
    const totalFrames = action.getClip().tracks[0].times.length;
    const freezeTime = (freezeFrame / totalFrames) * duration * action.timeScale;

    function onLoop() {

        const currentTime = action.time;

        if (currentTime >= freezeTime) {
            action.paused = true;
            if (whichPlayer==3)
            mixch3.removeEventListener('loop', onLoop);
            if (whichPlayer==1)
                mixch1.removeEventListener('loop', onLoop);
            if (whichPlayer==2)
                mixch2.removeEventListener('loop', onLoop);
            if (whichPlayer==4)
                mixch4.removeEventListener('loop', onLoop);
        }
    }

    if (whichPlayer==3)
    mixch3.addEventListener('loop', onLoop);
    if (whichPlayer==1)
        mixch1.addEventListener('loop', onLoop);
    if (whichPlayer==2)
        mixch2.addEventListener('loop', onLoop);
    if (whichPlayer==4)
        mixch4.addEventListener('loop', onLoop);
}

// Function to convert frame number to time
function frameToTime(frame, clip, timeScale) {
   
    const duration = clip.duration;
    const frames = clip.tracks.length;

    return (frame / frames) * duration*timeScale;
}

// Function to check if the animation is at a specific frame
function checkFrameAndLog(action, frameNumber) {
    const clip = action.getClip();
    const frameTime = frameToTime(frameNumber+30, clip, action.timeScale);

    // Check if current time is within the frame range
    if (Math.abs(action.time - frameTime) < 0.05) { // Allow a small tolerance
        // Optionally, you might want to pause or take action here
        if (whichPlayer==3)
       ch3JumpAction.timeScale = 0.01;
        if (whichPlayer==1)
            ch1JumpAction.timeScale = 0.01;
        if (whichPlayer==2)
            ch2JumpAction.timeScale = 0.01;
        if (whichPlayer==4)
            ch4JumpAction.timeScale = 0.01;

    }
}

  
function _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;


    _particles.Step(timeElapsedS, 'id');

  }

  function drawDottedLine(x1,y1,z1, x2, y2, z2) {
    if (adminDottedLine){
        scene.remove(adminDottedLine);
        adminDottedLine = null;
    }


    // Create start and end points for the line
    const startPoint = new THREE.Vector3(x1, y1, z1);
    const endPoint = new THREE.Vector3(x2, y2, z2);

    // Create the line geometry
    const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);

    // Create the material for a dashed line
    const material = new THREE.LineDashedMaterial({
        color: 0x0055ff,
        linewidth: 1, // Not supported in WebGL, but kept for compatibility
        scale: 1,
        dashSize: 3, // Length of the dash
        gapSize: 1, // Length of the gap between dashes
    });

    // Create the line
    adminDottedLine = new THREE.Line(geometry, material);
    adminDottedLine.computeLineDistances(); // Required for dashed lines to appear


    // Add the line to the scene
    scene.add(adminDottedLine);
}

function findBoneByName(node, name) {
    if (node.name === name) {
        return node;
    }
    for (let i = 0; i < node.children.length; i++) {
        const childResult = findBoneByName(node.children[i], name);
        if (childResult) {
            return childResult;
        }
    }
    return null;
}

function clickEnvObjects(point){

}

function plantAnimation(action){
    if (plant){
        if ((plantIdleAction.time>0)&&(action!=plantIdleAction)){ plantIdleAction.paused = true;}
        if (plantBiteAction.time>0){plantIdleAction.stop();}

        action.reset().play();
    }
}

function updateNPCMovemement(){
    if (whichPlayer!=5){
  
    if (vic){
        vic.position.set(npcs[10].x, npcs[10].y, npcs[10].z);
        vic.rotation.y = npcs[10].direction;
    }
}

    if ((eBone)&&(ch3animations!='elevator')){
        eBone.position.set(npcs[0].x,npcs[0].y,npcs[0].z);

        if ((eAction=='up')&&(calculateDistance3D(selectedCube.position.x,selectedCube.position.y,selectedCube.position.z,eBone.position.x,eBone.position.y,eBone.position.z)<2)&&(grounded==1)){
            selectedCube.position.y+=0.1;
        }

    }
    if ((eBone)&&(ch3animations=='elevator')){
        if (eAction=='up'){
            eBone.position.y+=.1;
            npcs[0].y+=0.1;
        }
        if (eAction=='down'){
            eBone.position.y-=0.1;
            npcs[0].y-=0.1;
        }
        const data = {
        "0":{

            y: parseFloat(eBone.position.y),

            action: npcs[0].eAction,
        }}
        socket.emit('updateNPCData', data);
    }

}

function getPlayingActionsTimes(mixer) {
    let playingActions = mixer._actions.filter(action => action.isRunning());
    
    if (playingActions.length === 0) {
           
            if (ch3animations=='ko')
            {
                return {
                    "0":
                    {
                    time: 2.22}};
            }
            if (ch3animations=='climb')
                {
                    return {
                        "0":
                        {
                        time: 1}};
                }
            if (ch3animations=='hangon'){
                return {
                    "0":{time: 1.685}
                };
            }
    }
    
    let actionsTimes = playingActions.map(action => {
        return {
            actionName: action.getClip().name,
            time: action.time
        };
    });
    
    return actionsTimes;
}


function updateOtherAnimations(){

    console.log(actions);
    //check animations for player 1 if youre not player 1
    if (whichPlayer!=1){
        if ((actions[0] == 'none')&&(idleCh1StandAction)){
            mixch1.stopAllAction();
            idleCh1StandAction.reset().play();
        }
        if ((actions[0] == 'ko')&&(ch1KOAction)){
            mixch1.stopAllAction();
            
                ch1KOAction.play();
                ch1KOAction.time = times[0];
            
        }
        if ((actions[0]=='run fwd')&&(ch1RunAction)){
            mixch1.stopAllAction();
            ch1RunAction.play();
            ch1RunAction.time = times[0];
        }
        if ((actions[0]=='flight')&&(ch1FlyAction)){
            mixch1.stopAllAction();
            ch1FlyAction.play();
            ch1FlyAction.time = times[0];
        }
        if ((actions[0]=='run back')&&(ch1WalkBackAction)){
            mixch1.stopAllAction();
            ch1WalkBackAction.play();
            ch1WalkBackAction.time = times[0];
        }
        if ((actions[0]=='jump')&&(ch1JumpAction)){
            mixch1.stopAllAction();
            ch1JumpAction.play();
            ch1JumpAction.time = times[0];
        }
        if ((actions[0]=='strafe left')&&(ch1StrafeRAction)){
            mixch1.stopAllAction();
            ch1StrafeRAction.play();
            ch1StrafeRAction.time = times[0]; 
        }
        if ((actions[0]=='strafe right')&&(ch1StrafeLAction)){
            mixch1.stopAllAction();
            ch1StrafeLAction.play();
            ch1StrafeLAction.time = times[0]; 
        }
        if ((actions[0]=='climb')&&(ch1ClimbAction)){
            mixch1.stopAllAction();
            ch1ClimbAction.play();
            ch1ClimbAction.time = times[0]; 
        }
        if ((actions[0]=='hangon')&&(ch1StandToHangAction)){
            mixch1.stopAllAction();
            ch1StandToHangAction.play();
            ch1StandToHangAction.time = times[0]; 
        }
        if ((actions[0]=='elevator')&&(ch1TypeAction)){
            mixch1.stopAllAction();
            ch1TypeAction.play();
            ch1TypeAction.time = times[0]; 
        }
    }
    if (whichPlayer!=2){
        if ((actions[1]=='elevator')&&(ch2TypeAction)){
            mixch2.stopAllAction();
            ch2TypeAction.play();
            ch2TypeAction.time = times[1]; 
        }
        if ((actions[1] == 'none')&&(idleCh2StandAction)){
            mixch2.stopAllAction();
            idleCh2StandAction.reset().play();
        }
        if ((actions[1] == 'ko')&&(ch2KOAction)){
            mixch2.stopAllAction();
            ch2KOAction.play();
            ch2KOAction.time = times[1];
        }
        if ((actions[1]=='run fwd')&&(ch2RunAction)){
            mixch2.stopAllAction();
            ch2RunAction.play();
            ch2RunAction.time = times[1];
        }
        if ((actions[1]=='flight')&&(ch2FlyAction)){
            mixch2.stopAllAction();
            ch2FlyAction.play();
            ch2FlyAction.time = times[1];
        }
        if ((actions[1]=='run back')&&(ch2WalkBackAction)){
            mixch2.stopAllAction();
            ch2WalkBackAction.play();
            ch2WalkBackAction.time = times[1];
        }
        if ((actions[1]=='jump')&&(ch2JumpAction)){
            mixch2.stopAllAction();
            ch2JumpAction.play();
            ch2JumpAction.time = times[1];
        }
        if ((actions[1]=='strafe left')&&(ch2StrafeRAction)){
            mixch2.stopAllAction();
            ch2StrafeRAction.play();
            ch2StrafeRAction.time = times[1]; 
        }
        if ((actions[1]=='strafe right')&&(ch2StrafeLAction)){
            mixch2.stopAllAction();
            ch2StrafeLAction.play();
            ch2StrafeLAction.time = times[1]; 
        }
        if ((actions[1]=='climb')&&(ch2ClimbAction)){
            mixch2.stopAllAction();
            ch2ClimbAction.play();
            ch2ClimbAction.time = times[1]; 
        }
        if ((actions[1]=='hangon')&&(ch2StandToHangAction)){
            mixch2.stopAllAction();
            ch2StandToHangAction.play();
            ch2StandToHangAction.time = times[1]; 
        }
    }
    if (whichPlayer!=3){
        if ((actions[2]=='elevator')&&(ch3TypeAction)){
            mixch3.stopAllAction();
            ch3TypeAction.play();
            ch3TypeAction.time = times[2]; 
        }
        if ((actions[2] == 'none')&&(idleCh3StandAction)){
            mixch3.stopAllAction();
            idleCh3StandAction.reset().play();
        }
        if ((actions[2] == 'ko')&&(ch3KOAction)){
            mixch3.stopAllAction();
            ch3KOAction.play();
            ch3KOAction.time = times[2];
        }
        if ((actions[2]=='flight')&&(ch3FlyAction)){
            mixch3.stopAllAction();
            ch3FlyAction.play();
            ch3FlyAction.time = times[0];
        }
        if ((actions[2]=='run fwd')&&(ch3RunAction)){
            mixch3.stopAllAction();
            ch3RunAction.play();
            ch3RunAction.time = times[2];
        }
        if ((actions[2]=='run back')&&(ch3WalkBackAction)){
            mixch3.stopAllAction();
            ch3WalkBackAction.play();
            ch3WalkBackAction.time = times[2];
        }
        if ((actions[2]=='jump')&&(ch3JumpAction)){
            mixch3.stopAllAction();
            ch3JumpAction.play();
            ch3JumpAction.time = times[2];
        }
        if ((actions[2]=='strafe left')&&(ch3StrafeRAction)){
            mixch3.stopAllAction();
            ch3StrafeRAction.play();
            ch3StrafeRAction.time = times[2]; 
        }
        if ((actions[2]=='strafe right')&&(ch3StrafeLAction)){
            mixch3.stopAllAction();
            ch3StrafeLAction.play();
            ch3StrafeLAction.time = times[2]; 
        }
        if ((actions[2]=='climb')&&(ch3ClimbAction)){
            mixch3.stopAllAction();
            ch3ClimbAction.play();
            ch3ClimbAction.time = times[2]; 
        }
        if ((actions[2]=='hangon')&&(ch3StandToHangAction)){
            mixch3.stopAllAction();
            ch3StandToHangAction.play();
            ch3StandToHangAction.time = times[2]; 
        }
    }
    if (whichPlayer!=4){
        if ((actions[3]=='elevator')&&(ch4TypeAction)){
            mixch4.stopAllAction();
            ch4TypeAction.play();
            ch4TypeAction.time = times[3]; 
        }
        if ((actions[3]=='flight')&&(ch4FlyAction)){
            mixch4.stopAllAction();
            ch4FlyAction.play();
            ch4FlyAction.time = times[3];
        }
        if ((actions[3] == 'none')&&(idleCh4StandAction)){
            mixch4.stopAllAction();
            idleCh4StandAction.reset().play();
        }
        if ((actions[3] == 'ko')&&(ch4KOAction)){
            mixch4.stopAllAction();
            ch4KOAction.play();
            ch4KOAction.time = times[3];
        }
        if ((actions[3]=='run fwd')&&(ch4RunAction)){
            mixch4.stopAllAction();
            ch4RunAction.play();
            ch4RunAction.time = times[3];
        }
        if ((actions[3]=='run back')&&(ch4WalkBackAction)){
            mixch4.stopAllAction();
            ch4WalkBackAction.play();
            ch4WalkBackAction.time = times[3];
        }
        if ((actions[3]=='jump')&&(ch4JumpAction)){
            mixch4.stopAllAction();
            ch4JumpAction.play();
            ch4JumpAction.time = times[3];
        }
        if ((actions[3]=='strafe left')&&(ch4StrafeRAction)){
            mixch4.stopAllAction();
            ch4StrafeRAction.play();
            ch4StrafeRAction.time = times[3]; 
        }
        if ((actions[3]=='strafe right')&&(ch4StrafeLAction)){
            mixch4.stopAllAction();
            ch4StrafeLAction.play();
            ch4StrafeLAction.time = times[3]; 
        }
        if ((actions[3]=='climb')&&(ch4ClimbAction)){
            mixch4.stopAllAction();
            ch4ClimbAction.play();
            ch4ClimbAction.time = times[3]; 
        }
        if ((actions[3]=='hangon')&&(ch4StandToHangAction)){
            mixch4.stopAllAction();
            ch4StandToHangAction.play();
            ch4StandToHangAction.time = times[3]; 
        }
    }
}



function handleMovement(directionX, directionY) {

    const raycaster = new THREE.Raycaster();
    const directions = {
        forward: new THREE.Vector3(0, 0, -1),
        backward: new THREE.Vector3(0, 0, 1),
        left: new THREE.Vector3(-1, 0, 0),
        right: new THREE.Vector3(1, 0, 0),
        above: new THREE.Vector3(0,1,0),
        below: new THREE.Vector3(0,-1,0)
    };

    // Apply cube's quaternion to direction vectors
    for (let key in directions) {
        directions[key].applyQuaternion(selectedCube.quaternion);
    }

    // Function to check for collisions
const checkCollision = (direction) => {
    const rayOrigin = selectedCube.position.clone();
    rayOrigin.y += 1; // Start the ray slightly above the character to detect slants
    
    raycaster.set(rayOrigin, direction);

    const intersects = raycaster.intersectObject(mesh);

    if (intersects.length > 0 && intersects[0].distance < 1) {
        return true;
    }

    return false;
};

const getTerrainHeightAhead = (direction) => {
    const rayOrigin = selectedCube.position.clone().addScaledVector(direction, 0.1);
    rayOrigin.y += 10; // Start the ray significantly above the character

    raycaster.set(rayOrigin, new THREE.Vector3(0, -1, 0)); // Cast ray downward

    const intersects = raycaster.intersectObject(terrainMesh);
    if (intersects.length > 0) {
        return intersects[0].point.y;
    }

    return selectedCube.position.y;
};
// const touchData = {
//     howManyTouches: howManyTouches, touching: touching, touchstatus: touchstatus, directionx: directionX.toFixed(2), directiony: directionY.toFixed(2)
// }
// socket.emit('touchstatus', touchData);
    // Example: Adjust the cube's movement direction based on the joystick
    
  if (ch3animations!='elevator' && ch3animations!='ko'){
    if ((touchstatus == 'single')&&(!onLad)){
        if (directionY < -0.5) {
            // Move forward
            if (!checkCollision(directions.forward)) {
                selectedCube.position.addScaledVector(directions.forward, 0.1);
                if (ch3animations!='jump')
                ch3animations = 'run fwd';
                socket.emit('mobileanim', ch3animations);
            }
        }
        if (directionY > 0.5) {
            // Move backward
            if (!checkCollision(directions.backward)) {
                if (ch3animations!='jump')
                ch3animations='run bck';
                selectedCube.position.addScaledVector(directions.backward, 0.1);

            }
        }
        if (directionX > 0.5) {
            // Strafe right
            if (!checkCollision(directions.right)) {
                if (ch3animations!='jump')
                ch3animations='strafe left';
                selectedCube.position.addScaledVector(directions.right, 0.1);

            }
        }
        if (directionX < -0.5) {
            // Strafe left
            if (!checkCollision(directions.left)) {
                if (ch3animations!='jump')
                ch3animations= 'strafe right'
                selectedCube.position.addScaledVector(directions.left, 0.1);

            }
        }
}

    if ((touchstatus=='single')&&(onLad)){
        if ((directionY < -0.5)&&(selectedCube.position.y+.1<6)) {

                const quickDist = calculateDistance3D(selectedCube.position.x, selectedCube.position.y, selectedCube.position.z, ceilingBeamBox.position.x, ceilingBeamBox.position.y, ceilingBeamBox.position.z);
                if ((clearToClimb)||((!clearToClimb)&&(quickDist>3)))
                selectedCube.position.y+=0.05;
            }
        


        
        if (directionY > 0.5) {
            selectedCube.position.y-=0.05;
        }
    }
}
    if ((directionX==0)&&(directionY==0)&&(ch3animations!='ko')&&(ch3animations!='jump')&&(!onLad))
        ch3animations='none'
}
function initJoystick() {
    const backgroundRect = joystickBackground.getBoundingClientRect();
    originalKnobX = backgroundRect.left + backgroundRect.width / 2 - joystickKnob.offsetWidth / 2;
    originalKnobY = backgroundRect.top + backgroundRect.height / 2 - joystickKnob.offsetHeight / 2;
    joystickKnob.style.left = `${originalKnobX}px`;
    joystickKnob.style.top = `${originalKnobY}px`;
}

function updateJoystick() {
    if (touching) {
        const deltaX = joystickKnob.offsetLeft - knobX;
        const deltaY = joystickKnob.offsetTop - knobY;
        knobDeltaX = deltaX;
        knobDeltaY = deltaY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 75;

        if (distance < maxDistance) {
            directionX = deltaX / maxDistance;
            directionY = deltaY / maxDistance;
        } else {
            const angle = Math.atan2(deltaY, deltaX);
            directionX = Math.cos(angle);
            directionY = Math.sin(angle);
        }

        const data = {
            dX: directionX,
            dY: directionY
        };

        // Emit data via socket
        socket.emit('show directions', data);

        // Handle movement
        if (selectedCube) handleMovement(directionX, directionY);
    }
}

function updateGaugeBar(value) {
    // Value should be between 0 and 1
    dGauge.style.width = (value) + '%';
}