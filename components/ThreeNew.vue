<template>
  <div ref="asciiEffectContainer"></div>
</template>
<script setup>
import * as THREE from 'three';
import { MathUtils } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

// const box = new THREE.Box3().setFromObject( gltf.scene );
// const center = box.getCenter( new THREE.Vector3() );

const asciiEffectContainer = ref(null);

let camera, scene, renderer, effect;
let width = 600;
let height = 600;
let whereTo = 2
const easingFactor = 0.05;
let pointer = { x: 0, z: 0 };
let targetRotation = { x: 0, z: 0 }
let rotationIncrementMouse = 0;
let rotationIncrementConstant = 0.0001;
let constantRotationDirection = 1;
let directionSwitched = false;
let lastMove = 0;
const maxPosition = 0.5;  // Maximum position for the animation
  const speed = 0.005;  

  let scenePosition = 0;
let direction = 1;
let previousTime = 0;



const start = Date.now();
const gltfLoader = new GLTFLoader()
let isAboutPage = false;
const route = useRoute();
let center = new THREE.Vector3();
let cachedTargetQuaternion = new THREE.Quaternion();

// render();
onMounted(() => {
isAboutPage = route.path === '/about';
if (isAboutPage) {
  init();
  loadModel();
  window.addEventListener('mousemove', onMouseMove)
  animate();
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
  camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 2);
  camera.position.y = 1.2;
  camera.position.z = 1.2;

  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0, 0, 0 );

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  // scene.add(ambientLight)

  const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
  pointLight1.position.set( 3, 5, 5 );
  scene.add( pointLight1 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
  // renderer.getContext().willReadFrequently = true;
  effect = new AsciiEffect( renderer, '   ....::::', { invert: true, resolution: 0.13} );
  effect.setSize( width, height );
  // effect.domElement.style.color = '#4583B2';
  effect.domElement.style.color = 'blue';

  asciiEffectContainer.value.appendChild( effect.domElement );

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




function animate() {
  const frameTime = 100; // Calculate the frame time for 15 FPS

  let lastFrameTime = 0;

  function render(timestamp) {
    const deltaTime = timestamp - lastFrameTime;

    // Check if it's time to render a frame
    if (deltaTime >= frameTime) {
      lastFrameTime = timestamp;

      const gltfModelGroup = scene.getObjectByName('gltfModel');
      if (gltfModelGroup) {
        const gltfModel = gltfModelGroup.children[0];

        // Apply cached target rotation
        gltfModel.quaternion.slerp(cachedTargetQuaternion, 0.1);

        scenePosition += direction * speed;

        if (Math.abs(scenePosition) >= maxPosition) {
          direction *= -1; // Reverse direction
        }

        scene.rotation.y = scenePosition;

        effect.render(scene, camera);
      }
    }

    requestAnimationFrame(render);
  }

  // Start the animation loop
  requestAnimationFrame(render);
}


</script>

