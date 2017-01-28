import THREE = require("three");

import {Input, ColorMethod} from "./gui";
import {Point2D} from "./point2D";

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

export class RenderController {
  private waitOnUpdate = false;
  private hasChanged: {
    [source: string]: boolean
  } = {};

  private readonly stats: Stats;
  private readonly threeEnv: ThreeEnv;
  private readonly input: Input;

  constructor(stats: Stats, threeEnv: ThreeEnv, input: Input) {
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

    // console.log(this.hasChanged);

    this.waitOnUpdate = false;

    this.update();

    render(this.threeEnv);

    this.hasChanged = {};

    this.prepareNextRender();

    this.stats.end();
  }

  private update() {
    if (this.hasChanged["init"]) {
      updateTotalLines(this.threeEnv, this.input.totalLines);
      updateNumbers(this.threeEnv.numbersAttribute, this.input.totalLines);
      updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
      updateCamera(this.threeEnv, this.input.camPosX, this.input.camPosY);
      updateOpacity(this.threeEnv, this.input.opacity);
      updateZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.hasChanged["totalLines"]) {
      updateTotalLines(this.threeEnv, this.input.totalLines);
      updateNumbers(this.threeEnv.numbersAttribute, this.input.totalLines);
      updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
    }

    if (this.hasChanged["multiplier"]) {
      updateMultiplier(this.threeEnv.material, this.input.multiplier);

      if (this.input.recolor) {
        // Only recolor on multiplier update when the color method depends on line length
        if (this.input.colorMethod === "lengthOpacity" ||
          this.input.colorMethod === "lengthHue") {
          updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
        }
      }
    }

    if (this.hasChanged["colorMethod"] ||
      this.hasChanged["recolor"]) {
      updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
    }

    if (this.hasChanged["resetCamera"]) {
      // TODO: update gui
      this.input.camPosX = 0;
      this.input.camPosY = 0;
      this.input.camZoom = 1;
    }

    if (this.hasChanged["resetCamera"] ||
      this.hasChanged["camPosX"] ||
      this.hasChanged["camPosY"]) {
      updateCamera(this.threeEnv, this.input.camPosX, this.input.camPosY);
    }

    if (this.hasChanged["camZoom"]) {
      updateZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.hasChanged["opacity"]) {
      updateOpacity(this.threeEnv, this.input.opacity);
    }
  }

  private prepareNextRender() {
    if (this.input.animate) {
      this.input.multiplier += Math.pow(this.input.multiplierIncrement, 3);
      this.requestRender("multiplier");
    }
  }
}

function getCircleCord(number: number, total: number): Point2D {
  let normalized = (number / total) * 2 * Math.PI;
  return new Point2D(Math.cos(normalized), Math.sin(normalized));
}

function updateNumbers(numbersAttribute: THREE.BufferAttribute, total: number) {
  const numbers = <Float32Array> numbersAttribute.array;

  for (let i = 0; i < total * 2; i++) {
    numbers[i] = i;
  }

  numbersAttribute.needsUpdate = true;
}

function updateMultiplier(material: THREE.ShaderMaterial, multiplier: number) {
  material.uniforms.multiplier.value = multiplier;
  material.needsUpdate = true;
}

// TODO: move calculations to vertex shader because distances is now only available there
function updateColors(colorsAttribute: THREE.BufferAttribute, distances: Float32Array, total: number, colorMethod: ColorMethod) {
  const colors = <Float32Array> colorsAttribute.array;

  switch (colorMethod) {
    case 'solid':
      for (let i = 0; i < total; i++) {
        // colors start point
        colors[i * 6] = 1;
        colors[i * 6 + 1] = 1;
        colors[i * 6 + 2] = 1;
        // colors end point
        colors[i * 6 + 3] = 1;
        colors[i * 6 + 4] = 1;
        colors[i * 6 + 5] = 1;
      }
      break;
    case 'faded':
      for (let i = 0; i < total; i++) {
        // colors start point
        colors[i * 6] = 1;
        colors[i * 6 + 1] = 1;
        colors[i * 6 + 2] = 1;
        // colors end point
        colors[i * 6 + 3] = 0;
        colors[i * 6 + 4] = 0;
        colors[i * 6 + 5] = 0;
      }
      break;
    case 'lengthOpacity':
      for (let i = 0; i < total; i++) {
        const distance = 1 - distances[i] / 2;

        // colors start point
        colors[i * 6] = distance;
        colors[i * 6 + 1] = distance;
        colors[i * 6 + 2] = distance;
        // colors end point
        colors[i * 6 + 3] = distance;
        colors[i * 6 + 4] = distance;
        colors[i * 6 + 5] = distance;
      }
      break;
    case 'lengthHue':
      for (let i = 0; i < total; i++) {
        const {r, g, b} = new THREE.Color().setHSL(distances[i] / 2, 1, 0.5);

        // colors start point
        colors[i * 6] = r;
        colors[i * 6 + 1] = g;
        colors[i * 6 + 2] = b;
        // colors end point
        colors[i * 6 + 3] = r;
        colors[i * 6 + 4] = g;
        colors[i * 6 + 5] = b;
      }
      break;
    default:
      throw "Unexpected ColorValue";
  }

  colorsAttribute.needsUpdate = true;
}

function updateOpacity(threeEnv: ThreeEnv, opacity: number) {
  threeEnv.material.uniforms.opacity.value = opacity;
  threeEnv.material.needsUpdate = true;
}

function updateCamera(threeEnv: ThreeEnv, camPosX: number, camPosY: number) {
  threeEnv.camera.position.setX(camPosX);
  threeEnv.camera.position.setX(camPosY);
}

function updateZoom(threeEnv: ThreeEnv, zoom: number) {
  console.log(zoom)
  threeEnv.camera.zoom = zoom;
  threeEnv.camera.updateProjectionMatrix();
}

function updateTotalLines(threeEnv: ThreeEnv, totalLines: number) {
  const positions = new Float32Array(totalLines * 6);
  threeEnv.positionsAttribute.setArray(positions);

  const colors = new Float32Array(totalLines * 6);
  threeEnv.colorsAttribute.setArray(colors);

  const numbers = new Float32Array((totalLines * 2));
  threeEnv.numbersAttribute.setArray(numbers);

  const distances = new Float32Array(totalLines);
  threeEnv.distances = distances;

  threeEnv.material.uniforms.total.value = totalLines;
  threeEnv.material.needsUpdate = true;

  threeEnv.positionsAttribute.needsUpdate = true;
}

function render(threeEnv: ThreeEnv) {
  threeEnv.renderer.render(threeEnv.scene, threeEnv.camera);
}