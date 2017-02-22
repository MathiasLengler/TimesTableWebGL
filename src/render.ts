import THREE = require("three");

import {ThreeEnv, Input, UpdateSource} from "./interfaces";
import {
  updateTotalLines,
  updateNumbers,
  updateColors,
  updateCamera,
  updateOpacity,
  updateZoom,
  updateMultiplier,
  updateRendererSize
} from "./updateActions";

export class RenderController {
  private frameRequested = false;

  private readonly updateSources: Set<UpdateSource>;
  private readonly stats: Stats;
  private readonly threeEnv: ThreeEnv;
  private readonly input: Input;

  constructor(stats: Stats, threeEnv: ThreeEnv, input: Input) {
    this.stats = stats;
    this.threeEnv = threeEnv;
    this.input = input;
    this.updateSources = new Set();
  }

  public requestRender(source: UpdateSource) {
    this.updateSources.add(source);

    if (!this.frameRequested) {
      this.frameRequested = true;
      requestAnimationFrame(() => this.render());
    }
  }

  private render() {
    this.stats.begin();

    this.frameRequested = false;

    this.update();

    this.threeEnv.renderer.render(this.threeEnv.scene, this.threeEnv.camera);

    this.prepareNextRender();

    this.stats.end();
  }

  private update() {
    if (this.updateSources.has("init")) {
      updateRendererSize(this.threeEnv, window.innerHeight, window.innerWidth);
      updateTotalLines(this.threeEnv, this.input.totalLines);
      updateNumbers(this.threeEnv.numbersAttribute, this.input.totalLines);
      updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
      updateCamera(this.threeEnv, this.input.camPosX, this.input.camPosY);
      updateOpacity(this.threeEnv, this.input.opacity);
      updateZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.updateSources.has("totalLines")) {
      updateTotalLines(this.threeEnv, this.input.totalLines);
      updateNumbers(this.threeEnv.numbersAttribute, this.input.totalLines);
      updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
    }

    if (this.updateSources.has("multiplier")) {
      updateMultiplier(this.threeEnv.material, this.input.multiplier);

      if (this.input.recolor) {
        // Only recolor on multiplier update when the color method depends on line length
        if (this.input.colorMethod === "lengthOpacity" ||
          this.input.colorMethod === "lengthHue") {
          updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
        }
      }
    }

    if (this.updateSources.has("colorMethod") ||
      this.updateSources.has("recolor")) {
      updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
    }

    if (this.updateSources.has("resetCamera")) {
      // TODO: update gui
      this.input.camPosX = 0;
      this.input.camPosY = 0;
      this.input.camZoom = 1;
    }

    if (this.updateSources.has("resetCamera") ||
      this.updateSources.has("camPosX") ||
      this.updateSources.has("camPosY")) {
      updateCamera(this.threeEnv, this.input.camPosX, this.input.camPosY);
    }

    if (this.updateSources.has("camZoom")) {
      updateZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.updateSources.has("opacity")) {
      updateOpacity(this.threeEnv, this.input.opacity);
    }

    if (this.updateSources.has("resize")) {
      updateRendererSize(this.threeEnv, window.innerHeight, window.innerWidth);
    }
  }

  private prepareNextRender() {
    this.updateSources.clear();

    if (this.input.animate) {
      this.input.multiplier += Math.pow(this.input.multiplierIncrement, 3);
      this.requestRender("multiplier");
    }
  }
}
