// Routeur hash‑based pour la SPA

(function(){
  // Définition des routes et des fonctions correspondantes
  const routes = {
    '/': () => window.Views_Home.render(),
    '/fiches': () => window.Views_Fiches.list(),
    '/fiches/create': () => window.Views_FichesCreate.render(),
    '/collaborations': () => window.Views_Collaborations.render(),
    '/messages': () => window.Views_Messages.render(),
    '/admin': () => window.Views_Admin.render(),
    '/profiles/me': () => window.Views_Profiles.me && window.Views_Profiles.me()
  };

  // Analyse l’URL hash et renvoie chemin et query
  function parseHash() {
    const hash = location.hash.slice(1) || '/';
    // Sépare la partie avant le ? (chemin) de la query
    const [path] = hash.split('?');
    return { path };
  }

  // Fonction de navigation
  async function navigate() {
    const { path } = parseHash();
    // Vérifie l’admin
    if (path === '/admin' && window.Auth.getRole && window.Auth.getRole() !== 'admin') {
      UI.toast('Accès réservé aux administrateurs', 'error');
      location.hash = '#/';
      return;
    }
    const view = routes[path] || routes['/'];
    view();
  }

  // Initialisation : au chargement du DOM et à chaque changement de hash
  window.addEventListener('hashchange', navigate);
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Auth && window.Auth.init) {
      window.Auth.init();
    }
    navigate();
  });
})();