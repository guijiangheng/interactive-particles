import App from './app/App';
import './index.css';

const app = new App();
app.toggleGUI();
document.body.appendChild(app.webgl.renderer.domElement);

(function animate() {
  requestAnimationFrame(animate);
  app.update();
})();

window.addEventListener('resize', () => app.resize());

window.addEventListener('keyup', (e) => {
  // SPACE
  if (e.keyCode === 32) app.toggleGUI();
});
