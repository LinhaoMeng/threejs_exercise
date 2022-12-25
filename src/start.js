import * as THREE from 'three';
import './main.css';
import {
  GUI
} from 'three/addons/libs/lil-gui.module.min.js';


// const canvas = document.createElement('canvas');
// canvas.id = 'mycanvas';
// document.body.appendChild(canvas);

const canvas = document.querySelector('#c');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas
});
//renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);

const cubes = [];
const planes = [];
//===============textures================//
const loader = new THREE.TextureLoader();

loader.load('resources/mip-low-res-enlarged.png', (texture) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  })
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = -2;
  cubes.push(cube);
  scene.add(cube);
})

const texture = loader.load('resources/mip-low-res-enlarged.png', (texture) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  })
  const planegeometry = new THREE.PlaneGeometry(1, 20, 1, 10);
  const plane = new THREE.Mesh(planegeometry, material);
  plane.position.set(0, 0, -10);
  plane.rotateX(1.4);
  scene.add(plane);
  planes.push(plane);
})

texture.repeat.y = 10;
texture.wrapT = THREE.RepeatWrapping;

const loadManager = new THREE.LoadingManager();
const loader2 = new THREE.TextureLoader(loadManager);
const imagematerials = [
  new THREE.MeshBasicMaterial({
    map: loader2.load('resources/doraemon.jpeg'),
  }),
  new THREE.MeshBasicMaterial({
    map: loader2.load('resources/flower.jpg'),
  }),
  new THREE.MeshBasicMaterial({
    map: loader2.load('resources/china.jpg'),
  }),
  new THREE.MeshBasicMaterial({
    map: loader2.load('resources/mountain.jpg'),
  }),
  new THREE.MeshBasicMaterial({
    map: loader2.load('resources/sunrise.jpg'),
  }),
  new THREE.MeshBasicMaterial({
    map: loader2.load('resources/doraemon.jpeg'),
  }),
];

const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

loadManager.onLoad = () => {
  loadingElem.style.display = 'none';
  const cube = new THREE.Mesh(geometry, imagematerials);
  cube.position.x = 2;
  cubes.push(cube);
  scene.add(cube);
}
loadManager.onProgress = (urlOfLastItemLoader, itemsLoaded, itemsTotal) => {
  console.log(urlOfLastItemLoader, itemsLoaded);
  const progress = itemsLoaded / itemsTotal;
  progressBarElem.style.transform = `scaleX(${progress})`;
}
//=======================================//

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({
  color: 0x44aa88
});
const cube = new THREE.Mesh(geometry, material);
cube.position.x = -4;
cubes.push(cube);
scene.add(cube);

const linematerial = new THREE.LineBasicMaterial({
  color: 0xff0000
});
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 0, 0));
points.push(new THREE.Vector3(10, 0, 0));
const linegeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(linegeometry, linematerial);
scene.add(line);

camera.position.set(0, 0, 5);

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 4, 4);
scene.add(light);

renderer.render(scene, camera);

function animate(time) {
  time *= 0.001; // time is default parameter for callback in requestAnimationFrame(in milliseconds)
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix(); //Updates the camera projection matrix. Must be called after any change of parameters.
  }

  planes.forEach((plane) => {
    plane.rotation.x = (time * 1000) % 4000 <= 2000 ? 1.3 + 0.2 / 2000 * (time * 1000 % 4000) : 1.5 - 0.2 / 2000 * ((time * 1000 - 2000) % 4000);
  })

  cubes.forEach((cube, i) => {
    cube.rotation.x = time + i;
    cube.rotation.y = time + i;
  })
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  //console.log(pixelRatio);
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    console.log('resize')
    renderer.setSize(width, height, false);
  }
  return needResize;
}

//========================gui=========================//

class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop]);
  }
  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v);
  }
}

class StringToNumberHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return this.obj[this.prop];
  }
  set value(v) {
    this.obj[this.prop] = parseFloat(v);
  }
}

const wrapModes = {
  'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
  'RepeatWrapping': THREE.RepeatWrapping,
  'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping,
};

const magFilters = {
  'NearestFilter': THREE.NearestFilter,
  'LinearFilter': THREE.LinearFilter,
};

const minFilters = {
  'NearestFilter': THREE.NearestFilter,
  'LinearFilter': THREE.LinearFilter,
  'NearestMipmapNearestFilter': THREE.NearestMipmapNearestFilter,
  'NearestMipmapLinearFilter': THREE.NearestMipmapLinearFilter,
  'LinearMipmapNearestFilter': THREE.LinearMipMapNearestFilter,
  'LinearMipmapLinearFilter': THREE.LinearMipmapLinearFilter,
}

function updateTexture() {
  texture.needsUpdate = true;
}

const gui = new GUI();
gui.add(new StringToNumberHelper(texture, 'magFilter'), 'value', magFilters).name('texture.magFilter').onChange(updateTexture);;
gui.add(new StringToNumberHelper(texture, 'minFilter'), 'value', minFilters).name('texture.minFilter').onChange(updateTexture);
gui.add(new StringToNumberHelper(texture, 'wrapS'), 'value', wrapModes)
  .name('texture.wrapS')
  .onChange(updateTexture);
gui.add(new StringToNumberHelper(texture, 'wrapT'), 'value', wrapModes)
  .name('texture.wrapT')
  .onChange(updateTexture);
gui.add(texture.repeat, 'x', 0, 40, .01).name('texture.repeat.x');
gui.add(texture.repeat, 'y', 0, 40, .01).name('texture.repeat.y');
gui.add(texture.offset, 'x', -2, 2, .01).name('texture.offset.x');
gui.add(texture.offset, 'y', -2, 2, .01).name('texture.offset.y');
gui.add(texture.center, 'x', -.5, 1.5, .01).name('texture.center.x');
gui.add(texture.center, 'y', -.5, 1.5, .01).name('texture.center.y');
gui.add(new DegRadHelper(texture, 'rotation'), 'value', -360, 360)
  .name('texture.rotation');