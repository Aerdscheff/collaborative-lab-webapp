import { supabase } from '../auth.js';
import { getProfile } from '../api.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app, userId) {
  app.innerHTML = `
    <section class="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Modifier le profil</h2>
      <form id="profile-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom</label>
          <input type="text" name="name" class="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" class="mt-1 block w-full border rounded px-3 py-2" disabled />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Bio</label>
          <textarea name="bio" rows="3" class="mt-1 block w-full border rounded px-3 py-2"></textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" id="cancel-edit"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Annuler
          </button>
          <button type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
        </div>
      </form>
      <div id="profile-feedback" class="mt-4"></div>
    </section>
  `;

  const form = app.querySelector('#profile-form');
  const feedback = app.querySelector('#profile-feedback');
  const cancelBtn = app.querySelector('#cancel-edit');

  // Préremplir avec les données existantes
  try {
    const profile = await getProfile(userId);
    if (profile) {
      form.name.value = profile.name || '';
      form.email.value = profile.email || '';
      form.bio.value = profile.bio || '';
    }
  } catch (err) {
    console.error('[profile-edit] Erreur chargement profil', err);
    showFeedback(feedback, 'error', "Impossible de charger vos informations.");
  }

  // Soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showFeedback(feedback, 'info', 'Enregistrement en cours...');

    const payload = {
      name: form.name.value.trim(),
      bio: form.bio.value.trim(),
    };

    try {
      const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
      if (error) throw error;

      showFeedback(feedback, 'success', 'Profil mis à jour avec succès ✅');
    } catch (err) {
      console.error('[profile-edit] Erreur update profil', err);
      showFeedback(feedback, 'error', err.message || "Impossible de mettre à jour le profil.");
    }
  });

  // Bouton annuler
  cancelBtn.addEventListener('click', () => {
    window.location.hash = '#/profiles';
  });
}
