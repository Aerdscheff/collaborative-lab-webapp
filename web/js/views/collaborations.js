import { getCollaborations } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-purple-700 mb-8">🤝 Collaborations</h1>
    <div id="collabs-feedback" class="mb-6"></div>
    <div id="collabs-list" class="grid gap-6 md:grid-cols-2"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('collabs-feedback');
  const list = document.getElementById('collabs-list');

  try {
    showFeedback(feedback, 'info', '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-purple-700 rounded-full mx-auto"></div>');
    const collabs = await getCollaborations();
    feedback.innerHTML = '';

    if (!collabs || collabs.length === 0) {
      list.innerHTML = `<p class="text-gray-500">Aucune collaboration disponible.</p>`;
      return;
    }

    list.innerHTML = collabs
      .map(
        (collab) => `
        <div class="rounded-xl bg-white shadow-md overflow-hidden transform transition hover:scale-[1.02] hover:shadow-[0_0_15px_3px_rgba(64,224,208,0.4)]">
          <div class="bg-gradient-to-r from-purple-600 to-[#E25C5C] h-2"></div>
          <div class="p-5">
            <h3 class="font-exo2 text-xl text-purple-700 font-semibold mb-2">${collab.title || 'Sans titre'}</h3>
            <p class="text-gray-700 mb-4">${collab.summary || 'Pas de résumé disponible.'}</p>
            <div class="flex space-x-3">
              <a href="#/collaborations/${collab.id}"
                 aria-label="Voir la collaboration ${collab.title || ''}"
                 class="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-xl transition">
                 👀 Voir
              </a>
              <a href="#/collaborations/${collab.id}/messages"
                 aria-label="Messages pour la collaboration ${collab.title || ''}"
                 class="text-sm bg-[#E25C5C] hover:bg-red-600 text-white px-3 py-1 rounded-xl transition">
                 💬 Messages
              </a>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  } catch {
    showFeedback(feedback, 'error', 'Impossible de charger les collaborations.');
  }
}
