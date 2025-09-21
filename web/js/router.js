import { getJWT, signIn, signUp, logout, supabase } from './auth.js';
import { render as renderProfile } from './views/profile.js';
import { render as renderProfileEdit } from './views/profile-edit.js';
import { render as renderFiches } from './views/fiches.js';
import { render as renderFicheCreate } from './views/fiches-create.js';
import { render as renderMessages } from './views/messages.js';
import { render as renderCollabs } from './views/collaborations.js';
import { render as renderAdmin } from './views/admin.js';
import { render as renderResetPassword } from './views/reset-password.js';
import { render as renderFicheDetail } from './views/fiche-detail.js';
import { showFeedback } from './utils/feedback.js';

const app = document.getElementById('app');
// Ici tu peux garder tes autres const (authForm, signupBtn, etc.)

// --- Router principal ---
async function router() {
  const hash = window.location.hash || '#/login';
  console.log('[router] route finale =', hash);

  // Protections login / reset-password
  if (!getJWT() && !hash.startsWith('#/login') && !hash.startsWith('#/reset-password')) {
    app.innerHTML = '<p>Veuillez vous connecter.</p>';
    return;
  }

  if (hash === '#/login') {
    app.innerHTML = '<p>Page de connexion</p>'; // ta logique login existante
    return;
  }

  if (hash.startsWith('#/reset-password')) {
    renderResetPassword(app);
    return;
  }

  // Routes principales
  switch (true) {
    case hash === '#/profiles':
      renderProfile(app);
      break;
    case hash === '#/profiles/edit':
      renderProfileEdit(app);
      break;
    case hash === '#/fiches':
      renderFiches(app);
      break;
    case hash === '#/fiches/create':
      renderFicheCreate(app);
      break;
    case /^#\/fiches\/([^/]+)\/messages$/.test(hash): {
      // Extrait l’ID de la fiche depuis l’URL
      const ficheId = hash.match(/^#\/fiches\/([^/]+)\/messages$/)[1];
      renderMessages(app, ficheId);
      break;
    }
    case /^#\/fiches\/([^/]+)$/.test(hash): {
      // Route détail d’une fiche
      const ficheId = hash.match(/^#\/fiches\/([^/]+)$/)[1];
      renderFicheDetail(app, ficheId);
      break;
    }
    case hash === '#/collaborations':
      renderCollabs(app);
      break;
    case hash === '#/admin':
      renderAdmin(app);
      break;
    default:
      app.innerHTML = '<h2>Bienvenue sur Ä Collaborative Lab</h2>';
  }
}

window.addEventListener('hashchange', () => router().catch(console.error));
window.addEventListener('load', () => router().catch(console.error));
