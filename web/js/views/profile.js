import { getProfile } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-[#E25C5C] mb-8">👤 Mon profil</h1>
    <div id="profil-feedback" class="mb-6"></div>
    <div id="profil-content" class="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('profil-feedback');
  const container = document.getElementById('profil-content');

  try {
    showFeedback(feedback, 'info', '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-[#E25C5C] rounded-full mx-auto"></div>');
    const profil = await getProfile();
    feedback.innerHTML = '';

    if (!profil) {
      container.innerHTML = `<p class="text-gray-500">Profil introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <h2 class="font-exo2 text-xl text-[#E25C5C] font-semibold mb-4">${profil.name || 'Nom inconnu'}</h2>
      <p class="text-gray-700 mb-2"><strong>Email :</strong> ${profil.email || 'Non renseigné'}</p>
      <p class="text-gray-700 mb-2"><strong>Discipline :</strong> ${profil.discipline || 'Non renseignée'}</p>
      <div class="mt-6">
        <a href="#profil-edit"
           aria-label="Modifier mon profil"
           class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
           ✏️ Modifier mon profil
        </a>
      </div>
    `;
  } catch {
    showFeedback(feedback, 'error', 'Impossible de charger le profil.');
  }
}
