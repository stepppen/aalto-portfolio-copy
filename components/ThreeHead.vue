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

let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let effect;
const experience: Ref<HTMLCanvasElement | null> = ref(null)

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();


const onMouseMove = (event) => {
    pointer.x = ((event.clientX / width)-1.5)/3;
    pointer.y = ((event.clientY / height)-0.5)/3;
    // camera.position.set(pointer.x, camera.position.y, 0.2);
    camera.position.set(0, 0, 0.2);
    const gltfModel = scene.getObjectByName('gltfModel');
    if (gltfModel) {
        gltfModel.rotation.y = pointer.x;
        gltfModel.rotation.x = pointer.y;
    }
    // camera.rotation.set(0, pointer.x, 0);
    // console.log(pointer.x, pointer.y)
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


function setRenderer(){
    if(experience.value){
        renderer = new THREE.WebGLRenderer({ canvas: experience.value, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // effect = new THREE.AsciiEffect(renderer);
        // effect.setSize(width, height);

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