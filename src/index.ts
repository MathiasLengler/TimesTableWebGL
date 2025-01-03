// webpack
import "../res/style/index.css";
import fragmentShader from "../res/shaders/fragmentShader.glsl";
import vertexShader from "../res/shaders/vertexShader.glsl";
// npm
import * as THREE from "three";
// own
import * as Gui from "./gui";
import { RenderController } from "./render";
import type { Input, LineMaterial, LineMaterialUniforms, RenderContainer, ThreeEnv } from "./interfaces";
import { EffectComposer, RenderPass, ShaderPass, CopyShader } from "three/addons";
import { getRenderTarget } from "./updateActions";

function getInitialInput(): Input {
    const standard: Input = {
        totalLines: 200,
        multiplier: 2,
        animate: false,
        multiplierIncrement: 0.2,
        opacity: 1,
        colorMethod: "lengthHue",
        noiseStrength: 0.5,
        samples: 4,
        camPosX: 0,
        camPosY: 0,
        camZoom: 1,
        resetCamera: () => {
            // a function indicates a button in dat.gui
            // the actual logic is defined via `onChange`
        },
    };

    const benchmark: Input = {
        ...standard,
        totalLines: 250000,
        multiplier: 100000,
        multiplierIncrement: 1,
        opacity: 0.005,
        colorMethod: "faded",
    };

    const debug: Input = {
        ...standard,
        totalLines: 10,
        multiplier: 2,
        multiplierIncrement: 0.005,
        colorMethod: "faded",
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
        debugBlending,
    };

    return initialInputs.standard;
}

function init() {
    const input = getInitialInput();

    const threeEnv = getThreeEnv();

    const renderContainer = initRenderContainer(threeEnv.renderer);

    const renderController = new RenderController(threeEnv, input, renderContainer);

    window.addEventListener("resize", () => renderController.requestRender("resize"));

    Gui.initGUI(
        input,
        renderController,
        renderContainer,
        // Undocumented in three.js documentation and type definition
        threeEnv.renderer.capabilities.maxSamples || 4,
    );

    renderController.requestRender("init");
}

function initRenderContainer(renderer: THREE.WebGLRenderer): RenderContainer {
    const renderContainer = document.createElement("div");
    renderContainer.id = "render-container";
    document.body.appendChild(renderContainer);

    renderContainer.appendChild(renderer.domElement);

    return renderContainer;
}

/**
 * Static initialization of render environment
 */
function getThreeEnv(): ThreeEnv {
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
    camera.position.setZ(1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            multiplier: { value: 0 },
            total: { value: 0 },
            opacity: { value: 0 },
            colorMethod: { value: 0 },
            noiseStrength: { value: 0 },
        } satisfies LineMaterialUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        depthTest: false,
        transparent: true,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneFactor,
    }) as LineMaterial;

    const lines = getLines(getGeometry(0), material);

    scene.add(lines);
    const renderTarget = getRenderTarget(renderer, 4);

    const composer = new EffectComposer(renderer, renderTarget);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const copyPass = new ShaderPass(CopyShader);
    composer.addPass(copyPass);

    return {
        renderer,
        scene,
        camera,
        material,
        lines,
        composer,
    };
}

export function getGeometry(totalLines: number): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    // We use position attributes as parameters for the vertex shader
    // because THREE.js seems to expect a position attribute in every BufferAttribute.
    // Position attribute format:
    //  x - index
    //  y - isStart (of line) ? 0.0 : 1.0
    //  z - unused
    const vertices = totalLines * 2;
    const positionsLength = vertices * 3;
    const positions = new Float32Array(positionsLength);
    for (let i = 0; i < totalLines; i++) {
        positions[i * 6] = i; // x start
        positions[i * 6 + 1] = 0.0; // y start
        positions[i * 6 + 3] = i; // x end
        positions[i * 6 + 4] = 1.0; // y end
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    return geometry;
}

export function getLines(geometry: THREE.BufferGeometry, material: THREE.ShaderMaterial): THREE.LineSegments {
    const lines = new THREE.LineSegments(geometry, material);
    lines.frustumCulled = false;
    return lines;
}

init();
