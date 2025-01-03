import { RenderController } from "./render";
import GUI from "lil-gui";
import type { ColorMethod, Input, RenderContainer, UpdateSource } from "./interfaces";

export function initGUI(
    input: Input,
    renderController: RenderController,
    renderContainer: RenderContainer,
    maxSamples: number,
) {
    const gui = new GUI();

    const totalLines: UpdateSource = "totalLines";
    const multiplier: UpdateSource = "multiplier";
    const animate: UpdateSource = "animate";
    const multiplierIncrement: UpdateSource = "multiplierIncrement";
    const opacity: UpdateSource = "opacity";
    const colorMethod: UpdateSource = "colorMethod";
    const noiseStrength: UpdateSource = "noiseStrength";
    const samples: UpdateSource = "samples";
    const camPosX: UpdateSource = "camPosX";
    const camPosY: UpdateSource = "camPosY";
    const camZoom: UpdateSource = "camZoom";
    const resetCamera: UpdateSource = "resetCamera";

    const mathsFolder = gui.addFolder("Maths");
    mathsFolder
        .add(input, totalLines)
        .min(0)
        .step(1)
        .onChange(() => renderController.requestRender(totalLines));

    const multiplierController = mathsFolder.add(input, multiplier).step(1e-6);

    function postRenderCallback() {
        if (input.animate) {
            multiplierController.setValue(input.multiplier + Math.pow(input.multiplierIncrement, 3));
        }
    }

    multiplierController.onChange(() => renderController.requestRender(multiplier, postRenderCallback));

    const animationFolder = gui.addFolder("Animation");
    animationFolder.add(input, animate).onChange(() => renderController.requestRender(animate, postRenderCallback));
    animationFolder
        .add(input, multiplierIncrement)
        .min(-1)
        .max(1)
        .step(0.001)
        .onChange(() => renderController.requestRender(multiplierIncrement));

    const colorFolder = gui.addFolder("Color");
    colorFolder
        .add(input, opacity, 0, 1)
        .step(0.001)
        .onChange(() => renderController.requestRender(opacity));
    const colorMethods: ColorMethod[] = ["solid", "faded", "lengthOpacity", "lengthHue", "indexHue", "fadedIndexHue"];
    colorFolder.add(input, colorMethod, colorMethods).onChange(() => renderController.requestRender(colorMethod));

    const renderFolder = gui.addFolder("Render");
    renderFolder
        .add(input, noiseStrength, 0, 255)
        .step(0.5)
        .onChange(() => renderController.requestRender(noiseStrength));
    renderFolder
        .add(input, samples, 1, maxSamples)
        .step(1)
        .onChange(() => renderController.requestRender(samples));

    const cameraFolder = gui.addFolder("Camera");
    const camPosXController = cameraFolder.add(input, camPosX, -1, 1).step(1e-6);
    camPosXController.onChange(() => renderController.requestRender(camPosX));
    const camPosYController = cameraFolder.add(input, camPosY, -1, 1).step(1e-6);
    camPosYController.onChange(() => renderController.requestRender(camPosY));
    const camZoomController = cameraFolder.add(input, camZoom, 1).step(0.01);
    camZoomController.onChange(() => renderController.requestRender(camZoom));
    cameraFolder.add(input, resetCamera).onChange(() => {
        camPosXController.setValue(0);
        camPosYController.setValue(0);
        camZoomController.setValue(1);
    });

    renderContainer.addEventListener("wheel", (e: WheelEvent) => {
        if (e.shiftKey) {
            camZoomController.setValue(input.camZoom - e.deltaY / 1000);
        }
    });

    renderContainer.addEventListener("mousemove", (e: MouseEvent) => {
        if (e.buttons === 1 && e.shiftKey) {
            const circleDiameterPx = Math.min(renderContainer.clientHeight, renderContainer.clientWidth);

            const realZoom = Math.pow(Math.E, input.camZoom - 1);

            const movementFactor = (realZoom * circleDiameterPx) / 2;

            camPosXController.setValue(input.camPosX - e.movementX / movementFactor);
            camPosYController.setValue(input.camPosY + e.movementY / movementFactor);
        }
    });
}
