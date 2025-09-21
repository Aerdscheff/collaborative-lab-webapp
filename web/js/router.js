import { getJWT, signIn, signUp, logout, supabase } from './auth.js';
import { render as renderProfile } from './views/profile.js';
import { render as renderProfileEdit } from './views/profile-edit.js';
import { render as renderFiches } from './views/fiches.js';
import { render as renderFicheCreate } from './views/fiches-create.js';
import { render as renderMessages } from './views/messages.js';
import { render as renderCollabs } from './views/collaborations.js';
import { render as renderAdmin } from './views/admin.js';
import { render as renderResetPassword } from './views/reset-password.js';
import { showFeedback } from './utils/feedback.js';

const AUTH_FEEDBACK_STORAGE_KEY = 'authPendingFeedback';

const app = document.getElementById('app');
const authForm = document.getElementById('auth-form');
const signupBtn = document.getElementById('signup-btn');
const logoutLink = document.getElementById('logout-link');
const nav = document.getElementById('nav');
const authContainer = document.getElementById('auth-container');
const feedbackEl = document.getElementById('auth-feedback');

// --- Formulaires login/signup ---
if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      await signIn(email, password, feedbackEl);
      sessionStorage.setItem(AUTH_FEEDBACK_STORAGE_KEY, 'Connexion réussie ✅');
      location.hash = '#/fiches';
    } catch (err) {
      // signIn affiche déjà le feedback
    }
  });
}

if (signupBtn) {
  signupBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      await signUp(email, password, feedbackEl);
      sessionStorage.setItem(
        AUTH_FEEDBACK_STORAGE_KEY,
        'Compte créé avec succès ✅ Vérifiez vos emails.'
      );
      location.hash = '#/login';
    } catch (err) {
      // signUp affiche déjà le feedback
    }
  });
}

if (logoutLink) {
  logoutLink.addEventListener('click', async () => {
    try {
      await logout(feedbackEl);
      if (nav) nav.hidden = true;
      if (authContainer) authContainer.hidden = false;
    } catch (err) {
      // logout affiche déjà le feedback
    }
  });
}

// --- Gestion des routes ---
function normalizeRoute() {
  const { hash } = window.location;

  if (hash.startsWith('#/reset-password')) {
    return hash;
  }

  return hash || '#/login';
}

// --- Capture session de recovery Supabase ---
async function captureSupabaseRecoverySession() {
  const route = normalizeRoute();
  if (route.startsWith('#/reset-password?')) {
    try {
      console.log('[router] Tentative capture session via setSession (Supabase v2)');
      const urlParams = new URLSearchParams(route.split('?')[1]);
      const access_token = urlParams.get('access_token');
      const refresh_token = urlParams.get('refresh_token');
      const type = urlParams.get('type');

      if (type === 'recovery' && access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) throw error;
        console.log('[router] Session Supabase capturée');
      }
    } catch (err) {
      console.error('[router] Erreur capture session Supabase', err);
      showFeedback(feedbackEl, 'error', err.message || 'Lien invalide ou expiré.');
    }
  }
}

// --- Vue login ---
function showAuthView(feedbackMessage = '') {
  app.innerHTML = '';
  if (authContainer) authContainer.hidden = false;
  if (nav) nav.hidden = true;
  if (feedbackMessage) {
    showFeedback(feedbackEl, 'info', feedbackMessage);
  } else {
    feedbackEl.innerHTML = '';
  }
}

// --- Router principal ---
async function router() {
  await captureSupabaseRecoverySession();

  const route = normalizeRoute();
  console.log('[router] route finale =', route);

  if (!getJWT() && route !== '#/login' && !route.startsWith('#/reset-password')) {
    showAuthView();
    return;
  }

  if (route === '#/login') {
    let feedbackMessage = '';
    try {
      if (typeof sessionStorage !== 'undefined') {
        feedbackMessage = sessionStorage.getItem(AUTH_FEEDBACK_STORAGE_KEY) || '';
        sessionStorage.removeItem(AUTH_FEEDBACK_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('[router] Impossible de lire le feedback en attente', err);
    }
    showAuthView(feedbackMessage);
    return;
  }

  if (route.startsWith('#/reset-password')) {
    if (authContainer) authContainer.hidden = true;
    if (nav) nav.hidden = true;
    renderResetPassword(app);
    return;
  }

  if (authContainer) authContainer.hidden = true;
  if (nav) nav.hidden = false;

  switch (route) {
    case '#/profiles':
      renderProfile(app); break;
    case '#/profiles/edit':
      renderProfileEdit(app); break;
    case '#/fiches':
      renderFiches(app); break;
    case '#/fiches/create':
      renderFicheCreate(app); break;
    case '#/messages':
      renderMessages(app); break;
    case '#/collaborations':
      renderCollabs(app); break;
    case '#/admin':
      renderAdmin(app); break;
    default:
      app.innerHTML = `
        <div class="max-w-xl mx-auto text-center mt-12">
          <h2 class="text-2xl font-semibold mb-4">Bienvenue sur Ä Collaborative Lab</h2>
          <p class="text-gray-600">Sélectionnez une section dans le menu pour commencer.</p>
        </div>`;
  }
}

window.addEventListener('hashchange', () => router().catch(console.error));
window.addEventListener('load', () => router().catch(console.error));
