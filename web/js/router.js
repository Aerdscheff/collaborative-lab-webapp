
import { getJWT, signIn, signUp, logout } from './auth.js';
import { render as renderProfile } from './views/profiles.js';
import { render as renderFiches } from './views/fiches.js';
import { render as renderFicheCreate } from './views/fiches-create.js';
import { render as renderMessages } from './views/messages.js';
import { render as renderCollabs } from './views/collaborations.js';
import { render as renderAdmin } from './views/admin.js';

const app = document.getElementById('app');
const authForm = document.getElementById('auth-form');
const signupBtn = document.getElementById('signup-btn');
const logoutLink = document.getElementById('logout-link');
const nav = document.getElementById('nav');

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("Formulaire soumis");
  try {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    console.log("Tentative login avec", email);

    await signIn(email, password);

    console.log("Connexion réussie, redirection…");
    location.hash = '#/fiches';
  } catch (err) {
    console.error("Erreur d’auth :", err);
    document.getElementById('auth-error').textContent = err.message;
  }
});


signupBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  try {
    await signUp(email, password);
    location.hash = '#/fiches';
  } catch (err) {
    document.getElementById('auth-error').textContent = err.message;
  }
});

logoutLink.addEventListener('click', () => {
  logout();
  nav.hidden = true;
  document.getElementById('auth-container').hidden = false;
});

function router() {
  const route = location.hash || '#/login';
  if (!getJWT() && route !== '#/login') {
    app.innerHTML = '';
    document.getElementById('auth-container').hidden = false;
    nav.hidden = true;
    return;
  }

  document.getElementById('auth-container').hidden = true;
  nav.hidden = false;

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

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
