import { createFiche } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';
import { requireAuth } from '../authGuard.js';

export async function render(app) {
  const session = await requireAuth();
  if (!session) return;

  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-purple-700 mb-8">➕ Créer une fiche</h1>
    <div id="fiche-create-feedback" class="mb-6"></div>

    <form id="fiche-create-form" class="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input id="title" name="title" type="text" required
               class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
      </div>
      <div>
        <label for="summary" class="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
        <textarea id="summary" name="summary" rows="4" required
                  class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2"></textarea>
      </div>
      <div class="flex justify-end">
        <button type="submit"
                class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition text-base font-medium">
          💾 Enregistrer
        </button>
      </div>
    </form>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('fiche-create-feedback');
  const form = document.getElementById('fiche-create-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const fiche = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      owner: session.user.email,
    };

    try {
      showFeedback(feedback, 'info', 'Création en cours...');
      await createFiche(fiche);
      showFeedback(feedback, 'success', '✅ Fiche créée avec succès !');
      setTimeout(() => {
        window.location.hash = '#fiches';
      }, 1000);
    } catch (err) {
      console.error(err);
      showFeedback(feedback, 'error', '❌ Erreur lors de la création.');
    }
  });
}
