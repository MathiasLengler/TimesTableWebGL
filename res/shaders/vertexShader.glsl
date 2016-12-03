uniform float multiplier;

/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */
void main() {
  vec3 newPosition = position * multiplier;
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition,1.0);
}
