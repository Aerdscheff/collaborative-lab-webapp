import { getProfile } from '../api.js';
import { renderLayout } from '../layout.js';

export async function render(app, userId) {
  const content = `
    <h1 class="text-3xl font-exo2 text-[#E25C5C] mb-6">👤 Profil</h1>
    <div id="profile-content" class="space-y-4"></div>
    <a href="#/profiles/edit" class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)]">Modifier</a>
  `;
  renderLayout(app, content);

  const container = document.getElementById('profile-content');
  const profile = await getProfile(userId);
  container.innerHTML = profile
    ? `<p><strong>Nom:</strong> ${profile.name}</p><p><strong>Email:</strong> ${profile.email}</p>`
    : `<p class="text-red-500">Profil introuvable.</p>`;
}
