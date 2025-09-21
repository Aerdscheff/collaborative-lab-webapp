import { supabase } from './auth.js';

/**
 * Fiches
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
 * Profil utilisateur
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
 * API Fiches CRUD (branchée sur Supabase)
 */
export const API = {
  list: getFiches,
  get: async (id) => {
    try {
      const { data, error } = await supabase.from('fiches').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[api] get fiche error', err);
      return null;
    }
  },
  create: async (payload) => {
    try {
      const { data, error } = await supabase.from('fiches').insert(payload).select('id').single();
      if (error) throw error;
      return { id: data.id };
    } catch (err) {
      console.error('[api] create fiche error', err);
      return null;
    }
  },
  update: async (id, payload) => {
    try {
      const { error } = await supabase.from('fiches').update(payload).eq('id', id);
      if (error) throw error;
      return { id };
    } catch (err) {
      console.error('[api] update fiche error', err);
      return null;
    }
  },
  remove: async (id) => {
    try {
      const { error } = await supabase.from('fiches').delete().eq('id', id);
      if (error) throw error;
      return { id };
    } catch (err) {
      console.error('[api] remove fiche error', err);
      return null;
    }
  },
  export: async (id, format) => {
    // TODO : implémenter export (ex. JSON, DOCX)
    return Promise.resolve({ ok: true });
  }
};
