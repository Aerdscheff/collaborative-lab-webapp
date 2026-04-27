import { getCurrentRole, getSession } from './auth.js';

function redirectTo(pathname) {
  window.history.pushState({}, '', pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export async function requireSession(redirectPath = '/login') {
  const session = await getSession();
  if (!session) {
    redirectTo(redirectPath);
    return null;
  }
  return session;
}

export async function requireRole(allowedRoles, options = {}) {
  const { redirectPath = '/dashboard' } = options;
  const session = await requireSession();
  if (!session) return null;

  const role = await getCurrentRole();
  if (!allowedRoles.includes(role)) {
    redirectTo(redirectPath);
    return null;
  }

  return { session, role };
}
