uniform float multiplier;
uniform float total;

attribute float number;

attribute vec3 color;
varying vec3 vColor;

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

  vColor.xyz = color.xyz;
}

bool isStartCord(float number) {
  return mod(number, 2.0) < 0.01;
}

vec2 getCircleCord(float number, float total) {
    float normalized = (number / total) * 2.0 * PI;
    return vec2(cos(normalized), sin(normalized));
}
