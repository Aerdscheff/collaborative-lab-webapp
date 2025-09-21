 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/web/js/views/reset-password.js
index 0000000000000000000000000000000000000000..3bf3e1a99b56055d3cfbab5b9e30be3e821e1466 100644
--- a//dev/null
+++ b/web/js/views/reset-password.js
@@ -0,0 +1,195 @@
+import { supabase } from '../auth.js';
+
+const RECOVERY_TOKENS_STORAGE_KEY = 'supabaseRecoveryTokens';
+const AUTH_FEEDBACK_STORAGE_KEY = 'authPendingFeedback';
+
+function renderTemplate() {
+  return `
+    <section class="reset-password">
+      <h1>Réinitialiser votre mot de passe</h1>
+      <p class="reset-password__hint">
+        Veuillez définir un nouveau mot de passe pour votre compte Supabase.
+      </p>
+      <p class="reset-password__error" role="alert"></p>
+      <p class="reset-password__feedback" role="status"></p>
+      <form class="reset-password__form">
+        <label>
+          Nouveau mot de passe
+          <input type="password" name="password" autocomplete="new-password" required />
+        </label>
+        <label>
+          Confirmation du mot de passe
+          <input type="password" name="passwordConfirm" autocomplete="new-password" required />
+        </label>
+        <button type="submit" disabled>Mettre à jour le mot de passe</button>
+      </form>
+    </section>
+  `;
+}
+
+function setFormDisabled(form, disabled) {
+  const inputs = form.querySelectorAll('input, button');
+  inputs.forEach((el) => {
+    el.disabled = disabled;
+    if (disabled) {
+      el.setAttribute('aria-disabled', 'true');
+    } else {
+      el.removeAttribute('aria-disabled');
+    }
+  });
+}
+
+function showError(container, message) {
+  container.textContent = message;
+}
+
+function showFeedback(container, message) {
+  container.textContent = message;
+}
+
+async function getCurrentSession() {
+  try {
+    const { data, error } = await supabase.auth.getSession();
+    if (error) throw error;
+    return data?.session || null;
+  } catch (err) {
+    console.warn('[reset-password] Lecture session courante impossible', err);
+    return null;
+  }
+}
+
+async function trySessionFromUrl() {
+  try {
+    const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
+    if (error) throw error;
+    return data?.session || null;
+  } catch (err) {
+    console.warn('[reset-password] getSessionFromUrl a échoué', err);
+    return null;
+  }
+}
+
+function readStoredRecoveryTokens() {
+  try {
+    if (typeof sessionStorage === 'undefined') return null;
+    const raw = sessionStorage.getItem(RECOVERY_TOKENS_STORAGE_KEY);
+    if (!raw) return null;
+    return JSON.parse(raw);
+  } catch (err) {
+    console.warn('[reset-password] Impossible de lire les jetons stockés', err);
+    return null;
+  }
+}
+
+async function trySessionFromStoredTokens() {
+  const tokens = readStoredRecoveryTokens();
+  if (!tokens) return null;
+  const { access_token: accessToken, refresh_token: refreshToken } = tokens;
+  if (!accessToken || !refreshToken) return null;
+  try {
+    const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
+    if (error) throw error;
+    return data?.session || null;
+  } catch (err) {
+    console.warn('[reset-password] setSession avec jetons stockés a échoué', err);
+    return null;
+  }
+}
+
+async function prepareRecoverySession() {
+  const existingSession = await getCurrentSession();
+  if (existingSession) return existingSession;
+
+  const urlSession = await trySessionFromUrl();
+  if (urlSession) return urlSession;
+
+  return trySessionFromStoredTokens();
+}
+
+function persistAuthFeedback(message) {
+  try {
+    if (typeof sessionStorage === 'undefined') return;
+    sessionStorage.setItem(AUTH_FEEDBACK_STORAGE_KEY, message);
+  } catch (err) {
+    console.warn("[reset-password] Impossible d'enregistrer le feedback auth", err);
+  }
+}
+
+function clearStoredRecoveryTokens() {
+  try {
+    if (typeof sessionStorage === 'undefined') return;
+    sessionStorage.removeItem(RECOVERY_TOKENS_STORAGE_KEY);
+  } catch (err) {
+    console.warn('[reset-password] Impossible de nettoyer les jetons de récupération', err);
+  }
+}
+
+export function render(app) {
+  app.innerHTML = renderTemplate();
+
+  const section = app.querySelector('.reset-password');
+  const form = section.querySelector('form');
+  const passwordInput = form.querySelector('input[name="password"]');
+  const confirmInput = form.querySelector('input[name="passwordConfirm"]');
+  const errorContainer = section.querySelector('.reset-password__error');
+  const feedbackContainer = section.querySelector('.reset-password__feedback');
+
+  setFormDisabled(form, true);
+  showFeedback(feedbackContainer, 'Validation du lien de récupération en cours…');
+
+  (async () => {
+    const session = await prepareRecoverySession();
+    if (!session) {
+      showFeedback(feedbackContainer, '');
+      showError(errorContainer, 'Lien invalide ou expiré. Veuillez demander un nouveau mail de réinitialisation.');
+      return;
+    }
+
+    showFeedback(feedbackContainer, '');
+    setFormDisabled(form, false);
+    passwordInput.focus();
+  })().catch((err) => {
+    console.error('[reset-password] Erreur inattendue lors de la préparation de la session', err);
+    showFeedback(feedbackContainer, '');
+    showError(errorContainer, 'Une erreur est survenue. Veuillez rafraîchir la page ou redemander un lien.');
+  });
+
+  form.addEventListener('submit', async (event) => {
+    event.preventDefault();
+    showError(errorContainer, '');
+    showFeedback(feedbackContainer, '');
+
+    const password = passwordInput.value.trim();
+    const confirm = confirmInput.value.trim();
+    if (!password || !confirm) {
+      showError(errorContainer, 'Les deux champs sont obligatoires.');
+      return;
+    }
+
+    if (password !== confirm) {
+      showError(errorContainer, 'Les mots de passe ne correspondent pas.');
+      return;
+    }
+
+    setFormDisabled(form, true);
+    showFeedback(feedbackContainer, 'Mise à jour du mot de passe…');
+
+    try {
+      const { error } = await supabase.auth.updateUser({ password });
+      if (error) throw error;
+
+      clearStoredRecoveryTokens();
+      persistAuthFeedback('Mot de passe mis à jour avec succès. Vous pouvez vous reconnecter.');
+      await supabase.auth.signOut();
+      showFeedback(feedbackContainer, 'Mot de passe mis à jour. Redirection en cours…');
+      setTimeout(() => {
+        window.location.hash = '#/login';
+      }, 400);
+    } catch (err) {
+      console.error('[reset-password] Échec de mise à jour du mot de passe', err);
+      showFeedback(feedbackContainer, '');
+      showError(errorContainer, err.message || "Impossible de mettre à jour le mot de passe.");
+      setFormDisabled(form, false);
+    }
+  });
+}
 
EOF
)
