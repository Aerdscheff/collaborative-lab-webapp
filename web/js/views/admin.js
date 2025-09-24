export function render(app) {
  app.innerHTML = `
    <section class="card">
      <h2>Administration</h2>
      <p>Outils réservés aux administrateurs :</p>
      <ul>
        <li>👤 Gestion des utilisateurs</li>
        <li>🗂️ Trames pédagogiques</li>
        <li>⚙️ Paramètres généraux</li>
        <li>📤 Export / 📥 Import de données</li>
      </ul>
      <button>🔑 Gérer les rôles</button>
      <button>📝 Éditer trames</button>
      <button>📊 Exports</button>
    </section>
  `;
}
