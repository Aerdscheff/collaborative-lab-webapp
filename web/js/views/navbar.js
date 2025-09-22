import { logout } from '../auth.js';

export function renderNavbar(container) {
  container.innerHTML = `
    <nav class="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <!-- Logo / titre -->
      <div class="text-lg font-semibold">
        <a href="#/">Ä Collaborative Lab</a>
      </div>

      <!-- Menu -->
      <div class="flex space-x-6">
        <a href="#/profiles" class="hover:text-gray-300">Profil</a>
        <div class="relative group">
          <button class="hover:text-gray-300">Fiches ▾</button>
          <div class="absolute hidden group-hover:block bg-gray-700 text-sm rounded shadow-lg mt-1">
            <a href="#/fiches" class="block px-4 py-2 hover:bg-gray-600">Liste</a>
            <a href="#/fiches/create" class="block px-4 py-2 hover:bg-gray-600">Nouvelle fiche</a>
          </div>
        </div>
        <a href="#/collaborations" class="hover:text-gray-300">Collaborations</a>
        <a href="#/admin" class="hover:text-gray-300">Admin</a>
        <button id="logout-btn"
          class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
          Déconnexion
        </button>
      </div>
    </nav>
  `;

  // Gestion du logout
  const logoutBtn = container.querySelector('#logout-btn');
  if (logoutBtn) {
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
}
