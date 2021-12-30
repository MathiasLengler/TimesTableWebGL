uniform float multiplier;
uniform float total;
uniform int colorMethod;

varying vec3 vColor;
varying float vLinePosition;

#define PI 3.1415926535897932384626433832795

float myDistance(float index, float total, float multiplier);
vec2 getCircleCord(float number, float total);
vec3 hsv2rgb(vec3 c);

void main() {
  vec2 circleCord;

  float index = position.x;
  float isStartIndicator = position.y;
  bool isStart = isStartIndicator == 0.0;
  vLinePosition = isStartIndicator;
  if (isStart) {
    circleCord = getCircleCord(index, total);
  } else {
    circleCord = getCircleCord(index * multiplier, total);
  }

  gl_Position = projectionMatrix *
                modelViewMatrix *
  vec4(circleCord, 0.0, 1.0);

  // colorMethod switch
  if (colorMethod == 0) {
    // solid
    vColor = vec3(1.0);
  } else if (colorMethod == 1) {
    // faded
    if (isStart) {
      vColor = vec3(0.0);
    } else {
      vColor = vec3(1.0);
    }
  } else if (colorMethod == 2) {
    // lengthOpacity
    vColor = vec3(1.0 - myDistance(index, total, multiplier));
  } else if (colorMethod == 3) {
    // lengthHue
    vColor = vec3(hsv2rgb(vec3(myDistance(index, total, multiplier), 1.0, 1.0)));
  } else if (colorMethod == 4) {
    // indexHue
    vColor = vec3(hsv2rgb(vec3(index / total, 1.0, 1.0)));
  } else if (colorMethod == 5) {
    // fadedIndexHue
    if (isStart) {
      vColor = vec3(hsv2rgb(vec3(index / total, 1.0, 1.0)));
    } else {
      vColor = vec3(hsv2rgb(vec3(mod(index * multiplier, total) / total, 1.0, 1.0)));
    }
  } else {
    // fallback error red
    vColor = vec3(1.0, 0.0, 0.0);
  }
}

float myDistance(float index, float total, float multiplier) {
  float theta = 2.0 * PI * index * (multiplier - 1.0) / total;
  return abs(sin(theta / 2.0));
}

vec2 getCircleCord(float index, float total) {
  float normalized = 2.0 * PI * index / total;
    return vec2(cos(normalized), sin(normalized));
}

// source: http://gamedev.stackexchange.com/a/59808
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}