// Import des vues
import { render as renderProfile } from "./views/profile.js";
import { render as renderProfileEdit } from "./views/profile-edit.js";
import { render as renderFiches } from "./views/fiches.js";
import { render as renderFicheCreate } from "./views/fiches-create.js";
import { render as renderMessages } from "./views/messages.js";
import { render as renderCollabs } from "./views/collaborations.js";
import { render as renderAdmin } from "./views/admin.js";
import { render as renderResetPassword } from "./views/reset-password.js";

// Fonction de routage
function router() {
  const app = document.querySelector("main");
  const hash = window.location.hash || "#profil";

  switch (hash) {
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
          <p>La page demandée n’existe pas. Retour à <a href="#profil">Mon Profil</a>.</p>
        </section>
      `;
  }
}

// Initialisation
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
