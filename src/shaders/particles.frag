precision highp float;

uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

float y(vec3 rgb) {
    return rgb.r * 0.21 + rgb.g * 0.71 + rgb.b * 0.08;
}

void main() {
    vec4 color = texture2D(uTexture, vPUv);
    // float grey = y(color.rgb);
    // gl_FragColor = vec4(grey, grey, grey, 1.0);
    gl_FragColor = color;
}