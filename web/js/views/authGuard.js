import { getSession } from './auth.js';
import { showFeedback } from './utils/feedback.js';

/**
 * Vérifie qu'un utilisateur est connecté.
 * Si non, redirige vers #auth et retourne null.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    console.warn("[authGuard] Utilisateur non connecté, redirection vers #auth");
    window.location.hash = "#auth";
    return null;
  }
  return session;
}

/**
 * Vérifie qu'un utilisateur est connecté ET admin.
 * Si non, redirige vers #auth et retourne null.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    console.warn("[authGuard] Utilisateur non connecté, redirection vers #auth");
    window.location.hash = "#auth";
    return null;
  }

  const role = session.user?.role;
  if (role !== "admin") {
    console.warn("[authGuard] Accès refusé : utilisateur non admin");
    showFeedback(document.querySelector("#page-content"), "error", "❌ Accès réservé aux administrateurs");
    setTimeout(() => {
      window.location.hash = "#auth";
    }, 1000);
    return null;
  }

  return session;
}
