import { logout } from '../auth.js';

export function renderNavbar(container) {
  container.innerHTML = `
    <nav class="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <!-- Logo / titre -->
      <div class="text-lg font-semibold">
        <a href="#/">Ä Collaborative Lab</a>
      </div>

      <!-- Bouton burger (mobile) -->
      <div class="lg:hidden">
        <button id="menu-toggle" class="focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Menu desktop -->
      <div id="menu-desktop" class="hidden lg:flex space-x-6 items-center">
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

    <!-- Menu mobile -->
    <div id="menu-mobile" class="hidden bg-gray-700 text-white px-4 py-3 space-y-2 lg:hidden">
      <a href="#/profiles" class="block hover:text-gray-300">Profil</a>
      <a href="#/fiches" class="block hover:text-gray-300">Fiches – Liste</a>
      <a href="#/fiches/create" class="block hover:text-gray-300">Fiches – Nouvelle</a>
      <a href="#/collaborations" class="block hover:text-gray-300">Collaborations</a>
      <a href="#/admin" class="block hover:text-gray-300">Admin</a>
      <button id="logout-btn-mobile"
        class="w-full bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
        Déconnexion
      </button>
    </div>
  `;

  // Toggle du menu mobile
  const toggleBtn = container.querySelector('#menu-toggle');
  const mobileMenu = container.querySelector('#menu-mobile');
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Gestion du logout (desktop & mobile)
  const doLogout = async () => {
    try {
      await logout();
      window.location.hash = '#/login';
    } catch (err) {
      console.error('[navbar] Erreur logout', err);
      alert("Impossible de se déconnecter : " + (err.message || 'Erreur inconnue'));
    }
  };

  const logoutBtn = container.querySelector('#logout-btn');
  const logoutBtnMobile = container.querySelector('#logout-btn-mobile');
  if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
  if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', doLogout);
}
