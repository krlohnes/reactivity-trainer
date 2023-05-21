import * as THREE from './nm/three/build/three.module.js';
import { GLTFLoader } from './nm/three/examples/jsm/loaders/GLTFLoader.js';


var scene, camera, renderer, model, mixer, clock, distanceSlider, modelDropdown;

// Initialize the scene, camera, and renderer
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  window.camera = camera;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  var bgColor = THREE.Color(0x42c8f5);
  scene.background(bgColor);

  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 10);
  scene.add(light);

  distanceSlider = document.getElementById('distanceSlider');
  modelDropdown = document.getElementById('modelDropdown');

  // Load the initial model
  loadModel(modelDropdown.value);

  // Add event listeners
  distanceSlider.addEventListener('input', render);
  modelDropdown.addEventListener('change', onModelChange);

  render();
}

// Load the selected model
function loadModel(modelPath) {
  if (model) {
    scene.remove(model);
  }

  var loader = new GLTFLoader();
  loader.load(
    modelPath,
    function (gltf) {
      model = gltf.scene;

      // Create the animation mixer
      mixer = new THREE.AnimationMixer(model);

      // Play the first animation clip found
      var clips = gltf.animations;
      if (clips && clips.length > 0) {
        var clip = clips[0];
        var action = mixer.clipAction(clip);
        action.play();
      }

      scene.add(model);
      animate();
    },
    undefined,
    function (error) {
      console.error('Error loading model:', error);
    }
  );
}

// Handle model selection change
function onModelChange() {
  var modelPath = modelDropdown.value;
  loadModel(modelPath);
  render();
}

function animate() {
  var mixerUpdateDelta = new THREE.Clock();        
  if(typeof mixer !== "undefined") mixer.update( mixerUpdateDelta.getDelta());
  renderer.setAnimationLoop(render);
}

// Update the camera position based on the slider value
function updateCameraPosition() {
  var distance = parseFloat(distanceSlider.value);
  camera.position.z = distance;
}

// Render the scene
function render() {
  updateCameraPosition();

  // Update the animation mixer
  if (mixer) {
    var delta = clock.getDelta();
    mixer.update(delta);
  }

  renderer.render(scene, camera);
}

// Initialize the app
window.addEventListener('load', function () {
  clock = new THREE.Clock();
  init();
});
