uniform float multiplier;
uniform float total;
uniform float colorMethod;

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

  float theta = 2.0 * PI * (floor(number / 2.0) * (multiplier - 1.0) / total);
  float distance = abs(sin(theta / 2.0));

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition,1.0);

  // colorMethod switch
  if (colorMethod == 0.0) {
    // solid
    vColor.xyz = vec3(1.0, 1.0, 1.0);
  } else if (colorMethod == 1.0) {
    // faded
    if (isStartCord(number)) {
      vColor.xyz = vec3(1.0, 1.0, 1.0);
    } else {
      vColor.xyz = vec3(0.0, 0.0, 0.0);
    }
  } else if (colorMethod == 2.0) {
    // lengthOpacity

    vColor.xyz = vec3(1.0-distance);
  } else if (colorMethod == 3.0) {
    // lengthHue
    vColor.xyz = vec3(0.0, 0.0, 1.0);
  } else {
    // fallback error red
    vColor.xyz = vec3(1.0, 0.0, 0.0);
  }
}

bool isStartCord(float number) {
  return mod(number, 2.0) < 0.01;
}

vec2 getCircleCord(float number, float total) {
    float normalized = (number / total) * 2.0 * PI;
    return vec2(cos(normalized), sin(normalized));
}
