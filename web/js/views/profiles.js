
import { API } from '../api.js';

function renderForm(container, profile) {
  container.innerHTML = `
    <h2>Mon profil</h2>
    <form id="profile-form" class="profile-form">
      <label>
        Matières / sujets enseignés
        <input type="text" name="subject" value="${profile.subject || ''}" required />
      </label>
      <label>
        Classes
        <input type="text" name="classes" value="${profile.classes || ''}" required />
      </label>
      <label>
        Objectifs de développement durable (ODD)
        <input type="text" name="sdgs" value="${profile.sdgs || ''}" />
      </label>
      <label>
        Biographie
        <textarea name="bio" rows="4">${profile.bio || ''}</textarea>
      </label>
      <label>
        Préférences
        <textarea name="preferences" rows="3">${profile.preferences || ''}</textarea>
      </label>
      <button type="submit">Enregistrer</button>
    </form>
  `;

  const form = document.getElementById('profile-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      subject: form.subject.value.trim(),
      classes: form.classes.value.trim(),
      sdgs: form.sdgs.value.trim(),
      bio: form.bio.value.trim(),
      preferences: form.preferences.value.trim(),
    };

    try {
      await API.updateProfile(payload);
      alert('Profil mis à jour !');
    } catch (error) {
      console.error('Mise à jour impossible', error);
      alert(`Échec de la mise à jour : ${error.message}`);
    }
  });
}

export function render(container) {
  container.innerHTML = '<p>Chargement du profil…</p>';
  API.getProfile()
    .then((profile) => renderForm(container, profile))
    .catch((error) => {
      console.error(error);
      container.innerHTML = `<p>Erreur de chargement du profil : ${error.message}</p>`;
    });
}
