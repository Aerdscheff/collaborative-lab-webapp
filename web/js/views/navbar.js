import { logout } from '../auth.js';

export function renderNavbar(app) {
  app.innerHTML = `
    <nav class="navbar">
      <a href="#/">Accueil</a>
      <a href="#/profiles">Profil</a>
      <a href="#/fiches">Fiches</a>
      <a href="#/messages">Messages</a>
      <a href="#/collaborations">Collaborations</a>
      <button id="logout-btn">Se déconnecter</button>
    </nav>
  `;

  // Ajout de l'écouteur pour le bouton logout
  const logoutBtn = app.querySelector('#logout-btn');
  logoutBtn.addEventListener('click', async () => {
    try {
      await logout();
      window.location.hash = '#/login';
    } catch (err) {
      console.error('[navbar] Erreur logout', err);
      alert("Impossible de se déconnecter : " + (err.message || 'Erreur inconnue'));
    }
  });
}
