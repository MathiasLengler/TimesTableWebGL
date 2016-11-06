// webpack
import "../assets/index.css";
import "../node_modules/dat.gui/build/dat.gui.js";
// npm
import THREE = require("three");
import Stats = require("stats.js");
// own
import * as Gui from "./gui";
import * as Render from "./render";
import {ThreeEnv} from "./render";
import {Input} from "./gui";


interface RenderFunction {
    (threeEnv: ThreeEnv, input: Input): void;
}

export class RenderController {
    private waitOnUpdate = false;
    private hasChanged: {
        [source: string]: boolean
    } = {};

    private readonly renderMethod: RenderFunction;
    private readonly stats: Stats;
    private readonly threeEnv: ThreeEnv;
    private readonly input: Input;

    constructor(renderMethod: RenderFunction, stats: Stats, threeEnv: ThreeEnv, input: Input) {
        this.renderMethod = renderMethod;
        this.stats = stats;
        this.threeEnv = threeEnv;
        this.input = input;
    }

    public requestRender(source: string) {
        this.hasChanged[source] = true;

        if (!this.waitOnUpdate) {
            this.waitOnUpdate = true;
            requestAnimationFrame(() => this.render());
        }
    }

    private render() {
        this.stats.begin();

        console.log(this.hasChanged);

        this.waitOnUpdate = false;

        if (this.hasChanged["totalLines"]) {
            Render.updateTotalLines(this.threeEnv, this.input.totalLines);
        }

        if (this.hasChanged["camPosX"] ||
            this.hasChanged["camPosY"] ||
            this.hasChanged["camPosZ"]) {
            Render.updateCamera(this.threeEnv, this.input.camPosX, this.input.camPosY, this.input.camPosZ);
        }

        if (this.hasChanged["opacity"]) {
            Render.updateOpacity(this.threeEnv, this.input.opacity);
        }

        // Execute main render
        this.renderMethod(this.threeEnv, this.input);

        this.hasChanged = {};

        if (this.input.animate) {
            this.input.multiplier += this.input.multiplierIncrement;
            this.requestRender("multiplier");
        }

        this.stats.end();
    }
}

function getInitialInput() {
    return {
        totalLines: 200,
        multiplier: 2,
        animate: false,
        multiplierIncrement: 0.005,
        colorLength: true,
        opacity: 1,
        camPosX: 0,
        camPosY: 0,
        camPosZ: 1
    }
};


function init() {
    let stats = new Stats();
    stats.showPanel(1);
    document.body.appendChild(stats.dom);

    let input = getInitialInput();

    const threeEnv = initRenderer(input);

    let renderController: RenderController =
        new RenderController(Render.render, stats, threeEnv, input);

    window.addEventListener('resize', () => onWindowResize(renderController, threeEnv));

    Gui.initGUI(input, renderController);

    renderController.requestRender("init");
}


function initRenderer(input: Input): ThreeEnv {
    let renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 500);
    camera.position.set(input.camPosX, input.camPosY, input.camPosZ);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let geometry = new THREE.BufferGeometry();
    let material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: input.opacity
    });

    var {positions, colors} = Render.createPosColorArrays(input.totalLines);

    var positionsAttribute = new THREE.BufferAttribute(positions, 3);
    var colorsAttribute = new THREE.BufferAttribute(colors, 3);
    geometry.addAttribute('position', positionsAttribute);
    geometry.addAttribute('color', colorsAttribute);

    var mesh = new THREE.LineSegments(geometry, material);

    scene.add(mesh);

    return {renderer, scene, camera, geometry, material, positionsAttribute, colorsAttribute};
}

function onWindowResize(renderController: RenderController, threeEnv: ThreeEnv) {
    threeEnv.camera.aspect = window.innerWidth / window.innerHeight;
    threeEnv.camera.updateProjectionMatrix();

    threeEnv.renderer.setSize(window.innerWidth, window.innerHeight);

    renderController.requestRender("resize");
}

window.onload = init;