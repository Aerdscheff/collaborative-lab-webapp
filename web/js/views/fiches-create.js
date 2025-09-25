import { supabase } from '../auth.js';
import { API } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const ficheId = params.get('id');

  let content = `
    <h1 class="text-2xl font-bold text-[#E25C5C] mb-6">${ficheId ? '✏️ Modifier une fiche' : '➕ Nouvelle fiche'}</h1>
    <div id="fiche-feedback" class="mb-4"></div>
    <form id="fiche-form" class="space-y-4">
      <input type="text" name="title" placeholder="Titre" class="w-full border rounded px-3 py-2" required />
      <textarea name="summary" rows="3" placeholder="Résumé" class="w-full border rounded px-3 py-2"></textarea>
      <textarea name="content" rows="5" placeholder="Contenu détaillé" class="w-full border rounded px-3 py-2"></textarea>
      <div class="flex justify-end space-x-2">
        <a href="#/fiches" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">Annuler</a>
        <button type="submit" class="bg-[#E25C5C] hover:bg-red-600 text-white px-4 py-2 rounded">${ficheId ? 'Mettre à jour' : 'Créer'}</button>
      </div>
    </form>
    <div id="fiche-messages-link" class="mt-6"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('fiche-feedback');
  const form = document.getElementById('fiche-form');
  const linkContainer = document.getElementById('fiche-messages-link');

  if (ficheId) {
    try {
      const fiche = await API.get(ficheId);
      if (fiche) {
        form.title.value = fiche.title || '';
        form.summary.value = fiche.summary || '';
        form.content.value = fiche.content || '';
        linkContainer.innerHTML = `<a href="#/fiches/${ficheId}/messages" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">💬 Voir les messages liés</a>`;
      }
    } catch {
      showFeedback(feedback, 'error', 'Impossible de charger la fiche.');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = { title: form.title.value, summary: form.summary.value, content: form.content.value };
    try {
      if (ficheId) {
        await API.update(ficheId, payload);
        showFeedback(feedback, 'success', 'Fiche mise à jour ✅');
      } else {
        const res = await API.create(payload);
        showFeedback(feedback, 'success', 'Fiche créée ✅');
        linkContainer.innerHTML = `<a href="#/fiches/${res.id}/messages" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">💬 Voir les messages liés</a>`;
      }
    } catch {
      showFeedback(feedback, 'error', 'Erreur enregistrement.');
    }
  });
}
