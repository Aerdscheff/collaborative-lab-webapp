
import { API } from '../api.js';

export function render(container) {
  API.getProfile().then(profile => {
    container.innerHTML = `
      <h2>Mon profil</h2>
      <form id="profile-form">
        <input type="text" name="display_name" value="${profile.display_name || ''}" placeholder="Nom affiché" />
        <input type="text" name="role" value="${profile.role || ''}" placeholder="Rôle" readonly />
        <button type="submit">Mettre à jour</button>
      </form>
    `;
    const form = document.getElementById('profile-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await API.updateProfile({ display_name: form.display_name.value });
      alert('Profil mis à jour !');
    });
  }).catch(err => {
    container.innerHTML = `<p>Erreur de chargement du profil</p>`;
    console.error(err);
  });
}
