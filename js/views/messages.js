// frontend_files/js/views/messages.js
// Messages page view
// Minimal placeholder to demonstrate messages section

const Views_Messages = (function () {
  function render() {
    UI.renderBreadcrumb([
      { label: 'Accueil', href: '#/' },
      { label: 'Messagerie', href: '#/messages' }
    ]);
    const container = document.createElement('div');
    container.className = 'messages';
    container.innerHTML =
      '<h1>Messagerie</h1>' +
      '<p>Cette section sera dédiée à la messagerie interne.</p>' +
      '<p>Les fonctionnalités pour envoyer et recevoir des messages seront bientôt disponibles.</p>';
    UI.mount(container);
  }
  return { render };
})();
export { Views_Messages };
