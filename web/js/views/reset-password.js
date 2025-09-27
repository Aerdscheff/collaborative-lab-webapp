import { supabase } from '../../auth.js';  // ✅ chemin corrigé
import { showFeedback } from '../../utils/feedback.js';
import { renderLayout } from '../../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-3xl font-exo2 font-bold text-[#E25C5C] mb-6">🔑 Réinitialiser mon mot de passe</h1>
    <div id="reset-feedback" class="mb-6"></div>

    <form id="reset-form" class="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
      <div>
        <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
        <input type="email" id="reset-email" name="email" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600"
               placeholder="exemple@domaine.com">
      </div>
      <div class="flex justify-end">
        <button type="submit"
                class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
          📩 Envoyer le lien
        </button>
      </div>
    </form>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('reset-feedback');
  const form = document.getElementById('reset-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;

    try {
      showFeedback(feedback, 'info', '⏳ Envoi du lien de réinitialisation...');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password-complete',
      });
      if (error) throw error;

      showFeedback(feedback, 'success', '✅ Lien de réinitialisation envoyé ! Vérifiez vos emails.');
      form.reset();
    } catch (err) {
      console.error('[reset-password] error', err);
      showFeedback(feedback, 'error', '❌ Impossible d’envoyer le lien.');
    }
  });
}
