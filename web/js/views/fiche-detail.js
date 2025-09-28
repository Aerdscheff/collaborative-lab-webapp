import { getFicheById } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';
import { requireAuth } from '../authGuard.js';

export async function render(app, ficheId) {
  const session = await requireAuth();
  if (!session) return;

  const content = `
    <div id="fiche-detail-feedback" class="mb-6"></div>
    <div id="fiche-detail-container" class="max-w-3xl mx-auto"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('fiche-detail-feedback');
  const container = document.getElementById('fiche-detail-container');

  try {
    showFeedback(feedback, 'info', 'Chargement de la fiche...');
    const fiche = await getFicheById(ficheId);
    feedback.innerHTML = '';

    if (!fiche) {
      container.innerHTML = `<p class="text-gray-500">❌ Fiche introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <article class="bg-white shadow-md rounded-xl p-6 space-y-6">
        <header>
          <h1 class="text-3xl font-exo2 font-bold text-[#E25C5C] mb-2">${fiche.title}</h1>
          <p class="text-gray-600 italic">${fiche.summary || ''}</p>
        </header>

        <section>
          <h2 class="text-xl font-semibold text-purple-700 mb-2">Contenu détaillé</h2>
          <p class="text-gray-800 whitespace-pre-line">${fiche.content || '—'}</p>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 class="text-sm font-medium text-gray-600">Période</h3>
            <p class="text-gray-800">${fiche.period || '—'}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-600">Discipline</h3>
            <p class="text-gray-800">${fiche.discipline || '—'}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-600">Niveau</h3>
            <p class="text-gray-800">${fiche.level || '—'}</p>
          </div>
        </section>

        <section>
          <h3 class="text-sm font-medium text-gray-600">Mots-clés</h3>
          <div class="flex flex-wrap gap-2 mt-2">
            ${
              fiche.tags && fiche.tags.length > 0
                ? fiche.tags.map(tag => `<span class="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">${tag}</span>`).join('')
                : '<span class="text-gray-500">—</span>'
            }
          </div>
        </section>

        <footer class="flex justify-between items-center pt-6 border-t">
          <a href="#fiches"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl shadow-md transition">
            ⬅️ Retour
          </a>
          <div class="flex space-x-3">
            <a href="#fiches/${fiche.id}/edit"
              class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
              ✏️ Modifier
            </a>
            <a href="#messages?to=${fiche.owner}"
              class="bg-gradient-to-r from-purple-600 to-[#E25C5C] text-white px-6 py-2 rounded-xl shadow-md transition">
              💬 Envoyer un message
            </a>
            <a href="#profil/${fiche.owner}"
              class="bg-gradient-to-r from-gray-700 to-gray-500 text-white px-6 py-2 rounded-xl shadow-md transition">
              👤 Voir le profil de l’auteur
            </a>
          </div>
        </footer>
      </article>
    `;
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger la fiche.');
  }
}
