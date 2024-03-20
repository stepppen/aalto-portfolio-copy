<template>
    <div>
        <canvas ref="experience" /> 
    </div>
</template>

<script setup lang="ts">
// import { AmbientLight, Color, Fog, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from 'three';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let effect: AsciiEffect;
const experience: Ref<HTMLCanvasElement | null> = ref(null)

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();


const onMouseMove = (event) => {
    pointer.x = ((event.clientX / width)-1.5)/3;
    pointer.y = ((event.clientY / height)-0.5)/3;
    camera.position.set(0, 0, 0.2);
    const gltfModel = scene.getObjectByName('gltfModel');
    if (gltfModel) {
        gltfModel.rotation.y = pointer.x;
        gltfModel.rotation.x = pointer.y;
    }
}

window.addEventListener('mousemove', onMouseMove)
const width = 600;
const height = 600;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);


scene.add(camera)
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
const gltfLoader = new GLTFLoader()

gltfLoader.load('/three/skull.glb', (gltf) => {
    gltf.scene.name = 'gltfModel';
    scene.add(gltf.scene)
}
)

function createEffect() {
    const characters = ' .:-+*=%@#'; // Define characters
    const effectSize = { amount: .205 }; // Define effect size
    const backgroundColor = 'black'; // Define background color
    const ASCIIColor = 'white'; // Define ASCII color

    effect = new AsciiEffect(renderer, characters, { invert: true, resolution: effectSize.amount });
    effect.setSize(width, height);
    effect.domElement.style.color = ASCIIColor;
    effect.domElement.style.backgroundColor = backgroundColor;
}


function setRenderer(){
    if(experience.value){
        renderer = new THREE.WebGLRenderer({ canvas: experience.value, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableDamping = true;

        renderer.setSize(width, height)
        renderer.render(scene, camera)
    }
}
onMounted(() => {
    // controls.update()
    setRenderer()
    loop()
})

const loop = () => {
    // sphere.position.x += 0.01
    // effect.render(scene, camera);
    renderer.render(scene, camera)
    requestAnimationFrame(loop)
}




</script>