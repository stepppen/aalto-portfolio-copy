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
let width, height;
let pointer = { x: 0, y: 0 };
let scenePosition = 0;
let direction = 1;
const maxPosition = 0.5;
const speed = 0.0005;
let previousTime = 0;

const gltfLoader = new GLTFLoader();
let isLandingPage = false;
const route = useRoute();
let cachedTargetQuaternion = new THREE.Quaternion();

const onMouseMove = (event) => {
  pointer.x = ((event.clientX / width) - 1.5) / 4;
  pointer.y = ((event.clientY / height) - 0.5) / 6;
}

onMounted(() => {
  width = window.innerWidth;
  height = window.innerHeight;
  isLandingPage = route.path === '/';
  if (isLandingPage) {
      init();
      loadModel();
      window.addEventListener('mousemove', onMouseMove);
      animate();
  }
});

onUnmounted(() => {
  if (isLandingPage) {
      isLandingPage = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
});

function loadModel() {
  gltfLoader.load('/three/abstract.glb', (gltf) => {
      const model = gltf.scene;
      model.name = 'gltfModel';
      model.castShadow = false;
      model.receiveShadow = false;
      model.rotateY(-(Math.PI / 3));
      scene.add(model);
  });
}

function init() {
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 10);
  camera.position.y = 0;
  camera.position.z = 10;

  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
  pointLight2.position.set(-500, -500, -500);
  scene.add(pointLight2);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  effect = new AsciiEffect(renderer, '  .:-+*=%@#', { invert: true });
  effect.setSize(width, height);
  effect.domElement.style.color = "rgb(148 163 184)";
  asciiEffectContainer.value.appendChild(effect.domElement);
}

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
