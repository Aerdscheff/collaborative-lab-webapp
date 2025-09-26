// /web/js/views/home.js
export function render(app) {
  app.innerHTML = `
    <section class="relative h-[70vh] flex items-center justify-center overflow-visible">
      <img src="./assets/Batiment aerdscheff.png" alt="Bâtiment Äerdschëff"
           class="absolute inset-0 w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/40 via-purple-600/30 to-[#E25C5C]/40 animate-gradient"></div>
      <div class="relative z-10 flex flex-col items-center justify-center text-center">
        <div class="w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] rounded-full relative flex flex-col items-center justify-center px-8 animate-glow breathing"
             style="background: radial-gradient(circle, rgba(255,255,255,0.95) 70%, rgba(255,255,255,0.75) 100%); box-shadow: 0 0 55px 20px rgba(255,255,255,0.5), 0 0 85px 30px rgba(255,255,255,0.4);">
          <div class="absolute inset-0 rounded-full opacity-15"
               style="background-image: url('./assets/aquarelle-texture.png'); background-size: cover; mix-blend-mode: overlay;"></div>
          <div class="relative z-10 text-center">
            <h1 class="text-2xl md:text-3xl font-exo2 text-[#E25C5C]">Bienvenue dans</h1>
            <h2 class="text-xl md:text-2xl font-exo2 text-purple-700 mb-2">Collaborative Lab</h2>
            <p class="text-sm text-gray-700">
              Ton espace de cocréation de trames pédagogiques transversales
            </p>
            <a href="#profil"
               class="mt-4 inline-flex justify-center items-center bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition text-base font-medium clickable">
              🚀 <span class="ml-2">S’inscrire / Se connecter</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}
