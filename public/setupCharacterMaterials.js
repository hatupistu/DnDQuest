import * as THREE from 'three';

export function setupCharacterMaterials(){
    let colorSelect = new Array(21);
    colorSelect[0] = new THREE.MeshStandardMaterial({name: "red", color: "#ff0000", transparent: true});
    colorSelect[1] = new THREE.MeshStandardMaterial({name: "green", color: "#00ff00", transparent: true});
    colorSelect[2] = new THREE.MeshStandardMaterial({name: "blue", color: "#0000ff", transparent: true});
    colorSelect[3] = new THREE.MeshStandardMaterial({name: "yellow", color: "#ffff00", transparent: true});
    colorSelect[4] = new THREE.MeshStandardMaterial({name: "magenta", color: "#ff00ff", transparent: true});
    colorSelect[5] = new THREE.MeshStandardMaterial({name: "cyan", color: "#00ffff", transparent: true});
    colorSelect[6] = new THREE.MeshStandardMaterial({name: "white", color: "#ffffff", transparent: true});
    colorSelect[7] = new THREE.MeshStandardMaterial({name: "orange", color: "#ffa500", transparent: true});
    colorSelect[8] = new THREE.MeshStandardMaterial({name: "grey", color: "#808080", transparent: true});
    colorSelect[9] = new THREE.MeshStandardMaterial({name: "brown", color: "#8b4513", transparent: true});
    colorSelect[10] = new THREE.MeshStandardMaterial({name: "violet", color: "#2e207d", transparent: true});
    colorSelect[11] = new THREE.MeshStandardMaterial({name: "peach", color: "#ffdab9", transparent: true});
    colorSelect[12] = new THREE.MeshStandardMaterial({name: "black", color: "#000000", transparent: true});
    colorSelect[13] = new THREE.MeshStandardMaterial({name: "orange red", color: "#ff4500", transparent: true});
    colorSelect[14] = new THREE.MeshStandardMaterial({name: "lime green", color: "#32cd32", transparent: true});
    colorSelect[15] = new THREE.MeshStandardMaterial({name: "dodger blue", color: "#1e90ff", transparent: true});
    colorSelect[16] = new THREE.MeshStandardMaterial({name: "deep pink", color: "#ff1493", transparent: true});
    colorSelect[17] = new THREE.MeshStandardMaterial({name: "dark turquoise", color: "#00ced1", transparent: true});
    colorSelect[18] = new THREE.MeshStandardMaterial({name: "dark violet", color: "#9400d3", transparent: true});
    colorSelect[19] = new THREE.MeshStandardMaterial({name: "dark khaki", color: "#bdb76b", transparent: true});
    colorSelect[20] = new THREE.MeshStandardMaterial({name: "dark orange", color: "#ff8c00", transparent: true});

    return [colorSelect];
}

export function whichColor(string){
    let ans = 0;

    switch(string)
    {
        case 'red':
            ans = 0;
        break;
        case 'green':
            ans = 1;
        break;
        case 'blue':
            ans = 2;
        break;
        case 'yellow':
            ans = 3;
        break;
        case 'magenta':
            ans = 4;
        break;
        case 'cyan':
            ans = 5;
        break;
        case 'white':
            ans = 6;
        break;
        case 'orange':
            ans = 7;
        break;
        case 'grey':
            ans = 8;
        break;
        case 'brown':
            ans = 9;
        break;
        case 'violet':
            ans = 10;
        break;
        case 'peach':
            ans = 11;
        break;
        case 'black':
            ans = 12;
        break;
        case 'orange red':
            ans = 13;
        break;
        case 'lime green':
            ans = 14;
        break;
        case 'dodger blue':
            ans = 15;
        break;
        case 'deep pink':
            ans = 16;
        break;
        case 'dark turquoise':
            ans = 17;
        break;
        case 'dark violet':
            ans = 18;
        break;
        case 'dark khaki':
            ans = 19;
        break;
        case 'dark orange':
            ans = 20;
        break;
        default:
            break;
    }

    return ans;
}