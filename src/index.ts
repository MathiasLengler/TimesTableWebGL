declare function require(any):any;
require("script!../node_modules/dat.gui/build/dat.gui.js");

import * as THREE from "three";
import Stats = require("stats.js");
import BufferGeometry = THREE.BufferGeometry;
import Geometry = THREE.Geometry;
import LineBasicMaterial = THREE.LineBasicMaterial;

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

// --- GLOBALS ---
// fps
var stats = new Stats();
// gui vars
var input = null;
// threejs
var renderer: THREE.WebGLRenderer;
var scene: THREE.Scene;
var camera: THREE.PerspectiveCamera;
// threejs object management
var lines: THREE.Line[];

var material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    opacity: 0.1,
    transparent: true
});

var TimesTableGL = function () {
    this.totalPoints = 800;
    this.multiplier = 2;
    this.animate = false;
    this.speed = 0.005;
    this.colorLength = true;
    this.opacity = 0.1;
};


function init() {
    initGUI();
    initRenderer();
    render();
}

function initGUI() {
    input = new TimesTableGL();
    var gui = new dat.GUI();
    var f1 = gui.addFolder("Maths");
    f1.add(input, "totalPoints").min(0).step(1);
    f1.add(input, "multiplier").step(1);
    f1.open();
    var f2 = gui.addFolder("Animation");
    f2.add(input, "animate");
    f2.add(input, "speed", -1, 1).step(0.005);
    f2.open();
    var f3 = gui.addFolder("Color");
    f3.add(input, "colorLength");
    f3.add(input, "opacity", 0, 1).step(0.01);
    f3.open();
}


function initRenderer() {
    stats.showPanel(1);
    document.body.appendChild(stats.dom);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 500);
    camera.position.set(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    window.addEventListener( 'resize', onWindowResize);
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

var prevTotal: number = 0;
var prevOpacity: number = 0;

function render() {

    stats.begin();

    if (prevTotal !== input.totalPoints) {
        cleanUp(prevTotal);
        createGeometryAndLines(input.totalPoints);
    }

    drawCircle(input.totalPoints, input.multiplier);

    renderer.render(scene, camera);

    prevTotal = input.totalPoints;
    prevOpacity = input.opacity;
    if (input.animate) {
        input.multiplier += input.speed;
    }

    stats.end();
    requestAnimationFrame(render);
}

function getCircleCord(number: number, total: number): Point2D {
    var normalized = (number / total) * 2 * Math.PI;
    return new Point2D(Math.cos(normalized), Math.sin(normalized));
}

function createGeometryAndLines(total: number) {
    lines = Array(total);

    for (var i = 0; i < total; i++) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3());
        geometry.vertices.push(new THREE.Vector3());

        var material = new THREE.LineBasicMaterial({
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        var line = new THREE.Line(geometry, material);
        lines[i] = line;
        scene.add(line);
    }
}


function drawCircle(total: number, multiplier: number): void {
    for (var i = 0; i < total; i++) {
        var cord = getCircleCord(i, total);
        var cordMulti = getCircleCord(i * multiplier, total);
        var distance = Point2D.distance(cord, cordMulti);

        var line = lines[i];
        var geometry = line.geometry;
        if (geometry instanceof Geometry) {
            geometry.vertices[0].set(cord.x, cord.y, 0);
            geometry.vertices[1].set(cordMulti.x, cordMulti.y, 0);
            geometry.verticesNeedUpdate = true;
        }

        var material = line.material;
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
    for (var i = 0; i < total; i++) {
        var line = lines[i];
        scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    }
    lines = null;
}

window.onload = init;