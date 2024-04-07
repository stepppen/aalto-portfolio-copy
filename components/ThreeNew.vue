<template>
  <div ref="asciiEffectContainer"></div>
</template>

<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

const asciiEffectContainer = ref(null);
let camera, scene, renderer, effect;
let rotationIncrement = 0.0009;
let rotationDirection = 1;
let lastRenderTime = 0;
const fpsInterval = 10;
const width = 600;
const height = 600;

onMounted(() => {
  init();
  loadModel();
  animate();
});

function init() {

  camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 2);
  camera.position.y = 1.2;
  camera.position.z = 1.2;

  scene = new THREE.Scene();

  const pointLight1 = new THREE.PointLight(0xffffff, 5, 0, 0);
  pointLight1.position.set(3, 5, 5);
  scene.add(pointLight1);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  effect = new AsciiEffect(renderer, '    ....::', { invert: true, resolution: 0.11 });
  effect.setSize(width, height);
  effect.domElement.style.color = '#006CFF';

  asciiEffectContainer.value.appendChild(effect.domElement);
}

function loadModel() {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/three/poly2.glb', (gltf) => {
    const model = gltf.scene;
    model.name = 'gltfModel';
    model.castShadow = false;
    model.receiveShadow = false;
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.side = THREE.FrontSide;
      }
    });
    scene.add(model);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });
}

function animate() {
    setTimeout(function() {
        requestAnimationFrame(animate);
        
        const gltfModelGroup = scene.getObjectByName('gltfModel');
        if (gltfModelGroup) {
            const gltfModel = gltfModelGroup.children[0];
            gltfModel.rotation.y += rotationIncrement;
        }
        
        effect.render(scene, camera);
    }, 50);
}

</script>
