import { login, signup, logout, getSession } from '../auth.js';
import { renderLayout } from '../layout.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app) {
  const session = await getSession();

  let content = `
    <h1 class="text-3xl font-exo2 font-bold text-[#E25C5C] mb-6">🔑 Authentification</h1>
    <div id="auth-feedback" class="mb-4"></div>
  `;

  if (session) {
    // ✅ Utilisateur connecté
    content += `
      <div class="bg-white shadow-md rounded-xl p-6 max-w-md mx-auto text-center space-y-4">
        <p class="text-gray-700">Bienvenue <strong>${session.user.email}</strong></p>
        <button id="logout-btn"
          class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
          🚪 Se déconnecter
        </button>
      </div>
    `;
  } else {
    // ✅ Pas connecté → afficher le formulaire
    content += `
      <form id="auth-form" class="space-y-4 bg-white shadow-md rounded-xl p-6 max-w-md mx-auto">
        <input type="email" name="email" placeholder="Email"
          class="w-full border rounded p-2" required>
        <input type="password" name="password" placeholder="Mot de passe"
          class="w-full border rounded p-2" required>
        <div class="flex justify-between">
          <button type="submit" name="action" value="login"
            class="bg-purple-600 text-white px-4 py-2 rounded">Se connecter</button>
          <button type="submit" name="action" value="signup"
            class="bg-[#E25C5C] text-white px-4 py-2 rounded">Créer un compte</button>
        </div>
      </form>
    `;
  }

  renderLayout(app, content);

  const feedback = document.getElementById('auth-feedback');

  // ✅ Gestion déconnexion
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await logout(feedback);
        setTimeout(() => (window.location.hash = '#auth'), 500);
      } catch (err) {
        console.error(err);
      }
    });
  }

  // ✅ Gestion connexion / inscription
  const form = document.getElementById('auth-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const email = formData.get('email');
      const password = formData.get('password');
      const action = formData.get('action');

      try {
        if (action === 'login') {
          await login(email, password, feedback);
        } else {
          await signup(email, password, feedback);
        }
        setTimeout(() => (window.location.hash = '#profil'), 800);
      } catch (err) {
        console.error(err);
      }
    });
  }
}
