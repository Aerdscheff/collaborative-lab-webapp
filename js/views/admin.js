// frontend_files/js/views/admin.js
// Admin page view
// Minimal Placeholder to demonstrate admin section

const Views_Admin = (function() {
  function render() {
    UI.renderBreadcrumb([
      { label: 'Accueil', href: '#/' },
      { label: 'Admin', href: '#/admin' }
    ]);
    const container = document.createElement('div');
    container.className = 'admin';
    container.innerHTML = '<h3>Administration</h3>' +
      '<p>Cette section est d\u00e9di\u00e9e \u00e0 la gestion administrative de l\'application.</p>' +
      '<p>Les fonctionnalit\u00e9s d\'administration seront bient\u00f4t disponibles.</p>';
    UI.mount(container);
  }
  return { render };
})();

export { Views_Admin };
