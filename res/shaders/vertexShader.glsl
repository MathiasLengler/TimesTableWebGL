uniform float multiplier;
uniform float total;

attribute float number;

#define PI 3.1415926535897932384626433832795

bool isStartCord(float number);
vec2 getCircleCord(float number, float total);

/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */
void main() {
  vec3 newPosition = position;

  if (isStartCord(number)) {
    newPosition.xy =  getCircleCord(number / 2.0, total);
  } else {
    newPosition.xy =  getCircleCord( floor(number / 2.0) * multiplier, total);
  }

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition,1.0);
}

bool isStartCord(float number) {
  return mod(number, 2.0) == 0.0;
}

vec2 getCircleCord(float number, float total) {
    float normalized = (number / total) * 2.0 * PI;
    return vec2(cos(normalized), sin(normalized));
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