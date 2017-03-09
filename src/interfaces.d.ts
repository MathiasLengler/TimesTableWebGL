export type ColorMethod = 'solid' | 'faded' | 'lengthOpacity' | 'lengthHue';

export type UpdateSource = keyof Input | "init" | "resize"

export interface ThreeEnv {
  renderer: THREE.WebGLRenderer,
  readonly renderContainer: Node,
  readonly scene: THREE.Scene,
  readonly camera: THREE.OrthographicCamera,
  readonly geometry: THREE.BufferGeometry,
  readonly material: THREE.ShaderMaterial,
  readonly positionsAttribute: THREE.BufferAttribute,
  readonly colorsAttribute: THREE.BufferAttribute,
  readonly numbersAttribute: THREE.BufferAttribute,
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
