import * as THREE from './node_modules/three/build/three.module.js';
import { GLTFLoader } from './node_modules/three/addons/loaders/GLTFLoader.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a light source
var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

// Load the dog model
var loader = new GLTFLoader();
loader.load(
  'dog_model.glb',
  function (gltf) {
    // Retrieve the dog mesh from the loaded model
    var dog = gltf.scene;
    scene.add(dog);
  },
  undefined,
  function (error) {
    console.error('Error loading GLB model:', error);
  }
);

// Adjust the camera position based on the slider value
function updateCameraPosition() {
  var distance = parseFloat(document.getElementById('distanceSlider').value);
  camera.position.z = distance;
}

// Render the scene
function render() {
  updateCameraPosition();
  renderer.render(scene, camera);
}

// Initialize the slider event listener and start rendering
window.addEventListener('load', function () {
  var slider = document.getElementById('distanceSlider');
  slider.addEventListener('input', render);
  render();
});
