import { login, signup } from '../auth.js';
import { renderLayout } from '../layout.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app) {
  const content = `
    <h1 class="text-3xl font-exo2 font-bold text-[#E25C5C] mb-6">🔑 Connexion / Inscription</h1>
    <div id="auth-feedback" class="mb-4"></div>
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

  renderLayout(app, content);

  const feedback = document.getElementById('auth-feedback');
  const form = document.getElementById('auth-form');

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
    } catch (err) {
      console.error(err);
    }
  });
}
