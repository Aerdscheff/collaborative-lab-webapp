import { renderLayout } from '../layout.js';
import { requireAdmin } from '../authGuard.js';
import { getFiches, removeFiche } from '../api.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app) {
  const session = await requireAdmin();
  if (!session) return;

  const content = `
    <!-- Hero sombre -->
    <section class="relative w-full h-[30vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center"
           style="background-image: url('/assets/batiment-aerdscheff.png'); background-attachment: fixed;"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/70 via-purple-600/80 to-[#E25C5C]/70"></div>
      <div class="relative z-10 text-center text-white">
        <h1 class="text-3xl font-exo2 font-bold">📚 Administration — Fiches</h1>
      </div>
    </section>

    <!-- Contenu (70%) -->
    <section class="relative w-full h-[70vh] overflow-y-auto py-10">
      <div id="admin-fiches-feedback" class="mb-6 text-center"></div>
      <div id="admin-fiches-list" class="grid gap-4 md:grid-cols-2 max-w-5xl mx-auto"></div>
    </section>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('admin-fiches-feedback');
  const list = document.getElementById('admin-fiches-list');

  try {
    showFeedback(feedback, 'info', 'Chargement des fiches...');
    const fiches = await getFiches();
    feedback.innerHTML = '';

    if (!fiches || fiches.length === 0) {
      list.innerHTML = `<p class="text-gray-500">Aucune fiche trouvée.</p>`;
      return;
    }

    list.innerHTML = fiches.map(fiche => `
      <div class="rounded-xl bg-white shadow-md p-4">
        <h3 class="font-exo2 text-xl text-[#E25C5C] mb-2">${fiche.title || 'Sans titre'}</h3>
        <p class="text-gray-700 mb-3">${fiche.summary || 'Pas de résumé.'}</p>
        <button data-id="${fiche.id}"
                class="delete-btn bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm">
          ❌ Supprimer
        </button>
      </div>
    `).join('');

    // Suppression fiche
    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ficheId = btn.dataset.id;
        try {
          showFeedback(feedback, 'info', 'Suppression en cours...');
          await removeFiche(ficheId);
          showFeedback(feedback, 'success', '✅ Fiche supprimée');
          setTimeout(() => window.location.reload(), 800);
        } catch (err) {
          console.error(err);
          showFeedback(feedback, 'error', '❌ Erreur lors de la suppression.');
        }
      });
    });

  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger les fiches.');
  }
}
