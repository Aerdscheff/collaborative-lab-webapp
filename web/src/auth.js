import { supabase } from './supabase.js';

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function signInWithMagicLink(email) {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });
}

export async function signInWithPassword(email, password) {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentRole() {
  const session = await getSession();
  if (!session || !supabase) return 'student';

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  return data?.role ?? 'student';
}
