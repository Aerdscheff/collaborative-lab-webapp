
import { API } from '../api.js';

function renderList(container, fiches) {
  if (!Array.isArray(fiches) || fiches.length === 0) {
    container.innerHTML = `
      <h2>Mes fiches</h2>
      <p>Aucune fiche n'a encore été créée.</p>
    `;
    return;
  }

  const items = fiches.map((fiche) => {
    const levels = (fiche.levels || []).join(', ');
    const tags = (fiche.tags || []).join(', ');
    return `
      <li class="fiche-item">
        <h3>${fiche.title}</h3>
        <p><strong>Période :</strong> ${fiche.period || '—'}</p>
        <p><strong>Niveaux :</strong> ${levels || '—'}</p>
        <p><strong>Mots-clés :</strong> ${tags || '—'}</p>
        <p>${fiche.summary || ''}</p>
        <button data-id="${fiche.id}">Supprimer</button>
      </li>
    `;
  }).join('');

  container.innerHTML = `
    <h2>Mes fiches</h2>
    <ul class="fiche-list">${items}</ul>
  `;

  container.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await API.deleteFiche(btn.dataset.id);
        render(container);
      } catch (error) {
        console.error('Suppression impossible', error);
        alert('La suppression a échoué.');
      }
    });
  });
}

export function render(container) {
  container.innerHTML = '<p>Chargement des fiches…</p>';
  API.getFiches()
    .then((fiches) => renderList(container, fiches))
    .catch((err) => {
      console.error(err);
      container.innerHTML = `<p>Erreur de chargement des fiches : ${err.message}</p>`;
    });
}
