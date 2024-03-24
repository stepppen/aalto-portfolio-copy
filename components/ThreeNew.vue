<template>
    <div ref="asciiEffectContainer"></div>
</template>
<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

const asciiEffectContainer = ref(null);

let camera, scene, renderer, effect;
let width = 600;
let height = 600;
let speed = 0.1
let whereTo = 2

const start = Date.now();
const gltfLoader = new GLTFLoader()
let isAboutPage = false;
const route = useRoute();

onMounted(() => {
  isAboutPage = route.path === '/about';
  if (isAboutPage) {
    init();
    loadModel();
  }
});

onUnmounted(() => {
  if (isAboutPage) {
    isAboutPage = false;
  }
});

// init();
// animate();
function loadModel() {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/three/skull.glb', (gltf) => {
    gltf.scene.name = 'gltfModel';
    // gltf.rotation.y = 3
    scene.add(gltf.scene);
    animate();
  });
}


function init() {

    camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    // camera.rotation.y
    camera.position.x = 0.03;
    camera.position.y = -0.02;
    camera.position.z = 0.2;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0, 0, 0 );

    const pointer = new THREE.Vector2();
    const onMouseMove = (event) => {
        pointer.x = ((event.clientX / width)-1.5)/3;
        pointer.y = ((event.clientY / height)-0.5)/3;
        camera.position.set(0.03, -0.02, 0.2);
        const gltfModel = scene.getObjectByName('gltfModel');
        if (gltfModel) {
            gltfModel.rotation.y = pointer.x;
            gltfModel.rotation.x = pointer.y;
        }
    }
    window.addEventListener('mousemove', onMouseMove)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
    pointLight1.position.set( 500, 500, 500 );
    scene.add( pointLight1 );

    // const pointLight2 = new THREE.PointLight( 0xffffff, 1, 0, 0 );
    // pointLight2.position.set( - 500, - 500, - 500 );
    // scene.add( pointLight2 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );

    // effect = new AsciiEffect( renderer, '  .:-+*=%@#', { invert: true } );
    effect = new AsciiEffect( renderer, '  .-oz@#', { invert: true } );
    effect.setSize( width, height );
    effect.domElement.style.color = '#4583B2';
  
    effect.domElement.style.backgroundColor = "#020617";
    // effect.domElement.style.backgroundColor = "grey";

    asciiEffectContainer.value.appendChild( effect.domElement );

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
    effect.setSize( width, height );

}

//

function animate() {
    requestAnimationFrame( animate );
    render();
    let gltfModel = scene.getObjectByName('gltfModel');
    gltfModel.rotation.y += 0.0005;

}

function render() {
    effect.render( scene, camera );

}
</script>