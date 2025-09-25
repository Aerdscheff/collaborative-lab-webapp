import { getFiches, API } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  let content = `
    <h1 class="text-2xl font-bold text-[#E25C5C] mb-6">📚 Mes fiches</h1>
    <div id="fiches-feedback" class="mb-4"></div>
    <div id="fiches-list" class="space-y-4"></div>
    <div class="mt-6 text-right">
      <a href="#/fiches/create"
        class="bg-[#E25C5C] hover:bg-red-600 text-white px-4 py-2 rounded">
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

    if (!fiches || fiches.length === 0) {
      list.innerHTML = `<p class="text-gray-500">Aucune fiche disponible pour l’instant.</p>`;
      feedback.innerHTML = '';
      return;
    }

    feedback.innerHTML = '';
    list.innerHTML = fiches
      .map(
        (fiche) => `
        <div class="border border-[#E25C5C] rounded-lg p-4 bg-white shadow-sm">
          <h3 class="text-lg font-medium text-[#E25C5C]">${fiche.title || 'Sans titre'}</h3>
          <p class="text-sm text-gray-600 mb-2">${fiche.summary || ''}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <a href="#/fiches/${fiche.id}"
               class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">👀 Voir la fiche</a>
            <a href="#/fiches/${fiche.id}/messages"
               class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">💬 Messages</a>
          </div>
        </div>
      `
      )
      .join('');
  } catch (err) {
    console.error('[fiches] Erreur chargement', err);
    showFeedback(feedback, 'error', 'Impossible de charger les fiches.');
  }
}
