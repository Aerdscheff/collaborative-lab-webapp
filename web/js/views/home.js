import { renderLayout } from '../layout.js';

export function render(app) {
  const content = `
    <!-- Hero unique couvrant toute la page -->
    <section class="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <!-- Image de fond fixe -->
      <div class="absolute inset-0 bg-cover bg-center"
           style="background-image: url('/assets/batiment-aerdscheff.png'); background-attachment: fixed;"></div>

      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/40 via-purple-600/40 to-[#E25C5C]/40"></div>

      <!-- Cercle central -->
      <div class="relative z-10 flex flex-col items-center justify-center text-center">
        <div class="w-[22rem] h-[22rem] md:w-[26rem] md:h-[26rem] rounded-full relative flex flex-col items-center justify-center px-8 animate-glow breathing"
             style="background: radial-gradient(circle, rgba(255,255,255,0.95) 70%, rgba(255,255,255,0.75) 100%); box-shadow: 0 0 40px 12px rgba(226,92,92,0.35), 0 0 60px 20px rgba(147,112,219,0.25);">

          <!-- Texture aquarelle -->
          <div class="absolute inset-0 rounded-full opacity-15"
               style="background-image: url('/assets/aquarelle-texture.png'); background-size: cover; mix-blend-mode: overlay;"></div>

          <!-- Contenu -->
          <div class="relative z-10 text-center">
            <h1 class="text-2xl md:text-3xl font-exo2 text-[#E25C5C]">Bienvenue dans</h1>
            <h2 class="text-xl md:text-2xl font-exo2 text-purple-700 mb-2">Collaborative Lab</h2>
            <p class="text-sm text-gray-700">
              Ton espace de cocréation de trames pédagogiques transversales
            </p>
            <a href="#auth"
               class="mt-4 inline-flex justify-center items-center bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition text-base font-medium clickable">
              🚀 <span class="ml-2">S’inscrire / Se connecter</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Texte bas de page -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center text-white max-w-3xl px-6">
        <h3 class="text-xl md:text-2xl font-exo2 mb-3">Qu’est-ce que Collaborative Lab ?</h3>
        <p class="text-sm md:text-base leading-relaxed">
          <strong>Collaborative Lab</strong> est un dispositif éducatif imaginé par Äerdschëff asbl. 
          Pensé comme un <span class="font-medium">outil basé sur l’intelligence artificielle</span>, 
          il facilite le travail collaboratif entre enseignants et intervenants externes.<br><br>
          Basé sur une <span class="font-medium">pédagogie de projet</span>, il génère des 
          <span class="font-medium">trames pédagogiques interdisciplinaires</span> 
          à partir des compétences du curriculum et des publics visés.
        </p>
      </div>
    </section>
  `;

  renderLayout(app, content, { isHome: true });
}
