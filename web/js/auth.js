import { createClient } from '@supabase/supabase-js';
import { showFeedback } from './utils/feedback.js';

// --------------------
// INIT CLIENT SUPABASE
// --------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[auth] Variables manquantes : VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --------------------
// AUTHENTIFICATION
// --------------------

/**
 * Connexion avec email / mot de passe
 */
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

/**
 * Inscription avec email / mot de passe
 */
export async function signup(email, password, feedbackContainer) {
  try {
    showFeedback(feedbackContainer, 'info', 'Création du compte…');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: "teacher" } // rôle par défaut
      }
    });
    if (error) throw error;
    showFeedback(feedbackContainer, 'success', 'Compte créé ✅ Vérifiez vos emails.');
    return data;
  } catch (err) {
    console.error('[auth] signup error', err);
    showFeedback(feedbackContainer, 'error', err.message || 'Création impossible.');
    throw err;
  }
}

/**
 * Déconnexion
 */
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

/**
 * Obtenir la session en cours
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (data.session) {
      // Récupération du rôle
      const user = data.session.user;
      const role =
        user?.role ||
        user?.app_metadata?.role ||
        user?.user_metadata?.role ||
        "teacher";

      return {
        ...data.session,
        user: {
          ...user,
          role
        }
      };
    }

    return null;
  } catch (err) {
    console.error('[auth] getSession error', err);
    return null;
  }
}

/**
 * Obtenir le JWT
 */
export async function getJWT() {
  const session = await getSession();
  return session?.access_token || null;
}

// --------------------
// ALIASES
// --------------------
export const signIn = login;
export const signUp = signup;
