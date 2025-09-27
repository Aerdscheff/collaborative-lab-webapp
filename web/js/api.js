import { supabase } from './auth.js';

/* -------------------
   PROFIL UTILISATEUR
------------------- */
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

export async function createFiche(payload) {
  try {
    const { data, error } = await supabase.from('fiches').insert(payload).select('id').single();
    if (error) throw error;
    return { id: data.id };
  } catch (err) {
    console.error('[api] createFiche error', err);
    return null;
  }
}

export async function updateFiche(id, payload) {
  try {
    const { error } = await supabase.from('fiches').update(payload).eq('id', id);
    if (error) throw error;
    return { id, ...payload };
  } catch (err) {
    console.error('[api] updateFiche error', err);
    return null;
  }
}

export async function deleteFiche(id) {
  try {
    const { error } = await supabase.from('fiches').delete().eq('id', id);
    if (error) throw error;
    return { id };
  } catch (err) {
    console.error('[api] deleteFiche error', err);
    return null;
  }
}

/* -------------------
   COLLABORATIONS
------------------- */
export async function getCollaborations({ q = '', limit = 20, offset = 0 } = {}) {
  try {
    let query = supabase.from('collaborations').select('*').range(offset, offset + limit - 1);
    if (q) query = query.ilike('title', `%${q}%`);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[api] getCollaborations error', err);
    return [];
  }
}

export async function getCollaborationById(id) {
  try {
    const { data, error } = await supabase.from('collaborations').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[api] getCollaborationById error', err);
    return null;
  }
}

export async function createCollaboration(payload) {
  try {
    const { data, error } = await supabase.from('collaborations').insert(payload).select('id').single();
    if (error) throw error;
    return { id: data.id };
  } catch (err) {
    console.error('[api] createCollaboration error', err);
    return null;
  }
}

export async function updateCollaboration(id, payload) {
  try {
    const { error } = await supabase.from('collaborations').update(payload).eq('id', id);
    if (error) throw error;
    return { id, ...payload };
  } catch (err) {
    console.error('[api] updateCollaboration error', err);
    return null;
  }
}

export async function deleteCollaboration(id) {
  try {
    const { error } = await supabase.from('collaborations').delete().eq('id', id);
    if (error) throw error;
    return { id };
  } catch (err) {
    console.error('[api] deleteCollaboration error', err);
    return null;
  }
}

/* -------------------
   MESSAGES
------------------- */
export async function getMessages(userEmail) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('to_email', userEmail)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[api] getMessages error', err);
    return [];
  }
}

export async function sendMessage(payload) {
  try {
    const { data, error } = await supabase.from('messages').insert(payload).select('id').single();
    if (error) throw error;
    return { id: data.id };
  } catch (err) {
    console.error('[api] sendMessage error', err);
    return null;
  }
}

export async function markMessageRead(id) {
  try {
    const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
    if (error) throw error;
    return { id, read: true };
  } catch (err) {
    console.error('[api] markMessageRead error', err);
    return null;
  }
}

/* -------------------
   ADMIN (USERS)
------------------- */
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

export async function updateUserRole(userId, role) {
  try {
    const { error } = await supabase.from('users').update({ role }).eq('id', userId);
    if (error) throw error;
    return { id: userId, role };
  } catch (err) {
    console.error('[api] updateUserRole error', err);
    return null;
  }
}
