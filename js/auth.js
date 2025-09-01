// Gestion simple d’authentification et de rôle.
//
// Pour cette démonstration, l’authentification réelle (via Supabase) n’est pas implémentée.
// On lit éventuellement un rôle stocké dans localStorage sous la clé `demoRole`.

(function(){
  const state = { user: null, role: 'user', onChange: [] };

  // Initialise l’état et met à jour le lien admin
  function init() {
    // Si un rôle est stocké localement, l’utiliser (utile pour tests)
    const saved = localStorage.getItem('demoRole');
    if (saved) state.role = saved;
    updateAdminLink();
    notify();
  }

  // Met à jour la visibilité du lien admin dans la barre de navigation
  function updateAdminLink() {
    const link = document.getElementById('admin-link');
    if (link) link.hidden = (state.role !== 'admin');
  }

  // Renvoie le rôle actuel
  function getRole() {
    return state.role;
  }

  // Renvoie l’utilisateur (non utilisé ici)
  function getUser() {
    return state.user;
  }

  // Permet de s’abonner aux changements d’état
  function onChange(cb) {
    state.onChange.push(cb);
  }

  // Notifie les abonnés
  function notify() {
    state.onChange.forEach(cb => cb(state));
  }

  // Expose l’API globale
  window.Auth = { init, updateAdminLink, getRole, getUser, onChange };

  // Lancer l’initialisation immédiatement
  init();
})();
