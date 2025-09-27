// Layout global futuriste/aquarelle pour l'app Collaborative Lab
export function renderLayout(app, contentHtml) {
  app.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#fdf7f7] text-gray-800 font-sans">

      <!-- Header premium -->
      <header class="fixed top-0 left-1/2 transform -translate-x-1/2 w-[95%] 
        bg-gradient-to-r from-[#E25C5C]/90 to-purple-600/90 backdrop-blur-md 
        rounded-xl text-white shadow-lg z-50">
        <nav class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-3 cursor-pointer" onclick="window.location.hash='#home'">
            <img src="/assets/logo-official.png" alt="Äerdschëff Logo" class="h-8 drop-shadow-md">
            <span class="font-exo2 text-lg font-semibold tracking-wide">Collaborative Lab</span>
          </div>

          <!-- Desktop menu -->
          <div class="hidden md:flex space-x-6 font-medium">
            <a href="#fiches" class="transition hover:text-turquoise-300">Fiches</a>
            <a href="#collaborations" class="transition hover:text-turquoise-300">Collaborations</a>
            <a href="#profil" class="transition hover:text-turquoise-300">Profil</a>
            <a href="#admin" class="transition hover:text-turquoise-300">Admin</a>
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
          <a href="#admin" class="block w-full text-center py-2 hover:text-turquoise-300">Admin</a>
        </div>
      </header>

      <!-- Main -->
      <main class="flex-1 relative pb-12">
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
