import { getSession, getCurrentRole } from './auth.js';

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
    return null;
  }
  return session;
}

export async function requireRole(allowedRoles) {
  const session = await requireSession();
  if (!session) return null;

  const role = await getCurrentRole();
  if (!allowedRoles.includes(role)) {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
    return null;
  }

  return { session, role };
}
