import {RenderController} from "./index";
export interface Input {
    totalPoints: number,
    multiplier: number,
    animate: boolean,
    multiplierIncrement: number,
    colorLength: boolean,
    opacity: number,
    camPosX: number,
    camPosY: number,
    camPosZ: number,
}

export function initGUI(input: Input, renderController: RenderController) {
    let gui = new dat.GUI();
    let f1 = gui.addFolder("Maths");
    f1.add(input, "totalPoints").min(0).step(1).onChange(sayHello);
    f1.add(input, "multiplier").step(1);
    f1.open();
    let f2 = gui.addFolder("Animation");
    f2.add(input, "animate");
    f2.add(input, "multiplierIncrement", -1, 1).step(0.005);
    f2.open();
    let f3 = gui.addFolder("Color");
    f3.add(input, "colorLength");
    f3.add(input, "opacity", 0, 1).step(0.01);
    f3.open();
    let f4 = gui.addFolder("Camera");
    f4.add(input, "camPosX").step(0.01);
    f4.add(input, "camPosY").step(0.01);
    f4.add(input, "camPosZ").step(0.01);
    f4.open();

    for (var folderName in gui.__folders) {
        if (gui.__folders.hasOwnProperty(folderName)) {
            gui.__folders[folderName].__controllers.forEach(
                controller => controller.onChange(() => renderController.requestRender())
            );
        }
    }
}

function sayHello() {
    console.log("Hello");
}