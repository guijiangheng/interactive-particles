import ControlKit from '@brunoimbrizi/controlkit';

export default class GUIView {
  constructor(webgl) {
    this.webgl = webgl;

    this.touchRadius = 0.15;
    this.touchRadiusRange = [0, 1];

    this.particleDepth = 4;
    this.particleDepthRange = [1, 10];

    this.particleSize = 1.5;
    this.particleSizeRange = [0, 3];

    this.particleRandomness = 2;
    this.particleRandomnessRange = [1, 10];

    this.initControlKit();
  }

  initControlKit() {
    this.controlKit = new ControlKit();
    this.controlKit.addPanel({width: 300, enable: true})
        .addGroup({label: 'Touch'})
        .addCanvas({label: 'trail', height: 64})
        .addSlider(this, 'touchRadius', 'touchRadiusRange', {label: 'radius', onChange: this.onTouchRadiusChange.bind(this)})
        .addGroup({label: 'Particles'})
        .addSlider(this, 'particleSize', 'particleSizeRange', {label: 'size', onChange: this.onParticleChange.bind(this)})
        .addSlider(this, 'particleDepth', 'particleDepthRange', {label: 'depth', onChange: this.onParticleChange.bind(this)})
        .addSlider(this, 'particleRandomness', 'particleRandomnessRange', {label: 'randomness', onChange: this.onParticleChange.bind(this)});

    const touchComponent = this.controlKit.getComponentBy({label: 'trail'});
    this.touchCanvas = touchComponent._canvas;
    this.touchContext = this.touchCanvas.getContext('2d');
  }

  toggle() {
    if (this.controlKit._enabled) this.controlKit.disable();
    else this.controlKit.enable();
  }

  update() {
    const sourceImage = this.webgl.particles.touchTexture.canvas;
    const x = Math.floor((this.touchCanvas.width - sourceImage.width) * 0.5);
    this.touchContext.fillRect(0, 0, this.touchCanvas.width, this.touchCanvas.height);
    this.touchContext.drawImage(sourceImage, x, 0);
  }

  onTouchRadiusChange() {
    this.webgl.particles.touchTexture.radius = this.touchRadius;
  }

  onParticleChange() {
    this.webgl.particles.particles.material.uniforms.uSize.value = this.particleSize;
    this.webgl.particles.particles.material.uniforms.uDepth.value = this.particleDepth;
    this.webgl.particles.particles.material.uniforms.uRandom.value = this.particleRandomness;
  }
}
