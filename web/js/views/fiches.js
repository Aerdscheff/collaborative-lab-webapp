import { renderLayout } from '../layout.js';
import { getFiches } from '../api.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app) {
  const content = `
    <!-- Hero sombre -->
    <section class="relative w-full h-[30vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center"
           style="background-image: url('/assets/batiment-aerdscheff.png'); background-attachment: fixed;"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/70 via-purple-600/80 to-[#E25C5C]/70"></div>
      <div class="relative z-10 text-center text-white">
        <h1 class="text-3xl font-exo2 font-bold">📚 Mes fiches</h1>
      </div>
    </section>

    <section class="relative w-full h-[70vh] overflow-y-auto py-10">
      <div id="fiches-feedback" class="mb-6"></div>
      <div id="fiches-list" class="grid gap-6 md:grid-cols-2"></div>
      <div class="mt-10 text-center">
        <a href="#/fiches/create"
           class="inline-block bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition">
          ➕ Nouvelle fiche
        </a>
      </div>
    </section>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('fiches-feedback');
  const list = document.getElementById('fiches-list');

  try {
    showFeedback(feedback, 'info', 'Chargement des fiches…');
    const fiches = await getFiches();
    feedback.innerHTML = '';

    if (!fiches || fiches.length === 0) {
      list.innerHTML = `<p class="text-gray-500">Aucune fiche disponible.</p>`;
      return;
    }

    list.innerHTML = fiches.map(fiche => `
      <div class="rounded-lg bg-white shadow-md overflow-hidden transform transition hover:scale-[1.02] hover:shadow-lg">
        <div class="bg-gradient-to-r from-[#E25C5C] to-purple-600 h-2"></div>
        <div class="p-5">
          <h3 class="font-exo2 text-xl text-[#E25C5C] font-semibold mb-2">${fiche.title || 'Sans titre'}</h3>
          <p class="text-gray-700 mb-4">${fiche.summary || 'Pas de résumé disponible.'}</p>
        </div>
      </div>
    `).join('');
  } catch {
    showFeedback(feedback, 'error', 'Impossible de charger les fiches.');
  }
}
