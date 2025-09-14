
import { API } from '../api.js';

export function render(container) {
  container.innerHTML = `
    <h2>Créer une fiche</h2>
    <form id="fiche-form">
      <input type="text" name="title" placeholder="Titre" required />
      <input type="text" name="period" placeholder="Période" />
      <input type="text" name="status" placeholder="Statut" value="draft" />
      <button type="submit">Créer</button>
    </form>
  `;
  const form = document.getElementById('fiche-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await API.createFiche({
      title: form.title.value,
      period: form.period.value,
      status: form.status.value
    });
    location.hash = '#/fiches';
  });
}
