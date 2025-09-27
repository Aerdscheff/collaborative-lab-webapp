// Import des vues
import { render as renderHome } from "./views/home.js";
import { render as renderProfile } from "./views/profil.js";
import { render as renderProfileEdit } from "./views/profile-edit.js";
import { render as renderFiches } from "./views/fiches.js";
import { render as renderFicheCreate } from "./views/fiches-create.js";
import { render as renderMessages } from "./views/messages.js";
import { render as renderCollabs } from "./views/collaborations.js";
import { render as renderAdmin } from "./views/admin.js";
import { render as renderResetPassword } from "./views/reset-password.js";
import { render as renderAuth } from "./views/auth.js";

// Helpers
import { requireAuth, requireAdmin } from "./authGuard.js";

// Loader + animation fade-in
function showLoader(app) {
  app.innerHTML = `
    <div class="loader flex items-center justify-center h-full">
      <div class="spinner animate-spin h-10 w-10 border-4 border-t-transparent border-purple-600 rounded-full"></div>
    </div>
  `;
}

function withFadeIn(renderFn, app, ...args) {
  showLoader(app);
  setTimeout(async () => {
    await renderFn(app, ...args);
    app.classList.remove("fade-in");
    void app.offsetWidth; // reset animation
    app.classList.add("fade-in");
  }, 300);
}

// Router principal
async function router() {
  const app = document.querySelector("main#app");
  const hash = window.location.hash || "#home";

  switch (true) {
    case hash === "#home":
      withFadeIn(renderHome, app);
      break;

    case hash === "#profil":
      if (!(await requireAuth())) return;
      withFadeIn(renderProfile, app);
      break;

    case hash === "#profil-edit":
      if (!(await requireAuth())) return;
      withFadeIn(renderProfileEdit, app);
      break;

    case hash === "#fiches":
      withFadeIn(renderFiches, app);
      break;

    case hash === "#fiches/create":
      if (!(await requireAuth())) return;
      withFadeIn(renderFicheCreate, app);
      break;

    case hash === "#messages":
      if (!(await requireAuth())) return;
      withFadeIn(renderMessages, app);
      break;

    case hash === "#collaborations":
      withFadeIn(renderCollabs, app);
      break;

    case hash === "#admin":
      if (!(await requireAdmin())) return;
      withFadeIn(renderAdmin, app);
      break;

    case hash === "#reset-password":
      withFadeIn(renderResetPassword, app);
      break;

    case hash === "#auth":
      withFadeIn(renderAuth, app);
      break;

    default:
      showLoader(app);
      setTimeout(() => {
        app.innerHTML = `
          <section class="card text-center py-12">
            <h2 class="text-2xl font-exo2 text-[#E25C5C] mb-4">Page introuvable</h2>
            <p class="text-gray-700">
              La page demandée n’existe pas. Retour à 
              <a href="#home" class="text-purple-600 underline">l’accueil</a>.
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
