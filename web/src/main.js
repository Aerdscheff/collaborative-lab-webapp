import './styles.css';
import { bindRouteEvents, renderRoute } from './routes.js';

const app = document.getElementById('app');

async function mount() {
  const html = await renderRoute(window.location.pathname);
  app.innerHTML = html;
  bindRouteEvents(app);
}

window.addEventListener('popstate', mount);
window.addEventListener('load', mount);
