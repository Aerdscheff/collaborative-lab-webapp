import { supabase } from '../auth.js';

function renderTemplate() {
  return `
    <section class="reset-password">
      <h1>Réinitialiser votre mot de passe</h1>
      <p class="reset-password__hint">
        Veuillez définir un nouveau mot de passe pour votre compte Supabase.
      </p>
      <p class="reset-password__error" role="alert"></p>
      <p class="reset-password__feedback" role="status"></p>
      <form class="reset-password__form">
        <label>
          Nouveau mot de passe
          <input type="password" name="password" autocomplete="new-password" required />
        </label>
        <label>
          Confirmer le mot de passe
          <input type="password" name="passwordConfirm" autocomplete="new-password" required />
        </label>
        <button type="submit" disabled>Mettre à jour le mot de passe</button>
      </form>
    </section>
  `;
}

function setFormDisabled(form, disabled) {
  form.querySelectorAll('input, button').forEach(el => (el.disabled = disabled));
}

function showError(container, message) {
  container.textContent = message;
}

function showFeedback(container, message) {
  container.textContent = message;
}

// Parse les tokens de l’URL (hash après #)
function parseHashParams() {
  const hash = window.location.hash.substring(1); // enlève le "#"
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

  const section = app.querySelector('.reset-password');
  const form = section.querySelector('form');
  const passwordInput = form.querySelector('input[name="password"]');
  const confirmInput = form.querySelector('input[name="passwordConfirm"]');
  const errorContainer = section.querySelector('.reset-password__error');
  const feedbackContainer = section.querySelector('.reset-password__feedback');

  setFormDisabled(form, true);
  showFeedback(feedbackContainer, 'Validation du lien de récupération…');

  (async () => {
    const { access_token, refresh_token, type, error, error_description } = parseHashParams();

    if (error) {
      showFeedback(feedbackContainer, '');
      showError(errorContainer, decodeURIComponent(error_description || 'Lien invalide ou expiré.'));
      return;
    }

    if (type !== 'recovery' || !access_token || !refresh_token) {
      showFeedback(feedbackContainer, '');
      showError(errorContainer, 'Lien de récupération invalide ou incomplet.');
      return;
    }

    try {
      const { data, error: setError } = await supabase.auth.setSession({
        access_token,
        refresh_token
      });
      if (setError) throw setError;

      console.log('[reset-password] Session recovery établie', data.session);

      showFeedback(feedbackContainer, '');
      setFormDisabled(form, false);
      passwordInput.focus();
    } catch (err) {
      console.error('[reset-password] setSession error', err);
      showFeedback(feedbackContainer, '');
      showError(errorContainer, 'Impossible de valider le lien de récupération. Veuillez en demander un nouveau.');
    }
  })();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showError(errorContainer, '');
    showFeedback(feedbackContainer, '');

    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();

    if (!password || !confirm) {
      showError(errorContainer, 'Les deux champs sont obligatoires.');
      return;
    }
    if (password !== confirm) {
      showError(errorContainer, 'Les mots de passe ne correspondent pas.');
      return;
    }

    setFormDisabled(form, true);
    showFeedback(feedbackContainer, 'Mise à jour du mot de passe…');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      showFeedback(feedbackContainer, 'Mot de passe mis à jour. Redirection vers la connexion…');
      await supabase.auth.signOut();

      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1000);
    } catch (err) {
      console.error('[reset-password] updateUser error', err);
      showFeedback(feedbackContainer, '');
      showError(errorContainer, err.message || "Impossible de mettre à jour le mot de passe.");
      setFormDisabled(form, false);
    }
  });
}
