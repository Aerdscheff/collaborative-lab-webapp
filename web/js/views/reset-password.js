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

async function prepareRecoverySession() {
  try {
    // Tente de récupérer une session depuis l’URL (token de recovery)
    const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
    if (error) throw error;
    return data?.session || null;
  } catch (err) {
    console.warn('[reset-password] Session de recovery non trouvée', err);
    return null;
  }
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
  showFeedback(feedbackContainer, 'Validation du lien de récupération en cours…');

  (async () => {
    const session = await prepareRecoverySession();
    if (!session) {
      showFeedback(feedbackContainer, '');
      showError(errorContainer, 'Lien invalide ou expiré. Veuillez redemander un email de réinitialisation.');
      return;
    }

    // Lien valide → on autorise le formulaire
    showFeedback(feedbackContainer, '');
    setFormDisabled(form, false);
    passwordInput.focus();
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
      }, 800);
    } catch (err) {
      console.error('[reset-password] Erreur updateUser', err);
      showFeedback(feedbackContainer, '');
      showError(errorContainer, err.message || "Impossible de mettre à jour le mot de passe.");
      setFormDisabled(form, false);
    }
  });
}
