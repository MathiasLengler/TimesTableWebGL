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
    colorsAttribute: THREE.BufferAttribute,
    distances: Float32Array
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
            this.input.multiplier += Math.pow(this.input.multiplierIncrement, 3);
            this.requestRender("multiplier");
        }

        this.stats.end();
    }

    private update() {
        if (this.hasChanged["init"]) {
            updateTotalLines(this.threeEnv, this.input.totalLines);
            updatePositions(
                this.threeEnv.positionsAttribute,
                this.threeEnv.distances,
                this.input.multiplier,
                this.input.totalLines
            );
            updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
            updateCamera(this.threeEnv, this.input.camPosX, this.input.camPosY, this.input.camPosZ);
            updateOpacity(this.threeEnv, this.input.opacity);
        }

        if (this.hasChanged["totalLines"]) {
            updateTotalLines(this.threeEnv, this.input.totalLines);
            updatePositions(
                this.threeEnv.positionsAttribute,
                this.threeEnv.distances,
                this.input.multiplier,
                this.input.totalLines
            );
            updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
        }

        if (this.hasChanged["multiplier"]) {
            updatePositions(
                this.threeEnv.positionsAttribute,
                this.threeEnv.distances,
                this.input.multiplier,
                this.input.totalLines
            );
        }

        if (this.hasChanged["colorMethod"]) {
            updateColors(this.threeEnv.colorsAttribute, this.threeEnv.distances, this.input.totalLines, this.input.colorMethod);
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

function updatePositions(positionsAttribute: THREE.BufferAttribute, distances: Float32Array, multiplier: number, total: number) {
    const positions = <Float32Array> positionsAttribute.array;

    for (let i = 0; i < total; i++) {
        let startCord = getCircleCord(i, total);
        let endCord = getCircleCord(i * multiplier, total);
        distances[i] = Point2D.distance(startCord, endCord);

        // Position start point
        positions[i * 6] = startCord.x;
        positions[i * 6 + 1] = startCord.y;
        positions[i * 6 + 2] = 0;
        // Position end point
        positions[i * 6 + 3] = endCord.x;
        positions[i * 6 + 4] = endCord.y;
        positions[i * 6 + 5] = 0;
    }

    positionsAttribute.needsUpdate = true;
}

function updateColors(colorsAttribute: THREE.BufferAttribute, distances: Float32Array, total: number, colorMethod: string) {
    const colors = <Float32Array> colorsAttribute.array;

    const options = ['solid', 'faded', 'length'];

    switch (colorMethod) {
        case 'solid':
            for (let i = 0; i < total; i++) {
                // colors start point
                colors[i * 6] = 1;
                colors[i * 6 + 1] = 1;
                colors[i * 6 + 2] = 1;
                // colors end point
                colors[i * 6 + 3] = 1;
                colors[i * 6 + 4] = 1;
                colors[i * 6 + 5] = 1;
            }
            break;
        case 'faded':
            for (let i = 0; i < total; i++) {
                // colors start point
                colors[i * 6] = 1;
                colors[i * 6 + 1] = 1;
                colors[i * 6 + 2] = 1;
                // colors end point
                colors[i * 6 + 3] = 0;
                colors[i * 6 + 4] = 0;
                colors[i * 6 + 5] = 0;
            }
            break;
        case 'length':
            for (let i = 0; i < total; i++) {
                // TODO: use old color logic

                const distance = 1- distances[i] / 2;

                console.log(distance);

                // colors start point
                colors[i * 6] = distance;
                colors[i * 6 + 1] = distance;
                colors[i * 6 + 2] = distance;
                // colors end point
                colors[i * 6 + 3] = distance;
                colors[i * 6 + 4] = distance;
                colors[i * 6 + 5] = distance;
            }
            break;
        default:
            throw "Use an enum";
    }

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
    var distances = new Float32Array(totalLines);
    threeEnv.positionsAttribute.setArray(positions);
    threeEnv.colorsAttribute.setArray(colors);
    threeEnv.distances = distances;
}

function render(threeEnv: ThreeEnv, input: Input) {
    threeEnv.renderer.render(threeEnv.scene, threeEnv.camera);
}