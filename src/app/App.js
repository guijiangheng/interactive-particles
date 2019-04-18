import GUIView from './GUIView';
import WebGLView from './WebGLView';

export default class App {
  constructor() {
    this.webgl = new WebGLView();
    this.gui = new GUIView(this.webgl);
    window.gui = this.gui;
    this.resize();
    this.addListeners();
  }

  resize() {
    this.webgl.resize();
  }

  update() {
    this.webgl.update();
    this.gui.update();
  }

  toggleGUI() {
    this.gui.toggle();
  }

  addListeners() {
    const el = this.webgl.renderer.domElement;
    el.addEventListener('click', () => this.webgl.next());
  }
}
