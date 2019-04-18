import * as THREE from 'three';

export default class TouchTexture {
  constructor() {
    this.size = 64;
    this.maxAge = 120;
    this.radius = 0.15;
    this.trails = [];
    this.initTexture();
  }

  initTexture() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.context = this.canvas.getContext('2d');
    this.clear();
    this.texture = new THREE.Texture(this.canvas);
  }

  easeInOut(t) {
    if (t < 0.3) t /= 0.3;
    else t = 1 - (t - 0.3) / 0.7;
    return Math.sin(t * Math.PI / 2);
  }

  clear() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(touch) {
    let force = 0;
    const last = this.trails[this.trails.length - 1];

    if (last) {
      const dx = touch.x - last.x;
      const dy = touch.y - last.y;
      const dist = dx * dx + dy * dy;
      force = Math.min(1, dist * 10000);
    }

    this.trails.push({x: touch.x, y: touch.y, age: 0, force});
  }

  drawTouch(trail) {
    const p = {
      x: trail.x * this.size,
      y: (1 - trail.y) * this.size,
    };

    const intensity = this.easeInOut(trail.age / this.maxAge);
    const radius = this.size * this.radius * intensity * trail.force;
    const gradient = this.context.createRadialGradient(p.x, p.y, radius * 0.25, p.x, p.y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.context.beginPath();
    this.context.fillStyle = gradient;
    this.context.arc(p.x, p.y, radius, 0, Math.PI * 2);
    this.context.fill();
  }

  update() {
    this.clear();
    this.trails.forEach((trail, i) => {
      this.drawTouch(trail);
      ++trail.age;
      if (trail.age > this.maxAge) {
        this.trails.splice(i, 1);
      }
    });
    this.texture.needsUpdate = true;
  }

  destroy() {
    this.texture.dispose();
  }
}
