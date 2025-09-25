import { signIn, signUp } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <section class="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h1 class="text-3xl font-exo2 text-[#E25C5C] mb-6 text-center">🔐 Connexion</h1>
      <div id="auth-feedback" class="mb-4"></div>
      <form id="auth-form" class="space-y-4">
        <input id="auth-email" type="email" placeholder="Email"
          class="w-full border rounded px-3 py-2" required />
        <input id="auth-password" type="password" placeholder="Mot de passe"
          class="w-full border rounded px-3 py-2" required />
        <div class="flex justify-between items-center">
          <button type="submit"
            class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)] transition">
            Se connecter
          </button>
          <button type="button" id="signup-btn"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
            Créer un compte
          </button>
        </div>
      </form>
    </section>
  `;
  renderLayout(app, content);

  const feedback = document.getElementById('auth-feedback');
  const form = document.getElementById('auth-form');
  const signupBtn = document.getElementById('signup-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    try {
      await signIn(email, password, feedback);
      showFeedback(feedback, 'success', 'Connexion réussie ✅');
      setTimeout(() => { window.location.hash = '#/fiches'; }, 500);
    } catch {
      showFeedback(feedback, 'error', 'Erreur de connexion.');
    }
  });

  signupBtn.addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    try {
      await signUp(email, password, feedback);
      showFeedback(feedback, 'success', 'Compte créé ✅ Vérifiez vos emails.');
      setTimeout(() => { window.location.hash = '#/login'; }, 500);
    } catch {
      showFeedback(feedback, 'error', 'Erreur création de compte.');
    }
  });
}
