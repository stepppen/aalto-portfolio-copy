<template>
  <div ref="sceneContainer"></div>
</template>
<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const sceneContainer = ref(null);
let camera, scene, renderer;
let width = 600;
let height = 600;
let pointer = { x: 0, z: 0 };
let scenePosition = 0;
let direction = 1;
const maxPosition = 0.5;  // Maximum position for the animation
const speed = 0.0005;  
let cachedTargetQuaternion = new THREE.Quaternion(); 

const gltfLoader = new GLTFLoader();

onMounted(() => {
  init();
  loadModel();
  window.addEventListener('mousemove', onMouseMove)
  animate();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
});

function loadModel() {
  gltfLoader.load('/three/poly2.glb', (gltf) => {
    const model = gltf.scene;
    model.name = 'gltfModel';
    model.castShadow = false;
    model.receiveShadow = false;
    model.traverse((child) => {
      if (child.isMesh) {
        // Enable back-face culling for the material
        child.material.side = THREE.FrontSide;
      }
    });
    scene.add(model);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });
}

const onMouseMove = (event) => {
  pointer.x = ((event.clientX / width)-1.5)/4;
  // pointer.y = ((event.clientY / height)-0.5)/4;
}

function init() {
  camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 2);
  camera.position.y = 1.2;
  camera.position.z = 1.2;

  scene = new THREE.Scene();

  const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
  pointLight1.position.set(3, 5, 5);
  scene.add(pointLight1);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  sceneContainer.value.appendChild(renderer.domElement);
}

function animate() {    
  function render() {
    const gltfModelGroup = scene.getObjectByName('gltfModel');
    if (gltfModelGroup) {
      const gltfModel = gltfModelGroup.children[0];

      // Check if the target rotation has changed
      if (cachedTargetQuaternion.x !== pointer.x || cachedTargetQuaternion.y !== pointer.y) {
        cachedTargetQuaternion.setFromEuler(new THREE.Euler(pointer.y, pointer.x, 0, 'XYZ'));
      }

      // Apply cached target rotation
      gltfModel.quaternion.slerp(cachedTargetQuaternion, 0.1);

      scenePosition += direction * speed;

      if (Math.abs(scenePosition) >= maxPosition) {
        direction *= -1;  // Reverse direction
      }

      scene.rotation.y = scenePosition;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
}
</script>
