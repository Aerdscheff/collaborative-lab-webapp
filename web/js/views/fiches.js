import { getFiches } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-3xl font-exo2 font-bold text-[#E25C5C] mb-6">📚 Mes fiches</h1>
    <div id="fiches-feedback" class="mb-4"></div>
    <div id="fiches-list" class="space-y-4"></div>
    <div class="mt-6 text-right">
      <a href="#/fiches/create"
        class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)] transition">
        ➕ Nouvelle fiche
      </a>
    </div>
  `;
  renderLayout(app, content);

  const feedback = document.getElementById('fiches-feedback');
  const list = document.getElementById('fiches-list');

  try {
    showFeedback(feedback, 'info', 'Chargement des fiches…');
    const fiches = await getFiches();
    feedback.innerHTML = '';

    if (!fiches || fiches.length === 0) {
      list.innerHTML = `<p class="text-gray-500">Aucune fiche disponible.</p>`;
      return;
    }

    list.innerHTML = fiches.map(f => `
      <div class="rounded-lg bg-white shadow-md hover:scale-[1.01] transition">
        <div class="bg-gradient-to-r from-[#E25C5C] to-purple-600 h-2"></div>
        <div class="p-4">
          <h3 class="font-exo2 text-[#E25C5C] text-lg font-semibold">${f.title || 'Sans titre'}</h3>
          <p class="text-gray-700">${f.summary || ''}</p>
          <div class="mt-2 flex gap-2">
            <a href="#/fiches/${f.id}" class="text-sm text-[#E25C5C] hover:underline">👀 Voir</a>
            <a href="#/fiches/${f.id}/messages" class="text-sm text-[#E25C5C] hover:underline">💬 Messages</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch {
    showFeedback(feedback, 'error', 'Erreur de chargement.');
  }
}
