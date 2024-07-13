import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const rendererMain = new THREE.WebGLRenderer({ antialias: true });
rendererMain.outputColorSpace = THREE.SRGBColorSpace;
rendererMain.setSize(1200, 600);
rendererMain.setClearColor(0x000000);
rendererMain.setPixelRatio(window.devicePixelRatio);
rendererMain.shadowMap.enabled = false;  

document.getElementById('scene-container').appendChild(rendererMain.domElement);

const sceneMain = new THREE.Scene();

const cameraMain = new THREE.PerspectiveCamera(45, 1200 / 600, 1, 1000);
cameraMain.position.set(4, 16, 4);

const controlsMain = new OrbitControls(cameraMain, rendererMain.domElement);
controlsMain.enableDamping = true;
controlsMain.enablePan = false;
controlsMain.minDistance = 5;
controlsMain.maxDistance = 20;
controlsMain.minPolarAngle = 0.5;
controlsMain.maxPolarAngle = 1.5;
controlsMain.autoRotate = false;
controlsMain.target = new THREE.Vector3(0, 1, 0);
controlsMain.update();

const directionalLightMain = new THREE.DirectionalLight(0xffffff, 1);
directionalLightMain.position.set(5, 10, 7.5);
directionalLightMain.castShadow = false;  
sceneMain.add(directionalLightMain);

const ambientLightMain = new THREE.AmbientLight(0xffffff, 1); 
sceneMain.add(ambientLightMain);

let selectedHandle = null;
let selectedBlade = null;
let currentModel = null;

function loadMainModel(handle, blade) {
    let modelPath;
    if (handle === 1 && blade === 4) {
        modelPath = 'Sword1.1/Sword1.1.gltf';
    } else if (handle === 1 && blade === 5) {
        modelPath = 'Sword1.2/Sword1.1.gltf';
    } else if (handle === 1 && blade === 6) {
        modelPath = 'Sword1.3/Sword1.3.gltf';
    } else if (handle === 2 && blade === 4) {
        modelPath = 'Sword2.1/Sword2.1.gltf';
    } else if (handle === 2 && blade === 5) {
        modelPath = 'Sword2.2/Sword2.2.gltf';
    } else if (handle === 2 && blade === 6) {
        modelPath = 'Sword2.3/Sword2.3.gltf';
    } else if (handle === 3 && blade === 4) {
        modelPath = 'Sword3.1/Sword3.1.gltf';
    } else if (handle === 3 && blade === 5) {
        modelPath = 'Sword3.2/Sword3.2.gltf';
    } else if (handle === 3 && blade === 6) {
        modelPath = 'Sword3.3/Sword3.3.gltf';
    }

    if (modelPath) {
        if (currentModel) {
            sceneMain.remove(currentModel);
        }

        const loaderMain = new GLTFLoader();
        loaderMain.load(modelPath, (gltf) => {
            currentModel = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            currentModel.position.sub(center); 
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;
            currentModel.scale.set(scale, scale, scale); 
            currentModel.position.set(0, 1.5, -1);
            sceneMain.add(currentModel);

            controlsMain.autoRotate = true;

            document.getElementById('progress-container').style.display = 'none';
        }, undefined, (error) => {
            console.error(error);
        });
    }
}

function highlightSelectedButton(selectedHandleButton, selectedBladeButton) {
    document.querySelectorAll('.button.handle').forEach(button => {
        button.classList.remove('selected');
    });
    document.querySelectorAll('.button.blade').forEach(button => {
        button.classList.remove('selected');
    });
    if (selectedHandleButton) {
        selectedHandleButton.classList.add('selected');
    }
    if (selectedBladeButton) {
        selectedBladeButton.classList.add('selected');
    }
}

document.getElementById('button-1').addEventListener('click', () => {
    selectedHandle = 1;
    highlightSelectedButton(document.getElementById('button-1'), document.querySelector('.button.blade.selected'));
});
document.getElementById('button-2').addEventListener('click', () => {
    selectedHandle = 2;
    highlightSelectedButton(document.getElementById('button-2'), document.querySelector('.button.blade.selected'));
});
document.getElementById('button-3').addEventListener('click', () => {
    selectedHandle = 3;
    highlightSelectedButton(document.getElementById('button-3'), document.querySelector('.button.blade.selected'));
});
document.getElementById('button-4').addEventListener('click', () => {
    selectedBlade = 4;
    highlightSelectedButton(document.querySelector('.button.handle.selected'), document.getElementById('button-4'));
});
document.getElementById('button-5').addEventListener('click', () => {
    selectedBlade = 5;
    highlightSelectedButton(document.querySelector('.button.handle.selected'), document.getElementById('button-5'));
});
document.getElementById('button-6').addEventListener('click', () => {
    selectedBlade = 6;
    highlightSelectedButton(document.querySelector('.button.handle.selected'), document.getElementById('button-6'));
});

document.getElementById('button-7').addEventListener('click', () => {
    if (selectedHandle && selectedBlade) {
        loadMainModel(selectedHandle, selectedBlade);
    } else {
        alert('Please select a handle and a blade first.');
    }
});

window.addEventListener('resize', () => {
    cameraMain.aspect = 1200 / 600;
    cameraMain.updateProjectionMatrix();
    rendererMain.setSize(1200, 600);
});

function animateMain() {
    requestAnimationFrame(animateMain);
    controlsMain.update();
    rendererMain.render(sceneMain, cameraMain);
}
animateMain();

