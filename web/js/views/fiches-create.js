
import { API } from '../api.js';

function toList(value) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function render(container) {
  container.innerHTML = `
    <h2>Créer une fiche</h2>
    <form id="fiche-form" class="fiche-form">
      <label>
        Titre
        <input type="text" name="title" required />
      </label>
      <label>
        Période
        <input type="text" name="period" required />
      </label>
      <label>
        Modalités
        <input type="text" name="modalities" placeholder="Présentiel, distanciel…" required />
      </label>
      <label>
        Niveaux (séparés par des virgules)
        <input type="text" name="levels" placeholder="Lycée, Collège" required />
      </label>
      <label>
        Pédagogies (séparées par des virgules)
        <input type="text" name="pedagogy" placeholder="Co-construction, projet" required />
      </label>
      <label>
        Disciplines (séparées par des virgules)
        <input type="text" name="disciplines" placeholder="SVT, Physique" required />
      </label>
      <label>
        Mots-clés (séparés par des virgules)
        <input type="text" name="tags" placeholder="climat, biodiversité" required />
      </label>
      <label>
        Résumé
        <textarea name="summary" rows="4" required></textarea>
      </label>
      <button type="submit">Créer</button>
    </form>
  `;

  const form = document.getElementById('fiche-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.value.trim(),
      period: form.period.value.trim(),
      modalities: form.modalities.value.trim(),
      levels: toList(form.levels.value),
      pedagogy: toList(form.pedagogy.value),
      disciplines: toList(form.disciplines.value),
      tags: toList(form.tags.value),
      summary: form.summary.value.trim(),
    };

    try {
      await API.createFiche(payload);
      location.hash = '#/fiches';
    } catch (error) {
      console.error('Création impossible', error);
      alert(`La création a échoué : ${error.message}`);
    }
  });
}
