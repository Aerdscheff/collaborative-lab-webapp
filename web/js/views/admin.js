import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-3xl font-exo2 text-[#E25C5C] mb-6">⚙️ Administration</h1>
    <p class="text-gray-700">Outils à venir : gestion des utilisateurs, exports, paramètres.</p>
  `;
  renderLayout(app, content);
}
