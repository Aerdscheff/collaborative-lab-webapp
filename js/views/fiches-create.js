// frontend_files/js/views/fiches-create.js
// View for creating a new fiche

const Views_FichesCreate = (function () {
  function render() {
    UI.renderBreadcrumb([
      { label: 'Accueil', href: '#/' },
      { label: 'Fiches', href: '#/fiches' },
      { label: 'Nouvelle fiche' }
    ]);
    const container = document.createElement('div');
    container.className = 'card';
    container.innerHTML = `
      <h1>Nouvelle fiche</h1>
      <form id="fiche-form">
        <label>Titre<br /><input name="title" required /></label><br />
        <label>Thème<br /><input name="theme" /></label><br />
        <label>Contenu<br /><textarea name="content"></textarea></label><br />
        <label>Statut<br />
          <select name="status">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </label><br />
        <button class="button" type="submit">Enregistrer</button>
      </form>
    `;
    const form = container.querySelector('#fiche-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      try {
        await API.Fiches.create(payload);
        UI.toast('Fiche créée', 'success');
        window.location.hash = '#/fiches';
      } catch {
        UI.toast('Erreur lors de la création', 'error');
      }
    });
    UI.mount(container);
  }
  return { render };
})();

export { Views_FichesCreate };
