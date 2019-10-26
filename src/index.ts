// webpack
import "../res/style/index.css";
import fragmentShader from "../res/shaders/fragmentShader.glsl";
import vertexShader from "../res/shaders/vertexShader.glsl";
// npm
import * as THREE from "three";
import Stats = require("stats.js");
// own
import * as Gui from "./gui";
import {RenderController} from "./render"
import {ThreeEnv, Input, RenderContainer} from "./interfaces";


function getInitialInput(): Input {
  const standard: Input = {
    totalLines: 200,
    multiplier: 2,
    animate: false,
    multiplierIncrement: 0.2,
    opacity: 1,
    colorMethod: 'lengthHue',
    noiseStrength: 0.5,
    antialias: false,
    camPosX: 0,
    camPosY: 0,
    camZoom: 1,
    resetCamera: () => {
    }
  };

  const benchmark: Input = {
    ...standard,
    totalLines: 250000,
    multiplier: 100000,
    multiplierIncrement: 1,
    opacity: 0.005,
    colorMethod: 'faded',
  };

  const debug: Input = {
    ...standard,
    totalLines: 10,
    multiplier: 2,
    multiplierIncrement: 0.005,
    colorMethod: 'faded',
  };

  const debugBlending: Input = {
    ...standard,
    totalLines: 10000,
    opacity: 0.05,
  };

  const initialInputs = {
    standard,
    benchmark,
    debug,
    debugBlending
  };

  return initialInputs.standard;
}


function init() {
  const stats = new Stats();
  stats.showPanel(1);
  document.body.appendChild(stats.dom);

  const input = getInitialInput();

  const threeEnv = getThreeEnv();

  const renderContainer = getRenderContainer(threeEnv.renderer);

  const renderController = new RenderController(stats, threeEnv, input, renderContainer);

  window.addEventListener('resize', () => renderController.requestRender("resize"));

  Gui.initGUI(input, renderController, renderContainer);

  renderController.requestRender("init");
}

function getRenderContainer(renderer: THREE.WebGLRenderer): RenderContainer {
  const renderContainer = document.createElement("div");
  renderContainer.id = "render-container";
  document.body.appendChild(renderContainer);

  renderContainer.appendChild(renderer.domElement);

  return renderContainer;
}

// TODO: try other kinds of noises
function getRandomNoiseTexture() {
  const width = 1024;
  const data = new Uint8Array(4 * width);
  for (let i = 0; i < width * 4; i++) {
    data[i] = Math.random() * 255 | 0;
  }

  const dataTexture = new THREE.DataTexture(data, width, 1, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping,
    THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.LinearFilter, THREE.LinearFilter);
  dataTexture.needsUpdate = true;
  return dataTexture;
}

/**
 * Static initialization of render environment
 */
function getThreeEnv(): ThreeEnv {
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
  camera.position.setZ(1);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      multiplier: {value: 2},
      total: {value: 10},
      opacity: {value: 1},
      colorMethod: {value: 0},
      noise: {value: getRandomNoiseTexture()},
      noiseStrength: {value: 1}
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });

  material.blending = THREE.CustomBlending;
  material.blendEquation = THREE.AddEquation;
  material.blendSrc = THREE.SrcAlphaFactor;
  material.blendDst = THREE.OneFactor;

  const geometry = new THREE.BufferGeometry();

  setAttributes(geometry, 0);

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
  };
}

export function setAttributes(geometry: THREE.BufferGeometry, totalLines: number) {
  const numbersLength = totalLines * 2;
  const numbers = new Float32Array(numbersLength);
  for (let i = 0; i < numbersLength; i++) {
    numbers[i] = i;
  }
  const numbersAttribute = new THREE.BufferAttribute(numbers, 1);
  geometry.addAttribute('number', numbersAttribute);
}

export function removeAttributes(geometry: THREE.BufferGeometry) {
  geometry.removeAttribute('number').dispose();
}

window.onload = init;