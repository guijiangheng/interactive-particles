precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec2 offset;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uTextureSize;
uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

void main() {
    vUv = uv;
    vPUv = offset / uTextureSize;

    vec3 pos = vec3(offset, 0.0);
    pos.xy -= uTextureSize * 0.5;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    mvPosition.xyz += position;

    gl_Position = projectionMatrix * mvPosition;
}