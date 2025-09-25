// Layout global pour l'application Collaborative Lab
export function renderLayout(app, contentHtml) {
  app.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#fdf7f7] text-gray-800 font-sans">

      <!-- Header -->
      <header class="bg-[#E25C5C] text-white shadow">
        <nav class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="./assets/aerdscheff-logo.png" alt="Äerdschëff Logo" class="h-8">
            <span class="font-bold">Ä Collaborative Lab</span>
          </div>
          <div class="flex space-x-6">
            <a href="#/fiches" class="hover:text-[#fdf7f7]">Fiches</a>
            <a href="#/collaborations" class="hover:text-[#fdf7f7]">Collaborations</a>
            <a href="#/profiles" class="hover:text-[#fdf7f7]">Profil</a>
            <a href="#/admin" class="hover:text-[#fdf7f7]">Admin</a>
          </div>
        </nav>
      </header>

      <!-- Main -->
      <main class="flex-1 relative py-12">
        <!-- Image décorative gauche -->
        <img src="./assets/deco-left.png" alt="Décor gauche"
             class="absolute left-0 top-20 h-32 opacity-70 pointer-events-none">

        <!-- Contenu injecté -->
        <div id="page-content" class="max-w-4xl mx-auto px-4">
          ${contentHtml}
        </div>

        <!-- Image décorative droite -->
        <img src="./assets/deco-right.png" alt="Décor droite"
             class="absolute right-0 top-20 h-32 opacity-70 pointer-events-none">
      </main>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white text-center py-3">
        <p class="text-sm">© 2025 Äerdschëff · Collaborative Lab</p>
      </footer>
    </div>
  `;
}
