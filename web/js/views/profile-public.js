import { getProfile } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app, userId) {
  const content = `
    <h1 class="text-3xl font-exo2 font-bold text-[#E25C5C] mb-8">👤 Profil utilisateur</h1>
    <div id="profil-public-feedback" class="mb-6"></div>
    <div id="profil-public-container" class="max-w-2xl mx-auto"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('profil-public-feedback');
  const container = document.getElementById('profil-public-container');

  try {
    showFeedback(feedback, 'info', 'Chargement du profil...');
    const profil = await getProfile(userId);
    feedback.innerHTML = '';

    if (!profil) {
      container.innerHTML = `<p class="text-gray-500">❌ Profil introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="bg-white shadow-md rounded-xl p-6 space-y-4">
        <p><strong>Nom :</strong> ${profil.name || '—'}</p>
        <p><strong>Discipline :</strong> ${profil.discipline || '—'}</p>
        <p><strong>Bio :</strong> ${profil.bio || '—'}</p>
        <p><strong>Email :</strong> ${
          profil.show_email ? profil.email || '—' : 'Non visible'
        }</p>
      </div>
    `;
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger le profil.');
  }
}
