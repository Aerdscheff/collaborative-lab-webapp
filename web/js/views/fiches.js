import { getFiches } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-[#E25C5C] mb-8">📚 Mes fiches</h1>
    <div id="fiches-feedback" class="mb-6"></div>
    <div id="fiches-list" class="grid gap-6 md:grid-cols-2"></div>
    <div class="mt-10 text-center">
      <a href="#/fiches/create"
        class="inline-block bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition text-lg font-medium">
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

    list.innerHTML = fiches
      .map(
        (fiche) => `
        <div class="rounded-lg bg-white shadow-md overflow-hidden transform transition hover:scale-[1.02] hover:shadow-lg">
          <div class="bg-gradient-to-r from-[#E25C5C] to-purple-600 h-2"></div>
          <div class="p-5">
            <h3 class="font-exo2 text-xl text-[#E25C5C] font-semibold mb-2">${fiche.title || 'Sans titre'}</h3>
            <p class="text-gray-700 mb-4">${fiche.summary || 'Pas de résumé disponible.'}</p>
            <div class="flex space-x-3">
              <a href="#fiches/${fiche.id}"
                 class="text-sm bg-[#E25C5C] hover:bg-red-600 text-white px-3 py-1 rounded-lg transition">
                 👀 Voir
              </a>
              <a href="#fiches/${fiche.id}/edit"
                 class="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition">
                 ✏️ Modifier
              </a>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  } catch {
    showFeedback(feedback, 'error', 'Impossible de charger les fiches.');
  }
}
