// Import des vues
import { render as renderHome } from "./views/home.js";
import { render as renderProfile } from "./views/profile.js";
import { render as renderProfileEdit } from "./views/profile-edit.js";
import { render as renderFiches } from "./views/fiches.js";
import { render as renderFicheCreate } from "./views/fiches-create.js";
import { render as renderMessages } from "./views/messages.js";
import { render as renderCollabs } from "./views/collaborations.js";
import { render as renderAdmin } from "./views/admin.js";
import { render as renderResetPassword } from "./views/reset-password.js";

// Helper loader + animation fade-in
function showLoader(app) {
  app.innerHTML = `<div class="loader">Chargement</div>`;
}

function withFadeIn(renderFn, app) {
  showLoader(app);
  setTimeout(() => {
    renderFn(app);
    app.classList.remove("fade-in");
    void app.offsetWidth; // reset animation
    app.classList.add("fade-in");
  }, 300); // délai pour voir le loader
}

// Router principal
function router() {
  const app = document.querySelector("main");
  const hash = window.location.hash || "#home";

  switch (hash) {
    case "#home":
      withFadeIn(renderHome, app);
      break;
    case "#profil":
      withFadeIn(renderProfile, app);
      break;
    case "#profil-edit":
      withFadeIn(renderProfileEdit, app);
      break;
    case "#fiches":
      withFadeIn(renderFiches, app);
      break;
    case "#fiches-create":
      withFadeIn(renderFicheCreate, app);
      break;
    case "#messages":
      withFadeIn(renderMessages, app);
      break;
    case "#collaborations":
      withFadeIn(renderCollabs, app);
      break;
    case "#admin":
      withFadeIn(renderAdmin, app);
      break;
    case "#reset-password":
      withFadeIn(renderResetPassword, app);
      break;
    default:
      showLoader(app);
      setTimeout(() => {
        app.innerHTML = `
          <section class="card">
            <h2>Page introuvable</h2>
            <p>
              La page demandée n’existe pas. Retour à 
              <a href="#home">l’accueil</a>.
            </p>
          </section>
        `;
        app.classList.remove("fade-in");
        void app.offsetWidth;
        app.classList.add("fade-in");
      }, 300);
  }
}

// Initialisation
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
