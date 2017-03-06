import {ColorMethod, ThreeEnv} from "./interfaces";
import * as THREE from "three";


export function updateNumbers(numbersAttribute: THREE.BufferAttribute, total: number) {
  const numbers = <Float32Array> numbersAttribute.array;

  for (let i = 0; i < total * 2; i++) {
    numbers[i] = i;
  }

  numbersAttribute.needsUpdate = true;
}


export function updateColorMethod(material: THREE.ShaderMaterial, colorMethod: ColorMethod) {
  switch (colorMethod) {
    case 'solid':
      material.uniforms.colorMethod.value = 0.0;
      break;
    case 'faded':
      material.uniforms.colorMethod.value = 1.0;
      break;
    case 'lengthOpacity':
      material.uniforms.colorMethod.value = 2.0;
      break;
    case 'lengthHue':
      material.uniforms.colorMethod.value = 3.0;
      break;
  }

  material.needsUpdate = true;
}

export function updateMultiplier(material: THREE.ShaderMaterial, multiplier: number) {
  material.uniforms.multiplier.value = multiplier;

  material.needsUpdate = true;
}

export function updateOpacity(threeEnv: ThreeEnv, opacity: number) {
  threeEnv.material.uniforms.opacity.value = opacity;
  threeEnv.material.needsUpdate = true;
}

export function updateCamera(threeEnv: ThreeEnv, camPosX: number, camPosY: number) {
  threeEnv.camera.position.setX(camPosX);
  threeEnv.camera.position.setX(camPosY);
}

export function updateZoom(threeEnv: ThreeEnv, zoom: number) {
  threeEnv.camera.zoom = zoom * zoom;
  threeEnv.camera.updateProjectionMatrix();
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
}

export function updateTotalLines(threeEnv: ThreeEnv, totalLines: number) {
  const positions = new Float32Array(totalLines * 6);
  threeEnv.positionsAttribute.setArray(positions);

  const colors = new Float32Array(totalLines * 6);
  threeEnv.colorsAttribute.setArray(colors);

  const numbers = new Float32Array((totalLines * 2));
  threeEnv.numbersAttribute.setArray(numbers);

  threeEnv.distances = new Float32Array(totalLines);

  threeEnv.material.uniforms.total.value = totalLines;
  threeEnv.material.needsUpdate = true;

  threeEnv.positionsAttribute.needsUpdate = true;
}