uniform float total;

attribute vec2 number;

#define PI 3.1415926535897932384626433832795

/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */
void main() {
  vec3 newPosition = position;
  newPosition.x = number.x;
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition,1.0);
}

struct Point2D {
  float x;
  float y;
} point2d;

Point2D getCircleCord(int number, int total) {
    float normalized = (float(number) / float(total)) * 2.0 * PI;
    return Point2D(cos(normalized), sin(normalized));
}

//function updatePositions(positionsAttribute: THREE.BufferAttribute, distances: Float32Array, multiplier: number, total: number) {
//    const positions = <Float32Array> positionsAttribute.array;
//
//    for (let i = 0; i < total; i++) {
//        let startCord = getCircleCord(i, total);
//        let endCord = getCircleCord(i * multiplier, total);
//        distances[i] = Point2D.distance(startCord, endCord);
//
//        // Position start point
//        positions[i * 6] = startCord.x;
//        positions[i * 6 + 1] = startCord.y;
//        positions[i * 6 + 2] = 0;
//        // Position end point
//        positions[i * 6 + 3] = endCord.x;
//        positions[i * 6 + 4] = endCord.y;
//        positions[i * 6 + 5] = 0;
//    }
//
//    positionsAttribute.needsUpdate = true;
//}