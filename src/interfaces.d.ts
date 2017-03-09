export type ColorMethod = 'solid' | 'faded' | 'lengthOpacity' | 'lengthHue';

export type UpdateSource = keyof Input | "init" | "resize"

export interface ThreeEnv {
  readonly renderer: THREE.WebGLRenderer,
  readonly scene: THREE.Scene,
  readonly camera: THREE.OrthographicCamera,
  readonly geometry: THREE.BufferGeometry,
  readonly material: THREE.ShaderMaterial,
  positionsAttribute: THREE.BufferAttribute,
  colorsAttribute: THREE.BufferAttribute,
  numbersAttribute: THREE.BufferAttribute,
}

export interface Input {
  totalLines: number,
  multiplier: number,
  animate: boolean,
  multiplierIncrement: number,
  opacity: number,
  colorMethod: ColorMethod,
  noiseStrength: number,
  camPosX: number,
  camPosY: number,
  camZoom: number,
  resetCamera: () => void
}
