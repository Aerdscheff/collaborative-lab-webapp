import { getProfile, updateProfile } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';
import { requireAuth } from '../authGuard.js';

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
        <h1 class="text-3xl font-exo2 font-bold">✏️ Modifier mon profil</h1>
      </div>
    </section>

    <!-- Formulaire -->
    <section class="relative w-full h-[70vh] overflow-y-auto py-10">
      <div id="profil-edit-feedback" class="mb-6 text-center"></div>
      <div id="profil-edit-container" class="max-w-2xl mx-auto"></div>
    </section>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('profil-edit-feedback');
  const container = document.getElementById('profil-edit-container');

  try {
    showFeedback(feedback, 'info', 'Chargement du profil...');
    const profil = await getProfile(session.user.id);
    feedback.innerHTML = '';

    if (!profil) {
      container.innerHTML = `<p class="text-gray-500">❌ Profil introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <form id="profil-edit-form" class="bg-white shadow-md rounded-xl p-6 space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input id="name" name="name" type="text"
                 value="${profil.name || ''}"
                 class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
        </div>

        <div>
          <label for="discipline" class="block text-sm font-medium text-gray-700 mb-1">Discipline</label>
          <input id="discipline" name="discipline" type="text"
                 value="${profil.discipline || ''}"
                 class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea id="bio" name="bio" rows="4"
                    class="w-full border-gray-300 rounded-xl shadow-sm focus:ring-purple-600 focus:border-purple-600 p-2">${profil.bio || ''}</textarea>
        </div>

        <div class="flex justify-between">
          <a href="#profil"
             class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl shadow-md transition">
             ⬅️ Annuler
          </a>
          <button type="submit"
                  class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
            💾 Enregistrer
          </button>
        </div>
      </form>
    `;

    const form = document.getElementById('profil-edit-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const updated = {
        name: formData.get('name'),
        discipline: formData.get('discipline'),
        bio: formData.get('bio'),
      };

      try {
        showFeedback(feedback, 'info', '💾 Sauvegarde en cours...');
        await updateProfile(session.user.id, updated);
        showFeedback(feedback, 'success', '✅ Profil mis à jour avec succès !');

        setTimeout(() => {
          window.location.hash = '#profil';
        }, 1000);
      } catch (err) {
        console.error(err);
        showFeedback(feedback, 'error', '❌ Erreur lors de la mise à jour du profil.');
      }
    });
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger le profil.');
  }
}
