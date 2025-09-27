export function render(app) {
  app.innerHTML = `
    <!-- Hero Section -->
    <section class="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <!-- Image de fond -->
      <img src="/assets/batiment-aerdscheff.png" alt="Bâtiment Äerdschëff"
           class="absolute inset-0 w-full h-full object-cover">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/40 via-purple-600/30 to-[#E25C5C]/40"></div>

      <!-- Cercle central -->
      <div class="relative z-10 flex flex-col items-center justify-center text-center">
        <div class="w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] rounded-full flex flex-col justify-center items-center px-8 bg-white/90 shadow-xl">
          <h1 class="text-2xl md:text-3xl font-exo2 text-[#E25C5C]">Bienvenue dans</h1>
          <h2 class="text-xl md:text-2xl font-exo2 text-purple-700 mb-2">Collaborative Lab</h2>
          <p class="text-sm text-gray-700">Ton espace de cocréation de trames pédagogiques transversales</p>
          <a href="#auth"
             class="mt-4 inline-block bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition">
            🚀 S’inscrire / Se connecter
          </a>
        </div>
      </div>
    </section>

    <!-- Section suivante -->
    <section class="relative h-auto py-16 bg-gradient-to-r from-[#E25C5C]/10 via-purple-500/10 to-[#E25C5C]/10">
      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h3 class="text-xl md:text-2xl font-exo2 text-[#E25C5C] mb-3">Qu’est-ce que Collaborative Lab ?</h3>
        <p class="text-sm md:text-base text-gray-800 leading-relaxed">
          <strong>Collaborative Lab</strong> est un dispositif éducatif imaginé par Äerdschëff asbl.
          Pensé comme un <span class="text-purple-700 font-medium">outil basé sur l’intelligence artificielle</span>,
          il facilite le travail collaboratif entre enseignants et intervenants externes.<br><br>
          Basé sur une <span class="text-[#E25C5C] font-medium">pédagogie de projet</span>, il génère des
          <span class="text-purple-700 font-medium">trames pédagogiques interdisciplinaires</span>
          à partir des compétences du curriculum et des publics visés.
        </p>
      </div>
    </section>
  `;
}
