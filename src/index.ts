import fragmentShader from "../res/shaders/fragmentShader.glsl";
import vertexShader from "../res/shaders/vertexShader.glsl";
import "../res/style/index.css";
import * as THREE from "three";
import { EffectComposer, MapControls, OutputPass, RenderPass } from "three/addons";
import * as Gui from "./gui";
import type {
    Input,
    LineMaterial,
    LineMaterialUniforms,
    RenderContainer,
    RenderTargetTypeLabel,
    ThreeEnv,
} from "./interfaces";
import { RenderController } from "./render";
import assertNever from "assert-never";

function getInitialInput(): Input {
    const standard: Input = {
        totalLines: 200,
        multiplier: 2,
        animate: false,
        multiplierIncrement: 0.2,
        opacity: 1,
        colorMethod: "lengthHue",
        noiseStrength: 0.0,
        samples: 4,
        toneMapping: "Neutral",
        toneMappingExposure: 1.0,
        renderTargetType: "HalfFloat",
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
        opacity: 0.1,
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
        opacity: 0.2,
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

    const threeEnv = getThreeEnv(input);

    const renderContainer = initRenderContainer(threeEnv.renderer);

    const renderController = new RenderController(threeEnv, input, renderContainer);

    window.addEventListener("resize", () => renderController.requestRender("resize"));

    threeEnv.controls.addEventListener("change", () => {
        renderController.requestRender("controls");
    });

    Gui.initGUI(input, renderController, renderContainer, threeEnv.renderer.capabilities.maxSamples);

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
function getThreeEnv(_input: Input): ThreeEnv {
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
    camera.position.setY(10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxTargetRadius = 1;

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
        linewidth: 0,
    }) as LineMaterial;

    const lines = getLines(getGeometry(0), material);
    scene.add(lines);

    // TODO: add toggle
    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    const renderTarget = getRenderTarget(renderer, 0, "UnsignedByte");

    const composer = new EffectComposer(renderer, renderTarget);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    return {
        renderer,
        scene,
        camera,
        controls,
        material,
        lines,
        composer,
    };
}

export function getGeometry(totalLines: number): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    const vertices = totalLines * 2;

    // Performance optimization: we don't need to set the position attribute,
    // since the vertex shader makes use of `gl_VertexID` to determine the line position.
    // Previously, we needed to allocate a buffer whenever the total number of lines changed.
    // Setting the draw range is enough to trigger the required `gl.drawArrays` call.
    // References:
    //  https://webgl2fundamentals.org/webgl/lessons/webgl-drawing-without-data.html
    //  https://github.com/mrdoob/three.js/blob/f30af844f4fe3300e1ddc75dcbad25988705c1c2/src/renderers/webgl/WebGLBufferRenderer.js#L13
    //  https://github.com/mrdoob/three.js/blob/f30af844f4fe3300e1ddc75dcbad25988705c1c2/src/renderers/WebGLRenderer.js#L912
    //  https://github.com/mrdoob/three.js/blob/f30af844f4fe3300e1ddc75dcbad25988705c1c2/src/renderers/WebGLRenderer.js#L777
    geometry.setDrawRange(0, vertices);

    return geometry;
}

export function getLines(geometry: THREE.BufferGeometry, material: THREE.ShaderMaterial): THREE.LineSegments {
    const lines = new THREE.LineSegments(geometry, material);
    lines.frustumCulled = false;
    return lines;
}

export function getRenderTargetSize(renderer: THREE.WebGLRenderer) {
    return renderer.getDrawingBufferSize(new THREE.Vector2());
}

export function getRenderTarget(
    renderer: THREE.WebGLRenderer,
    samples: number,
    renderTargetType: RenderTargetTypeLabel,
) {
    const renderTargetSize = getRenderTargetSize(renderer);
    let type: THREE.TextureDataType;
    switch (renderTargetType) {
        case "UnsignedByte":
            type = THREE.UnsignedByteType;
            break;
        case "HalfFloat":
            type = THREE.HalfFloatType;
            break;
        case "Float":
            type = THREE.FloatType;
            break;
        default:
            assertNever(renderTargetType);
    }
    const renderTarget = new THREE.WebGLRenderTarget(renderTargetSize.width, renderTargetSize.height, {
        format: THREE.RGBAFormat,
        type,
    });
    renderTarget.samples = samples;
    return renderTarget;
}

init();
