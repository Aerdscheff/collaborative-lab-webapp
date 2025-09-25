import { supabase } from '../auth.js';
import { getProfile } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app, userId) {
  let content = `
    <h1 class="text-2xl font-bold text-[#E25C5C] mb-6">✏️ Modifier le profil</h1>
    <div id="profile-feedback"></div>
    <form id="profile-form" class="space-y-4">
      <input type="text" name="name" placeholder="Nom" class="w-full border rounded px-3 py-2" />
      <input type="email" name="email" class="w-full border rounded px-3 py-2" disabled />
      <textarea name="bio" rows="3" placeholder="Bio" class="w-full border rounded px-3 py-2"></textarea>
      <button type="submit" class="bg-[#E25C5C] hover:bg-red-600 text-white px-4 py-2 rounded">Enregistrer</button>
    </form>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('profile-feedback');
  const form = document.getElementById('profile-form');

  try {
    const profile = await getProfile(userId);
    if (profile) {
      form.name.value = profile.name || '';
      form.email.value = profile.email || '';
      form.bio.value = profile.bio || '';
    }
  } catch {
    showFeedback(feedback, 'error', 'Erreur chargement profil.');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = { name: form.name.value.trim(), bio: form.bio.value.trim() };
    try {
      await supabase.from('profiles').update(payload).eq('id', userId);
      showFeedback(feedback, 'success', 'Profil mis à jour ✅');
    } catch {
      showFeedback(feedback, 'error', 'Erreur mise à jour.');
    }
  });
}
