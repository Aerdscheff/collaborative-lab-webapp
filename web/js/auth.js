import { createClient } from '@supabase/supabase-js';
import { showFeedback } from './utils/feedback.js';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialisation du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Vérification de configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[auth] Variables d'environnement manquantes : VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY."
  );
}

// === Fonctions d'authentification ===

/**
 * Connexion avec email + mot de passe
 */
export async function login(email, password, feedbackContainer) {
  try {
    showFeedback(feedbackContainer, 'info', 'Connexion en cours...');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    showFeedback(feedbackContainer, 'success', 'Connexion réussie ✅');
    return data;
  } catch (err) {
    console.error('[auth] Échec de connexion', err);
    showFeedback(feedbackContainer, 'error', err.message || 'Impossible de se connecter.');
    throw err;
  }
}

/**
 * Inscription avec email + mot de passe
 */
export async function signup(email, password, feedbackContainer) {
  try {
    showFeedback(feedbackContainer, 'info', 'Création du compte...');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    showFeedback(feedbackContainer, 'success', 'Compte créé ✅ Vérifiez vos emails.');
    return data;
  } catch (err) {
    console.error('[auth] Échec inscription', err);
    showFeedback(feedbackContainer, 'error', err.message || 'Impossible de créer le compte.');
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
    console.error('[auth] Échec déconnexion', err);
    showFeedback(feedbackContainer, 'error', err.message || 'Impossible de se déconnecter.');
    throw err;
  }
}

/**
 * Obtenir la session courante
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (err) {
    console.error('[auth] Impossible de récupérer la session', err);
    return null;
  }
}

// --- Aliases pour compatibilité avec router.js ---
export const signIn = login;
export const signUp = signup;

export async function getJWT() {
  const session = await getSession();
  return session?.access_token || null;
}
