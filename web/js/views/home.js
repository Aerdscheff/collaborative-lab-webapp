import { renderLayout } from '../layout.js';

export function render(app) {
  const content = `
    <!-- Hero Section (70%) -->
    <section class="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
      <!-- Image de fond fixe -->
      <div class="absolute inset-0 bg-cover bg-center"
           style="background-image: url('/assets/batiment-aerdscheff.png'); background-attachment: fixed;"></div>

      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/40 via-purple-600/40 to-[#E25C5C]/40"></div>

      <!-- Cercle central -->
      <div class="relative z-10 flex flex-col items-center justify-center text-center">
        <div class="w-[20rem] h-[20rem] md:w-[24rem] md:h-[24rem] rounded-full relative flex flex-col items-center justify-center px-8 animate-glow breathing"
             style="background: radial-gradient(circle, rgba(255,255,255,0.95) 70%, rgba(255,255,255,0.8) 100%);
                    box-shadow: 0 0 40px 12px rgba(226,92,92,0.35), 0 0 60px 20px rgba(147,112,219,0.25);">

          <!-- Texture aquarelle -->
          <div class="absolute inset-0 rounded-full opacity-15"
               style="background-image: url('/assets/aquarelle-texture.png');
                      background-size: cover; mix-blend-mode: overlay;"></div>

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
    </section>

    <!-- Section suivante (30%) -->
    <section class="relative w-full h-[30vh] overflow-hidden flex items-center justify-center">
      <!-- Fond -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/20 via-purple-500/20 to-[#E25C5C]/20"></div>
      <div class="absolute inset-0 opacity-40"
           style="background-image: url('/assets/aquarelle-texture.png'); background-size: cover;"></div>

      <!-- Texte -->
      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center fade-in">
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

  renderLayout(app, content, { isHome: true });
}
