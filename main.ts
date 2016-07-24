class Point2D {
    x:number;
    y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    static distance(a:Point2D, b:Point2D) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx * dx + dy * dy);
    }
}

// --- GLOBALS ---

var input = null;
// threejs globals
var renderer:THREE.WebGLRenderer;
var scene:THREE.Scene;
var camera:THREE.Camera;
var geometries:THREE.Geometry[];
var lines:THREE.Line[];

var material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    opacity: 0.5,
    transparent: true
});

var TimesTableGL = function () {
    this.totalPoints = 10;
    this.multiplier = 2;
    this.multiplierAnimation = 0.01;
    this.drawOutline = false;
};


function init() {
    input = new TimesTableGL();
    var gui = new dat.GUI();
    gui.add(input, "totalPoints");
    gui.add(input, "multiplier");
    gui.add(input, "drawOutline");

    initRenderer();
    render();
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 500);
    camera.position.set(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function render() {

    drawCircle(input.totalPoints, input.multiplier);

    renderer.render(scene, camera);

    cleanUp();

    input.multiplier += input.multiplierAnimation;
    requestAnimationFrame(render);
}

function getCircleCord(number:number, total:number):Point2D {
    var normalized = (number / total) * 2 * Math.PI;
    return new Point2D(Math.cos(normalized), Math.sin(normalized));
}


// TODO: reuse geometry and line instances
function drawCircle(total:number, multiplier:number):void {
    geometries = Array(total);
    lines = Array(total);

    for (var i = 0; i < total; i++) {
        var cord = getCircleCord(i, total);
        var cordMulti = getCircleCord(i * multiplier, total);

        //var distance = cord.distance(cordMulti);

        var geometry = new THREE.Geometry();
        geometries[i] = geometry;
        geometry.vertices.push(new THREE.Vector3(cord.x, cord.y));
        geometry.vertices.push(new THREE.Vector3(cordMulti.x, cordMulti.y));

        var line = new THREE.Line(geometry, material);
        lines[i] = line;
        scene.add(line);
    }
}


function cleanUp() {
    for (var i = 0; i < input.totalPoints; i++) {
        scene.remove(lines[i]);
        geometries[i].dispose();
    }
    lines = null;
    geometries = null;
}

window.onload = init;