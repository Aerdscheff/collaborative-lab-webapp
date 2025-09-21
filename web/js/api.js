import { supabase } from './auth.js';

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
 * API objet pour compatibilité
 */
export const API = {
  list: getFiches,
  get: async (id) => {
    const { data, error } = await supabase.from('fiches').select('*').eq('id', id).single();
    if (error) {
      console.error('[api] get fiche error', error);
      return null;
    }
    return data;
  },
  create: async (payload) => {
    const { data, error } = await supabase.from('fiches').insert(payload).select('id').single();
    if (error) {
      console.error('[api] create fiche error', error);
      return null;
    }
    return { id: data.id };
  },
  update: async (id, payload) => {
    const { error } = await supabase.from('fiches').update(payload).eq('id', id);
    if (error) {
      console.error('[api] update fiche error', error);
      return null;
    }
    return { id };
  },
  remove: async (id) => {
    const { error } = await supabase.from('fiches').delete().eq('id', id);
    if (error) {
      console.error('[api] remove fiche error', error);
      return null;
    }
    return { id };
  }
};
