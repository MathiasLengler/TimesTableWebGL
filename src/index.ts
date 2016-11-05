// Webpack requires
declare function require(any): any;
require("script!../node_modules/dat.gui/build/dat.gui.js");
require("./../assets/index.css");

import * as THREE from "three";
import Stats = require("stats.js");
import BufferGeometry = THREE.BufferGeometry;
import Geometry = THREE.Geometry;
import LineBasicMaterial = THREE.LineBasicMaterial;

import * as Gui from "./gui";

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

export class RenderController {
    private waitOnUpdate = false;
    private readonly doRender: (rc: RenderController) => void;
    private readonly stats: Stats;

    constructor(doRender: (rc: RenderController) => void, stats: Stats) {
        this.doRender = doRender;
        this.stats = stats;
    }

    public requestRender() {
        if (!this.waitOnUpdate) {
            this.waitOnUpdate = true;
            requestAnimationFrame(() => this.render());
        }
    }

    private render() {
        this.waitOnUpdate = false;

        this.stats.begin();
        this.doRender(this);
        this.stats.end();
    }
}

// --- GLOBALS ---
// threejs
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
// threejs object management
let lines: THREE.Line[];

// gui
let input: Gui.Input = {
    totalPoints: 250,
    multiplier: 2,
    animate: false,
    multiplierIncrement: 0.005,
    colorLength: true,
    opacity: 0.3,
    camPosX: 0,
    camPosY: 0,
    camPosZ: 1,
};


function init() {
    let stats = new Stats();
    stats.showPanel(1);
    document.body.appendChild(stats.dom);

    let renderController: RenderController = new RenderController(render, stats);

    window.addEventListener('resize', () => onWindowResize(renderController));

    Gui.initGUI(input, renderController);

    initRenderer();

    renderController.requestRender();
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 500);
    camera.position.set(input.camPosX, input.camPosY, input.camPosZ);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

}

function onWindowResize(renderController: RenderController) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderController.requestRender();
}

let prevTotal: number = 0;

function render(renderController: RenderController) {
    if (prevTotal !== input.totalPoints) {
        cleanUp(prevTotal);
        createGeometryAndLines(input.totalPoints);
    }

    drawCircle(input.totalPoints, input.multiplier);

    camera.position.set(input.camPosX, input.camPosY, input.camPosZ);

    renderer.render(scene, camera);

    prevTotal = input.totalPoints;
    if (input.animate) {
        input.multiplier += input.multiplierIncrement;
        renderController.requestRender();
    }
}

function getCircleCord(number: number, total: number): Point2D {
    let normalized = (number / total) * 2 * Math.PI;
    return new Point2D(Math.cos(normalized), Math.sin(normalized));
}

function createGeometryAndLines(total: number) {
    lines = Array(total);

    for (let i = 0; i < total; i++) {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3());
        geometry.vertices.push(new THREE.Vector3());

        let material = new THREE.LineBasicMaterial({
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        let line = new THREE.Line(geometry, material);
        lines[i] = line;
        scene.add(line);
    }
}


function drawCircle(total: number, multiplier: number): void {
    for (let i = 0; i < total; i++) {
        let cord = getCircleCord(i, total);
        let cordMulti = getCircleCord(i * multiplier, total);
        let distance = Point2D.distance(cord, cordMulti);

        let line = lines[i];
        let geometry = line.geometry;
        if (geometry instanceof Geometry) {
            geometry.vertices[0].set(cord.x, cord.y, 0);
            geometry.vertices[1].set(cordMulti.x, cordMulti.y, 0);
            geometry.verticesNeedUpdate = true;
        }

        let material = line.material;
        if (material instanceof LineBasicMaterial) {
            material.opacity = input.opacity;
            if (input.colorLength) {
                material.color.setHSL(distance / 2, 1, 0.5);
            }
            material.needsUpdate = true;
        }
    }
}


function cleanUp(total: number): void {
    for (let i = 0; i < total; i++) {
        let line = lines[i];
        scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    }
    lines = null;
}

window.onload = init;