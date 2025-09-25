import { getProfile } from '../api.js';
import { renderLayout } from '../layout.js';

export async function render(app, userId) {
  let content = `
    <h1 class="text-2xl font-bold text-[#E25C5C] mb-6">👤 Profil</h1>
    <div id="profile-content" class="space-y-4"></div>
    <a href="#/profiles/edit" class="bg-[#E25C5C] hover:bg-red-600 text-white px-4 py-2 rounded">Modifier</a>
  `;

  renderLayout(app, content);

  const container = document.getElementById('profile-content');
  try {
    const profile = await getProfile(userId);
    container.innerHTML = profile
      ? `<p><strong>Nom :</strong> ${profile.name || '—'}</p><p><strong>Email :</strong> ${profile.email || '—'}</p>`
      : `<p class="text-red-500">Aucun profil trouvé.</p>`;
  } catch {
    container.innerHTML = `<p class="text-red-500">Erreur chargement profil.</p>`;
  }
}
