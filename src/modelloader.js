import * as THREE from 'three';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 2);

const loader = new GLTFLoader();

loader.load('resources/shiba.glb', function (gltf) {

  scene.add(gltf.scene);
  console.log('added')

}, undefined, function (error) {

  console.error(error);

});

renderer.render(scene, camera);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();