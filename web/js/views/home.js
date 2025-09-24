export function render(app) {
  app.innerHTML = `
    <section class="card" style="text-align:center;">
      <h1>Bienvenue dans le Collaborative Lab – Äerdschëff</h1>
      <p>
        Une plateforme pour partager vos pratiques pédagogiques, 
        collaborer et créer ensemble.
      </p>
      <div style="margin:2rem 0;">
        <img src="./cactus-home.png" alt="Cactus Äerdschëff" style="max-width:200px; margin:1rem;">
        <img src="./home-top-bottom.png" alt="Illustration" style="max-width:200px; margin:1rem;">
      </div>
      <button onclick="window.location.hash='#profil'">
        🚀 Accéder à mon profil
      </button>
    </section>
  `;
}
