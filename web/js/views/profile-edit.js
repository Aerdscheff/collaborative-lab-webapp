import { supabase } from '../auth.js';
import { getProfile } from '../api.js';

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
      <p id="profile-feedback" class="mt-4 text-sm text-gray-500"></p>
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
    feedback.textContent = "Impossible de charger vos informations.";
    feedback.classList.add('text-red-500');
  }

  // Soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = "Enregistrement...";
    feedback.classList.remove('text-red-500');
    feedback.classList.add('text-gray-500');

    const payload = {
      name: form.name.value.trim(),
      bio: form.bio.value.trim(),
    };

    try {
      const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
      if (error) throw error;

      feedback.textContent = "Profil mis à jour avec succès ✅";
      feedback.classList.remove('text-gray-500');
      feedback.classList.add('text-green-600');
    } catch (err) {
      console.error('[profile-edit] Erreur update profil', err);
      feedback.textContent = err.message || "Impossible de mettre à jour le profil.";
      feedback.classList.remove('text-gray-500');
      feedback.classList.add('text-red-500');
    }
  });

  // Bouton annuler
  cancelBtn.addEventListener('click', () => {
    window.location.hash = '#/profiles';
  });
}
