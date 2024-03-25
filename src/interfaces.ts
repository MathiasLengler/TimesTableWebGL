import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.ts";

export type ColorMethod = "solid" | "faded" | "lengthOpacity" | "lengthHue" | "indexHue" | "fadedIndexHue";

export type UpdateSource = keyof Input | "init" | "resize";

export type RenderContainer = HTMLElement;

export interface LineMaterialUniforms {
    multiplier: { value: number };
    total: { value: number };
    opacity: { value: number };
    colorMethod: { value: number };
    noise: { value: THREE.DataTexture };
    noiseStrength: { value: number };
}

export type LineMaterial = THREE.ShaderMaterial & {
    uniforms: LineMaterialUniforms;
};

export interface ThreeEnv {
    renderer: THREE.WebGLRenderer;
    readonly scene: THREE.Scene;
    readonly camera: THREE.OrthographicCamera;
    readonly material: LineMaterial;
    lines: THREE.LineSegments;
    composer: EffectComposer;
}

export interface Input {
    totalLines: number;
    multiplier: number;
    animate: boolean;
    multiplierIncrement: number;
    opacity: number;
    colorMethod: ColorMethod;
    noiseStrength: number;
    samples: number;
    camPosX: number;
    camPosY: number;
    camZoom: number;
    resetCamera: () => void;
}
