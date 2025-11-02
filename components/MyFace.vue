<template>
  <div
    ref="asciiEffectContainer"
    class="ascii-placeholder"
    :class="{ 'is-loading': !modelLoaded }"
  >
    <div v-if="!modelLoaded" class="loading-text">Loading 3D...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const asciiEffectContainer = ref(null);
const modelLoaded = ref(false);
let cleanup = null;

onMounted(async () => {
  const [
    ThreeModule,
    { GLTFLoader: GLTFLoaderClass },
    { AsciiEffect: OriginalAsciiEffectClass }
  ] = await Promise.all([
    import(/* webpackChunkName: "three" */ 'three'),
    import(/* webpackChunkName: "three-gltf" */ 'three/examples/jsm/loaders/GLTFLoader.js'),
    import(/* webpackChunkName: "three-ascii" */ 'three/examples/jsm/effects/AsciiEffect.js')
  ]);

  const THREE = ThreeModule.default || ThreeModule;
  const GLTFLoader = GLTFLoaderClass;
  const OriginalAsciiEffect = OriginalAsciiEffectClass;

  class PatchedAsciiEffect extends OriginalAsciiEffect {
    constructor(renderer, characters, options) {
      super(renderer, characters, options);
      if (this.context?.canvas) {
        const oldCanvas = this.context.canvas;
        const ctx = oldCanvas.getContext('2d', { willReadFrequently: true });
        if (ctx) this.context = ctx;
      }
    }
  }

  let camera, scene, renderer, effect;
  let rotationIncrement = 0.0009;
  let rotationDirection = 1;
  let animationFrameId = null;
  let gltfModel = null;
  const width = 500;
  const height = 500;

  // Init scene
  camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 2);
  camera.position.set(0, 1.2, 1.2);

  scene = new THREE.Scene();

  const pointLight1 = new THREE.PointLight(0xffffff, 5, 0, 0);
  pointLight1.position.set(3, 5, 5);
  scene.add(pointLight1);

  renderer = new THREE.WebGLRenderer({ 
    antialias: false,
    powerPreference: 'low-power' 
  });
  renderer.setSize(width, height);

  effect = new PatchedAsciiEffect(renderer, '   ...::', { 
    invert: true, 
    resolution: 0.15 
  });
  effect.setSize(width, height);
  effect.domElement.style.color = '#FFFFFF';

  asciiEffectContainer.value.innerHTML = '';
  asciiEffectContainer.value.appendChild(effect.domElement);

  // Load model
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
    gltfModel = model.children[0];
    modelLoaded.value = true;
    animate();
  });

  let lastTime = 0;
  const targetFPS = 20;
  const frameDelay = 1000 / targetFPS;

  function animate(currentTime = 0) {
    animationFrameId = requestAnimationFrame(animate);

    const elapsed = currentTime - lastTime;
    if (elapsed < frameDelay) return;
    lastTime = currentTime - (elapsed % frameDelay);

    if (gltfModel) {
      gltfModel.rotation.y += rotationIncrement * rotationDirection;
      if (Math.abs(gltfModel.rotation.y) >= Math.PI / 8) {
        rotationDirection *= -1;
      }
      effect.render(scene, camera);
    }
  }

  // Cleanup function
  cleanup = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (renderer) {
      renderer.dispose();
    }
    if (scene) {
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  };
});

onBeforeUnmount(() => {
  if (cleanup) cleanup();
});
</script>

<style scoped>
.ascii-placeholder {
  width: 500px;
  height: 500px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* .ascii-placeholder.is-loading {
  background: rgba(255, 255, 255, 0.05);
}

.loading-text {
  font-family: monospace;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
} */
</style>