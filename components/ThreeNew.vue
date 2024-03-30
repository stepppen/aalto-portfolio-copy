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
let speed = 0.1
let whereTo = 2
const easingFactor = 0.05;
let pointer = { x: 0, z: 0 };
let targetRotation = { x: 0, z: 0 }
let rotationIncrementMouse = 0;
let rotationIncrementConstant = 0.0001;
let constantRotationDirection = 1;
let directionSwitched = false;
let lastMove = 0;



const start = Date.now();
const gltfLoader = new GLTFLoader()
let isAboutPage = false;
const route = useRoute();
let center = new THREE.Vector3();
let cachedTargetQuaternion = new THREE.Quaternion();

const onMouseMove = (event) => {
    pointer.x = ((event.clientX / width)-1.5)/4;
   
    // pointer.y = ((event.clientY / height)-0.5)/4;
}
// render();
onMounted(() => {
isAboutPage = route.path === '/about';
if (isAboutPage) {
  init();
  loadModel();
  animate();
  window.addEventListener('mousemove', onMouseMove)
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


function loadModel() {
const gltfLoader = new GLTFLoader();
const group = new THREE.Group();
gltfLoader.load('/three/poly2.glb', (gltf) => {
  gltf.scene.name = 'gltfModel';
  // gltf.scene.rotateX(Math.PI/ 8);

  // const boxBoundaries = new THREE.Box3().setFromObject(gltf.scene);
  // const center = new THREE.Vector3();
  // boxBoundaries.getCenter(center);
  // center.y += 0.5;
  // gltf.scene.worldToLocal(center);
  // group.add(gltf.scene)
  scene.add(gltf.scene)
});
}

function init() {
  camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 2);
  camera.position.y = 1.2;
  camera.position.z = 1.2;

  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0, 0, 0 );

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  // scene.add(ambientLight)

  const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
  pointLight1.position.set( 500, 500, 500 );
  scene.add( pointLight1 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );

  effect = new AsciiEffect( renderer, '   .:-+*=%@#', { invert: true } );
  effect.setSize( width, height );
  // effect.domElement.style.color = '#4583B2';
  effect.domElement.style.color = 'rgb(148 163 184)';

  // effect.domElement.style.backgroundColor = "#020617";
  asciiEffectContainer.value.appendChild( effect.domElement );
  // window.addEventListener( 'resize', onWindowResize );

}

// function onWindowResize() {

//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();

//   renderer.setSize( width, height );
//   effect.setSize( width, height );

// }

//



// function animate() {
// let scenePosition = 0;
// let direction = 1; 

// function render() {
// const gltfModelGroup = scene.getObjectByName('gltfModel');
// if (gltfModelGroup) {
//   const gltfModel = gltfModelGroup.children[0];

//   // Check if the target rotation has changed
//   if (cachedTargetQuaternion.x !== pointer.x || cachedTargetQuaternion.y !== pointer.y) {
//     cachedTargetQuaternion.setFromEuler(new THREE.Euler(pointer.y, pointer.x, 0, 'XYZ'));
//   }

//   // Apply cached target rotation
//   gltfModel.quaternion.slerp(cachedTargetQuaternion, 0.1);

//   // Apply back and forth animation to the scene along the x-axis
//   const maxPosition = 0.5;  // Maximum position for the animation
//   const speed = 0.0005;       // Animation speed
//   scenePosition += direction * speed;

//   if (Math.abs(scenePosition) >= maxPosition) {
//     direction *= -1;  // Reverse direction
// }

//   scene.rotation.y = scenePosition;

//   effect.render(scene, camera);
// }

//   requestAnimationFrame(render);
// }

//   render();
// }

function animate() {
  let scenePosition = 0;
  let direction = 1;
  let lastRenderTime = performance.now();

  const cachedTargetQuaternion = new THREE.Quaternion();
  const maxPosition = 0.5;
  const speed = 0.0005;
  const frameRate = 10; // Desired frame rate (e.g., 30 frames per second)

  function render(currentTime) {
    const deltaTime = currentTime - lastRenderTime;

    if (deltaTime > 1000 / frameRate) {
      lastRenderTime = currentTime;

      const gltfModelGroup = scene.getObjectByName('gltfModel');

      if (gltfModelGroup) {
        const gltfModel = gltfModelGroup.children[0];

        if (gltfModel) {
          cachedTargetQuaternion.setFromEuler(new THREE.Euler(pointer.y, pointer.x, 0, 'XYZ'));
          // pointer.hasChanged = false;
        }

        gltfModel.quaternion.slerp(cachedTargetQuaternion, 0.1);

        scenePosition += direction * speed;
        if (Math.abs(scenePosition) >= maxPosition) {
          direction *= -1;
        }

        scene.rotation.y = scenePosition;

        effect.render(scene, camera);
      }
    }

    requestAnimationFrame(render);
  }

  render(performance.now());
}




// function render() {
//   requestAnimationFrame(render);
//   effect.render(scene, camera);
// }
</script>