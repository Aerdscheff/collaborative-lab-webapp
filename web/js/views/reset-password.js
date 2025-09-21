import { supabase } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';

function renderTemplate() {
  return `
    <section class="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 class="text-xl font-semibold mb-4">Réinitialiser votre mot de passe</h1>
      <div id="reset-feedback" class="mb-4"></div>
      <form id="reset-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
          <input type="password" name="password" autocomplete="new-password" required
            class="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
          <input type="password" name="passwordConfirm" autocomplete="new-password" required
            class="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" disabled
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Mettre à jour le mot de passe
        </button>
      </form>
    </section>
  `;
}

// Parse les tokens de l’URL (hash après #)
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
  app.innerHTML = renderTemplate();

  const form = app.querySelector('#reset-form');
  const passwordInput = form.querySelector('input[name="password"]');
  const confirmInput = form.querySelector('input[name="passwordConfirm"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const feedback = app.querySelector('#reset-feedback');

  submitBtn.disabled = true;
  showFeedback(feedback, 'info', 'Validation du lien de récupération…');

  (async () => {
    const { access_token, refresh_token, type, error, error_description } = parseHashParams();

    if (error) {
      showFeedback(feedback, 'error', decodeURIComponent(error_description || 'Lien invalide ou expiré.'));
      return;
    }

    if (type !== 'recovery' || !access_token || !refresh_token) {
      showFeedback(feedback, 'error', 'Lien de récupération invalide ou incomplet.');
      return;
    }

    try {
      const { error: setError } = await supabase.auth.setSession({
        access_token,
        refresh_token
      });
      if (setError) throw setError;

      showFeedback(feedback, 'success', 'Lien de récupération validé. Vous pouvez saisir un nouveau mot de passe.');
      submitBtn.disabled = false;
      passwordInput.focus();
    } catch (err) {
      console.error('[reset-password] setSession error', err);
      showFeedback(feedback, 'error', 'Impossible de valider le lien. Veuillez en demander un nouveau.');
    }
  })();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showFeedback(feedback, 'info', 'Mise à jour du mot de passe…');

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

      showFeedback(feedback, 'success', 'Mot de passe mis à jour ✅ Redirection en cours…');
      await supabase.auth.signOut();
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1000);
    } catch (err) {
      console.error('[reset-password] updateUser error', err);
      showFeedback(feedback, 'error', err.message || "Impossible de mettre à jour le mot de passe.");
    }
  });
}
