import { supabase } from './auth.js';

//
// -------------------- PROFIL --------------------
//

/**
 * Récupérer un profil utilisateur avec email et rôle
 */
export async function getProfile(userId) {
  try {
    // Charger le profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (profileError) throw profileError;

    // Charger l'utilisateur lié (email + role)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, role')
      .eq('id', userId)
      .single();
    if (userError) throw userError;

    return {
      ...profile,
      email: user?.email || null,
      role: user?.role || 'teacher'
    };
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

    if (q) query = query.ilike('title', `%${q}%`);
    if (status) query = query.eq('status', status);

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
    const { data, error } = await supabase.from('fiches').select('*').eq('id', id).single();
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
// -------------------- MESSAGES --------------------
//

/**
 * Récupérer les messages reçus par un utilisateur
 */
export async function getMessages(userId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('to_user', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[api] getMessages error', err);
    return [];
  }
}

/**
 * Envoyer un message
 */
export async function sendMessage(payload) {
  try {
    const { error } = await supabase.from('messages').insert(payload);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[api] sendMessage error', err);
    return false;
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
// -------------------- API OBJET (compatibilité) --------------------
//
export const API = {
  list: getFiches,
  get: getFicheById,
  create: createFiche,
  update: updateFiche,
  remove: removeFiche,
};
