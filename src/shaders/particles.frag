precision highp float;

uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vPUv);
    float dist = 0.5 - distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.0, 0.2, dist);
    gl_FragColor = vec4(color.rgb, alpha);
}