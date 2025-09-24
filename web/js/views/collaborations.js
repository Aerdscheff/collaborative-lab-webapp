export function render(app) {
  app.innerHTML = `
    <section class="card">
      <h2>Collaborations</h2>
      <p>Voici vos projets collaboratifs actifs :</p>
      <ul>
        <li>🌱 Projet jardin scolaire – avec Marie et Paul</li>
        <li>🐝 Activité pollinisateurs – avec Sophie</li>
      </ul>
      <button id="new-collab">➕ Nouvelle collaboration</button>
    </section>
  `;

  document.getElementById("new-collab").addEventListener("click", () => {
    alert("Création d'une nouvelle collaboration (module à compléter).");
  });
}
