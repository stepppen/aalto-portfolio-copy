<template>
    <div ref="asciiEffectContainer"></div>
</template>
<script setup>
import * as THREE from 'three';
import { MathUtils } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

const asciiEffectContainer = ref(null);

let camera, scene, renderer, effect;
let width = window.innerWidth;
let height = window.innerHeight;
let speed = 0.1
let whereTo = 2
const easingFactor = 0.05;
let pointer = { x: 0, y: 0 };
let targetRotation = { x: 0, z: 0 }
let rotationIncrementMouse = 0;
let rotationIncrementConstant = 0.0001;
let constantRotationDirection = 1;
let directionSwitched = false;

const start = Date.now();
const gltfLoader = new GLTFLoader()
let isLandingPage = false;
const route = useRoute();
let center = new THREE.Vector3();

onMounted(() => {
  isLandingPage = route.path === '/';
  if (isLandingPage) {
    init();
    loadModel();
    animate();
  }
});

onUnmounted(() => {
  if (isLandingPage) {
    isLandingPage = false;
  }
});

// init();
// animate();
function loadModel() {
  const gltfLoader = new GLTFLoader();
  const group = new THREE.Group();
  gltfLoader.load('/three/abstract.glb', (gltf) => {
    gltf.scene.name = 'gltfModel';
    gltf.scene.rotateY(-(Math.PI/4));
    // const boxBoundaries = new THREE.Box3().setFromObject(gltf.scene);
    // const center = new THREE.Vector3();
    // boxBoundaries.getCenter(center);
    // // gltf.scene.position.sub(center);
    // center.y += 0.5;
    // gltf.scene.worldToLocal(center);
    // group.add(gltf.scene)
    scene.add(gltf.scene)
  });
}


function init() {

    camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    camera.position.y = 0;
    camera.position.z = 5;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0, 0, 0 );


    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    // const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
    // pointLight1.position.set( 500, 500, 500 );
    // scene.add( pointLight1 );

    const pointLight2 = new THREE.PointLight( 0xffffff, 1, 0, 0 );
    pointLight2.position.set( - 500, - 500, - 500 );
    scene.add( pointLight2 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );

    effect = new AsciiEffect( renderer, '  .:-+*=%@#', { invert: true } );
    effect.setSize( width, height );
    effect.domElement.style.color = '#4583B2';
    // effect.domElement.style.backgroundColor = 'black';
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
  // const pointer = new THREE.Vector2();
  const onMouseMove = (event) => {
      pointer.x = ((event.clientX / width)-1.5)/4;
      pointer.y = ((event.clientY / height)-0.5)/4;

  }
  window.addEventListener('mousemove', onMouseMove)

  function render(){
    const gltfModelGroup = scene.getObjectByName('gltfModel');
    if (gltfModelGroup) {
    const gltfModel = gltfModelGroup.children[0];
      const targetRotation = {
        x: pointer.y,
        y: pointer.x
      };
      gltfModel.rotation.x = MathUtils.lerp(gltfModel.rotation.x, targetRotation.x, 0.1); 
      gltfModel.rotation.y = MathUtils.lerp(gltfModel.rotation.y, targetRotation.y, 0.1); 

      // Accumulate constant rotation increment
      rotationIncrementMouse += rotationIncrementConstant * constantRotationDirection;
      
      // Check if rotationIncrementMouse crosses the threshold of 0.05 and direction hasn't been switched yet
      if (Math.abs(rotationIncrementMouse) >= 0.05 && !directionSwitched) {
          // Change direction of constant rotation
          constantRotationDirection *= -1;
          directionSwitched = true; // Update flag to indicate direction switch
      } else if (Math.abs(rotationIncrementMouse) < 0.05) {
          directionSwitched = false; // Reset flag if rotationIncrementMouse goes below threshold
      }
          gltfModel.rotation.y += rotationIncrementMouse;
      }
      
      effect.render(scene, camera);
      requestAnimationFrame(render);
  }

  render();

}

</script>