import { getFicheById, deleteFiche } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app, id) {
  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-[#E25C5C] mb-8">🗑️ Supprimer une fiche</h1>
    <div id="fiche-delete-feedback" class="mb-6"></div>
    <div id="fiche-delete-container" class="max-w-2xl mx-auto"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('fiche-delete-feedback');
  const container = document.getElementById('fiche-delete-container');

  try {
    // loader
    showFeedback(
      feedback,
      'info',
      '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-[#E25C5C] rounded-full mx-auto"></div>'
    );

    const fiche = await getFicheById(id);
    feedback.innerHTML = '';

    if (!fiche) {
      container.innerHTML = `<p class="text-gray-500">❌ Fiche introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="bg-white shadow-md rounded-xl p-6 space-y-6">
        <p class="text-gray-700">
          Es-tu sûr de vouloir supprimer la fiche 
          <strong class="text-[#E25C5C]">"${fiche.title || 'Sans titre'}"</strong> ?
        </p>
        <div class="flex justify-between">
          <a href="#/fiches/${id}"
             class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl shadow-md transition">
             ❌ Annuler
          </a>
          <button id="confirm-delete"
                  class="bg-gradient-to-r from-red-600 to-[#E25C5C] text-white px-6 py-2 rounded-xl shadow-md hover:shadow-[0_0_15px_3px_rgba(255,0,0,0.6)] transition text-base font-medium">
            🗑️ Supprimer
          </button>
        </div>
      </div>
    `;

    // gestion du bouton de confirmation
    document.getElementById('confirm-delete').addEventListener('click', async () => {
      try {
        showFeedback(
          feedback,
          'info',
          '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-red-600 rounded-full mx-auto"></div>'
        );

        await deleteFiche(id);
        showFeedback(feedback, 'success', '✅ Fiche supprimée avec succès !');

        // redirection vers la liste
        setTimeout(() => {
          window.location.hash = '#fiches';
        }, 1000);
      } catch (err) {
        console.error(err);
        showFeedback(feedback, 'error', '❌ Erreur lors de la suppression de la fiche.');
      }
    });
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger la fiche à supprimer.');
  }
}
