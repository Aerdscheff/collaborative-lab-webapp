import { getSession } from './auth.js';

/**
 * Vérifie si l'utilisateur est connecté.
 * Si non, redirige vers #auth avec un message.
 */
export async function requireAuth(redirect = '#auth') {
  const session = await getSession();
  if (!session) {
    window.location.hash = redirect;
    return null;
  }
  return session;
}

/**
 * Vérifie si l'utilisateur est admin.
 * Suppose que le rôle est stocké dans `user_metadata.role` ou une colonne `role`.
 */
export async function requireAdmin(redirect = '#auth') {
  const session = await getSession();
  if (!session) {
    window.location.hash = redirect;
    return null;
  }

  // Exemple : rôle stocké dans user_metadata
  const role = session.user?.user_metadata?.role || 'teacher';
  if (role !== 'admin') {
    alert("⚠️ Accès réservé aux administrateurs.");
    window.location.hash = '#';
    return null;
  }

  return session;
}
