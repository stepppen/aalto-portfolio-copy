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



const start = Date.now();
const gltfLoader = new GLTFLoader()
let isAboutPage = false;
const route = useRoute();
let center = new THREE.Vector3();

onMounted(() => {
  isAboutPage = route.path === '/about';
  if (isAboutPage) {
    init();
    loadModel();
    animate();
  }
});

onUnmounted(() => {
  if (isAboutPage) {
    isAboutPage = false;
  }
});


function loadModel() {
  const gltfLoader = new GLTFLoader();
  const group = new THREE.Group();
  gltfLoader.load('/three/poly.glb', (gltf) => {
    gltf.scene.name = 'gltfModel';
    // gltf.scene.rotateX(Math.PI/ 8);

    const boxBoundaries = new THREE.Box3().setFromObject(gltf.scene);
    const center = new THREE.Vector3();
    boxBoundaries.getCenter(center);
    // gltf.scene.position.sub(center);
    center.y += 0.5;
    gltf.scene.worldToLocal(center);

    // const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32); // Adjust size as needed
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for visibility
    // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.copy(center); // Position sphere at pivotal point
    // scene.add(sphere);



    group.add(gltf.scene)
    scene.add(group)
  });
}

// function getPivotPoint(gltfModel) {
//   const box = new THREE.Box3().setFromObject(gltfModel);
//   const center = new THREE.Vector3();
//   box.getCenter(center);
  
//   // If the model has been transformed, transform the center to local space
//   gltfModel.worldToLocal(center);

//   return center;
// }


function init() {

    camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 1000 );
    // camera = new THREE.OrthographicCamera( width / - 2, width, height, height / - 2, 0.1, 100 );
    // camera.rotation.y
    // camera.position.x = 0.03;
    camera.position.y = 1.2;
    camera.position.z = 1.2;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0, 0, 0 );

    // const pointer = new THREE.Vector2();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
    pointLight1.position.set( 500, 500, 500 );
    scene.add( pointLight1 );

    // const pointLight2 = new THREE.PointLight( 0xffffff, 1, 0, 0 );
    // pointLight2.position.set( - 500, - 500, - 500 );
    // scene.add( pointLight2 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );

    effect = new AsciiEffect( renderer, '   .:-+*=%@#', { invert: true } );
    // effect = new AsciiEffect( renderer, '  .-oz@#', { invert: true } );
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
    const onMouseMove = (event) => {
        pointer.x = ((event.clientX / width) - 1.5) / 3;
        pointer.z = ((event.clientY / height) - 1) / 3;
    };
    window.addEventListener('mousemove', onMouseMove);

    function render() {
        const gltfModelGroup = scene.getObjectByName('gltfModel');
        if (gltfModelGroup) {
            const gltfModel = gltfModelGroup.children[0];
            const targetRotation = {
                y: pointer.x,
                // x: pointer.z
            };
            // Apply easing to the rotation
            // gltfModel.rotation.x = MathUtils.lerp(gltfModel.rotation.x, targetRotation.x, 0.1); 
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
        requestAnimationFrame(render); // Call requestAnimationFrame inside render
        // let gltfModel = scene.getObjectByName('gltfModel');
    }

    render();
}

// function render() {
//     effect.render( scene, camera );

// }
</script>