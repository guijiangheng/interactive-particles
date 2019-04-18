import * as THREE from 'three';
import Particles from './Particles';

export default class WebGLView {
  constructor() {
    this.images = [
      require('../../static/images/sample-01.png'),
      require('../../static/images/sample-02.png'),
      require('../../static/images/sample-03.png'),
      require('../../static/images/sample-04.png'),
      require('../../static/images/sample-05.png'),
    ];

    this.initScene();
    this.initParticles();
    this.goto(0);
  }

  initScene() {
    this.clock = new THREE.Clock(true);
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 300;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
  }

  initParticles() {
    this.particles = new Particles(this);
    this.scene.add(this.particles.container);
  }

  goto(index) {
    if (this.currentIndex === undefined) {
      this.particles.init(this.images[index]);
    } else {
      this.particles.hide().then(() => this.particles.init(this.images[index]));
    }
    this.currentIndex = index;
  }

  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.goto(this.currentIndex + 1);
    } else {
      this.goto(0);
    }
  }

  update() {
    this.particles.update(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.fovHeight = 2 * Math.tan(this.camera.fov / 2 / 180 * Math.PI) * this.camera.position.z;
    this.particles.resize();
  }
}
