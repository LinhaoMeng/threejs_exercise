import * as THREE from 'three';
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import './main.css';
import {
  GUI
} from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;
const canvas = renderer.domElement;
canvas.setAttribute('id', 'c');
document.body.appendChild(canvas);

camera.position.set(0, 1, 5);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.update();

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axisHelper = new THREE.AxesHelper(10);
scene.add(axisHelper);

const cubegeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff
});
const cube = new THREE.Mesh(cubegeometry, material);
cube.position.set(3, 0.5, 0);
scene.add(cube);

const spheregeometry = new THREE.SphereGeometry(0.5);
const sphere = new THREE.Mesh(spheregeometry, material);
sphere.position.set(-1, 0.5, 0);
scene.add(sphere);

const planegeometry = new THREE.PlaneGeometry(8, 8);
const planematerial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planegeometry, planematerial);
plane.rotateX(Math.PI * -0.5);
scene.add(plane);

//================ Test Light=========================//

const color = '#ffffff';
const intensity = 1;
const ambientLight = new THREE.AmbientLight(color, 0.1); // No direction. The AmbientLight effectively just multiplies the material's color by the light's color times the intensity. 环境光
scene.add(ambientLight);

const skycolor = '#0000ff';
const groundcolor = 0xB97A20;
const hemisphereLight = new THREE.HemisphereLight(skycolor, groundcolor, intensity);
scene.add(hemisphereLight);

const directionLight = new THREE.DirectionalLight(color, intensity);
directionLight.position.set(-3, 2, 2);
directionLight.target.position.set(0, 0, 0);
scene.add(directionLight);
scene.add(directionLight.target);

const directionLightHelper = new THREE.DirectionalLightHelper(directionLight);
scene.add(directionLightHelper);

const pointLight = new THREE.PointLight(color, intensity);
pointLight.position.set(2, 2, 3);
scene.add(pointLight);

pointLight.power = 800; //lumens
pointLight.decay = 2;
pointLight.distance = Infinity;

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const spotLight = new THREE.SpotLight(color, intensity, 2, Math.PI / 4);
spotLight.position.set(0, 1, -1);
spotLight.target.position.set(0, 0, 0);
spotLight.penumbra = 0.2;
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

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

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

function updateLight() {
  //directionLight.target.updateMatrixWorld();
  directionLightHelper.update();
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.open();
}

const gui = new GUI();
gui.addColor(new ColorGUIHelper(directionLight, 'color'), 'value').name('color');
makeXYZGUI(gui, directionLight.position, 'position', updateLight);
makeXYZGUI(gui, directionLight.target.position, 'position', updateLight);