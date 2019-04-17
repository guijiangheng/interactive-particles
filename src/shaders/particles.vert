precision highp float;

attribute float pindex;
attribute float angle;
attribute vec3 position;
attribute vec2 offset;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uSize;
uniform float uDepth;
uniform float uRandom;
uniform vec2 uTextureSize;
uniform sampler2D uTouch;
uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

float random(float n) {
    return fract(sin(n) * 43758.5453123);
}

float y(vec3 rgb) {
    return rgb.r * 0.21 + rgb.g * 0.71 + rgb.b * 0.08;
}

void main() {
    vUv = uv;
    vPUv = offset / uTextureSize;

    vec3 pos = vec3(offset, 0.0);
    pos.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;

    float rndz = (random(pindex) + snoise2(vec2(pindex * 0.1, uTime * 0.1)));
    pos.z += random(pindex) * 2.0 * uDepth;

    pos.xy -= uTextureSize * 0.5;

    float pSize = snoise2(vec2(uTime, pindex) * 0.5) + 2.0;
    float grey = y(texture2D(uTexture, vPUv).xyz);
	pSize *= max(grey, 0.2);
	pSize *= uSize;

    float t = texture2D(uTouch, vPUv).r;
	pos.z += t * 20.0 * rndz;
	pos.x += cos(angle) * t * 20.0 * rndz;
	pos.y += sin(angle) * t * 20.0 * rndz;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    mvPosition.xyz += position * pSize;

    gl_Position = projectionMatrix * mvPosition;
}