
import { API } from '../api.js';

export function render(container) {
  API.getFiches().then(fiches => {
    container.innerHTML = '<h2>Mes fiches</h2><ul>' +
      fiches.map(f => `<li>${f.title} (${f.status}) <button data-id="${f.id}">Supprimer</button></li>`).join('') +
      '</ul>';
    container.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        await API.deleteFiche(btn.dataset.id);
        render(container);
      });
    });
  }).catch(err => {
    container.innerHTML = `<p>Erreur de chargement des fiches</p>`;
    console.error(err);
  });
}
