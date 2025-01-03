uniform float opacity;
uniform float noiseStrength;

varying vec3 vColor;
varying float vLinePosition;
varying float vIndex;

float cnoise(vec2 P);

// Source: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83#generic-123-noise
float rand(float n);
float rand(float n){return fract(sin(n) * 43758.5453123);}

void main() {
  gl_FragColor = vec4(vColor, opacity);

  float noise = rand(vIndex * vLinePosition);

  gl_FragColor.rgb += mix(-noiseStrength/255.0, noiseStrength/255.0, noise);
}
