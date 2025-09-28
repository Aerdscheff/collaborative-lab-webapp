import { getSession, logout } from './auth.js';
import { getProfile } from './api.js';

export async function renderLayout(app, contentHtml) {
  const session = await getSession();

  let userEmail = session?.user?.email || null;
  let displayName = null;

  // 🔎 Si connecté → on tente de récupérer le profil
  if (session?.user?.id) {
    const profile = await getProfile(session.user.id);
    if (profile?.name) {
      displayName = profile.name;
    }
  }

  // Avatar = initiale du name ou fallback email
  const avatarLetter = displayName
    ? displayName.charAt(0).toUpperCase()
    : userEmail
    ? userEmail.charAt(0).toUpperCase()
    : "?";

  app.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#fdf7f7] text-gray-800 font-sans">

      <!-- Header premium -->
      <header class="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] bg-gradient-to-r from-[#E25C5C]/90 to-purple-600/90 backdrop-blur-md rounded-xl text-white shadow-lg z-50">
        <nav class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <img src="/assets/logo-official.png" alt="Äerdschëff Logo" class="h-8 drop-shadow-md">
            <a href="#home" class="font-exo2 text-lg font-semibold tracking-wide">Collaborative Lab</a>
          </div>

          <!-- Desktop menu -->
          <div class="hidden md:flex space-x-6 font-medium items-center">
            <a href="#fiches" class="transition hover:text-turquoise-300">Fiches</a>
            <a href="#collaborations" class="transition hover:text-turquoise-300">Collaborations</a>
            <a href="#profil" class="transition hover:text-turquoise-300">Profil</a>
            <a href="#admin" class="transition hover:text-turquoise-300">Admin</a>
            ${
              session
                ? `
                  <div class="flex items-center space-x-2">
                    <div id="avatar-desktop" class="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold shadow-md cursor-pointer">
                      ${avatarLetter}
                    </div>
                    <span class="text-sm opacity-80">${displayName || userEmail}</span>
                    <button id="logout-btn" class="bg-[#E25C5C] hover:bg-red-600 text-white px-3 py-1 rounded-xl shadow-md">
                      Déconnexion
                    </button>
                  </div>
                `
                : `<a href="#auth" class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-xl shadow-md">Connexion</a>`
            }
          </div>

          <!-- Burger button (mobile) -->
          <button id="burger-btn" aria-label="Menu mobile"
            class="md:hidden flex flex-col space-y-1.5 focus:outline-none">
            <span class="w-6 h-0.5 bg-white rounded"></span>
            <span class="w-6 h-0.5 bg-white rounded"></span>
            <span class="w-6 h-0.5 bg-white rounded"></span>
          </button>
        </nav>

        <!-- Mobile menu -->
        <div id="mobile-menu" class="hidden flex-col items-center space-y-4 py-4 bg-gradient-to-r from-[#E25C5C]/95 to-purple-600/95 rounded-b-xl md:hidden">
          <a href="#fiches" class="block w-full text-center py-2 hover:text-turquoise-300">Fiches</a>
          <a href="#collaborations" class="block w-full text-center py-2 hover:text-turquoise-300">Collaborations</a>
          <a href="#profil" class="block w-full text-center py-2 hover:text-turquoise-300">Profil</a>
          <a href="#admin" class="block w-full text-center py-2 hover:text-turquoise-300">Admin</a>
          ${
            session
              ? `
                <div class="flex flex-col items-center space-y-2">
                  <div id="avatar-mobile" class="w-10 h-10 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold shadow-md cursor-pointer">
                    ${avatarLetter}
                  </div>
                  <span class="text-sm opacity-80">${displayName || userEmail}</span>
                  <button id="logout-btn-mobile" class="bg-[#E25C5C] hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md">
                    Déconnexion
                  </button>
                </div>
              `
              : `<a href="#auth" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-md">Connexion</a>`
          }
        </div>
      </header>

      <!-- Main -->
      <main class="flex-1 relative pt-28 pb-12">
        <div id="page-content" class="max-w-5xl mx-auto px-4">
          ${contentHtml}
        </div>
      </main>

      <!-- Footer unique -->
      <footer class="bg-gradient-to-r from-purple-600/90 to-[#E25C5C]/90 text-white py-4 mt-auto">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 space-y-3 md:space-y-0">
          <p class="text-sm opacity-80">© 2025 <a href="https://aerdscheff.lu" target="_blank" class="underline">Äerdschëff</a> · Collaborative Lab</p>
          <div class="flex space-x-6">
            <a href="https://github.com/Aerdscheff/collaborative-lab-webapp" target="_blank" aria-label="Code source sur GitHub" class="hover:text-turquoise-300 transition">
              <i class="fab fa-github text-lg"></i>
            </a>
            <a href="mailto:contact@aerdscheff.lu" aria-label="Contacter par mail" class="hover:text-turquoise-300 transition">
              <i class="fas fa-envelope text-lg"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>

    <!-- Script menu mobile -->
    <script>
      const burgerBtn = document.getElementById("burger-btn");
      const mobileMenu = document.getElementById("mobile-menu");
      if (burgerBtn) {
        burgerBtn.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
          mobileMenu.classList.toggle("flex");
        });
      }
    </script>
  `;

  // ✅ Gestion avatar → redirige vers #profil
  const avatarDesktop = document.getElementById('avatar-desktop');
  if (avatarDesktop) {
    avatarDesktop.addEventListener('click', () => {
      window.location.hash = '#profil';
    });
  }
  const avatarMobile = document.getElementById('avatar-mobile');
  if (avatarMobile) {
    avatarMobile.addEventListener('click', () => {
      window.location.hash = '#profil';
    });
  }

  // ✅ Gestion logout (desktop)
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await logout();
        window.location.hash = '#auth';
      } catch (err) {
        console.error('[layout] logout error', err);
      }
    });
  }

  // ✅ Gestion logout (mobile)
  const logoutBtnMobile = document.getElementById('logout-btn-mobile');
  if (logoutBtnMobile) {
    logoutBtnMobile.addEventListener('click', async () => {
      try {
        await logout();
        window.location.hash = '#auth';
      } catch (err) {
        console.error('[layout] logout error', err);
      }
    });
  }
}
