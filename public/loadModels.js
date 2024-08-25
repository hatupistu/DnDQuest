import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModels(scene, mesh, bounds, echina, tiamat,char1, char2, char3, char4,){

const map = new GLTFLoader().setPath('/map/');
map.load('stadium.gltf', (gltf) => {
    mesh = gltf.scene;
    mesh.traverse((child) => {
        if (child.isMesh) {
            child.name = 'stadium';
        }
    });
    mesh.position.set(-20.2, -25, -24.7);
   // mesh.scale.set(0.5, 0.5, 0.5);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    scene.add(mesh);
});



const outOfBounds = new GLTFLoader().setPath('/map/');
outOfBounds.load('outofbounds.glb', (gltf) => {
    bounds = gltf.scene;
    bounds.traverse((child) => {
        if (child.isMesh) {
            child.name = 'bounds';
            child.visible = false;
        }
    });

    bounds.position.set(-20.2, -25, -24.7);
scene.add(bounds);
});

const echinaModel = new GLTFLoader().setPath('/map/');
echinaModel.load('echina.gltf', (gltf) => {
    echina = gltf.scene;
    echina.traverse((child) => {
        if (child.isMesh) {
            child.name = 'echina';
        }
    });
    echina.position.set(-29.03, -15.5, -77.435);
    echina.scale.set(.6,.6,.6);

scene.add(echina);
});

const tiamatModel = new GLTFLoader().setPath('/map/');
tiamatModel.load('5head_dragon.gltf', (gltf) => {
    tiamat = gltf.scene;
    tiamat.traverse((child) => {
        if (child.isBone && child.name === 'neck-03003') {
            tiamatHeadBone = child;
          }
        if (child.isMesh) {
            child.name = 'tiamat';

        }
    });
    tiamat.position.set(-77.83,20.6,31.581);
    tiamat.layers.set(1);

scene.add(tiamat);
    // Set up animation
    const gltfAnimations = gltf.animations;
    mix5h = new THREE.AnimationMixer(tiamat);
    const idleStanding = THREE.AnimationClip.findByName(gltfAnimations, 'Standing_idle');
    const idleStandAction = mix5h.clipAction(idleStanding);
    idleStandAction.play();
    
    
}, undefined, function (error) {
    console.error(error);
});
const character1Model = new GLTFLoader().setPath('/map/');
const character2Model = new GLTFLoader().setPath('/map/');
const character3Model = new GLTFLoader().setPath('/map/');
const character4Model = new GLTFLoader().setPath('/map/');
character3Model.load('character.glb', (gltf) => {
    char3 = gltf.scene;
    char3.traverse((child) => {

        if (child.isMesh) {
            child.name = 'character 3';
            child.material= new THREE.MeshStandardMaterial({ color: color[2] });
            child.castShadow = true;
        }
    });
    
    char3.position.set(xs[2],ys[2],zs[2]);
    char3.layers.set(1);

scene.add(char3);
    // Set up animation
    const gltfChAnimations = gltf.animations;
    mixch = new THREE.AnimationMixer(char3);
    const idleCh3Standing = THREE.AnimationClip.findByName(gltfChAnimations, 'standing_idle');
    idleCh3StandAction = mixch.clipAction(idleCh3Standing);
    idleCh3StandAction.play();
    const ch3RunAnim = THREE.AnimationClip.findByName(gltfChAnimations, 'running.001');
     ch3RunAction = mixch.clipAction(ch3RunAnim);
    const ch3JumpAnim = THREE.AnimationClip.findByName(gltfChAnimations, 'jump');
     ch3JumpAction = mixch.clipAction(ch3JumpAnim);
     ch3JumpAction.setLoop(THREE.LoopOnce, 1);
     ch3JumpAction.clampWhenFinished = true;
    const ch3WalkBackAnim = THREE.AnimationClip.findByName(gltfChAnimations, 'walking_backwards');
     ch3WalkBackAction = mixch.clipAction(ch3WalkBackAnim); 
    const ch3StrafeLAnim = THREE.AnimationClip.findByName(gltfChAnimations, 'strafe_left');
    const ch3StrafeRAnim = THREE.AnimationClip.findByName(gltfChAnimations, 'strafe_right');
    ch3StrafeLAction = mixch.clipAction(ch3StrafeLAnim);
    ch3StrafeRAction = mixch.clipAction(ch3StrafeRAnim);
    ch3RunAction.timeScale=0.6;
    
    document.addEventListener('keydown', handleKeyPress);

}, undefined, function (error) {
    console.error(error);
});


const zonewall = new GLTFLoader().setPath('/map/');
zonewall.load('zonewall.gltf', (gltf) => {
    wallmesh = gltf.scene;
    wallmesh.traverse((child) => {
        if (child.isMesh) {
            child.name = 'zonewall';
            child.material.transparent = true;
            child.material.opacity = 1.0;
        }
    });
        wallmesh.position.set(10, -5,10);
        wallmesh.visible = false;

scene.add(wallmesh);
});

new GLTFLoader().load('/map/dragon2.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object) {
        if (object.isMesh) {object.castShadow = true; object.name = 'dragon 1';}
    });
    model.position.set(0,8,0);
    scene.add(model);

    // Set up animation
    const gltfAnimations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    const idleFlying = THREE.AnimationClip.findByName(gltfAnimations, 'wyvern_oldestAction.002');
    const idleFlyAction = mixer.clipAction(idleFlying);
    idleFlyAction.play();
    
    const flyFwdAction = mixer.clipAction(THREE.AnimationClip.findByName(gltfAnimations, 'wyvern_flying'));
    
}, undefined, function (error) {
    console.error(error);
});

}