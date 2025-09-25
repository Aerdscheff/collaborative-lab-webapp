// web/js/components/background.js
// Crée un fond aquarelle animé avec un dégradé lent + effet parallaxe

export function renderBackground(containerId = 'background') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="absolute inset-0 overflow-hidden z-0">
      <!-- Calque dégradé animé -->
      <div class="w-full h-full bg-gradient-to-r from-[#E25C5C] via-purple-500 to-[#E25C5C] animate-gradient"></div>

      <!-- Calque aquarelle (texture PNG semi-transparente) -->
      <div class="absolute inset-0 opacity-20 mix-blend-multiply"
           style="background-image: url('./assets/aquarelle-texture.png'); background-size: cover;">
      </div>
    </div>
  `;

  // Ajoute un effet parallaxe léger au scroll
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.2; // effet subtil
    const gradientLayer = container.querySelector('.animate-gradient');
    if (gradientLayer) {
      gradientLayer.style.transform = `translateY(${offset}px)`;
    }
  });
}
