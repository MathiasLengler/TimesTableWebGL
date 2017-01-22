/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

uniform float opacity;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, opacity);
}