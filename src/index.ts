// webpack
import "../res/style/index.css";
import fragmentShader = require("../res/shaders/fragmentShader.glsl");
import vertexShader = require("../res/shaders/vertexShader.glsl");
// npm
import * as THREE from "three";
import Stats = require("stats.js");
// own
import * as Gui from "./gui";
import {RenderController} from "./render"
import {ThreeEnv, Input} from "./interfaces";


function getInitialInput(): Input {
  const standard: Input = {
    totalLines: 200,
    multiplier: 2,
    animate: false,
    multiplierIncrement: 0.2,
    opacity: 1,
    colorMethod: 'lengthHue',
    camPosX: 0,
    camPosY: 0,
    camZoom: 1,
    resetCamera: () => {
    }
  };

  const benchmark: Input = {
    totalLines: 250000,
    multiplier: 100000,
    animate: false,
    multiplierIncrement: 1,
    opacity: 0.005,
    colorMethod: 'faded',
    camPosX: 0,
    camPosY: 0,
    camZoom: 1,
    resetCamera: () => {
    }
  };

  const debug: Input = {
    totalLines: 10,
    multiplier: 2,
    animate: false,
    multiplierIncrement: 0.005,
    opacity: 1,
    colorMethod: 'faded',
    camPosX: 0,
    camPosY: 0,
    camZoom: 1,
    resetCamera: () => {
    }
  };

  const initialInputs = {
    standard,
    benchmark,
    debug
  };

  return initialInputs.standard;
}


function init() {
  const stats = new Stats();
  stats.showPanel(1);
  document.body.appendChild(stats.dom);

  const input = getInitialInput();

  const threeEnv = getThreeEnv();

  const renderController = new RenderController(stats, threeEnv, input);

  window.addEventListener('resize', () => renderController.requestRender("resize"));

  Gui.initGUI(input, renderController);

  renderController.requestRender("init");
}

/**
 * Static initialization of render environment
 */
function getThreeEnv(): ThreeEnv {
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
  camera.position.setZ(1);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const geometry = new THREE.BufferGeometry();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      multiplier: {value: 2},
      total: {value: 10},
      opacity: {value: 1},
      colorMethod: {value: 0}
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });

  // material.blending = THREE.CustomBlending;
  // material.blendEquation = THREE.MaxEquation; //default
  // material.blendSrc = THREE.SrcAlphaFactor; //default
  // material.blendDst = <any> THREE.OneMinusDstAlphaFactor; //default

  const positions = new Float32Array(0);
  const positionsAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.addAttribute('position', positionsAttribute);

  const colors = new Float32Array(0);
  const colorsAttribute = new THREE.BufferAttribute(colors, 3);
  geometry.addAttribute('color', colorsAttribute);

  const numbers = new Float32Array(0);
  const numbersAttribute = new THREE.BufferAttribute(numbers, 1);
  geometry.addAttribute('number', numbersAttribute);

  const distances = new Float32Array(0);

  const mesh = new THREE.LineSegments(geometry, material);
  // TODO: find out why this is needed with OrthographicCamera and zoom
  mesh.frustumCulled = false;

  scene.add(mesh);

  return {
    renderer,
    scene,
    camera,
    geometry,
    material,
    positionsAttribute,
    colorsAttribute,
    numbersAttribute,
    distances
  };
}

window.onload = init;