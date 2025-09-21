import { logout } from '../auth.js';

export function renderNavbar(app) {
  app.innerHTML = `
    <nav class="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <!-- Logo / titre -->
      <div class="text-lg font-semibold">
        <a href="#/">Collaborative Lab</a>
      </div>

      <!-- Bouton burger mobile -->
      <div class="lg:hidden">
        <button id="menu-toggle" class="focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Liens -->
      <div id="menu" class="hidden lg:flex space-x-6">
        <a href="#/profiles" class="hover:text-gray-300">Profil</a>
        <a href="#/fiches" class="hover:text-gray-300">Fiches</a>
        <a href="#/messages" class="hover:text-gray-300">Messages</a>
        <a href="#/collaborations" class="hover:text-gray-300">Collaborations</a>
        <button id="logout-btn"
          class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
          Se déconnecter
        </button>
      </div>
    </nav>

    <!-- Menu mobile -->
    <div id="mobile-menu" class="hidden bg-gray-700 text-white px-4 py-3 space-y-2 lg:hidden">
      <a href="#/profiles" class="block hover:text-gray-300">Profil</a>
      <a href="#/fiches" class="block hover:text-gray-300">Fiches</a>
      <a href="#/messages" class="block hover:text-gray-300">Messages</a>
      <a href="#/collaborations" class="block hover:text-gray-300">Collaborations</a>
      <button id="logout-btn-mobile"
        class="w-full bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
        Se déconnecter
      </button>
    </div>
  `;

  // Gestion du menu burger
  const toggleBtn = app.querySelector('#menu-toggle');
  const mobileMenu = app.querySelector('#mobile-menu');
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Gestion logout (desktop et mobile)
  const logoutActions = async () => {
    try {
      await logout();
      window.location.hash = '#/login';
    } catch (err) {
      console.error('[navbar] Erreur logout', err);
      alert("Impossible de se déconnecter : " + (err.message || 'Erreur inconnue'));
    }
  };

  const logoutBtn = app.querySelector('#logout-btn');
  const logoutBtnMobile = app.querySelector('#logout-btn-mobile');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutActions);
  if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', logoutActions);
}
