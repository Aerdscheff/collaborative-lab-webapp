import { getFicheById } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app, id) {
  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-[#E25C5C] mb-8">📄 Détail de la fiche</h1>
    <div id="fiche-detail-feedback" class="mb-6"></div>
    <div id="fiche-detail" class="max-w-3xl mx-auto"></div>
    <div class="mt-8 text-center">
      <a href="#fiches"
         class="inline-block bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-[0_0_15px_3px_rgba(64,224,208,0.6)] transition text-base font-medium">
        ⬅️ Retour aux fiches
      </a>
    </div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('fiche-detail-feedback');
  const container = document.getElementById('fiche-detail');

  try {
    showFeedback(feedback, 'info', '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-[#E25C5C] rounded-full mx-auto"></div>');
    const fiche = await getFicheById(id);
    feedback.innerHTML = '';

    if (!fiche) {
      container.innerHTML = `<p class="text-gray-500">❌ Fiche introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="font-exo2 text-2xl text-[#E25C5C] font-semibold mb-4">${fiche.title || 'Sans titre'}</h2>
        <p class="text-gray-700 mb-6">${fiche.summary || 'Pas de résumé disponible.'}</p>

        <div class="space-y-2 text-gray-600">
          <p><strong>Niveau :</strong> ${fiche.level || 'Non spécifié'}</p>
          <p><strong>Discipline :</strong> ${fiche.discipline || 'Non spécifiée'}</p>
          <p><strong>Tags :</strong> ${(fiche.tags && fiche.tags.join(', ')) || 'Aucun'}</p>
        </div>

        <div class="mt-6 flex space-x-3">
          <a href="#/fiches/${fiche.id}/edit"
             aria-label="Modifier la fiche ${fiche.title || ''}"
             class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-md transition">
             ✏️ Modifier
          </a>
          <a href="#/fiches/${fiche.id}/messages"
             aria-label="Voir les messages de la fiche ${fiche.title || ''}"
             class="bg-[#E25C5C] hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md transition">
             💬 Messages
          </a>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger cette fiche.');
  }
}
