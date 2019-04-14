import * as THREE from 'three';
import TouchTexture from './TouchTexture';
import InteractiveControl from './InteractiveControl';

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

            this.initHitPlane();
            this.initTouchTexture();
            this.resize();
            this.show();
        });
    }

    update() {
        this.touchTexture.update();
    }

    show() {
        this.addListeners();
    }

    resize() {
        this.control.resize();
        if (this.hitPlane) {
            const scale = this.webgl.fovHeight / this.height;
            this.hitPlane.scale.set(scale, scale, 1);
        }
    }

    initTouchTexture() {
        this.touchTexture = new TouchTexture();
    }

    initHitPlane() {
        const geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff000, wireframe: true, depthTest: false });
        this.hitPlane = new THREE.Mesh(geometry, material);
        this.container.add(this.hitPlane);
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
    }
    
    destroy() {
        if (!this.hitPlane) return;
        this.hitPlane.parent.remove(hitPlane);
        this.hitPlane.geometry.dispose();
        this.hitPlane.material.dispose();
        this.hitPlane = null;
    }
}