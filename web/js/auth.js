import { login, signup, logout, getSession } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const session = await getSession();

  const content = session
    ? `
      <h1 class="text-3xl font-exo2 text-[#E25C5C] mb-6">👋 Bonjour</h1>
      <p class="mb-6 text-gray-700">Vous êtes connecté avec <strong>${session.user.email}</strong>.</p>
      <div id="auth-feedback" class="mb-4"></div>
      <button id="logout-btn"
              class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
        🚪 Déconnexion
      </button>
    `
    : `
      <h1 class="text-3xl font-exo2 text-[#E25C5C] mb-6">🔐 Authentification</h1>
      <div id="auth-feedback" class="mb-4"></div>

      <!-- Login form -->
      <form id="login-form" class="bg-white rounded-xl shadow-md p-6 space-y-4 mb-8">
        <h2 class="font-exo2 text-xl text-purple-700 mb-2">Connexion</h2>
        <input type="email" id="login-email" placeholder="Email" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600">
        <input type="password" id="login-password" placeholder="Mot de passe" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600">
        <button type="submit"
                class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-4 py-2 rounded-xl shadow-md transition w-full">
          🔑 Se connecter
        </button>
      </form>

      <!-- Signup form -->
      <form id="signup-form" class="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h2 class="font-exo2 text-xl text-purple-700 mb-2">Créer un compte</h2>
        <input type="email" id="signup-email" placeholder="Email" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600">
        <input type="password" id="signup-password" placeholder="Mot de passe" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600">
        <button type="submit"
                class="bg-gradient-to-r from-purple-600 to-[#E25C5C] text-white px-4 py-2 rounded-xl shadow-md transition w-full">
          ✍️ Créer un compte
        </button>
      </form>
    `;

  renderLayout(app, content);

  const feedback = document.getElementById('auth-feedback');

  // Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      try {
        await login(email, password, feedback);
        setTimeout(() => window.location.reload(), 1000);
      } catch {}
    });
  }

  // Signup
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      try {
        await signup(email, password, feedback);
      } catch {}
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await logout(feedback);
        setTimeout(() => window.location.reload(), 1000);
      } catch {}
    });
  }
}
