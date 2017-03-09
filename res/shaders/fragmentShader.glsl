uniform float opacity;
uniform sampler2D noise;
uniform float noiseStrength;

varying vec3 vColor;
varying float vLinePosition;

void main() {
  gl_FragColor = vec4(vColor, opacity);

  float noise = vec4(texture2D(noise, vec2(vLinePosition * 1024.0, 0.5))).r;

  gl_FragColor.rgb += mix(-noiseStrength/255.0, noiseStrength/255.0, noise);
}