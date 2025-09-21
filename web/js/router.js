import { getJWT, signIn, signUp, logout, supabase } from './auth.js';
import { render as renderProfile } from './views/profiles.js';
import { render as renderFiches } from './views/fiches.js';
import { render as renderFicheCreate } from './views/fiches-create.js';
import { render as renderMessages } from './views/messages.js';
import { render as renderCollabs } from './views/collaborations.js';
import { render as renderAdmin } from './views/admin.js';
import { render as renderResetPassword } from './views/reset-password.js';

const AUTH_FEEDBACK_STORAGE_KEY = 'authPendingFeedback';

const app = document.getElementById('app');
const authForm = document.getElementById('auth-form');
const signupBtn = document.getElementById('signup-btn');
const logoutLink = document.getElementById('logout-link');
const nav = document.getElementById('nav');
const authContainer = document.getElementById('auth-container');

// --- Messages d'auth ---
function updateAuthMessages({ error = '', feedback = '' }) {
  const errorEl = document.getElementById('auth-error');
  const feedbackEl = document.getElementById('auth-feedback');

  if (errorEl) errorEl.textContent = error || '';
  if (feedbackEl) feedbackEl.textContent = feedback || '';
}

// --- Formulaires login/signup ---
if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      await signIn(email, password);
      updateAuthMessages({ error: '', feedback: 'Connexion réussie, redirection…' });
      location.hash = '#/fiches';
    } catch (err) {
      updateAuthMessages({ error: err.message || 'Authentification impossible.', feedback: '' });
    }
  });
}

if (signupBtn) {
  signupBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      await signUp(email, password);
      updateAuthMessages({ error: '', feedback: 'Compte créé avec succès, vous pouvez vous connecter.' });
      location.hash = '#/login';
    } catch (err) {
      updateAuthMessages({ error: err.message || 'Création de compte impossible.', feedback: '' });
    }
  });
}

if (logoutLink) {
  logoutLink.addEventListener('click', async () => {
    await logout();
    if (nav) nav.hidden = true;
    if (authContainer) authContainer.hidden = false;
    updateAuthMessages({ error: '', feedback: '' });
  });
}

// --- Gestion des routes ---
function normalizeRoute() {
  const { hash, pathname, search } = window.location;

  // Cas 1 : lien avec double-hash "#/reset-password#access_token=..."
  if (hash.startsWith('#/reset-password#')) {
    const fragment = hash.slice('#/reset-password#'.length);
    if (fragment.includes('access_token') && fragment.includes('type=recovery')) {
      const baseUrl = `${window.location.origin}${window.location.pathname}`;
      const newUrl = `${baseUrl}#/reset-password?${fragment}`;
      console.log('[router] Conversion double-hash en query string :', newUrl);
      window.history.replaceState(null, '', newUrl);
      return `#/reset-password?${fragment}`;
    }
  }

  // Cas 2 : lien déjà en query string
  if (pathname.endsWith('/reset-password')) {
    return `#/reset-password${search || ''}`;
  }

  // Cas 3 : hash normal
  if (hash.startsWith('#/reset-password')) {
    return hash;
  }

  return hash || '#/login';
}

// --- Capture session Supabase ---
async function captureSupabaseRecoverySession() {
  const route = normalizeRoute();
  if (route.startsWith('#/reset-password?')) {
    try {
      console.log('[router] Tentative capture session via getSessionFromUrl');
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
      if (error) throw error;
      console.log('[router] Session Supabase capturée');

      // Nettoyer l’URL
      const cleanUrl = `${window.location.origin}${window.location.pathname}#/reset-password`;
      window.history.replaceState(null, '', cleanUrl);
    } catch (err) {
      console.error('[router] Erreur capture session Supabase', err);
      updateAuthMessages({ error: err.message || 'Lien invalide ou expiré.', feedback: '' });
    }
  }
}

// --- Vue login ---
function showAuthView(feedbackMessage = '') {
  app.innerHTML = '';
  if (authContainer) authContainer.hidden = false;
  if (nav) nav.hidden = true;
  updateAuthMessages({ error: '', feedback: feedbackMessage });
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
      app.innerHTML = '<h2>Bienvenue sur Ä Collaborative Lab</h2>';
  }
}

window.addEventListener('hashchange', () => router().catch(console.error));
window.addEventListener('load', () => router().catch(console.error));
