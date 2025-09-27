import { supabase } from './auth.js';

/* -------------------
   PROFIL UTILISATEUR
------------------- */

/**
 * Récupérer un profil utilisateur par son id
 */
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[api] getProfile error', err);
    return null;
  }
}

/**
 * Mettre à jour un profil utilisateur
 */
export async function updateProfile(userId, payload) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId);
    if (error) throw error;
    return { id: userId, ...payload };
  } catch (err) {
    console.error('[api] updateProfile error', err);
    return null;
  }
}

/* -------------------
   FICHES PÉDAGOGIQUES
------------------- */

export async function getFiches
