import { supabase } from '../auth.js';

const RECOVERY_TOKENS_STORAGE_KEY = 'supabaseRecoveryTokens';
const AUTH_FEEDBACK_STORAGE_KEY = 'authPendingFeedback';

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
          Confirmation du mot de passe
          <input type="password" name="passwordConfirm" autocomplete="new-password" required />
        </label>
        <button type="submit" disabled>Mettre à jour le mot de passe</button>
      </form>
    </section>
  `;
}

function setFormDisabled(form, disabled) {
  const inputs = form.querySelectorAll('input, button');
  inputs.forEach((el) => {
    el.disabled = disabled;
    if (disabled) {
      el.setAttribute('aria-disabled', 'true');
    } else {
      el.removeAttribute('aria-disabled');
    }
  });
}

function showError(container, message) {
  container.textContent = message;
}

function showFeedback(container, message) {
  container.textContent = message;
}

async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session || null;
  } catch (err) {
    console.warn('[reset-password] Lecture session impossible', err);
    return null;
  }
}

async function trySessionFromUrl() {
try {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;

  clearStoredRecoveryTokens();
  persistAuthFeedback('Mot de passe mis à jour avec succès. Vous pouvez vous reconnecter.');
  await supabase.auth.signOut();
  showFeedback(feedbackContainer, 'Mot de passe mis à jour. Redirection en cours…');
  setTimeout(() => {
    window.location.hash = '#/login';
  }, 400);
} catch (err) {
  console.error('[reset-password] Échec updateUser', err);
  showError(errorContainer, err.message || "Impossible de mettre à jour le mot de passe.");
  setFormDisabled(form, false);
}


// === Vue exportée ===
export function render(app) {
  app.innerHTML = renderTemplate();

  const section = app.querySelector('.reset-password');
  const form = section.querySelector('form');
  const errorContainer = section.querySelector('.reset-password__error');
  const feedbackContainer = section.querySelector('.reset-password__feedback');

  // Exemple minimal : ne fait que préparer la session
  (async () => {
    const session = await getCurrentSession() || await trySessionFromUrl();
    if (!session) {
      showError(errorContainer, 'Lien invalide ou expiré.');
      return;
    }
    showFeedback(feedbackContainer, 'Session valide, vous pouvez changer votre mot de passe.');
    setFormDisabled(form, false);
  })();
}
