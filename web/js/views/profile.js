import { renderLayout } from '../layout.js';
import { requireAuth } from '../authGuard.js';
import { getProfile } from '../api.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app) {
  const session = await requireAuth();
  if (!session) return;

  const content = `
    <!-- Hero sombre -->
    <section class="relative w-full h-[30vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center"
           style="background-image: url('/assets/batiment-aerdscheff.png'); background-attachment: fixed;"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/70 via-purple-600/80 to-[#E25C5C]/70"></div>
      <div class="relative z-10 text-center text-white">
        <h1 class="text-3xl font-exo2 font-bold">👤 Mon profil</h1>
      </div>
    </section>

    <!-- Contenu -->
    <section class="relative w-full h-[70vh] overflow-y-auto py-10">
      <div id="profil-feedback" class="mb-6"></div>
      <div id="profil-container" class="max-w-2xl mx-auto"></div>
    </section>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('profil-feedback');
  const container = document.getElementById('profil-container');

  try {
    showFeedback(feedback, 'info', 'Chargement du profil...');
    const profil = await getProfile(session.user.id);
    feedback.innerHTML = '';

    if (!profil) {
      container.innerHTML = `<p class="text-gray-500">❌ Profil introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="bg-white shadow-md rounded-xl p-6 space-y-4">
        <p><strong>Nom :</strong> ${profil.name || 'Non renseigné'}</p>
        <p><strong>Discipline :</strong> ${profil.discipline || 'Non renseignée'}</p>
        <p><strong>Bio :</strong> ${profil.bio || 'Non renseignée'}</p>
        <div class="mt-6 text-right">
          <a href="#profil-edit"
             class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
             ✏️ Modifier
          </a>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger le profil.');
  }
}
