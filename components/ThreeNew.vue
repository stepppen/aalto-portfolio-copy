<template>
  <div ref="asciiEffectContainer"></div>
</template>

<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue';

const asciiEffectContainer = ref(null);

let camera, scene, renderer, effect;
let width = 600;
let height = 600;
let pointer = { x: 0, z: 0 };
let scenePosition = 0;
let direction = 1;
const maxPosition = 0.5;
const speed = 0.0005;
let previousTime = 0;
let cachedTargetQuaternion = new THREE.Quaternion();

const gltfLoader = new GLTFLoader();
let isAboutPage = false;
const route = useRoute();

onMounted(() => {
  isAboutPage = route.path === '/about';
  if (isAboutPage) {
    init();
    loadModel();
    animate();
    window.addEventListener('mousemove', onMouseMove);
  }
});

onUnmounted(() => {
  if (isAboutPage) {
    isAboutPage = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
});

function init() {
  camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 2);
  camera.position.y = 1.2;
  camera.position.z = 1.2;

  scene = new THREE.Scene();

  const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
  pointLight1.position.set(500, 500, 500);
  scene.add(pointLight1);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  effect = new AsciiEffect(renderer, '   .:-+*=%@#', { invert: true });
  effect.setSize(width, height);
  effect.domElement.style.color = 'rgb(148 163 184)';
  asciiEffectContainer.value.appendChild(effect.domElement);

  // Set willReadFrequently attribute to true for better performance
  const rendererCanvas = renderer.domElement;
  rendererCanvas.setAttribute('willReadFrequently', 'true');
}

function loadModel() {
  gltfLoader.load('/three/poly2.glb', (gltf) => {
    const model = gltf.scene;
    model.name = 'gltfModel';
    model.castShadow = false;
    model.receiveShadow = false;
    scene.add(model);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });
}

const onMouseMove = (event) => {
  pointer.x = ((event.clientX / width) - 1.5) / 4;
};

function animate() {
  function render() {
    const currentTime = performance.now();
    const timeDiff = currentTime - previousTime;

    if (timeDiff > 33.33) {
      const gltfModelGroup = scene.getObjectByName('gltfModel');
      if (gltfModelGroup) {
        const gltfModel = gltfModelGroup.children[0];

        if (cachedTargetQuaternion.x !== pointer.x || cachedTargetQuaternion.y !== pointer.y) {
          cachedTargetQuaternion.setFromEuler(new THREE.Euler(pointer.y, pointer.x, 0, 'XYZ'));
        }
        gltfModel.quaternion.slerp(cachedTargetQuaternion, 0.1);

        scenePosition += direction * speed;
        if (Math.abs(scenePosition) >= maxPosition) {
          direction *= -1;
        }
        scene.rotation.y = scenePosition;
        effect.render(scene, camera);
      }
      previousTime = currentTime;
    }
    requestAnimationFrame(render);
  }
  render();
}
</script>
