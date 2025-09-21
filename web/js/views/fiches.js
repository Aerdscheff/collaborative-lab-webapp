import { getFiches, API } from '../api.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app) {
  app.innerHTML = `
    <section class="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">📚 Mes fiches</h2>
      <div id="fiches-feedback" class="mb-4"></div>
      <div id="fiches-list" class="space-y-4"></div>
      <div class="mt-6 text-right">
        <a href="#/fiches/create"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          ➕ Nouvelle fiche
        </a>
      </div>
    </section>
  `;

  const feedback = app.querySelector('#fiches-feedback');
  const list = app.querySelector('#fiches-list');

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
        <div class="border rounded p-4 shadow-sm">
          <h3 class="text-lg font-medium">${fiche.title || 'Sans titre'}</h3>
          <p class="text-sm text-gray-600 mb-2">${fiche.summary || ''}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded edit-fiche"
                    data-id="${fiche.id}">
              ✏️ Modifier
            </button>
            <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded delete-fiche"
                    data-id="${fiche.id}">
              🗑 Supprimer
            </button>
            <a href="#/fiches/${fiche.id}"
               class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">
              👀 Voir la fiche
            </a>
            <a href="#/fiches/${fiche.id}/messages"
               class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
              💬 Voir les messages
            </a>
          </div>
        </div>
      `
      )
      .join('');

    // Boutons Modifier
    list.querySelectorAll('.edit-fiche').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.location.hash = `#/fiches/create?id=${btn.dataset.id}`;
      });
    });

    // Boutons Supprimer
    list.querySelectorAll('.delete-fiche').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Supprimer cette fiche ?')) return;
        try {
          await API.remove(btn.dataset.id);
          showFeedback(feedback, 'success', 'Fiche supprimée ✅');
          render(app); // recharger la liste
        } catch (err) {
          console.error('[fiches] Erreur suppression', err);
          showFeedback(feedback, 'error', err.message || 'Impossible de supprimer la fiche.');
        }
      });
    });
  } catch (err) {
    console.error('[fiches] Erreur chargement', err);
    showFeedback(feedback, 'error', 'Impossible de charger les fiches.');
  }
}
