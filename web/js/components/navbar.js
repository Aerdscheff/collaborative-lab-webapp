// web/js/components/navbar.js
export function renderNavbar(containerId = 'navbar') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <nav class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img src="./assets/aerdscheff-logo.png" alt="Logo" class="h-8">
        <span class="font-exo2 text-lg">Collaborative Lab</span>
      </div>
      <!-- Menu desktop -->
      <div class="hidden md:flex space-x-6">
        <a href="#/fiches" class="hover:text-turquoise transition">Fiches</a>
        <a href="#/collaborations" class="hover:text-turquoise transition">Collaborations</a>
        <a href="#/profil" class="hover:text-turquoise transition">Profil</a>
        <a href="#/admin" class="hover:text-turquoise transition">Admin</a>
      </div>
      <!-- Bouton burger -->
      <div class="md:hidden">
        <button id="menu-toggle" class="focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
    <!-- Menu mobile -->
    <div id="menu-mobile" class="hidden bg-purple-700 text-white px-6 py-4 space-y-3">
      <a href="#/fiches" class="block hover:text-turquoise">Fiches</a>
      <a href="#/collaborations" class="block hover:text-turquoise">Collaborations</a>
      <a href="#/profil" class="block hover:text-turquoise">Profil</a>
      <a href="#/admin" class="block hover:text-turquoise">Admin</a>
    </div>
  `;

  const toggle = container.querySelector('#menu-toggle');
  const mobileMenu = container.querySelector('#menu-mobile');
  toggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.add('transition', 'duration-300', 'ease-in-out');
  });
}
