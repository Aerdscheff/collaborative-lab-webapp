import { getFicheById, updateFiche } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';
import { requireAuth } from '../authGuard.js';

export async function render(app, ficheId) {
  const session = await requireAuth();
  if (!session) return;

  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-purple-700 mb-8">✏️ Modifier la fiche</h1>
    <div id="fiche-edit-feedback" class="mb-6"></div>
    <div id="fiche-edit-container" class="max-w-3xl mx-auto"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('fiche-edit-feedback');
  const container = document.getElementById('fiche-edit-container');

  try {
    showFeedback(feedback, 'info', 'Chargement de la fiche...');
    const fiche = await getFicheById(ficheId);
    feedback.innerHTML = '';

    if (!fiche) {
      container.innerHTML = `<p class="text-gray-500">❌ Fiche introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <form id="fiche-edit-form" class="bg-white shadow-md rounded-xl p-6 space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input id="title" name="title" type="text" value="${fiche.title || ''}" required
            class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
        </div>

        <div>
          <label for="summary" class="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
          <textarea id="summary" name="summary" rows="2" required
            class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">${fiche.summary || ''}</textarea>
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Contenu détaillé</label>
          <textarea id="content" name="content" rows="6"
            class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">${fiche.content || ''}</textarea>
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">Mots-clés (séparés par des virgules)</label>
          <input id="tags" name="tags" type="text"
            value="${fiche.tags ? fiche.tags.join(', ') : ''}"
            class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="period" class="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <input id="period" name="period" type="text"
              value="${fiche.period || ''}"
              class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
          </div>

          <div>
            <label for="discipline" class="block text-sm font-medium text-gray-700 mb-1">Discipline</label>
            <input id="discipline" name="discipline" type="text"
              value="${fiche.discipline || ''}"
              class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
          </div>

          <div>
            <label for="level" class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <input id="level" name="level" type="text"
              value="${fiche.level || ''}"
              class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
          </div>
        </div>

        <div class="flex justify-between items-center">
          <a href="#fiches/${fiche.id}"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl shadow-md transition">
            ⬅️ Annuler
          </a>
          <button type="submit"
            class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
            💾 Enregistrer
          </button>
        </div>
      </form>
    `;

    const form = document.getElementById('fiche-edit-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      const updated = {
        title: formData.get('title'),
        summary: formData.get('summary'),
        content: formData.get('content'),
        tags: formData.get('tags')
          ? formData.get('tags').split(',').map(tag => tag.trim())
          : [],
        period: formData.get('period'),
        discipline: formData.get('discipline'),
        level: formData.get('level'),
      };

      try {
        showFeedback(feedback, 'info', '💾 Sauvegarde en cours...');
        await updateFiche(fiche.id, updated);
        showFeedback(feedback, 'success', '✅ Fiche mise à jour avec succès !');

        setTimeout(() => {
          window.location.hash = `#fiches/${fiche.id}`;
        }, 1200);
      } catch (err) {
        console.error(err);
        showFeedback(feedback, 'error', '❌ Erreur lors de la mise à jour de la fiche.');
      }
    });
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger la fiche.');
  }
}
