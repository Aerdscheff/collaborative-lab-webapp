import { renderLayout } from '../layout.js';

export async function render(app) {
  let content = `
    <h1 class="text-2xl font-bold text-[#E25C5C] mb-6">⚙️ Administration</h1>
    <p class="text-gray-700">Outils à venir : gestion des utilisateurs, exports, paramètres.</p>
  `;
  renderLayout(app, content);
}
