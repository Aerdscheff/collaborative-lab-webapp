import { supabase } from '../auth.js';  // ✅ chemin corrigé
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-3xl font-exo2 font-bold text-[#E25C5C] mb-6">🔒 Nouveau mot de passe</h1>
    <div id="reset-complete-feedback" class="mb-6"></div>

    <form id="reset-complete-form" class="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
      <div>
        <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
        <input type="password" id="new-password" name="password" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600"
               placeholder="********">
      </div>
      <div>
        <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
        <input type="password" id="confirm-password" name="confirm" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600"
               placeholder="********">
      </div>
      <div class="flex justify-end">
        <button type="submit"
                class="bg-gradient-to-r from-purple-600 to-[#E25C5C] text-white px-6 py-2 rounded-xl shadow-md transition">
          💾 Sauvegarder
        </button>
      </div>
    </form>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('reset-complete-feedback');
  const form = document.getElementById('reset-complete-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (password !== confirm) {
      showFeedback(feedback, 'error', '❌ Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      showFeedback(feedback, 'info', '⏳ Mise à jour du mot de passe...');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      showFeedback(feedback, 'success', '✅ Mot de passe mis à jour avec succès !');
      setTimeout(() => {
        window.location.hash = '#auth';
      }, 1200);
    } catch (err) {
      console.error('[reset-password-complete] error', err);
      showFeedback(feedback, 'error', '❌ Impossible de mettre à jour le mot de passe.');
    }
  });
}
