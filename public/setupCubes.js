import * as THREE from 'three';

export function setupCubes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshStandardMaterial({ color: "#000000" });

    const cube1 = new THREE.Mesh(geometry, material);
    cube1.position.set(0, -10, 0);
    cube1.castShadow = true;
    cube1.receiveShadow = true;

    const cube2 = new THREE.Mesh(geometry, material);
    cube2.position.set(0, -10, 0);
    cube2.castShadow = true;
    cube2.receiveShadow = true;

    const cube3 = new THREE.Mesh(geometry, material);
    cube3.position.set(0, -10, 0);
    cube3.castShadow = true;
    cube3.receiveShadow = true;

    const cube4 = new THREE.Mesh(geometry, material);
    cube4.position.set(0, -10, 0);
    cube4.castShadow = true;
    cube4.receiveShadow = true;

    return [cube1, cube2, cube3, cube4];
}
