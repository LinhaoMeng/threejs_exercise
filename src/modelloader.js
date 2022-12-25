import * as THREE from 'three';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import './main.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;
const canvas = renderer.domElement;
canvas.setAttribute('id', 'c');
document.body.appendChild(canvas);

camera.position.set(0, 1, 5);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.update();

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axisHelper = new THREE.AxesHelper(10);
scene.add(axisHelper);


const loader = new GLTFLoader();

loader.load('resources/shiba.glb', function (gltf) {
  gltf.scene.position.y = 1;
  scene.add(gltf.scene);

  camera.lookAt(gltf.scene.position);
  console.log('added')

}, undefined, function (error) {

  console.error(error);

});


function animate() {
  requestAnimationFrame(animate);

  if (checkdisplayresize()) {
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
}

animate();

function checkdisplayresize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const isresize = width !== canvas.width || height !== canvas.height;
  if (isresize) {
    renderer.setSize(width, height, false);
  }
  return isresize;
}