import { createClient } from '@supabase/supabase-js';
import { showFeedback } from './utils/feedback.js';
import { renderLayout } from './layout.js';

/* -------------------
   INIT CLIENT SUPABASE
------------------- */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[auth] Variables manquantes : VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* -------------------
   FONCTIONS AUTH
------------------- */
export async function login(email, password, feedbackContainer) {
  try {
    showFeedback(feedbackContainer, 'info', 'Connexion en cours...');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    showFeedback(feedbackContainer, 'success', 'Connexion réussie ✅');
    return data;
  } catch (err) {
    console.error('[auth] login error', err);
    showFeedback(feedbackContainer, 'error', err.message || 'Connexion impossible.');
    throw err;
  }
}

export async function signup(email, password, feedbackContainer) {
  try {
    showFeedback(feedbackContainer, 'info', 'Création du compte…');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    showFeedback(feedbackContainer, 'success', 'Compte créé ✅ Vérifiez vos emails.');
    return data;
  } catch (err) {
    console.error('[auth] signup error', err);
    showFeedback(feedbackContainer, 'error', err.message || 'Création impossible.');
    throw err;
  }
}

export async function logout(feedbackContainer) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    showFeedback(feedbackContainer, 'success', 'Vous êtes déconnecté.');
  } catch (err) {
    console.error('[auth] logout error', err);
    showFeedback(feedbackContainer, 'error', err.message || 'Déconnexion impossible.');
    throw err;
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (err) {
    console.error('[auth] getSession error', err);
    return null;
  }
}

export async function getJWT() {
  const session = await getSession();
  return session?.access_token || null;
}

export const signIn = login;
export const signUp = signup;

/* -------------------
   VUE AUTH (render)
------------------- */
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
