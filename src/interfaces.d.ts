import * as THREE from 'three';

export type ColorMethod = 'solid' | 'faded' | 'lengthOpacity' | 'lengthHue';

export type UpdateSource = keyof Input | "init" | "resize"

export type RenderContainer = HTMLElement;

export interface ThreeEnv {
  renderer: THREE.WebGLRenderer,
  readonly scene: THREE.Scene,
  readonly camera: THREE.OrthographicCamera,
  readonly geometry: THREE.BufferGeometry,
  readonly material: THREE.ShaderMaterial,
}

export interface Input {
  totalLines: number,
  multiplier: number,
  animate: boolean,
  multiplierIncrement: number,
  opacity: number,
  colorMethod: ColorMethod,
  noiseStrength: number,
  antialias: boolean,
  camPosX: number,
  camPosY: number,
  camZoom: number,
  resetCamera: () => void
}
