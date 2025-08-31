// frontend_files/js/views/home.js
// Home page view
// Renders the hero section with CTA buttons to create a profile and explore fiches

const Views_Home = (function () {
  function render() {
    UI.renderBreadcrumb([{ label: 'Accueil' }]);
    const container = document.createElement('div');
    container.className = 'card';
    container.style.textAlign = 'center';
    container.innerHTML = `
      <h1>Äerdschëff – Collaborative Lab</h1>
      <p>Relier profils, projets et pédagogies pour la bifurcation écologique.</p>
      <div style="display:flex; flex-direction:column; gap:12px; align-items:center; margin-top:16px;">
        <a class="button" href="#/fiches/create">Créer une fiche</a>
        <a class="button secondary" href="#/fiches">Explorer les fiches</a>
      </div>
    `;
    UI.mount(container);
  }
  return { render };
})();

export { Views_Home };