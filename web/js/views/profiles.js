import { getProfile } from '../api.js';

export async function render(app, userId) {
  app.innerHTML = `
    <section class="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl">
          👤
        </div>
        <div>
          <h2 class="text-xl font-semibold">Profil utilisateur</h2>
          <p class="text-sm text-gray-500">Chargement en cours...</p>
        </div>
      </div>
      <div id="profile-content" class="space-y-4">
        <!-- contenu profil -->
      </div>
      <div class="mt-6">
        <button id="edit-profile" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Modifier le profil
        </button>
      </div>
    </section>
  `;

  try {
    const profile = await getProfile(userId);
    const content = app.querySelector('#profile-content');

    if (!profile) {
      content.innerHTML = `
        <p class="text-red-500">Aucun profil trouvé. Veuillez compléter vos informations.</p>
      `;
      return;
    }

    content.innerHTML = `
      <div>
        <label class="block text-sm font-medium text-gray-700">Nom</label>
        <p class="mt-1 text-gray-900">${profile.name || 'Non renseigné'}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <p class="mt-1 text-gray-900">${profile.email || 'Non renseigné'}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Bio</label>
        <p class="mt-1 text-gray-900">${profile.bio || 'Aucune biographie'}</p>
      </div>
    `;
  } catch (err) {
    console.error('[profile] Erreur récupération profil', err);
    app.querySelector('#profile-content').innerHTML = `
      <p class="text-red-500">Impossible de charger le profil.</p>
    `;
  }

  // Action "modifier profil"
  const editBtn = app.querySelector('#edit-profile');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      alert('TODO: ouvrir un formulaire d’édition du profil');
    });
  }
}
