import THREE = require("three");

import {RenderController} from "./index";
import {Input} from "./gui";

export interface ThreeEnv {
    readonly renderer: THREE.WebGLRenderer,
    readonly scene: THREE.Scene,
    readonly camera: THREE.PerspectiveCamera,
    readonly geometry: THREE.BufferGeometry,
    readonly material: THREE.LineBasicMaterial,
    positionsAttribute: THREE.BufferAttribute,
    colorsAttribute: THREE.BufferAttribute
}

class Point2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static distance(a: Point2D, b: Point2D) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx * dx + dy * dy);
    }
}

function getCircleCord(number: number, total: number): Point2D {
    let normalized = (number / total) * 2 * Math.PI;
    return new Point2D(Math.cos(normalized), Math.sin(normalized));
}

function fillPosColorArrays(positionsAttribute: THREE.BufferAttribute,
                            colorsAttribute: THREE.BufferAttribute,
                            multiplier: number,
                            total: number) {
    const positions = <Float32Array> positionsAttribute.array;
    const colors = <Float32Array> colorsAttribute.array;
    for (let i = 0; i < total; i++) {
        let startCord = getCircleCord(i, total);
        let endCord = getCircleCord(i * multiplier, total);
        let distance = Point2D.distance(startCord, endCord);

        // Position start point
        positions[i * 6] = startCord.x;
        positions[i * 6 + 1] = startCord.y;
        positions[i * 6 + 2] = 0;
        // Position end point
        positions[i * 6 + 3] = endCord.x;
        positions[i * 6 + 4] = endCord.y;
        positions[i * 6 + 5] = 0;

        // colors start point
        colors[i * 6] = 1;
        colors[i * 6 + 1] = 1;
        colors[i * 6 + 2] = 1;
        // colors end point
        colors[i * 6 + 3] = 0;
        colors[i * 6 + 4] = 0;
        colors[i * 6 + 5] = 0;
    }

    positionsAttribute.needsUpdate = true;
    colorsAttribute.needsUpdate = true;
}

export function updateOpacity(threeEnv: ThreeEnv, opacity: number) {
    threeEnv.material.opacity = opacity;
}

export function updateCamera(threeEnv: ThreeEnv, camPosX: number, camPosY: number, camPosZ: number) {
    threeEnv.camera.position.set(camPosX,camPosY,camPosZ);
}

export function updateTotalLines(threeEnv: ThreeEnv, totalLines: number) {
    var {positions, colors} = createPosColorArrays(totalLines);
    threeEnv.positionsAttribute.setArray(positions);
    threeEnv.colorsAttribute.setArray(colors);
}

export function createPosColorArrays(totalLines: number) {
    var positions = new Float32Array(totalLines * 6);
    var colors = new Float32Array(totalLines * 6);
    return {positions, colors};
}

export function render(threeEnv: ThreeEnv, input: Input) {
    fillPosColorArrays(threeEnv.positionsAttribute, threeEnv.colorsAttribute, input.multiplier, input.totalLines);

    threeEnv.renderer.render(threeEnv.scene, threeEnv.camera);
}