import type { Input, RenderContainer, ThreeEnv, UpdateSource } from "./interfaces";
import {
    updateCameraPosition,
    updateCameraZoom,
    updateColorMethod,
    updateMultiplier,
    updateNoiseStrength,
    updateOpacity,
    updateRendererSize,
    updateSamples,
    updateTotalLines,
} from "./updateActions";

export class RenderController {
    private frameRequested = false;
    private postRenderCallbacks: Set<() => void>;

    private readonly updateSources: Set<UpdateSource>;
    private readonly threeEnv: ThreeEnv;
    private readonly input: Input;
    private readonly renderContainer: RenderContainer;

    constructor(threeEnv: ThreeEnv, input: Input, renderContainer: RenderContainer) {
        this.threeEnv = threeEnv;
        this.input = input;
        this.renderContainer = renderContainer;
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
        this.frameRequested = false;

        this.update();

        this.threeEnv.composer.render();

        this.prepareNextRender();
    }

    private update() {
        if (this.updateSources.has("init")) {
            updateRendererSize(this.threeEnv, window.innerHeight, window.innerWidth);
            updateTotalLines(this.threeEnv, this.input.totalLines);
            updateMultiplier(this.threeEnv.material, this.input.multiplier);
            updateColorMethod(this.threeEnv.material, this.input.colorMethod);
            updateOpacity(this.threeEnv.material, this.input.opacity);
            updateCameraPosition(this.threeEnv.camera, this.input.camPosX, this.input.camPosY);
            updateCameraZoom(this.threeEnv.camera, this.input.camZoom);
        }

        if (this.updateSources.has("samples")) {
            updateSamples(this.threeEnv, this.input.samples);
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

        if (this.updateSources.has("camPosX") || this.updateSources.has("camPosY")) {
            updateCameraPosition(this.threeEnv.camera, this.input.camPosX, this.input.camPosY);
        }

        if (this.updateSources.has("camZoom")) {
            updateCameraZoom(this.threeEnv.camera, this.input.camZoom);
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

        oldPostRenderCallbacks.forEach((callback) => callback());
    }
}
