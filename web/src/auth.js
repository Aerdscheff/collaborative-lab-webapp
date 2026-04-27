import { supabase } from './supabase.js';

const roleAliases = {
  student: 'student',
  eleve: 'student',
  'élève': 'student',
  referent: 'referent',
  'référent': 'referent',
  facilitator: 'facilitator',
  facilitateur: 'facilitator',
  admin: 'facilitator',
};

function normalizeRole(role) {
  if (!role) return 'student';
  return roleAliases[String(role).trim().toLowerCase()] ?? 'student';
}

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

export async function getCurrentUserProfile() {
  const session = await getSession();
  if (!session || !supabase) return { data: null, error: null };

  return supabase
    .from('profiles')
    .select('id, role, organization_id')
    .eq('id', session.user.id)
    .maybeSingle();
}

export async function getCurrentUserMembership() {
  const session = await getSession();
  if (!session || !supabase) return { data: null, error: null };

  return supabase
    .from('memberships')
    .select('role, organization_id, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function getCurrentUserContext() {
  const session = await getSession();
  if (!session || !supabase) {
    return {
      session,
      role: 'student',
      organizationId: null,
      profile: null,
      membership: null,
      errors: [],
    };
  }

  const [profileResult, membershipResult] = await Promise.all([
    getCurrentUserProfile(),
    getCurrentUserMembership(),
  ]);

  const role = normalizeRole(membershipResult.data?.role ?? profileResult.data?.role);
  const organizationId = membershipResult.data?.organization_id ?? profileResult.data?.organization_id ?? null;

  return {
    session,
    role,
    organizationId,
    profile: profileResult.data,
    membership: membershipResult.data,
    errors: [profileResult.error, membershipResult.error].filter(Boolean),
  };
}

export async function getCurrentRole() {
  const context = await getCurrentUserContext();
  return context.role;
}

export async function getCurrentUserOrganizationId() {
  const context = await getCurrentUserContext();
  return context.organizationId;
}
