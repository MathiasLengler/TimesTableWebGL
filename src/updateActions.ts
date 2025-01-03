import type { ColorMethod, LineMaterial, ThreeEnv } from "./interfaces";
import * as THREE from "three";
import { getGeometry, getLines } from "./index";
import assertNever from "assert-never";

export function updateColorMethod(material: LineMaterial, colorMethod: ColorMethod) {
    switch (colorMethod) {
        case "solid":
            material.uniforms.colorMethod.value = 0;
            break;
        case "faded":
            material.uniforms.colorMethod.value = 1;
            break;
        case "lengthOpacity":
            material.uniforms.colorMethod.value = 2;
            break;
        case "lengthHue":
            material.uniforms.colorMethod.value = 3;
            break;
        case "indexHue":
            material.uniforms.colorMethod.value = 4;
            break;
        case "fadedIndexHue":
            material.uniforms.colorMethod.value = 5;
            break;
        default:
            assertNever(colorMethod);
    }

    material.needsUpdate = true;
}

export function updateMultiplier(material: LineMaterial, multiplier: number) {
    material.uniforms.multiplier.value = multiplier;
    material.needsUpdate = true;
}

export function updateOpacity(material: LineMaterial, opacity: number) {
    material.uniforms.opacity.value = Math.pow(opacity, 3);
    material.needsUpdate = true;
}

export function updateNoiseStrength(material: LineMaterial, noiseStrength: number) {
    material.uniforms.noiseStrength.value = noiseStrength;
    material.needsUpdate = true;
}

export function updateCameraPosition(camera: THREE.OrthographicCamera, camPosX: number, camPosY: number) {
    camera.position.setX(camPosX);
    camera.position.setY(camPosY);
}

export function updateCameraZoom(camera: THREE.OrthographicCamera, zoom: number) {
    camera.zoom = Math.pow(Math.E, zoom - 1);
    camera.updateProjectionMatrix();
}

export function updateRendererSize(threeEnv: ThreeEnv, height: number, width: number) {
    const aspectRatio = width / height;

    const camera = threeEnv.camera;

    if (aspectRatio > 1) {
        camera.left = -aspectRatio;
        camera.right = aspectRatio;
        camera.top = 1;
        camera.bottom = -1;
    } else {
        camera.left = -1;
        camera.right = 1;
        camera.top = Math.pow(aspectRatio, -1);
        camera.bottom = -Math.pow(aspectRatio, -1);
    }

    threeEnv.camera.updateProjectionMatrix();

    threeEnv.renderer.setSize(width, height);

    const renderTargetSize = getRenderTargetSize(threeEnv.renderer);
    threeEnv.composer.setSize(renderTargetSize.width, renderTargetSize.height);
}

export function updateTotalLines(threeEnv: ThreeEnv, totalLines: number) {
    threeEnv.scene.remove(threeEnv.lines);

    threeEnv.material.uniforms.total.value = totalLines;
    threeEnv.material.needsUpdate = true;
    threeEnv.lines = getLines(getGeometry(totalLines), threeEnv.material);

    threeEnv.scene.add(threeEnv.lines);
}

export function updateSamples(threeEnv: ThreeEnv, samples: number) {
    threeEnv.composer.reset(getRenderTarget(threeEnv.renderer, samples));
}

function getRenderTargetSize(renderer: THREE.WebGLRenderer) {
    return renderer.getDrawingBufferSize(new THREE.Vector2());
}

export function getRenderTarget(renderer: THREE.WebGLRenderer, samples: number) {
    const renderTargetSize = getRenderTargetSize(renderer);
    const renderTarget = new THREE.WebGLRenderTarget(renderTargetSize.width, renderTargetSize.height, {
        format: THREE.RGBAFormat,
    });
    renderTarget.samples = samples;
    return renderTarget;
}
