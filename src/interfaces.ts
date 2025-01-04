import * as THREE from "three";
import type { EffectComposer, MapControls } from "three/addons";

export type ColorMethod = "solid" | "faded" | "lengthOpacity" | "lengthHue" | "indexHue" | "fadedIndexHue";

export type ToneMappingLabel = "No" | "Linear" | "Reinhard" | "Cineon" | "ACESFilmic" | "AgX" | "Neutral";

export type RenderTargetTypeLabel = "UnsignedByte" | "HalfFloat" | "Float";

export type UpdateSource = keyof Input | "resize" | "controls";

export type RenderContainer = HTMLElement;

export interface LineMaterialUniforms {
    multiplier: { value: number };
    total: { value: number };
    opacity: { value: number };
    colorMethod: { value: number };
}

export type LineMaterial = THREE.ShaderMaterial & {
    uniforms: LineMaterialUniforms;
};

export interface ThreeEnv {
    renderer: THREE.WebGLRenderer;
    readonly scene: THREE.Scene;
    readonly camera: THREE.OrthographicCamera;
    readonly controls: MapControls;
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
    samples: number;
    toneMapping: ToneMappingLabel;
    toneMappingExposure: number;
    renderTargetType: RenderTargetTypeLabel;
    camPosX: number;
    camPosY: number;
    camZoom: number;

    resetCamera: () => void;
}
