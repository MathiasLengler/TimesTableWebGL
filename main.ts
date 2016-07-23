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

        return Math.sqrt(dx*dx + dy*dy);
    }
}

// threejs globals
var renderer: THREE.WebGLRenderer;
var scene: THREE.Scene;
var camera: THREE.Camera;

var material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    opacity: 0.01,
    transparent: true
});

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 500);
    camera.position.set(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    render();
}

var multiplier = 1;

function render() {
    scene = new THREE.Scene();

    drawCircle(10000,multiplier);
    multiplier += 0.01;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}


function getCircleCord(number:number, total:number):Point2D {
    var normalized = (number / total) * 2 * Math.PI;
    return new Point2D(Math.cos(normalized), Math.sin(normalized));
}


function drawCircle(total:number, multiplier:number):void {
    var geometry = new THREE.Geometry();

    for (var i = 0; i < total; i++) {
        var cord = getCircleCord(i, total);
        var cordMulti = getCircleCord(i * multiplier, total);

        //var distance = cord.distance(cordMulti);

        geometry.vertices.push(new THREE.Vector3(cord.x,cord.y));
        geometry.vertices.push(new THREE.Vector3(cordMulti.x,cordMulti.y));
    }
    var line = new THREE.Line(geometry, material);
    scene.add(line);
}

window.onload = init;