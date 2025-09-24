// Import des vues
import { render as renderProfile } from "./views/profile.js";
import { render as renderProfileEdit } from "./views/profile-edit.js";
import { render as renderFiches } from "./views/fiches.js";
import { render as renderFicheCreate } from "./views/fiches-create.js";
import { render as renderMessages } from "./views/messages.js";
import { render as renderCollabs } from "./views/collaborations.js";
import { render as renderAdmin } from "./views/admin.js";
import { render as renderResetPassword } from "./views/reset-password.js";

// Vue d’accueil (home)
function renderHome(app) {
  app.innerHTML = `
    <section class="card" style="text-align:center;">
      <h1>Bienvenue dans le Collaborative Lab – Äerdschëff</h1>
      <p>Une plateforme pour partager vos pratiques pédagogiques, collaborer et créer ensemble.</p>
      <div style="margin:2rem 0;">
        <img src="./cactus-home.png" alt="Cactus Äerdschëff" style="max-width:200px; margin:1rem;">
        <img src="./home-top-bottom.png" alt="Illustration" style="max-width:200px; margin:1rem;">
      </div>
      <button onclick="window.location.hash='#profil'">🚀 Accéder à mon profil</button>
    </section>
  `;
}

// Router principal
function router() {
  const app = document.querySelector("main");
  const hash = window.location.hash || "#home";

  switch (hash) {
    case "#home":
      renderHome(app);
      break;
    case "#profil":
      renderProfile(app);
      break;
    case "#profil-edit":
      renderProfileEdit(app);
      break;
    case "#fiches":
      renderFiches(app);
      break;
    case "#fiches-create":
      renderFicheCreate(app);
      break;
    case "#messages":
      renderMessages(app);
      break;
    case "#collaborations":
      renderCollabs(app);
      break;
    case "#admin":
      renderAdmin(app);
      break;
    case "#reset-password":
      renderResetPassword(app);
      break;
    default:
      app.innerHTML = `
        <section class="card">
          <h2>Page introuvable</h2>
          <p>La page demandée n’existe pas. Retour à <a href="#home">l’accueil</a>.</p>
        </section>
      `;
  }
}

// Initialisation
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
