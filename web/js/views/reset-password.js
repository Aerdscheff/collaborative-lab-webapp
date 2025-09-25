import { supabase } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

function parseHashParams() {
  const hash = window.location.hash.substring(1);
  const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : hash);
  return {
    access_token: urlParams.get('access_token'),
    refresh_token: urlParams.get('refresh_token'),
    type: urlParams.get('type'),
    error: urlParams.get('error'),
    error_description: urlParams.get('error_description')
  };
}

export function render(app) {
  const content = `
    <section class="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-exo2 text-[#E25C5C] mb-6 text-center">🔑 Réinitialiser le mot de passe</h1>
      <div id="reset-feedback" class="mb-4"></div>
      <form id="reset-form" class="space-y-4">
        <input type="password" name="password" placeholder="Nouveau mot de passe"
          class="w-full border rounded px-3 py-2" required />
        <input type="password" name="passwordConfirm" placeholder="Confirmer le mot de passe"
          class="w-full border rounded px-3 py-2" required />
        <button type="submit" disabled
          class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)] transition">
          Mettre à jour
        </button>
      </form>
    </section>
  `;
  renderLayout(app, content);

  const feedback = document.getElementById('reset-feedback');
  const form = document.getElementById('reset-form');
  const passwordInput = form.querySelector('input[name="password"]');
  const confirmInput = form.querySelector('input[name="passwordConfirm"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  submitBtn.disabled = true;
  showFeedback(feedback, 'info', 'Validation du lien…');

  (async () => {
    const { access_token, refresh_token, type, error, error_description } = parseHashParams();
    if (error) {
      showFeedback(feedback, 'error', decodeURIComponent(error_description || 'Lien invalide.'));
      return;
    }
    if (type !== 'recovery' || !access_token || !refresh_token) {
      showFeedback(feedback, 'error', 'Lien invalide ou incomplet.');
      return;
    }
    try {
      const { error: setError } = await supabase.auth.setSession({ access_token, refresh_token });
      if (setError) throw setError;
      showFeedback(feedback, 'success', 'Lien validé ✅ Vous pouvez saisir un nouveau mot de passe.');
      submitBtn.disabled = false;
      passwordInput.focus();
    } catch {
      showFeedback(feedback, 'error', 'Impossible de valider le lien.');
    }
  })();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();
    if (!password || !confirm) {
      showFeedback(feedback, 'error', 'Les deux champs sont obligatoires.');
      return;
    }
    if (password !== confirm) {
      showFeedback(feedback, 'error', 'Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showFeedback(feedback, 'success', 'Mot de passe mis à jour ✅ Redirection…');
      await supabase.auth.signOut();
      setTimeout(() => { window.location.hash = '#/login'; }, 1000);
    } catch (err) {
      showFeedback(feedback, 'error', err.message || 'Erreur mise à jour.');
    }
  });
}
