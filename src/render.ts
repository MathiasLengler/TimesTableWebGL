import THREE = require("three");

import {ThreeEnv, Input, UpdateSource} from "./interfaces";
import {
  updateTotalLines,
  updateCameraPosition,
  updateOpacity,
  updateCameraZoom,
  updateMultiplier,
  updateRendererSize,
  updateColorMethod,
  updateNoiseStrength
} from "./updateActions";


export class RenderController {
  private frameRequested = false;
  private postRenderCallbacks: Set<() => void>;

  private readonly updateSources: Set<UpdateSource>;
  private readonly stats: Stats;
  private readonly threeEnv: ThreeEnv;
  private readonly input: Input;

  constructor(stats: Stats, threeEnv: ThreeEnv, input: Input) {
    this.stats = stats;
    this.threeEnv = threeEnv;
    this.input = input;
    this.updateSources = new Set();
    this.postRenderCallbacks = new Set();
  }

  public requestRender(source: UpdateSource, postRenderCallback?: () => void) {
    this.updateSources.add(source);

    if (!this.frameRequested) {
      this.frameRequested = true;
      requestAnimationFrame(() => this.render());
    }

    if (postRenderCallback) {
      this.postRenderCallbacks.add(postRenderCallback);
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
      updateMultiplier(this.threeEnv.material, this.input.multiplier);
      updateColorMethod(this.threeEnv.material, this.input.colorMethod);
      updateOpacity(this.threeEnv.material, this.input.opacity);
      updateCameraPosition(this.threeEnv, this.input.camPosX, this.input.camPosY);
      updateCameraZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.updateSources.has("totalLines")) {
      updateTotalLines(this.threeEnv, this.input.totalLines);
    }

    if (this.updateSources.has("multiplier")) {
      updateMultiplier(this.threeEnv.material, this.input.multiplier);
    }

    if (this.updateSources.has("colorMethod")) {
      updateColorMethod(this.threeEnv.material, this.input.colorMethod);
    }

    if (this.updateSources.has("noiseStrength")) {
      updateNoiseStrength(this.threeEnv.material, this.input.noiseStrength);
    }

    if (this.updateSources.has("resetCamera")) {
      updateCameraPosition(this.threeEnv, this.input.camPosX, this.input.camPosY);
      updateCameraZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.updateSources.has("camPosX") ||
      this.updateSources.has("camPosY")) {
      updateCameraPosition(this.threeEnv, this.input.camPosX, this.input.camPosY);
    }

    if (this.updateSources.has("camZoom")) {
      updateCameraZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.updateSources.has("opacity")) {
      updateOpacity(this.threeEnv.material, this.input.opacity);
    }

    if (this.updateSources.has("resize")) {
      updateRendererSize(this.threeEnv, window.innerHeight, window.innerWidth);
    }
  }

  private prepareNextRender() {
    this.updateSources.clear();

    // clear postRenderCallbacks before executing the previous callbacks
    // this allows renderCallbacks to requestRender with callbacks
    const oldPostRenderCallbacks = this.postRenderCallbacks;

    this.postRenderCallbacks = new Set();

    oldPostRenderCallbacks.forEach(callback => callback());
  }
}
