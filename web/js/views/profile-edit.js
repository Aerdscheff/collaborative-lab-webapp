import { getFicheById, updateFiche } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app, id) {
  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-purple-700 mb-8">✏️ Modifier une fiche</h1>
    <div id="fiche-edit-feedback" class="mb-6"></div>
    <div id="fiche-edit-container" class="max-w-2xl mx-auto"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('fiche-edit-feedback');
  const container = document.getElementById('fiche-edit-container');

  try {
    // Loader spinner
    showFeedback(
      feedback,
      'info',
      '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-purple-600 rounded-full mx-auto"></div>'
    );

    const fiche = await getFicheById(id);
    feedback.innerHTML = '';

    if (!fiche) {
      container.innerHTML = `<p class="text-gray-500">❌ Fiche introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <form id="fiche-edit-form" class="bg-white shadow-md rounded-xl p-6 space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input id="title" name="title" type="text" aria-label="Titre de la fiche"
                 value="${fiche.title || ''}"
                 class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
        </div>

        <div>
          <label for="summary" class="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
          <textarea id="summary" name="summary" rows="4" aria-label="Résumé de la fiche"
                    class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">${fiche.summary || ''}</textarea>
        </div>

        <div class="flex justify-between">
          <a href="#fiches"
             class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl shadow-md transition">
             ⬅️ Annuler
          </a>
          <button type="submit"
                  class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-[0_0_15px_3px_rgba(64,224,208,0.6)] transition text-base font-medium">
            💾 Enregistrer
          </button>
        </div>
      </form>
    `;

    // Gestion du formulaire
    const form = document.getElementById('fiche-edit-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const updated = {
        title: formData.get('title'),
        summary: formData.get('summary'),
      };

      try {
        showFeedback(
          feedback,
          'info',
          '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-[#E25C5C] rounded-full mx-auto"></div>'
        );

        await updateFiche(id, updated);
        showFeedback(feedback, 'success', '✅ Fiche mise à jour avec succès !');

        // Redirection après succès
        setTimeout(() => {
          window.location.hash = `#/fiches/${id}`;
        }, 1000);
      } catch (err) {
        console.error(err);
        showFeedback(feedback, 'error', '❌ Erreur lors de la mise à jour de la fiche.');
      }
    });
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger cette fiche.');
  }
}
