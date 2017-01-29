import THREE = require("three");

import {ThreeEnv, Input} from "./interfaces";
import {
  updateTotalLines,
  updateNumbers,
  updateColors,
  updateCamera,
  updateOpacity,
  updateZoom,
  updateMultiplier
} from "./updateActions";

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


function render(threeEnv: ThreeEnv) {
  threeEnv.renderer.render(threeEnv.scene, threeEnv.camera);
}