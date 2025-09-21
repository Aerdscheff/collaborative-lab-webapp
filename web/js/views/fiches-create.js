import { supabase } from '../auth.js';
import { API } from '../api.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app) {
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const ficheId = params.get('id');

  app.innerHTML = `
    <section class="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">
        ${ficheId ? '✏️ Modifier une fiche' : '➕ Nouvelle fiche'}
      </h2>
      <div id="fiche-feedback" class="mb-4"></div>
      <form id="fiche-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Titre</label>
          <input type="text" name="title" class="mt-1 block w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Résumé</label>
          <textarea name="summary" rows="3" class="mt-1 block w-full border rounded px-3 py-2" required></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Contenu</label>
          <textarea name="content" rows="5" class="mt-1 block w-full border rounded px-3 py-2"></textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" id="cancel-fiche"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Annuler
          </button>
          <button type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            ${ficheId ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
      <div id="fiche-messages-link" class="mt-6"></div>
    </section>
  `;

  const form = app.querySelector('#fiche-form');
  const feedback = app.querySelector('#fiche-feedback');
  const cancelBtn = app.querySelector('#cancel-fiche');
  const linkContainer = app.querySelector('#fiche-messages-link');

  // Préremplir si mode édition
  if (ficheId) {
    try {
      showFeedback(feedback, 'info', 'Chargement de la fiche…');
      const fiche = await API.get(ficheId);
      if (fiche) {
        form.title.value = fiche.title || '';
        form.summary.value = fiche.summary || '';
        form.content.value = fiche.content || '';
        feedback.innerHTML = '';
        linkContainer.innerHTML = `
          <a href="#/fiches/${ficheId}/messages"
             class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            💬 Voir les messages liés
          </a>
        `;
      } else {
        showFeedback(feedback, 'error', 'Fiche introuvable.');
      }
    } catch (err) {
      console.error('[fiches-create] Erreur chargement fiche', err);
      showFeedback(feedback, 'error', 'Impossible de charger la fiche.');
    }
  }

  // Soumission formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showFeedback(feedback, 'info', ficheId ? 'Mise à jour…' : 'Création…');

    const payload = {
      title: form.title.value.trim(),
      summary: form.summary.value.trim(),
      content: form.content.value.trim(),
      updated_at: new Date().toISOString()
    };

    try {
      if (ficheId) {
        await API.update(ficheId, payload);
        showFeedback(feedback, 'success', 'Fiche mise à jour avec succès ✅');
        linkContainer.innerHTML = `
          <a href="#/fiches/${ficheId}/messages"
             class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            💬 Voir les messages liés
          </a>
        `;
      } else {
        const res = await API.create(payload);
        const newId = res.id;
        showFeedback(feedback, 'success', 'Fiche créée avec succès ✅');
        linkContainer.innerHTML = `
          <a href="#/fiches/${newId}/messages"
             class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            💬 Voir les messages liés
          </a>
        `;
      }
    } catch (err) {
      console.error('[fiches-create] Erreur save', err);
      showFeedback(feedback, 'error', err.message || 'Impossible d’enregistrer la fiche.');
    }
  });

  // Bouton annuler
  cancelBtn.addEventListener('click', () => {
    window.location.hash = '#/fiches';
  });
}
