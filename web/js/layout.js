import { getSession } from './auth.js';

// Layout global futuriste/aquarelle pour l'app Collaborative Lab
export async function renderLayout(app, contentHtml) {
  const session = await getSession();
  const role = session?.user?.role || session?.user?.app_metadata?.role || "teacher";

  app.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#fdf7f7] text-gray-800 font-sans">

      <!-- Header premium -->
      <header class="fixed top-0 left-0 w-full 
        bg-gradient-to-r from-[#E25C5C]/90 to-purple-600/90 backdrop-blur-md 
        text-white shadow-lg z-50">
        <nav class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          
          <!-- Logo -->
          <div class="flex items-center space-x-3 cursor-pointer" onclick="window.location.hash='#home'">
            <img src="/assets/logo-official.png" alt="Äerdschëff Logo" class="h-8 drop-shadow-md">
            <span class="font-exo2 text-lg font-semibold tracking-wide">Collaborative Lab</span>
            ${
              role === "admin"
                ? `<span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-400 text-black font-bold shadow-md">ADMIN</span>`
                : ""
            }
          </div>

          <!-- Desktop menu -->
          <div class="hidden md:flex space-x-6 font-medium items-center">
            <a href="#fiches" class="transition hover:text-turquoise-300">Fiches</a>
            <a href="#collaborations" class="transition hover:text-turquoise-300">Collaborations</a>
            <a href="#profil" class="transition hover:text-turquoise-300">Profil</a>

            ${
              role === "admin"
                ? `
            <!-- Menu admin avec dropdown -->
            <div class="relative group">
              <button class="transition hover:text-turquoise-300">Admin ▾</button>
              <div class="absolute hidden group-hover:block bg-white text-gray-800 mt-2 rounded-lg shadow-lg min-w-[180px] z-50">
                <a href="#admin" class="block px-4 py-2 hover:bg-gray-100">👥 Utilisateurs</a>
                <a href="#admin/fiches" class="block px-4 py-2 hover:bg-gray-100">📚 Fiches</a>
                <a href="#admin/logs" class="block px-4 py-2 hover:bg-gray-100">📜 Logs</a>
              </div>
            </div>
                `
                : ""
            }
          </div>

          <!-- Burger button -->
          <button id="burger-btn" aria-label="Menu mobile"
            class="md:hidden flex flex-col space-y-1.5 focus:outline-none">
            <span class="w-6 h-0.5 bg-white rounded"></span>
            <span class="w-6 h-0.5 bg-white rounded"></span>
            <span class="w-6 h-0.5 bg-white rounded"></span>
          </button>
        </nav>

        <!-- Mobile menu -->
        <div id="mobile-menu" 
             class="hidden flex-col items-center space-y-4 py-4 
             bg-gradient-to-r from-[#E25C5C]/95 to-purple-600/95 rounded-b-xl md:hidden">
          <a href="#fiches" class="block w-full text-center py-2 hover:text-turquoise-300">Fiches</a>
          <a href="#collaborations" class="block w-full text-center py-2 hover:text-turquoise-300">Collaborations</a>
          <a href="#profil" class="block w-full text-center py-2 hover:text-turquoise-300">Profil</a>

          ${
            role === "admin"
              ? `
          <div class="border-t border-white/30 w-2/3"></div>
          <a href="#admin" class="block w-full text-center py-2 hover:text-turquoise-300">👥 Utilisateurs</a>
          <a href="#admin/fiches" class="block w-full text-center py-2 hover:text-turquoise-300">📚 Fiches</a>
          <a href="#admin/logs" class="block w-full text-center py-2 hover:text-turquoise-300">📜 Logs</a>
              `
              : ""
          }
        </div>
      </header>

      <!-- Main -->
      <main class="flex-1 relative pt-24 pb-12">
        ${contentHtml}
      </main>

      <!-- Footer premium -->
      <footer class="bg-gradient-to-r from-purple-600/90 to-[#E25C5C]/90 text-white py-4 mt-auto">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 space-y-3 md:space-y-0">
          <p class="text-sm opacity-80">
            © 2025 
            <a href="https://aerdscheff.lu" target="_blank" class="underline hover:text-turquoise-300">
              Äerdschëff
            </a> · Collaborative Lab
          </p>
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
}
