export type ColorMethod = 'solid' | 'faded' | 'lengthOpacity' | 'lengthHue';

export interface ThreeEnv {
  readonly renderer: THREE.WebGLRenderer,
  readonly scene: THREE.Scene,
  readonly camera: THREE.OrthographicCamera,
  readonly geometry: THREE.BufferGeometry,
  readonly material: THREE.ShaderMaterial,
  positionsAttribute: THREE.BufferAttribute,
  colorsAttribute: THREE.BufferAttribute,
  numbersAttribute: THREE.BufferAttribute,
  distances: Float32Array
}

export interface Input {
  totalLines: number,
  multiplier: number,
  animate: boolean,
  multiplierIncrement: number,
  opacity: number,
  colorMethod: ColorMethod,
  recolor: boolean,
  camPosX: number,
  camPosY: number,
  camZoom: number,
  resetCamera: () => void
}