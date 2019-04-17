import * as THREE from 'three';
import TouchTexture from './TouchTexture';
import InteractiveControl from './InteractiveControl';

const y = (rgbas, index) => {
    const r = rgbas[index * 4 + 0];
    const g = rgbas[index * 4 + 1];
    const b = rgbas[index * 4 + 2];
    return r * 0.21 + g * 0.71 + b * 0.08;
};

export default class Particles {
    constructor(webgl) {
        this.webgl = webgl;
        this.container = new THREE.Object3D();
        this.touchTexture = new TouchTexture();
        this.control = new InteractiveControl(webgl.camera, webgl.renderer.domElement);
    }

    init(src) {
        new THREE.TextureLoader().load(src, (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            this.texture = texture;
            this.width = texture.image.width;
            this.height = texture.image.height;

            this.initTouchTexture();
            this.initParticles();
            this.initHitPlane();
            this.resize();
            this.show();
        });
    }

    update(delta) {
        this.touchTexture.update();
        if (this.particles) {
            this.particles.material.uniforms.uTime.value += delta;
        }
    }

    show() {
        this.addListeners();
    }

    resize() {
        this.control.resize();
        if (this.hitPlane) {
            const scale = this.webgl.fovHeight / this.height;
            this.hitPlane.scale.set(scale, scale, 1);
            this.particles.scale.set(scale, scale, 1);
        }
    }

    initParticles() {
        const image = this.texture.image;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        context.scale(1, -1);
        context.drawImage(image, 0, 0, this.width, -this.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const rgbas = Float32Array.from(imageData.data);

        const threshold = 34;
        let numPoints = 0;
        let numPixels = this.width * this.height;

        for (let i = 0; i < numPixels; ++i) {
            if (y(rgbas, i) > threshold) ++numPoints;
        }

        const indices = new Uint16Array(numPoints);
        const offsets = new Float32Array(numPoints * 2);
        const angles = new Float32Array(numPoints);

        for (let i = 0, j = 0; i < numPixels; ++i) {
            if (y(rgbas, i) > threshold) {
                indices[j] = i;
                offsets[j * 2 + 0] = i % this.width;
                offsets[j * 2 + 1] = Math.floor(i / this.width);
                angles[j] = Math.random() * Math.PI * 2;
                ++j;
            }
        }

        const geometry = new THREE.InstancedBufferGeometry();

        const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
        positions.setXYZ(0, -0.5,  0.5,  0.0);
		positions.setXYZ(1,  0.5,  0.5,  0.0);
		positions.setXYZ(2, -0.5, -0.5,  0.0);
		positions.setXYZ(3,  0.5, -0.5,  0.0);
        geometry.addAttribute('position', positions);
        
        const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
		uvs.setXYZ(0,  0.0,  0.0);
		uvs.setXYZ(1,  1.0,  0.0);
		uvs.setXYZ(2,  0.0,  1.0);
		uvs.setXYZ(3,  1.0,  1.0);
        geometry.addAttribute('uv', uvs);
        
        geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1));
        geometry.addAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
        geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 2, false));
        geometry.addAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

        const uniforms = {
            uTime: { value: 0.0 },
            uSize: { value: 1.2 },
            uDepth: { value: 2.0 },
            uRandom: { value: 1.0 },
            uTexture: { value: this.texture },
            uTouch: { value: this.touchTexture.texture },
            uTextureSize: { value: new THREE.Vector2(this.width, this.height) }
        };

        const material = new THREE.RawShaderMaterial({
            uniforms,
            depthTest: false,
            transparent: true,
            vertexShader: require('../shaders/particles.vert').default,
            fragmentShader: require('../shaders/particles.frag').default,
        });

        this.particles = new THREE.Mesh(geometry, material);
        this.container.add(this.particles);
    }
    
    initHitPlane() {
        const geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
        const material = new THREE.MeshBasicMaterial({ visible: false, color: 0x0000ff, wireframe: true, depthTest: false });
        this.hitPlane = new THREE.Mesh(geometry, material);
        this.container.add(this.hitPlane);
    }
    
    initTouchTexture() {
        this.touchTexture = new TouchTexture();
    }

    addListeners() {
        this.onInteractiveMoveHandler = this.onInteractiveMove.bind(this);
        this.control.objects.push(this.hitPlane);
        this.control.addListeners();
        this.control.addListener('interactive-move', this.onInteractiveMoveHandler);
    }
    
    removeListeners() {
        this.control.removeListener('interactive-move', this.onInteractiveMoveHandler);
        this.control.removeListeners();
    }

    onInteractiveMove(e) {
        this.touchTexture.addTouch(e.data.uv);
        console.log(e.data.uv);
    }
    
    destroy() {
        if (!this.hitPlane) return;

        this.hitPlane.parent.remove(hitPlane);
        this.hitPlane.geometry.dispose();
        this.hitPlane.material.dispose();
        this.hitPlane = null;

        this.particles.parent.remove(this.particles);
        this.particles.geometry.dispose();
        this.particles.material.dispose();
        this.particles = null;
    }
}
