// frontend_files/js/views/profiles.js
// Profiles page view
// Minimal placeholder to demonstrate profile section

const Views_Profiles = (function () {
  function render() {
    UI.renderBreadcrumb([
      { label: 'Accueil', href: '#/' },
      { label: 'Mon profil' }
    ]);
    const container = document.createElement('div');
    container.className = 'card';
    container.innerHTML = `
      <h1>Mon profil</h1>
      <p>Cette section sera dédiée à la gestion du profil utilisateur.</p>
      <p>Les fonctionnalités de mise à jour et d'export du profil seront bientôt disponibles.</p>
    `;
    UI.mount(container);
  }
  return { render };
})();

export { Views_Profiles };