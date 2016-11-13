import THREE = require("three");

import {Input} from "./gui";
import {Point2D} from "./point2D";

export interface ThreeEnv {
    readonly renderer: THREE.WebGLRenderer,
    readonly scene: THREE.Scene,
    readonly camera: THREE.PerspectiveCamera,
    readonly geometry: THREE.BufferGeometry,
    readonly material: THREE.LineBasicMaterial,
    positionsAttribute: THREE.BufferAttribute,
    colorsAttribute: THREE.BufferAttribute
}


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

        console.log(this.hasChanged);

        this.waitOnUpdate = false;

        this.update();

        render(this.threeEnv, this.input);

        this.hasChanged = {};

        if (this.input.animate) {
            this.input.multiplier += Math.pow(this.input.multiplierIncrement,3);
            this.requestRender("multiplier");
        }

        this.stats.end();
    }

    private update() {
        if (this.hasChanged["init"]) {
            updateTotalLines(this.threeEnv, this.input.totalLines);
            fillPosColorArrays(
                this.threeEnv.positionsAttribute,
                this.threeEnv.colorsAttribute,
                this.input.multiplier,
                this.input.totalLines
            );
            updateCamera(this.threeEnv, this.input.camPosX, this.input.camPosY, this.input.camPosZ);
            updateOpacity(this.threeEnv, this.input.opacity);
        }

        if (this.hasChanged["totalLines"]) {
            updateTotalLines(this.threeEnv, this.input.totalLines);
        }

        if (this.hasChanged["multiplier"] ||
            this.hasChanged["totalLines"]) {
            fillPosColorArrays(
                this.threeEnv.positionsAttribute,
                this.threeEnv.colorsAttribute,
                this.input.multiplier,
                this.input.totalLines
            );
        }

        if (this.hasChanged["camPosX"] ||
            this.hasChanged["camPosY"] ||
            this.hasChanged["camPosZ"]) {
            updateCamera(this.threeEnv, this.input.camPosX, this.input.camPosY, this.input.camPosZ);
        }

        if (this.hasChanged["opacity"]) {
            updateOpacity(this.threeEnv, this.input.opacity);
        }
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

function updateOpacity(threeEnv: ThreeEnv, opacity: number) {
    threeEnv.material.opacity = opacity;
}

function updateCamera(threeEnv: ThreeEnv, camPosX: number, camPosY: number, camPosZ: number) {
    threeEnv.camera.position.set(camPosX, camPosY, camPosZ);
}

function updateTotalLines(threeEnv: ThreeEnv, totalLines: number) {
    var positions = new Float32Array(totalLines * 6);
    var colors = new Float32Array(totalLines * 6);
    threeEnv.positionsAttribute.setArray(positions);
    threeEnv.colorsAttribute.setArray(colors);
}

function render(threeEnv: ThreeEnv, input: Input) {
    threeEnv.renderer.render(threeEnv.scene, threeEnv.camera);
}