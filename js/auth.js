import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://lofsckrqyrouymqyfatm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZnNja3JxeXJvdXltcXlmYXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDAyNTksImV4cCI6MjA3MTgxNjI1OX0.hUCEkHV8e7nz_BQgkvo-R2q6NC2Y5UdViV5LTV9l8A8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  localStorage.setItem('jwt', data.session.access_token);
  return data.user;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem('jwt');
}

export function getJWT() {
  return localStorage.getItem('jwt');
}
