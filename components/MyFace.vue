<template>
    <div
    ref="asciiEffectContainer"
    class="ascii-placeholder"
  ></div>
</template>

<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect as OriginalAsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

class PatchedAsciiEffect extends OriginalAsciiEffect {
  constructor(renderer, characters, options) {
    super(renderer, characters, options);

    if (this.context && this.context.canvas) {
      // Keep the original canvas but recreate its context
      const oldCanvas = this.context.canvas;
      const ctx = oldCanvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        this.context = ctx;
      }
    }
  }
}

const asciiEffectContainer = ref(null);
let camera, scene, renderer, effect;
let rotationIncrement = 0.0009;
let rotationDirection = 1;
const width = 500;
const height =  500;

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

  effect = new PatchedAsciiEffect(renderer, '   ...::', { invert: true, resolution: 0.15 });
  effect.setSize(width, height);
  effect.domElement.style.color = '#FFFFFF';

  // Replace placeholder content
  asciiEffectContainer.value.innerHTML = ''; // clear placeholder
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
            // gltfModel.rotation.y += rotationIncrement;
        

        // Rotate the model back and forth
        gltfModel.rotation.y += rotationIncrement * rotationDirection;
        // Change rotation direction if reaching the limits
        if (Math.abs(gltfModel.rotation.y) >= Math.PI / 8) {
          rotationDirection *= -1;
        }
        
        effect.render(scene, camera);
      }
    }, 50);
}

</script>
<style>
.ascii-placeholder {
  width: 500px;
  height: 500px;
  background: rgb(0,0,0,0); /* Or any placeholder color/image */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-family: monospace;
}
</style>