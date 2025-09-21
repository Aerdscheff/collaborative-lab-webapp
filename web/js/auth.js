import { createClient } from '@supabase/supabase-js';

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
export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[auth] Échec de connexion', err);
    throw err;
  }
}

/**
 * Inscription avec email + mot de passe
 */
export async function signup(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[auth] Échec inscription', err);
    throw err;
  }
}

/**
 * Déconnexion
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.error('[auth] Échec déconnexion', err);
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
