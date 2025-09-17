import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ⚠️ Ces variables seront injectées au build par Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialisation du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Connexion avec email / mot de passe
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  localStorage.setItem('jwt', data.session.access_token);
  return data.user;
}

// Création de compte
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

// Déconnexion
export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem('jwt');
}

// Récupération du token JWT
export function getJWT() {
  return localStorage.getItem('jwt');
}
