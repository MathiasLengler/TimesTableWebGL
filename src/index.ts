// webpack
import "../res/style/index.css";
import "../node_modules/dat.gui/build/dat.gui.js";
import fragmentShader = require("../res/shaders/fragmentShader.glsl");
import vertexShader = require("../res/shaders/vertexShader.glsl");
// npm
import THREE = require("three");
import Stats = require("stats.js");
// own
import * as Gui from "./gui";
import {ThreeEnv} from "./render";
import {RenderController} from "./render"
import {Input} from "./gui";


function getInitialInput(): Input {

    const standard: Input = {
        totalLines: 200,
        multiplier: 2,
        animate: false,
        multiplierIncrement: 0.2,
        opacity: 1,
        colorMethod: 'lengthHue',
        recolor: true,
        camPosX: 0,
        camPosY: 0,
        camPosZ: 1,
        resetCamera: () => {}
    };

    const benchmark: Input = {
        totalLines: 250000,
        multiplier: 100000,
        animate: false,
        multiplierIncrement: 1,
        opacity: 0.005,
        colorMethod: 'faded',
        recolor: false,
        camPosX: 0,
        camPosY: 0,
        camPosZ: 1,
        resetCamera: () => {}
    };

    const debug: Input = {
        totalLines: 4,
        multiplier: 2,
        animate: false,
        multiplierIncrement: 0.005,
        opacity: 1,
        colorMethod: 'faded',
        recolor: false,
        camPosX: 0,
        camPosY: 0,
        camPosZ: 1,
        resetCamera: () => {}
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

    window.addEventListener('resize', () => onWindowResize(renderController, threeEnv));

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

    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 500);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
        uniforms: {
            multiplier: {value: 2.0}
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true
    });

    const positions = new Float32Array(0);
    const colors = new Float32Array(0);
    const distances = new Float32Array(0);

    const positionsAttribute = new THREE.BufferAttribute(positions, 3);
    const colorsAttribute = new THREE.BufferAttribute(colors, 3);
    geometry.addAttribute('position', positionsAttribute);
    geometry.addAttribute('color', colorsAttribute);


    const mesh = new THREE.LineSegments(geometry, material);

    scene.add(mesh);

    return {renderer, scene, camera, geometry, material, positionsAttribute, colorsAttribute, distances};
}

function onWindowResize(renderController: RenderController, threeEnv: ThreeEnv) {
    threeEnv.camera.aspect = window.innerWidth / window.innerHeight;
    threeEnv.camera.updateProjectionMatrix();

    threeEnv.renderer.setSize(window.innerWidth, window.innerHeight);

    renderController.requestRender("resize");
}

window.onload = init;