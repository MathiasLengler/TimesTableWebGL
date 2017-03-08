import {RenderController} from "./render";
import {GUI} from "dat.gui";
import {Input, ColorMethod} from "./interfaces";

export function initGUI(input: Input, renderController: RenderController) {
  let gui = new GUI();

  const totalLines = "totalLines";
  const multiplier = "multiplier";
  const animate = "animate";
  const multiplierIncrement = "multiplierIncrement";
  const opacity = "opacity";
  const colorMethod = "colorMethod";
  const camPosX = "camPosX";
  const camPosY = "camPosY";
  const camZoom = "camZoom";
  const resetCamera = "resetCamera";

  let f1 = gui.addFolder("Maths");
  f1.add(input, totalLines).min(0).step(1)
    .onChange(() => renderController.requestRender(totalLines));

  const multiplierController = f1.add(input, multiplier).step(1e-06);
  function postRenderCallback() {
    if (input.animate) {
      multiplierController.setValue(input.multiplier + Math.pow(input.multiplierIncrement, 3));
    }
  }
  multiplierController.onChange(
    () => renderController.requestRender(multiplier, postRenderCallback)
  );
  f1.open();

  let f2 = gui.addFolder("Animation");
  f2.add(input, animate)
    .onChange(() => renderController.requestRender(animate, postRenderCallback));
  f2.add(input, multiplierIncrement).min(-1).max(1).step(0.001)
    .onChange(() => renderController.requestRender(multiplierIncrement));
  f2.open();

  let f3 = gui.addFolder("Color");
  f3.add(input, opacity, 0, 1).step(0.001)
    .onChange(() => renderController.requestRender(opacity));
  const colorMethods: Array<ColorMethod> = ['solid', 'faded', 'lengthOpacity', 'lengthHue'];
  f3.add(input, colorMethod, colorMethods)
    .onChange(() => renderController.requestRender(colorMethod));
  f3.open();

  let f4 = gui.addFolder("Camera");
  const camPosXController = f4.add(input, camPosX, -1, 1).step(0.001);
  camPosXController.onChange(() => renderController.requestRender(camPosX));
  const camPosYController = f4.add(input, camPosY, -1, 1).step(0.001);
  camPosYController.onChange(() => renderController.requestRender(camPosY));
  const camZoomController = f4.add(input, camZoom, 1).step(0.01);
  camZoomController.onChange(() => renderController.requestRender(camZoom));
  f4.add(input, resetCamera)
    .onChange(() => {
      camPosXController.setValue(0);
      camPosYController.setValue(0);
      camZoomController.setValue(1);
    });
  f4.open();
}
