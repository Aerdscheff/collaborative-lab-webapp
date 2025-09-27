import { supabase } from './auth.js';

//
// -------------------- PROFIL --------------------
//

/**
 * Récupérer un profil utilisateur
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
export async function updateProfile(userId, updatedData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[api] updateProfile error', err);
    return null;
  }
}

//
// -------------------- FICHES --------------------
//

/**
 * Récupérer toutes les fiches
 */
export async function getFiches({ q = '', status = '', limit = 20, offset = 0 } = {}) {
  try {
    let query = supabase.from('fiches').select('*').range(offset, offset + limit - 1);

    if (q) {
      query = query.ilike('title', `%${q}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[api] getFiches error', err);
    return [];
  }
}

/**
 * Récupérer une fiche par ID
 */
export async function getFicheById(id) {
  try {
    const { data, error } = await supabase
      .from('fiches')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[api] getFicheById error', err);
    return null;
  }
}

/**
 * Créer une nouvelle fiche
 */
export async function createFiche(payload) {
  try {
    const { data, error } = await supabase
      .from('fiches')
      .insert(payload)
      .select('id')
      .single();
    if (error) throw error;
    return { id: data.id };
  } catch (err) {
    console.error('[api] createFiche error', err);
    return null;
  }
}

/**
 * Mettre à jour une fiche
 */
export async function updateFiche(id, payload) {
  try {
    const { error } = await supabase.from('fiches').update(payload).eq('id', id);
    if (error) throw error;
    return { id };
  } catch (err) {
    console.error('[api] updateFiche error', err);
    return null;
  }
}

/**
 * Supprimer une fiche
 */
export async function removeFiche(id) {
  try {
    const { error } = await supabase.from('fiches').delete().eq('id', id);
    if (error) throw error;
    return { id };
  } catch (err) {
    console.error('[api] removeFiche error', err);
    return null;
  }
}

//
// -------------------- UTILISATEURS (ADMIN) --------------------
//

/**
 * Récupérer tous les utilisateurs (admin)
 */
export async function getUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[api] getUsers error', err);
    return [];
  }
}

/**
 * Mettre à jour le rôle d'un utilisateur (admin)
 */
export async function updateUserRole(userId, role) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[api] updateUserRole error', err);
    return null;
  }
}

//
// -------------------- API OBJET POUR COMPATIBILITÉ --------------------
//
export const API = {
  list: getFiches,
  get: getFicheById,
  create: createFiche,
  update: updateFiche,
  remove: removeFiche,
};
