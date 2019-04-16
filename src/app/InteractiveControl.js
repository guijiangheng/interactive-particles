import * as THREE from 'three';
import EventEmitter from 'events';
import browser from 'browser-detect';

export default class InteractiveControls extends EventEmitter {
    constructor(camera, el) {
        super()
        this.camera = camera;
        this.el = el || window;
        this.objects = [];
        this.hovered = null;
        this.raycaster = new THREE.Raycaster();
    }

    addListeners() {
        this.mouseMoveHandler = this.onMouseMove.bind(this);
        if (browser().mobile) {
            this.el.addEventListener('touchmove', this.mouseMoveHandler);
        } else {
            this.el.addEventListener('mousemove', this.mouseMoveHandler);
        }
    }

    removeListeners() {
        if (browser().mobile) {
            this.el.removeListeners('touchmove', this.mouseMoveHandler);
        } else {
            this.el.removeListeners('mousemove', this.mouseMoveHandler);
        }
    }

    onMouseMove(e) {
        const p = e.touches ? e.touches[0] : e;
        const mouse = {
            x:  p.clientX / this.rect.width * 2 - 1,
            y: -p.clientY / this.rect.width * 2 + 1
        };

        this.raycaster.setFromCamera(mouse, this.camera);
        const intersections = this.raycaster.intersectObjects(this.objects);

        if (intersections.length > 0) {
            const intersection = intersections[0];
            if (this.hovered !== intersection.object) {
                this.emit('interactive-out', { object: this.hovered });
                this.emit('interactive-over', { object: intersection.object });
                this.hovered = intersection.object;
            } else {
                this.emit('interactive-move', {
                    data: intersection,
                    object: intersection.object
                });
            }
        } else {
            if (this.hovered !== null) {
                this.emit('interactive-out', { object: this.hovered });
                this.hovered = null;
            }
        }
    }

    resize() {
        if (this.el === window) {
            this.rect = {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        } else {
            this.rect = this.el.getBoundingClientRect();
        }
    }
}
