// Layout global futuriste/aquarelle pour l'app Collaborative Lab
export function renderLayout(app, contentHtml) {
  app.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#fdf7f7] text-gray-800 font-sans">

      <!-- Header -->
      <header class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white shadow">
        <nav class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="./assets/aerdscheff-logo.png" alt="Äerdschëff Logo" class="h-8">
            <span class="font-exo2 text-lg">Collaborative Lab</span>
          </div>
          <div class="flex space-x-6">
            <a href="#/fiches" class="transition hover:text-turquoise-300 hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)]">Fiches</a>
            <a href="#/collaborations" class="transition hover:text-turquoise-300 hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)]">Collaborations</a>
            <a href="#/profiles" class="transition hover:text-turquoise-300 hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)]">Profil</a>
            <a href="#/admin" class="transition hover:text-turquoise-300 hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)]">Admin</a>
          </div>
        </nav>
      </header>

      <!-- Main -->
      <main class="flex-1 relative py-12">
        <!-- Décor gauche -->
        <img src="./assets/deco-left.png" alt="Décor gauche"
             class="absolute left-0 top-20 h-32 opacity-70 pointer-events-none">

        <!-- Contenu central -->
        <div id="page-content" class="max-w-4xl mx-auto px-4">
          ${contentHtml}
        </div>

        <!-- Décor droit -->
        <img src="./assets/deco-right.png" alt="Décor droite"
             class="absolute right-0 top-20 h-32 opacity-70 pointer-events-none">
      </main>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white text-center py-3">
        <p class="text-sm opacity-80">© 2025 Äerdschëff · Collaborative Lab</p>
      </footer>
    </div>
  `;
}
